class Vector {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
	add(v) {
		return new Vector(this.x + v.x, this.y + v.y)
	}
	diff(v) {
		return new Vector(this.x - v.x, this.y - v.y)
	}
}

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById(`game`)
const ctx = canvas.getContext(`2d`)

const screenRes = new Vector(64, 96)

/** @type {HTMLCanvasElement} */
const subCanvas = document.createElement('canvas')
subCanvas.width = screenRes.x
subCanvas.height = screenRes.y
const subCtx = subCanvas.getContext('2d')

let cw, ch, vw, vh, cPos

function fillScreen() {
	const computedStyle = window.getComputedStyle(canvas)
	cw = parseInt(computedStyle.width)
	ch = parseInt(computedStyle.height)
	canvas.width = cw
	canvas.height = ch

	ctx.imageSmoothingEnabled = false

	const upscaleFactor = Math.min(cw / screenRes.x, ch / screenRes.y)

	vw = screenRes.x * upscaleFactor
	vh = screenRes.y * upscaleFactor

	cPos = new Vector((cw - vw) / 2, (ch - vh) / 2)
}

fillScreen()

window.onresize = fillScreen

class ImageAsset extends Image {
	async load(src) {
		await new Promise((resolve) => {
			this.onload = resolve
			this.src = src
		})
	}
}

class Observable {
	constructor() {
		this.subs = {}
	}
	on(event, cb) {
		if (!this.subs[event]) {
			this.subs[event] = []
		}
		this.subs[event].push(cb)
	}
	trigger(event, args) {
		if (this.subs[event]) {
			this.subs[event].forEach(sub => sub(args))
		}
	}
}

class InputSingleton extends Observable {
	constructor() {
		super()
		this.onClick = this.onClick.bind(this)
		canvas.onclick = this.onClick
	}
	onClick(e) {
		let clickPos = new Vector(e.clientX, e.clientY)
		clickPos = clickPos.diff(cPos)

		// click.x : cw = gameClick.x : screenRes.x
		clickPos.x = clickPos.x * screenRes.x / vw

		// click.y : ch = gameClick.y : screenRes.y
		clickPos.y = clickPos.y * screenRes.y / vh

		this.trigger(`click`, {
			name: `click`,
			pos: clickPos
		})
	}
}

const Input = new InputSingleton()

class GameObject extends Observable {
	constructor({
		pos = new Vector(),
		children = []
	}) {
		super()
		this.pos = pos
		this.children = children
		// available after mount
		this.parent = null
	}
	mount() {
		return this.children.map(child => {
			child.parent = this
			return child.mount()
		}).flat()
	}
	update() {
		// noop
	}
	render() {
		// noop
	}
	getGlobalPosition() {
		if (this.parent) {
			return this.pos.add(this.parent.getGlobalPosition())
		} else {
			return this.pos
		}
	}
}

class Sprite extends GameObject {
	constructor({
		src = ``,
		...options
	}) {
		super(options)
		this.src = src
		this.img = null
	}
	mount() {
		this.img = new ImageAsset()
		return [...super.mount(), this.img.load(this.src)]
	}
	render(ctx) {
		ctx.drawImage(this.img, 0, 0)
	}
}

class Tile extends GameObject {
	constructor({
		...options
	}) {
		super(options)
		this.color = `#939393`
	}
	render(ctx) {
		ctx.strokeStyle = this.color
		ctx.lineWidth = 1
		ctx.strokeRect(0.5, 0.5, 10, 10)
	}
}

class Area extends GameObject {
	constructor({
		size,
		...options
	}) {
		super(options)
		this.size = size
		this.isCollisionObject = true
		// bind methods
		this._onMouseEvent = this._onMouseEvent.bind(this)
		// event listeners
		Input.on(`click`, this._onMouseEvent)
	}
	_onMouseEvent(event) {
		if (this.isPointWithinObject(event.pos)) {
			this.trigger(event.name, event)
		}
	}
	isPointWithinObject(point) {
		const gPos = this.getGlobalPosition()
		const {x, y} = gPos
		const {x: w, y: h} = gPos.add(this.size)
		return point.x > x && point.x < w && point.y > y && point.y < h
	}
}

class GameBoard extends GameObject {
	constructor({
		data = `0`,
		...options
	}) {
		super(options)
		this.data = data
		this.grid = this._parseData(this.data)
		this.children = this._createChildren(this.grid)
	}
	_parseData(data) {
		// e.g. `af 2d c4`
		return data.split(` `).map(row => parseInt(row, 16).toString(4).padStart(row.length * 2, `0`).split(``))
	}
	_createChildren(grid) {
		return grid.reduce((children, row, rowIndex) => [
			...children,
			...row.map((col, colIndex) => {
				const tile = new Tile({
					children: [
						new Sprite({
							pos: new Vector(2, 2),
							src: `./assets/${this.assets[col]}.png`
						})
					]
				})
				const area = new Area({
					pos: new Vector(15 * colIndex, 15 * rowIndex),
					size: new Vector(11, 11),
					children: [tile]
				})
				area.on(`click`, this.select.bind(this, tile, col, rowIndex, colIndex))
				return area
			})
		], [])
	}
	select(tile) {
		tile.color = `#ffff00`
	}
}
// static assets = []
GameBoard.prototype.assets = [`triangle`, `square`, `circle`, `cross`]

function mountTree(root) {
	const promises = root.children.map(mountTree)
	return [root.mount(), ...promises]
}

function updateTree(deltaT, root) {
	root.update(deltaT)
	root.children.forEach(child => updateTree(deltaT, child))
}

function renderTree(ctx, root) {
	ctx.save()
	const { x, y } = root.pos
	ctx.translate(x, y)
	root.render(ctx)
	root.children.forEach(child => renderTree(ctx, child))
	ctx.restore()
}

function range(n) {
	return new Array(n).fill(null)
}

(async function () {

	// const font = new FontFace('Pixeled', 'url(./Pixeled.ttf)')
	// await font.load()
	// document.fonts.add(font)

	const game = new GameObject({
		children: [
			new GameBoard({
				data: `af 2d c4`,
				pos: new Vector(4, 20),
			}),
		],
	})

	await Promise.all(game.mount())

	window.requestAnimationFrame(loop)

	let oldT = 0
	function loop(newT) {
		window.requestAnimationFrame(loop)

		if (oldT) {
			const deltaT = (newT - oldT) / 1000

			updateTree(deltaT, game)

			subCtx.fillStyle = 'black'
			subCtx.fillRect(0, 0, screenRes.x, screenRes.y)

			renderTree(subCtx, game)

			ctx.drawImage(
				subCanvas,
				0, 0, screenRes.x, screenRes.y,
				cPos.x, cPos.y, vw, vh
			)
		}

		oldT = newT
	}
})()