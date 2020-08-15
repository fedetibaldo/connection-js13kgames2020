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
	mul(s) {
		return new Vector(this.x * s, this.y * s)
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
		this.mousePos = new Vector(0, 0)

		canvas.onmousedown = (e) => this.onMouseDown(e)
		canvas.onmouseup = (e) => this.onMouseUp(e)
		canvas.onmousemove = (e) => this.onMouseMove(e)
		canvas.onclick = (e) => this.onClick(e)

		canvas.ontouchstart = (e) => this.onTouchStart(e)
		canvas.ontouchend = (e) => this.onTouchEnd(e)
		canvas.ontouchmove = (e) => this.onTouchMove(e)
	}
	onTouchStart(e) {
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
		this.trigger(`mousedown`, {
			name: `mousedown`,
		})
	}
	onMouseUp(e) {
		this.isMouseDown = false
		this.trigger(`mouseup`, {
			name: `mouseup`,
		})
	}
	onMouseMove(e) {
		this.mousePos = this._normalizePosition(new Vector(e.clientX, e.clientY))
		this.trigger(`mousemove`, {
			name: `mousemove`,
			pos: this.mousePos,
		})
	}
	onClick(e) {
		this.mousePos = this._normalizePosition(new Vector(e.clientX, e.clientY))
		this.trigger(`click`, {
			name: `click`,
			pos: this.mousePos,
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
		this.children.forEach(child => {
			child.parent = this
			return child.mount()
		})
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
		img = new ImageAsset(),
		...options
	}) {
		super(options)
		this.img = img
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
		ctx.fillStyle = `black`
		ctx.lineWidth = 1
		ctx.strokeRect(0.5, 0.5, 10, 10)
		ctx.fillRect(1, 1, 9, 9)
	}
}

class Area extends GameObject {
	constructor({
		size,
		...options
	}) {
		super(options)
		this.size = size
		// event listeners
		Input.on(`mousemove`, (e) => this.onMouseEvent(`mousemove`, e))
		Input.on(`click`, (e) => this.onMouseEvent(`click`, e))
	}
	onMouseEvent(name, event) {
		if (this.isPointWithinObject(event.pos)) {
			this.trigger(name, event)
		}
	}
	isPointWithinObject(point) {
		const gPos = this.getGlobalPosition()
		const {x, y} = gPos
		const {x: w, y: h} = gPos.add(this.size)
		return point.x > x && point.x < w && point.y > y && point.y < h
	}
}

const assets = {
	triangle: `./assets/triangle.png`,
	square: `./assets/square.png`,
	circle: `./assets/circle.png`,
	cross: `./assets/cross.png`,
	button: `./assets/button.png`,
}


function getAsset(name) {
	return assets[name]
}

function fromDataToAsset(id) {
	const assetMap = [`triangle`, `square`, `circle`, `cross`]
	return assetMap[id]
}

/**
 * Transform stored data from base 16 to base 4
 * @param {string} data A hexadecimal number
 * @returns {[string]} The base-4 number, split into digits
 * @example
 * ```
 * parseData(`c1`) // [`3`, `0`, `0`, `1`]
 * ```
 */
function parseData(data) {
	// parse hexadecimal number
	return parseInt(data, 16)
		// transform to base 4
		.toString(4)
		// a hexadecimal digits equals to 2 base-4 digits
		.padStart(data.length * 2, `0`)
		// turn it into an array
		.split(``)
}

function serializeData(data) {
	// data enters as an array
	data = data.join(``)
	// parse base-4 number
	return parseInt(data, 4)
		// transform to hex
		.toString(16)
		// 2 hexadecimal digits equal to a base-4 digit
		.padStart(data.length / 2, `0`)
}

class Combination extends GameObject {
	constructor({
		data = `0`,
		...options
	}) {
		// TODO: support combinations with odd length (e.g. 3, 5...)
		super(options)
		this.data = data
	}
	get data() {
		return this._data
	}
	set data(data) {
		this._data = data
		// set a clear chain of derived properties
		this.combination = parseData(this.data)
		this.children = this._createChildren(this.combination)
		this.mount()
	}
	_createChildren(combination) {
		const spriteW = 7
		const padding = 2
		const boxW = spriteW + padding
		return combination.map((value, index) => new Sprite({
			img: getAsset(fromDataToAsset(value)),
			pos: new Vector(screenRes.x / 2 - ((boxW * combination.length) / 2) + (boxW * index) + padding / 2, 0),
		}))
	}
}

class Timer extends GameObject {
	constructor({
		length = 0,
		width = 2,
		duration = 0,
		color = `white`,
		...options
	}) {
		super(options)
		this.length = length
		this.time = this.duration = duration
		this.progress = 0
		this.color = color
		this.width = width

		this.trail = 0
		this.trailOpacity = 0
		this.trailFade = 400
	}
	update(deltaT) {
		this.progress = Math.min(this.progress + deltaT, this.duration)
		this.trailOpacity = Math.max(this.trailOpacity - deltaT / this.trailFade, 0)
	}
	reduceBy(time) {
		this.trail = this.progress
		this.update(time)
		this.trailOpacity = 1
	}
	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	render(ctx) {
		ctx.strokeStyle = this.color
		ctx.lineWidth = this.width

		const length = Math.round(this.length - this.length / this.duration * this.progress)

		ctx.beginPath()
		ctx.moveTo(0, this.width / 2)
		ctx.lineTo(length, this.width / 2)
		ctx.stroke()

		const trailLength = Math.round(this.length - this.length / this.duration * this.trail)
		ctx.strokeStyle = `rgba(255,0,0,${this.trailOpacity})`
		ctx.beginPath()
		ctx.moveTo(length, this.width / 2)
		ctx.lineTo(trailLength, this.width / 2)
		ctx.stroke()
	}
}

