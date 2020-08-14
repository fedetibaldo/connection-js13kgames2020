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
	length() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
	}
	equals(v) {
		return this.x == v.x && this.y == v.y
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

		this.isMouseDown = false

		canvas.onmousedown = (e) => this.onMouseDown(e)
		canvas.onmouseup = (e) => this.onMouseUp(e)
		canvas.onmousemove = (e) => this.onMouseMove(e)

		canvas.ontouchstart = (e) => this.onTouchStart(e)
		canvas.ontouchend = (e) => this.onTouchEnd(e)
		canvas.ontouchmove = (e) => this.onTouchMove(e)
	}
	onTouchStart(e) {
		e = this._normalizeTouchEvent(e)
		this.onMouseDown(e)
	}
	onTouchEnd(e) {
		this.onMouseUp(e)
	}
	onTouchMove(e) {
		e = this._normalizeTouchEvent(e)
		this.onMouseMove(e)
	}
	_normalizeTouchEvent(e) {
		e.clientX = e.touches[0].clientX
		e.clientY = e.touches[0].clientY
		return e
	}
	onMouseDown(e) {
		this.isMouseDown = true
		this.onMouseMove(e)
		this.trigger(`mousedown`, {
			name: `mousedown`,
		})
	}
	onMouseUp(e) {
		this.isMouseDown = false
		this.onMouseMove(e)
		this.trigger(`mouseup`, {
			name: `mouseup`,
		})
	}
	onMouseMove(e) {
		const pos = this._normalizePosition(new Vector(e.clientX, e.clientY))
		this.trigger(`mousemove`, {
			name: `mousemove`,
			pos,
		})
	}
	_normalizePosition(pos) {
		const clickPos = pos.diff(cPos)

		// click.x : cw = gameClick.x : screenRes.x
		clickPos.x = clickPos.x * screenRes.x / vw

		// click.y : ch = gameClick.y : screenRes.y
		clickPos.y = clickPos.y * screenRes.y / vh

		return clickPos
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
		// bind methods
		this._onMouseEvent = this._onMouseEvent.bind(this)
		// event listeners
		Input.on(`mousemove`, this._onMouseEvent)
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

		this.combination = []
		this.tilesPlayed = []

		Input.on(`mouseup`, () => this.resetState())
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
				area.on(`mousemove`, this.select.bind(this, tile, col, rowIndex, colIndex))
				return area
			})
		], [])
	}
	select(tile, value, row, col) {
		if (Input.isMouseDown) {
			const pos = new Vector(col, row)
			if (this.tilesPlayed.length) {
				if (this.tilesPlayed.find(playedPos => playedPos.equals(pos))) {
					return
				}
				const lastTilePlayed = this.tilesPlayed[this.tilesPlayed.length - 1]
				if (pos.diff(lastTilePlayed).length() > 1) {
					return
				}
			}
			this.tilesPlayed.push(pos)
			this.combination.push(value)
			tile.color = `#ffff00`
		}
	}
	resetState() {
		this.children.forEach(area => area.children[0].color = `#939393`)
		this.combination = []
		this.tilesPlayed = []
	}
}
// static assets = []
GameBoard.prototype.assets = [`triangle`, `square`, `circle`, `cross`]

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