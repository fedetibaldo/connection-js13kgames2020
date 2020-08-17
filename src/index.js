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

class Color {
	constructor(r = 0, g = 0, b = 0, a = 255) {
		this.r = r
		this.g = g
		this.b = b
		this.a = a
	}
	equals(c) {
		return this.r == c.r && this.g == c.g && this.b == c.b && this.a == c.a
	}
	shift(to, amount) {
		const args = [
			[this.r, to.r],
			[this.g, to.g],
			[this.b, to.b],
			[this.a, to.a],
		].map(([now, target]) => {
			const dir = Math.sign(target - now)
			const fun = dir > 0 ? Math.min : Math.max
			return fun(now + (amount * dir), target)
		})
		return new Color(...args)
	}
	toString() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`
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
		return () => {
			const index = this.subs[event].findIndex(sub => sub === cb)
			if (index >= 0) {
				this.subs[event].splice(index, 1)
			}
		}
	}
	trigger(event, args) {
		if (this.subs[event]) {
			this.subs[event].forEach(sub => sub(args))
		}
	}
}

class GameSingleton extends Observable {
	constructor({
		canvas = document.createElement(`canvas`),
		viewRes = new Vector()
	}) {
		super()
		this.canvas = canvas
		this.ctx = this.canvas.getContext(`2d`)

		this.viewRes = viewRes

		this.subCanvas = document.createElement(`canvas`)
		this.subCanvas.width = this.viewRes.x
		this.subCanvas.height = this.viewRes.y
		this.subCtx = this.subCanvas.getContext(`2d`)

		this.root = null
		this.oldT = 0

		window.onresize = () => this.fitScreen()
		this.fitScreen()
	}
	fitScreen() {
		const computedStyle = window.getComputedStyle(this.canvas)
		this.canvasSize = new Vector(
			parseInt(computedStyle.width),
			parseInt(computedStyle.height)
		)
		this.canvas.width = this.canvasSize.x
		this.canvas.height = this.canvasSize.y

		this.ctx.imageSmoothingEnabled = false

		const upscaleFactor = Math.min(
			this.canvasSize.x / this.viewRes.x,
			this.canvasSize.y / this.viewRes.y
		)

		this.viewSize = new Vector(
			this.viewRes.x * upscaleFactor,
			this.viewRes.y * upscaleFactor
		)

		this.viewPos = this.canvasSize.diff(this.viewSize).mul(1/2)
	}
	loop(newT) {
		window.requestAnimationFrame((newT) => this.loop(newT))
		if (this.root) {
			if (this.oldT) {
				const deltaT = newT - this.oldT
				this.trigger(`tick`, deltaT)

				this.subCtx.fillStyle = 'black'
				this.subCtx.fillRect(0, 0, this.viewRes.x, this.viewRes.y)

				this.root.update(deltaT)
				this.root.render(this.subCtx)

				this.ctx.drawImage(
					this.subCanvas,
					0, 0, this.viewRes.x, this.viewRes.y,
					this.viewPos.x, this.viewPos.y, this.viewSize.x, this.viewSize.y
				)
			}
			this.oldT = newT
		}
	}
	play() {
		this.loop()
	}
}

const Game = new GameSingleton({
	canvas: document.getElementById(`game`),
	viewRes: new Vector(64, 96)
})

class InputSingleton extends Observable {
	constructor() {
		super()

		this.isMouseDown = false
		this.mousePos = new Vector(0, 0)

		Game.canvas.onmousedown = (e) => this.onMouseDown(e)
		Game.canvas.onmouseup = (e) => this.onMouseUp(e)
		Game.canvas.onmousemove = (e) => this.onMouseMove(e)
		Game.canvas.onclick = (e) => this.onClick(e)

		Game.canvas.ontouchstart = (e) => this.onTouchStart(e)
		Game.canvas.ontouchend = (e) => this.onTouchEnd(e)
		Game.canvas.ontouchmove = (e) => this.onTouchMove(e)
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
		const clickPos = pos.diff(Game.viewPos)
		clickPos.x = clickPos.x * Game.viewRes.x / Game.viewSize.x
		clickPos.y = clickPos.y * Game.viewRes.y / Game.viewSize.y
		return clickPos
	}
}

const Input = new InputSingleton()

class Timer extends Observable {
	constructor(duration = 0) {
		super()
		this.duration = duration
		this.progress = 0
		this.unsubscribe = Game.on(`tick`, (deltaT) => this.onTick(deltaT))
	}
	onTick(deltaT) {
		this.progress += deltaT
		this.trigger(`tick`, Math.min(this.progress / this.duration, 1))
		if (this.progress > this.duration) {
			this.trigger(`completed`)
			this.unsubscribe()
		}
	}
}

class GameAnimation extends Observable {
	constructor({ duration, delay = 0 }) {
		super()
		const delayTimer = new Timer(delay)
		delayTimer.on(`completed`, () => {
			this.trigger(`start`)
			const animationTimer = new Timer(duration)
			animationTimer.on(`tick`, (progress) => this.trigger(`progress`, progress))
			animationTimer.on(`completed`, () => this.trigger(`end`))
		})
	}
}

class AnimateSingleton {
	jumpOut(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		let base = 0
		animation.on(`start`, () => base = gameObject.pos.y)
		animation.on(`progress`, progress => {
			// y = -2 + (4x - sqrt2)^2
			gameObject.pos.y = base + 2 * ( -2 + Math.pow(4 * progress - Math.sqrt(2), 2))
			gameObject.opacity = 1 - progress
		})
		return animation
	}
	jumpIn(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		gameObject.opacity = 0
		let base = 0
		animation.on(`start`, () => base = gameObject.pos.y)
		animation.on(`progress`, progress => {
			gameObject.pos.y = base - 6 * (1 - progress)
			gameObject.opacity = progress
		})
		return animation
	}
	shake(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		let base = 0
		animation.on(`start`, () => base = gameObject.pos.x)
		animation.on(`progress`, progress => {
			gameObject.pos.x = base + 1 * Math.sin(2 * Math.PI * progress)
		})
	}
}

const Animate = new AnimateSingleton()

class GameObject extends Observable {
	constructor({
		pos = new Vector(),
		opacity = 1,
		children = []
	}) {
		super()
		this.pos = pos
		this.opacity = opacity
		this.children = []
		this.addChildren(children)
	}
	addChildren(children) {
		children.forEach(child => child.parent = this)
		this.children = this.children.concat(children)
	}
	update(deltaT) {
		this.children.forEach(child => child.update(deltaT))
	}
	render(ctx) {
		this.children.forEach(child => {
			ctx.save()
			const { x, y } = child.pos
			ctx.translate(x, y)
			ctx.globalAlpha = child.opacity
			child.render(ctx)
			ctx.restore()
		})
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
		img = new Image(),
		...options
	}) {
		super(options)
		this.img = img
	}
	render(ctx) {
		ctx.drawImage(this.img, 0, 0)
		super.render(ctx)
	}
}

class ColoredSprite extends GameObject {
	constructor({
		img = new Image(),
		...options
	}) {
		super(options)
		this.img = img
		this.accentColor = null
		this.baseColor = new Color(255, 255, 255)
		this.currentColor = this.baseColor
		this.shiftDur = 200
		this.canvas = document.createElement('canvas')
		this.canvas.width = 7
		this.canvas.height = 7
		this.ctx = this.canvas.getContext('2d')
		this.ctx.drawImage(this.img, 0, 0)
		this.colorArray = this.toColorArray(this.ctx.getImageData(0, 0, 7, 7))
	}
	update(deltaT) {
		let targetColor = null
		if (this.accentColor) {
			if (!this.currentColor.equals(this.accentColor)) {
				targetColor = this.accentColor
			}
		} else {
			if (!this.currentColor.equals(this.baseColor)) {
				targetColor = this.baseColor
			}
		}
		if (targetColor) {
			const newColor = this.currentColor.shift(targetColor, deltaT / this.shiftDur * 255)
			this.colorArray = this.colorArray.map(color => color.equals(this.currentColor) ? newColor : color)
			this.currentColor = newColor
		}
		super.update(deltaT)
	}
	toColorArray(imageData) {
		const colorArray = []
		const data = imageData.data
		for (let i = 0; i < data.length; i += 4) {
			colorArray.push(new Color(data[i], data[i + 1], data[i + 2], data[i + 3]))
		}
		return colorArray
	}
	toImageData(colorArray) {
		return new ImageData(Uint8ClampedArray.from(
			colorArray.reduce((data, color) => [...data, color.r, color.g, color.b, color.a], [])
		), 7)
	}
	render(ctx) {
		this.ctx.putImageData(this.toImageData(this.colorArray), 0, 0)
		ctx.drawImage(this.canvas, 0, 0)
		super.render(ctx)
	}
}

class Tile extends GameObject {
	constructor({
		...options
	}) {
		super(options)
		this.accentColor = null
		this.baseColor = new Color(147, 147, 147)
		this.currentColor = this.baseColor
		this.shiftDur = 400
	}
	update(deltaT) {
		let targetColor = null
		if (this.accentColor) {
			if (!this.currentColor.equals(this.accentColor)) {
				targetColor = this.accentColor
			}
		} else {
			if (!this.currentColor.equals(this.baseColor)) {
				targetColor = this.baseColor
			}
		}
		if (targetColor) {
			this.currentColor = this.currentColor.shift(targetColor, deltaT / this.shiftDur * 255)
		}
		super.update(deltaT)
	}
	render(ctx) {
		ctx.fillStyle = `black`
		ctx.lineWidth = 1
		ctx.strokeStyle = this.currentColor.toString()
		ctx.strokeRect(0.5, 0.5, 10, 10)
		ctx.fillRect(1, 1, 9, 9)
		super.render(ctx)
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
		const { x, y } = gPos
		const { x: w, y: h } = gPos.add(this.size)
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
		...options
	}) {
		super(options)
		this.on(`next`, (e) => this.onNext(e))
	}
	onNext({ combo, success }) {
		if (success) {
			this.highlight()
		}
		this.swap(combo)
	}
	highlight() {
		this.children.forEach(child => child.accentColor = new Color(255, 255))
	}
	swap(combo) {
		// Animate old children out
		this.children.forEach((oldChild, index) => {
			const animation = Animate.jumpOut(oldChild, {
				duration: 400,
				delay: 50 * index
			})
			// Remove the child once the animation is complete
			animation.on(`end`, () => {
				const index = this.children.findIndex(child => child === oldChild)
				this.children.splice(index, 1)
			})
		})
		// Generate and add new children
		const newRow = this._createChildren(combo)
		this.addChildren(newRow)
		// Animate new children in
		newRow.forEach((newChild, index) => {
			Animate.jumpIn(newChild, {
				duration: 200,
				delay: (this.children.length > 4 ? 300 : 0) + 50 * index
			})
		})
	}
	_createChildren(combination) {
		const spriteW = 7
		const padding = 2
		const boxW = spriteW + padding
		return combination.map((value, index) => new ColoredSprite({
			img: getAsset(fromDataToAsset(value)),
			pos: new Vector(Game.viewRes.x / 2 - Math.floor((boxW * combination.length) / 2) + (boxW * index) + padding / 2, 0),
		}))
	}
}

class Countdown extends GameObject {
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
		this.trailColor = new Color(255, 0, 0, 0)
		this.trailFade = 400
	}
	update(deltaT) {
		this.progress = Math.min(this.progress + deltaT, this.duration)
		this.trailColor.a = Math.max(this.trailColor.a - deltaT / this.trailFade * 255, 0)
		super.update(deltaT)
	}
	reduceBy(time) {
		this.trail = this.progress
		this.update(time)
		this.trailColor.a = 255
	}
	/**
	 * @param {CanvasRenderingContext2D} ctx 
	 */
	render(ctx) {
		ctx.lineWidth = this.width

		ctx.strokeStyle = this.trailColor.toString()

		const trailLength = this.length - this.length / this.duration * this.trail

		const startTrail = Math.round((this.length - trailLength) / 2)
		const endTrail = Math.round(trailLength + (this.length - trailLength) / 2)

		ctx.beginPath()
		ctx.moveTo(startTrail, this.width / 2)
		ctx.lineTo(endTrail, this.width / 2)
		ctx.stroke()

		ctx.strokeStyle = this.color

		const progressLength = this.length - this.length / this.duration * this.progress

		const startProgress = Math.round((this.length - progressLength) / 2)
		const endProgress = Math.round(progressLength + (this.length - progressLength) / 2)

		ctx.beginPath()
		ctx.moveTo(startProgress, this.width / 2)
		ctx.lineTo(endProgress, this.width / 2)
		ctx.stroke()

		super.render(ctx)
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
		this.addChildren(this._createChildren(this.grid))

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
						new ColoredSprite({
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
	getBorderingPositions(pos, exploredPositions = []) {
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
		return positions.filter(pos =>
			!exploredPositions.find(explored =>
				explored.equals(pos)
			)
		)
	}
	getEveryPossibleCoord() {
		return range(this.grid.length).reduce((rows, filler, y) => {
			return rows.concat(range(this.grid[y].length).map((filler, x) => {
				return new Vector(x, y)
			}))
		}, [])
	}
	findCombination(combination, exploredPositions = [], possiblePositions = null, depth = 0) {
		if (depth >= combination.length) {
			return true
		}
		if (!possiblePositions) {
			possiblePositions = this.getEveryPossibleCoord()
		}
		for (let pos of possiblePositions) {
			if (this.getValue(pos) == combination[depth]) {
				const solution = this.findCombination(
					combination,
					[...exploredPositions, pos],
					this.getBorderingPositions(pos, exploredPositions),
					depth + 1
				)
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
	getRandomCoords(length, exploredCoords = [], coords = null, depth = 0) {
		if (depth >= length) {
			return true
		}
		if (!coords) {
			coords = this.getEveryPossibleCoord()
		}
		coords = shuffle(coords)
		for (let coord of coords) {
			const solution = this.getRandomCoords(
				length,
				[...exploredCoords, coord],
				this.getBorderingPositions(coord, exploredCoords),
				depth + 1
			)
			if (solution) {
				if (solution === true) {
					return [coord]
				} else {
					return [coord, ...solution]
				}
			}
		}
	}
	coordsToValue(coords) {
		return coords.map(coord => this.getValue(coord))
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
			tile.accentColor = new Color(255, 255)
			tile.children[0].accentColor = new Color(255, 255)
		}
	}
	resetState() {
		this.trigger(`submit`, { combo: this.combination, coords: this.tilesPlayed })
		this.children.forEach(area => {
			area.children[0].accentColor = null
			area.children[0].children[0].accentColor = null
		})
		this.combination = []
		this.tilesPlayed = []
	}
	render(ctx) {
		const getCenterOfTile = (coord) => {
			/** @type {Area} */
			const tile = this.getTile(coord)
			const { pos, size } = tile
			return pos.add(size.mul(1 / 2))
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

		super.render(ctx)
	}
}

class Level extends GameObject {
	constructor({
		comboLength,
		...options
	}) {
		super(options)

		this.turn = -1
		this.combination = []
		this.comboLength = comboLength

		this.display = this.children.find(child => child instanceof Combination)
		this.countdow = this.children.find(child => child instanceof Countdown)
		this.board = this.children.find(child => child instanceof GameBoard)
		this.button = this.children.find(child => child instanceof Area)

		this.board.on(`submit`, (e) => this.onCombinationSubmit(e))
		this.button.on(`click`, (e) => this.onCombinationNotFound())

		this.nextTurn()
	}
	generateCombination() {
		if (Math.random() > 2 / 3) {
			return range(this.comboLength).map(() => Math.floor(Math.random() * 4))
		} else {
			return this.board.coordsToValue(this.board.getRandomCoords(this.comboLength))
		}
	}
	nextTurn(success) {
		this.turn++
		// this.board.highlightCombination()
		// this.display.highlight()
		this.combination = this.generateCombination()
		this.display.trigger(`next`, { combo: this.combination, success })
	}
	onCombinationSubmit({ combo, coords }) {
		if (combo.length == this.comboLength && serializeData(combo) == serializeData(this.combination)) {
			this.nextTurn(true)
		} else {
			coords.map(coord => Animate.shake(this.board.getTile(coord), { duration: 200 }))
		}
	}
	onCombinationNotFound() {
		if (this.board.findCombination(this.combination)) {
			this.countdow.reduceBy(2000)
			Animate.shake(this.display, { duration: 200 })
			Animate.shake(this.board, { duration: 200 })
		} else {
			this.nextTurn(true)
		}
	}
}

function range(n) {
	return new Array(n).fill(null)
}

/**
 * @see https://bost.ocks.org/mike/shuffle/
 */
function shuffle(array) {
	var m = array.length, t, i;
  
	// While there remain elements to shuffle…
	while (m) {
  
	  // Pick a remaining element…
	  i = Math.floor(Math.random() * m--);
  
	  // And swap it with the current element.
	  t = array[m];
	  array[m] = array[i];
	  array[i] = t;
	}
  
	return array;
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

	const level = new Level({
		comboLength: 4,
		children: [
			new Combination({
				pos: new Vector(0, 13),
			}),
			new Countdown({
				pos: new Vector(4, 26),
				duration: 60000,
				length: 56,
			}),
			new GameBoard({
				data: `af 2d c4`,
				pos: new Vector(4, 34),
			}),
			new Area({
				pos: new Vector(4, 81),
				size: new Vector(Game.viewRes.x - 8, 8),
				children: [
					new Sprite({
						img: getAsset(`button`)
					}),
				]
			}),
		],
	})

	Game.root = level

	Game.play()
})()