class Vector {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
}

class ImageAsset extends Image {
	async load(src) {
		await new Promise((resolve) => {
			this.onload = resolve
			this.src = src
		})
	}
}

class GameObject {
	constructor({
		pos = new Vector(),
		children = []
	}) {
		this.pos = pos
		this.children = children
	}
	mount() {
		// noop
	}
	update() {
		// noop
	}
	render() {
		// noop
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
	async mount() {
		this.img = new ImageAsset()
		await this.img.load(this.src)
	}
	render(ctx) {
		ctx.drawImage(this.img, 0, 0)
	}
}

class Tile extends GameObject {
	constructor({
		src = `0`,
		...options
	}) {
		super(options)
		this.children = [new Sprite({
			pos: new Vector(2, 2),
			src
		})]
	}
	render(ctx) {
		ctx.strokeStyle = `#939393`
		ctx.lineWidth = 1
		ctx.strokeRect(0.5, 0.5, 10, 10)
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
		return this.grid.reduce((children, row, rowIndex) => [
			...children,
			...row.map((col, colIndex) => {
				const assets = [`triangle`, `square`, `circle`, `cross`]
				const src = `./assets/${assets[col]}.png`
				const pos = new Vector(15 * colIndex, 15 * rowIndex)
				return new Tile({ src, pos })
			})
		], [])
	}
}

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

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById(`game`)
const ctx = canvas.getContext(`2d`)

const screenRes = new Vector(64, 96)

/** @type {HTMLCanvasElement} */
const subCanvas = document.createElement('canvas')
subCanvas.width = screenRes.x
subCanvas.height = screenRes.y
const subCtx = subCanvas.getContext('2d')

let cw, ch, vw, vh

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
}

fillScreen()

window.onresize = fillScreen

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

	await Promise.all(mountTree(game))

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
				(cw - vw) / 2, (ch - vh) / 2, vw, vh
			)
		}

		oldT = newT
	}
})()