class GameBoard extends GameObject {
	constructor({
		data = `0`,
		...options
	}) {
		super(options)
		this.data = data
		this.grid = this.data.split(` `).map(row => parseData(row))
		this.children = this._createChildren(this.grid)

		this.combination = []
		this.tilesPlayed = []

		Input.on(`mouseup`, () => this.resetState())
	}
	_createChildren(grid) {
		return grid.reduce((children, row, rowIndex) => [
			...children,
			...row.map((col, colIndex) => {
				const tile = new Tile({
					children: [
						new Sprite({
							pos: new Vector(2, 2),
							img: getAsset(fromDataToAsset(col)),
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
	getValue(pos) {
		return this.grid[pos.y][pos.x]
	}
	getTile(pos) {
		return this.children[pos.x + (this.grid[0].length * pos.y)]
	}
	getBorderingPositions(pos) {
		const positions = []
		if (pos.y + 1 < this.grid.length) {
			positions.push(new Vector(pos.x, pos.y + 1))
		}
		if (pos.y - 1 >= 0) {
			positions.push(new Vector(pos.x, pos.y - 1))
		}
		if (pos.x + 1 < this.grid[pos.y].length) {
			positions.push(new Vector(pos.x + 1, pos.y))
		}
		if (pos.x - 1 >= 0) {
			positions.push(new Vector(pos.x - 1, pos.y))
		}
		return positions
	}
	findCombination(combination, possiblePositions = null, depth = 0) {
		if (depth >= combination.length) {
			return true
		}
		if (!possiblePositions) {
			possiblePositions = range(this.grid.length).reduce((rows, filler, y) => {
				return rows.concat(range(this.grid[y].length).map((filler, x) => {
					return new Vector(x, y)
				}))
			}, [])
		}
		for (let pos of possiblePositions) {
			if (this.getValue(pos) === combination[depth]) {
				const solution = this.findCombination(combination, this.getBorderingPositions(pos), depth + 1)
				if (solution) {
					if (solution === true) {
						return [pos]
					} else {
						return [pos, ...solution]
					}
				}
			}
		}
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
		this.trigger(`submit`, { combination: this.combination })
		this.children.forEach(area => area.children[0].color = `#939393`)
		this.combination = []
		this.tilesPlayed = []
	}
	render(ctx) {
		const getCenterOfTile = (coord) => {
			/** @type {Area} */
			const tile = this.getTile(coord)
			const { pos, size } = tile
			return pos.add(size.mul(1/2))
		}
		const drawLine = (from, to) => {
			ctx.beginPath()
			ctx.strokeStyle = `#ffff00`
			ctx.lineWidth = 3
			ctx.moveTo(from.x, from.y)
			ctx.lineTo(to.x, to.y)
			ctx.stroke()
		}
		this.tilesPlayed.forEach((tile, index, tiles) => {
			if (index) {
				// connect the previous and current tiles
				const prevTile = tiles[index - 1]
				drawLine(getCenterOfTile(prevTile), getCenterOfTile(tile))
			}
			if (index == tiles.length - 1) {
				// connect the last element to the mouse
				drawLine(getCenterOfTile(tile), Input.mousePos.diff(this.getGlobalPosition()))
			}
		})
	}
}

class Game extends GameObject {
	constructor({
		combinations = [],
		...options
	}) {
		super(options)

		this.combinations = combinations
		this.turn = -1

		this.display = this.children.find(child => child instanceof Combination)
		this.timer = this.children.find(child => child instanceof Timer)
		this.board = this.children.find(child => child instanceof GameBoard)
		this.button = this.children.find(child => child instanceof Area)

		this.board.on(`submit`, (e) => this.onCombinationSubmit(e))
		this.button.on(`click`, (e) => this.onCombinationNotFound())
	}
	mount() {
		super.mount()
		this.nextTurn()
	}
	get combination() {
		return this.combinations[this.turn]
	}
	nextTurn() {
		this.turn++
		// this.board.highlightCombination()
		// this.display.highlight()
		this.display.data = this.combination
	}
	onCombinationSubmit(e) {
		if (serializeData(e.combination) == this.combination) {
			this.nextTurn()
		}
	}
	onCombinationNotFound() {
		if (this.board.findCombination(parseData(this.combination))) {
			// this.board.highlightCombination()
			this.timer.reduceBy(1000)
		} else {
			this.nextTurn()
		}
	}
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

	await Promise.all(Object.keys(assets).map(async key => {
		const img = new Image()
		await new Promise((resolve) => {
			img.onload = resolve
			img.src = assets[key]
		})
		assets[key] = img
	}))

	const game = new Game({
		combinations: [
			`c1`, `2a`, `95`, `42`, `dd`, `37`
		],
		children: [
			new Combination({
				pos: new Vector(0, 4),
			}),
			new Timer({
				pos: new Vector(4, 15),
				duration: 30000,
				length: 56,
			}),
			new GameBoard({
				data: `af 2d c4`,
				pos: new Vector(4, 20),
			}),
			new Area({
				pos: new Vector(4, 70),
				size: new Vector(screenRes.x - 8, 8),
				children: [
					new Sprite({
						img: getAsset(`button`)
					})
				]
			}),
		],
	})

	game.mount()

	window.requestAnimationFrame(loop)

	let oldT = 0
	function loop(newT) {
		window.requestAnimationFrame(loop)

		if (oldT) {
			const deltaT = newT - oldT

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