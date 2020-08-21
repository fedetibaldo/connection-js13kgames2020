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
Color.white = new Color(255, 255, 255)

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
				// schedule for removal
				this.subs[event][index] = null
			}
		}
	}
	trigger(event, args) {
		const implicitMethodName = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`
		if (typeof this[implicitMethodName] == `function`) {
			this[implicitMethodName](args)
		}
		if (this.subs[event]) {
			this.subs[event].forEach(sub => sub && sub(args))
			// remove unsubscribed watchers
			this.subs[event] = this.subs[event].filter(Boolean)
		}
	}
	destroy() {
		this.subs = []
	}
}

class GameObject extends Observable {
	constructor({
		pos = new Vector(),
		opacity = 1,
		scale = 1,
		children = null,
		...unknownOptions
	}) {
		super()

		this.pos = pos
		this.opacity = opacity
		this.scale = scale
		this.children = []

		for (let key in unknownOptions) {
			this[key] = unknownOptions[key]
		}

		this.addChildren(children || this.createChildren())
	}
	destroy() {
		super.destroy()
		if (this.parent) {
			this.parent.removeChild(this)
		}
		const children = this.children
		this.children = []
		children.forEach(child => child.destroy())
	}
	createChildren() {
		return []
	}
	addChildren(children) {
		children.forEach(child => this.addChild(child))
	}
	addChild(child, index = this.children.length) {
		child.parent = this
		this.children[index] = child
		child.trigger(`mount`)
	}
	getChild(id) {
		return this.children.find(child => child.id === id)
	}
	get(prop) {
		if (typeof this[prop] == `function`) {
			return this[prop]()
		} else {
			return this[prop]
		}
	}
	removeChild(toRemove) {
		const index = this.children.findIndex(child => child === toRemove)
		this.children.splice(index, 1)
	}
	update(deltaT) {
		this.children.forEach(child => child.update(deltaT))
	}
	render(ctx) {
		this.children.forEach(child => {
			ctx.save()
			const { x, y } = child.pos
			ctx.translate(x, y)
			ctx.scale(child.scale, child.scale)
			ctx.globalAlpha = child.opacity * this.getGlobalOpacity()
			child.render(ctx)
			ctx.restore()
		})
	}
	getGlobalOpacity() {
		if (this.parent) {
			return this.opacity * this.parent.getGlobalOpacity()
		} else {
			return this.opacity
		}
	}
	getGlobalPosition() {
		if (this.parent) {
			return this.pos.add(this.parent.getGlobalPosition())
		} else {
			return this.pos
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

		this.subCtx.imageSmoothingEnabled = false

		this.root = new GameObject({})
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

		this.viewPos = this.canvasSize.diff(this.viewSize).mul(1 / 2)
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

class GameText extends GameObject {
	constructor({
		text = ``,
		font = gameFont,
		fontSize = 1, // em
		size = new Vector(),
		align = `left`,
		color = Color.white,
		...options
	}) {
		super({ text, font, fontSize, size, align, color, ...options })
	}
	render(ctx) {
		let startPos = new Vector()
		if (this.get(`align`) == `center`) {
			startPos = this.size.mul(1 / 2).diff(
				new Vector(this.measure() / 2, 0)
			)
		}

		const text = this.get(`text`)

		let fromLeft = Math.round(startPos.x)
		let fromTop = 0 /* startPos.y */

		text.split(``).forEach((char) => {
			const width = this.font.getWidth(char)
			const height = this.font.getHeight(char)
			const offset = this.font.getOffset(char)

			const actualWidth = width * this.fontSize
			const actualHeight = height * this.fontSize

			ctx.drawImage(
				this.font.source,
				offset, 0, width, height,
				fromLeft, fromTop, actualWidth, actualHeight
			)

			if (!this.color.equals(Color.white)) {
				const { x: globalX, y: globalY } = this.getGlobalPosition()
				const imageData = ctx.getImageData(globalX + fromLeft, globalY + fromTop, actualWidth, actualHeight)
				for (let i = 0; i < imageData.data.length; i += 4) {
					imageData.data[i] = this.color.r / 255 * imageData.data[i]
					imageData.data[i + 1] = this.color.g / 255 * imageData.data[i + 1]
					imageData.data[i + 2] = this.color.b / 255 * imageData.data[i + 2]
				}
				ctx.putImageData(imageData, globalX + fromLeft, globalY + fromTop)
			}

			fromLeft += actualWidth
		})
	}
	measure() {
		return this.get(`text`).split(``).reduce((length, char) => {
			return length + this.font.getWidth(char) * this.fontSize
		}, 0)
	}
}

class GameFont {
	constructor(sourcePath, metaPath) {
		this.sourcePath = sourcePath
		this.metaPath = metaPath
		this.source = new Image()
		this.meta = {}
		this.charsMap = new Map()
	}

	async load() {
		// fetch resources
		await new Promise(resolve => {
			this.source.onload = resolve
			this.source.src = this.sourcePath
		})
		const response = await fetch(this.metaPath)
		if (response.ok) {
			this.meta = await response.json()
		}
		// precalculate chars indexes
		let index = 0
		for (let range of this.meta.ranges) {
			if (!Array.isArray(range)) {
				range = [range, range]
			}
			const [lowerBound, upperBound] = range.map(charCode => parseInt(charCode, 16))
			for (let i = lowerBound; i <= upperBound; i++) {
				this.charsMap.set(i, index)
				index += 1
			}
		}
	}

	getIndex(char) {
		char = char.charCodeAt(0)
		return this.charsMap.get(char)
	}

	getHeight(char) {
		// character independent
		return this.meta.height
	}

	getWidth(char) {
		const index = this.getIndex(char)
		return this.meta.width[index]
	}

	getOffset(char) {
		const index = this.getIndex(char)
		let offset = 0
		for (let i = 0; i < index; i++) {
			offset += this.meta.width[i]
		}
		return offset
	}
}

const gameFont = new GameFont(`./assets/font.png`, `./assets/font.meta.json`)

class InputSingleton extends Observable {
	constructor() {
		super()

		this.isMouseDown = false
		this.mousePos = new Vector(0, 0)

		Game.canvas.onmousedown = (e) => this.onCanvasMouseDown(e)
		Game.canvas.onmouseup = (e) => this.onCanvasMouseUp(e)
		Game.canvas.onmousemove = (e) => this.onCanvasMouseMove(e)
		Game.canvas.onclick = (e) => this.onCanvasClick(e)

		Game.canvas.ontouchstart = (e) => this.onCanvasTouchStart(e)
		Game.canvas.ontouchend = (e) => this.onCanvasTouchEnd(e)
		Game.canvas.ontouchmove = (e) => this.onCanvasTouchMove(e)
	}
	onCanvasTouchStart(e) {
		e = this._normalizeTouchEvent(e)
		this.onCanvasMouseDown(e)
	}
	onCanvasTouchEnd(e) {
		e = this._normalizeTouchEvent(e)
		this.onCanvasMouseUp(e)
	}
	onCanvasTouchMove(e) {
		e = this._normalizeTouchEvent(e)
		this.onCanvasMouseMove(e)
	}
	_normalizeTouchEvent(e) {
		e.clientX = e.changedTouches[0].clientX
		e.clientY = e.changedTouches[0].clientY
		return e
	}
	onCanvasMouseDown(e) {
		this.isMouseDown = true
		this.triggerMouseEvent(`mousedown`, e)
	}
	onCanvasMouseUp(e) {
		this.isMouseDown = false
		this.triggerMouseEvent(`mouseup`, e)
	}
	onCanvasMouseMove(e) {
		this.triggerMouseEvent(`mousemove`, e)
	}
	onCanvasClick(e) {
		this.triggerMouseEvent(`click`, e)
	}
	triggerMouseEvent(name, e) {
		const pos = this._normalizePosition(new Vector(e.clientX, e.clientY))
		this.mousePos = pos
		this.trigger(name, { name, pos })
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
		this.unsubscribe = Game.on(`tick`, (deltaT) => this.onGameTick(deltaT))
	}
	onGameTick(deltaT) {
		this.progress += deltaT
		this.trigger(`tick`, Math.min(this.progress / this.duration, 1))
		if (this.progress > this.duration) {
			this.trigger(`completed`)
			this.unsubscribe()
			this.destroy()
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
			animationTimer.on(`completed`, () => {
				this.trigger(`end`)
				this.destroy()
			})
		})
	}
}

class Animate {
	static jumpOut(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		let base = 0
		animation.on(`start`, () => base = gameObject.pos.y)
		animation.on(`progress`, progress => {
			// y = -2 + (4x - sqrt2)^2
			gameObject.pos.y = base + 2 * (-2 + Math.pow(4 * progress - Math.sqrt(2), 2))
			gameObject.opacity = 1 - progress
		})
		return animation
	}
	static jumpIn(gameObject, { duration, delay }) {
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
	static shake(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		let base = 0
		animation.on(`start`, () => base = gameObject.pos.x)
		animation.on(`progress`, progress => {
			gameObject.pos.x = base + 1 * Math.sin(2 * Math.PI * progress)
		})
		return animation
	}
	static explode(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		const { scale, pos, size } = gameObject
		animation.on(`progress`, progress => {
			const scaleFactor = 1.25
			gameObject.pos = pos.diff(size.mul(progress * scaleFactor / 2))
			gameObject.scale = scale + progress * scaleFactor
			gameObject.opacity = 1 - progress
		})
		return animation
	}
	static fadeIn(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		gameObject.opacity = 0
		animation.on(`progress`, progress => {
			gameObject.opacity = progress
		})
		return animation
	}
	static fadeOut(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		gameObject.opacity = 1
		animation.on(`progress`, progress => {
			gameObject.opacity = 1 - progress
		})
		return animation
	}
	static blink(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		const startOpacity = gameObject.opacity
		const oppositeOpacity = gameObject.opacity >= .5 ? 0 : 1
		animation.on(`progress`, progress => {
			if (progress >= 0 && progress < .5) {
				gameObject.opacity = oppositeOpacity
			} else if (progress >= .5 && progress < 1) {
				gameObject.opacity = startOpacity
			}
			if (progress == 1) {
				gameObject.opacity = oppositeOpacity
			}
		})
		return animation
	}
	static zoomIn(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		const { pos, size } = gameObject
		gameObject.scale = 0
		animation.on(`progress`, progress => {
			gameObject.pos = pos.add(size.mul(1 - progress).mul(1 / 2))
			gameObject.scale = progress
		})
		return animation
	}
	static slide(gameObject, { duration, delay, to }) {
		const animation = new GameAnimation({ duration, delay })
		let { pos } = gameObject
		pos = new Vector(pos.x, pos.y)
		animation.on(`progress`, progress => {
			gameObject.pos = pos.add(to.diff(pos).mul(progress))
		})
		return animation
	}
	static lift(gameObject, { duration, delay }) {
		const animation = new GameAnimation({ duration, delay })
		let { pos } = gameObject
		const to = new Vector(pos.x, pos.y + -4)
		animation.on(`progress`, progress => {
			gameObject.opacity = 1 - progress
			gameObject.pos = pos.add(to.diff(pos).mul(progress))
		})
		return animation
	}
}

class Rectangle extends GameObject {
	constructor({
		color = new Color(),
		size = new Vector(),
		...options
	}) {
		super(options)
		this.color = color
		this.size = size
	}
	render(ctx) {
		ctx.fillStyle = this.get(`color`).toString()
		const { x, y } = this.get(`size`)
		ctx.fillRect(0, 0, x, y)
		super.render(ctx)
	}
}

class ResultsScreen extends GameObject {
	constructor({
		score = 0,
		level,
		...options
	}) {
		super({ level, score, ...options })
	}
	createChildren() {
		return [
			new GameText({
				text: `TIME'S UP`,
				fontSize: 2,
				opacity: 0,
				onMount: function () {
					Animate.blink(this, { duration: 800 })
					Animate.slide(this, { delay: 1200, duration: 400, to: new Vector(4, 32) })
				},
				pos: new Vector(4, Game.viewRes.y / 2),
				size: new Vector(Game.viewRes.x - 8, 0),
				align: `center`,
			}),
			new GameText({
				text: () => `SCORE: ${this.get(`score`)}`,
				pos: new Vector(4, 32 + 8 + 4),
				onMount: function () {
					Animate.fadeIn(this, { delay: 1600, duration: 200 })
				},
				size: new Vector(Game.viewRes.x - 8, 0),
			}),
			new GameText({
				text: `BEST: 404`,
				pos: new Vector(4, 32 + 8 + 4 + 4 + 4),
				onMount: function () {
					Animate.fadeIn(this, { delay: 1800, duration: 200 })
				},
				size: new Vector(Game.viewRes.x - 8, 0),
			}),
			new Button({
				text: `RETRY`,
				align: `center`,
				onMount: function () {
					Animate.fadeIn(this, { delay: 2000, duration: 200 })
				},
				onClick: () => this.retry(),
				size: new Vector(Game.viewRes.x / 2 - 6, 11),
				pos: new Vector(4, 32 + 8 + 4 + 4 + 4 + 4 + 4),
			}),
			new Button({
				text: `MENU`,
				align: `center`,
				onMount: function () {
					Animate.fadeIn(this, { delay: 2000, duration: 200 })
				},
				onClick: () => this.goToMenu(),
				size: new Vector(Game.viewRes.x / 2 - 6, 11),
				pos: new Vector(Game.viewRes.x / 2 + 2, 32 + 8 + 4 + 4 + 4 + 4 + 4),
			}),
		]
	}
	retry() {
		Game.root.addChild(new Level({ ...this.level, children: null, opacity: 1 }))
		this.destroy()
	}
	goToMenu() {
		Game.root.addChild(new LevelsScreen({}))
		this.destroy()
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
		ctx.drawImage(this.img, 0, 0,)
		super.render(ctx)
	}
}

class ColoredSprite extends GameObject {
	constructor({
		img = new Image(),
		size = new Vector(),
		...options
	}) {
		super(options)
		this.img = img
		this.size = size
		this.accentColor = null
		this.shiftDur = 200
		this.canvas = document.createElement('canvas')
		this.canvas.width = this.size.x
		this.canvas.height = this.size.y
		this.ctx = this.canvas.getContext('2d')
		this.ctx.drawImage(this.img, 0, 0)
		this.colorArray = this.toColorArray(this.ctx.getImageData(0, 0, 7, 7))
		this.baseColor = this.colorArray.find(color => color.a == 255)
		this.currentColor = this.baseColor
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
			this.colorArray = this.colorArray.map(color => color.a == 255 ? newColor : color)
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
		ctx.drawImage(this.canvas, 0, 0, this.size.x, this.size.y)
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

		this.isInside = false
		// event listeners
		this.listeners = [
			Input.on(`mouseup`, (e) => this.onMouseEvent(`mouseup`, e)),
			Input.on(`mousedown`, (e) => this.onMouseEvent(`mousedown`, e)),
			Input.on(`mousemove`, (e) => this.onMouseEvent(`mousemove`, e)),
			Input.on(`click`, (e) => this.onMouseEvent(`click`, e)),
		]
	}
	destroy() {
		super.destroy()
		this.listeners.forEach(sub => sub())
		this.listeners = []
	}
	onMouseEvent(name, event) {
		if (this.isPointWithinObject(event.pos)) {
			if (!this.isInside) {
				this.trigger(`mouseenter`, event)
				this.isInside = true
			}
			this.trigger(name, event)
		} else {
			if (this.isInside) {
				this.trigger(`mouseexit`, event)
			}
			this.isInside = false
		}
	}
	isPointWithinObject(point) {
		const gPos = this.getGlobalPosition()
		const { x, y } = gPos
		const { x: w, y: h } = gPos.add(this.size)
		return point.x > x && point.x < w && point.y > y && point.y < h
	}
}

class Tile extends Area {
	constructor({
		...options
	}) {
		super(options)
		this.accentColor = null
		this.baseColor = new Color(92, 92, 92)
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
		ctx.strokeRect(0.5, 0.5, this.size.x - 1, this.size.y - 1)
		ctx.fillRect(1, 1, this.size.x - 2, this.size.y - 2)
		super.render(ctx)
	}
}

class Button extends GameObject {
	constructor({
		text = ``,
		size = new Vector(),
		align = `left`,
		...options
	}) {
		super({
			text, size, align,
			padding: 3,
			border: 1,
			...options
		})

		this.isPressed = false
	}
	createChildren() {
		return [
			new Area({
				size: this.size,
				onMousedown: () => this.onAreaMouseDown(),
				onMouseexit: () => this.isPressed = false,
				onMouseup: () => this.onAreaMouseUp(),
				children: [
					new GameText({
						text: this.text,
						align: this.align,
						size: this.size.diff(new Vector(this.padding + this.border, this.padding + this.border).mul(2)),
						pos: new Vector(this.padding + this.border, this.padding + this.border),
					})
				],
			})
		]
	}
	onAreaMouseDown() {
		this.isPressed = true
	}
	onAreaMouseUp() {
		if (this.isPressed) {
			this.trigger(`click`)
		}
		this.isPressed = false
	}
	render(ctx) {
		ctx.strokeStyle = (new Color(92, 92, 92)).toString()
		ctx.fillStyle = (new Color(33, 33, 33)).toString()

		if (!this.isPressed) {
			ctx.fillRect(0, 0, this.size.x, this.size.y)
		}
		ctx.strokeRect(
			(this.isPressed ? 1.5 : 0.5),
			(this.isPressed ? 1.5 : 0.5),
			this.size.x - (this.isPressed ? 3 : 1),
			this.size.y - (this.isPressed ? 3 : 1)
		)

		super.render(ctx)
	}
}

const assets = {
	triangle: `./assets/triangle.png`,
	square: `./assets/square.png`,
	circle: `./assets/circle.png`,
	cross: `./assets/cross.png`,
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
	}
	onNext(success) {
		if (success) {
			this.highlight()
		}
		this.swap()
	}
	highlight() {
		this.children.forEach(child => child.accentColor = new Color(255, 255))
	}
	swap() {
		// Animate old children out
		this.children.forEach((oldChild, index) => {
			const animation = Animate.jumpOut(oldChild, {
				duration: 400,
				delay: 50 * index
			})
			// Remove the child once the animation is complete
			animation.on(`end`, () => this.removeChild(oldChild))
		})
		// Generate and add new children
		const combo = this.get(`combo`)
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
			size: new Vector(7, 7),
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

		this.completed = false
	}
	update(deltaT) {
		if (!this.completed) {
			this.progress = Math.min(this.progress + deltaT, this.duration)
			this.trailColor.a = Math.max(this.trailColor.a - deltaT / this.trailFade * 255, 0)
			if (this.progress == this.duration) {
				this.completed = true
				this.trigger(`completed`)
			}
		}
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

		ctx.strokeStyle = this.color

		const progressLength = this.length - this.length / this.duration * this.progress

		const startProgress = Math.round((this.length - progressLength) / 2)
		const endProgress = Math.round(progressLength + (this.length - progressLength) / 2)

		ctx.beginPath()
		ctx.moveTo(startProgress, this.width / 2)
		ctx.lineTo(endProgress, this.width / 2)
		ctx.stroke()

		ctx.strokeStyle = this.trailColor.toString()

		const trailLength = this.length - this.length / this.duration * this.trail

		// const startTrail = Math.round((this.length - trailLength) / 2)
		// const endTrail = Math.round(trailLength + (this.length - trailLength) / 2)

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
		combo = [],
		...options
	}) {
		const grid = data.split(` `).map(row => parseData(row))
		super({ data, combo, grid, ...options })

		this.comboPlayed = []
		this.tilesPlayed = []
		this.generationsSince = [0, 0, 0, 0]

		this.unsubscribe = Input.on(`mouseup`, () => this.submit())
	}
	destroy() {
		super.destroy()
		this.unsubscribe()
	}
	createChildren() {
		return this.grid.reduce((children, row, rowIndex) => [
			...children,
			...row.map((col, colIndex) => this._createChild(new Vector(colIndex, rowIndex), col))
		], [])
	}
	_createChild(coord, value) {
		return new Tile({
			pos: coord.mul(15),
			size: new Vector(11, 11),
			children: [
				new ColoredSprite({
					pos: new Vector(2, 2),
					size: new Vector(7, 7),
					img: getAsset(fromDataToAsset(value)),
				})
			],
			onMousedown: function () {
				this.parent.select(this, value)
			},
			onMousemove: function () {
				this.parent.select(this, value)
			},
		})
	}
	replaceTiles(coords, values = [0, 0, 0, 0]) {
		// group by column
		const deletionsByColumn = coords.reduce((deletions, coord) => {
			deletions[coord.x].push(coord)
			return deletions
		}, range(4).map(() => []))
		let valueIndex = 0
		// it's difficult to explain
		deletionsByColumn.forEach((deletions, x) => {
			// skip column if untouched
			if (!deletions.length) {
				return
			}
			// for each deletion, create a new child
			const additions = deletions.map((coord, depth) => {
				// animate out
				const tile = this.getTile(coord)
				const outAnimation = Animate.explode(this.getTile(coord), { duration: 200 })
				// move to the bottom of the array and schedule for removal
				const index = this.getIndexFromCoord(coord)
				this.children[index] = null
				this.children[this.children.length] = tile
				outAnimation.on(`end`, () => {
					tile.destroy()
					// this.children.splice(this.children.length - 1, 1)
				})
				// create a new child to replace the soon-to-be-missing tile
				const startCoord = new Vector(x, -(deletions.length - depth))
				return this._createChild(startCoord, values[valueIndex++])
			})
			// query the remaining coordinates (the deletions have been moved to the bottom of the array by this point)
			const remainingTiles = range(3)
				.map(index => this.getTile(new Vector(x, index)))
				// remove deleted tiles
				.filter(Boolean)
			// move the tiles to their new coordinate
			additions.concat(remainingTiles).forEach((tile, index) => {
				// move to the right position in the children array
				const newCoord = new Vector(x, index)
				const childIndex = this.getIndexFromCoord(newCoord)
				if (index < additions.length) {
					this.addChild(tile, childIndex)
					Animate.fadeIn(tile, {
						duration: 200 + 100 * deletions.length,
						delay: (3 - (index + 1)) * 50,
					})
				} else {
					this.children[childIndex] = tile
				}
				// move to the right physical location
				Animate.slide(tile, {
					duration: 200 + 100 * deletions.length,
					delay: (3 - (index + 1)) * 50,
					to: new Vector(x * 15, index * 15)
				})
			})
		})
	}
	getIndexFromCoord(coord) {
		return coord.x + (4 * coord.y)
	}
	getCoordFromIndex(index) {
		return new Vector(index % 4, Math.floor(index / 4))
	}
	getIndexFromTile(tile) {
		return this.children.findIndex(child => child === tile)
	}
	getTile(coord) {
		return this.children[this.getIndexFromCoord(coord)]
	}
	getCoord(tile) {
		return this.getCoordFromIndex(this.getIndexFromTile(tile))
	}
	getValue(coord) {
		return Object.keys(assets).findIndex(key => assets[key] == this.getTile(coord).children[0].img)
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
	select(tile, value) {
		if (Input.isMouseDown && this.tilesPlayed.length < this.get(`combo`).length) {
			const coord = this.getCoord(tile)
			if (this.tilesPlayed.length) {
				if (this.tilesPlayed.find(playedPos => playedPos.equals(coord))) {
					return
				}
				const lastTilePlayed = this.tilesPlayed[this.tilesPlayed.length - 1]
				if (coord.diff(lastTilePlayed).length() > 1) {
					return
				}
			}
			this.tilesPlayed.push(coord)
			this.comboPlayed.push(value)
			tile.accentColor = new Color(255, 255)
			tile.children[0].accentColor = new Color(255, 255)
		}
	}
	generateValue() {
		let value = this.generationsSince.findIndex(value => value > 4)
		if (value == -1) {
			value = Math.floor(Math.random() * 4)
		}
		this.generationsSince[value] = 0
		this.generationsSince.forEach((count, index) => index != value && this.generationsSince[index]++)
		return value
	}
	submit() {
		const combo = this.get(`combo`)
		if (combo.length == this.comboPlayed.length && serializeData(combo) == serializeData(this.comboPlayed)) {
			this.replaceTiles(this.tilesPlayed, range(combo.length).map(() => this.generateValue()))
			this.trigger(`submit`)
		} else {
			this.tilesPlayed.map(coord => {
				const tile = this.getTile(coord)
				tile.accentColor = null
				tile.children[0].accentColor = null
				Animate.shake(tile, { duration: 200 })
			})
		}
		this.comboPlayed = []
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
			ctx.strokeStyle = (new Color(255, 255)).toString()
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
		board = ``,
		time = 0,
		...options
	}) {
		super({ comboLength, board, time, ...options })

		this.score = 0
		this.turn = -1
		this.combo = []

		this.nextTurn()
	}
	createChildren() {
		return [
			new Score({
				id: `score`,
				pos: new Vector(4, 4),
				score: () => this.score
			}),
			new Combination({
				id: `combination`,
				combo: () => this.combo,
				pos: new Vector(0, 13),
			}),
			new Countdown({
				id: `countdown`,
				pos: new Vector(4, 26),
				duration: this.time,
				length: 56,
				onCompleted: () => this.gameOver(),
			}),
			new GameBoard({
				id: `board`,
				data: this.board,
				pos: new Vector(4, 34),
				combo: () => this.combo,
				onSubmit: (e) => this.onCombinationSubmit(e),
			}),
			new Button({
				id: `button`,
				align: `center`,
				text: `404`,
				pos: new Vector(4, 81),
				size: new Vector(Game.viewRes.x - 8, 11),
				onClick: () => this.onCombinationNotFound(),
			}),
		]
	}
	gameOver() {
		this.combo = []
		this.getChild(`combination`).trigger(`next`, false)

		this.getChild(`board`).children.forEach((child, index) => {
			Animate.slide(child, { duration: 400, delay: (3 - Math.floor(index / 4)) * 50, to: child.pos.add(new Vector(0, 30)) })
		})

		const outAnimation = Animate.fadeOut(this, { duration: 400 })
		outAnimation.on(`end`, () => this.destroy())
		Game.root.addChild(new ResultsScreen({ score: this.score, level: this }))
	}
	generateCombination() {
		if (Math.random() > 2 / 3) {
			return range(this.comboLength).map(() => Math.floor(Math.random() * 4))
		} else {
			return this.getChild(`board`).coordsToValue(this.getChild(`board`).getRandomCoords(this.comboLength))
		}
	}
	nextTurn() {
		if (this.turn >= 0) {
			this.score++
			this.getChild(`score`).increment()
		}
		this.turn++
		this.combo = this.generateCombination()
		this.getChild(`combination`).trigger(`next`, true)
	}
	onCombinationSubmit() {
		this.nextTurn()
	}
	onCombinationNotFound() {
		if (this.freezed) {
			return
		} else {
			this.freezed = true
			const freezeTimer = new Timer(600)
			freezeTimer.on(`completed`, () => this.freezed = false)
		}
		if (this.getChild(`board`).findCombination(this.combo)) {
			this.getChild(`countdown`).reduceBy(2000)
			Animate.shake(this.getChild(`combination`), { duration: 200 })
			Animate.shake(this.getChild(`board`), { duration: 200 })
		} else if (this.combo.length) {
			this.nextTurn()
		}
	}
}

class Score extends GameObject {
	constructor({
		score = 0,
		...options
	}) {
		super(options)
		this.score = score
		this.labelObject = new GameText({
			text: () => `${this.get(`score`)}`,
			align: `center`,
			size: new Vector(Game.viewRes.x - 8, 0),
		})
		this.addChild(this.labelObject)
	}
	increment() {
		const popup = new GameText({
			text: `+1`,
			color: new Color(255, 255),
			pos: new Vector(Math.round((Game.viewRes.x - 8) / 2 + this.labelObject.measure() / 2), 0),
		})
		this.addChild(popup)
		const liftAnimation = Animate.lift(popup, { duration: 1000 })
		liftAnimation.on(`end`, () => popup.destroy())
	}
}

class LevelsScreen extends GameObject {
	constructor(options) {
		super({
			levels: [
				// {
				// 	name: `2 BIRDS`,
				// 	comboLength: 2,
				// 	board: `e4 1b b4`,
				// 	time: 30000,
				// },
				{
					name: `3 IN A ROW`,
					comboLength: 3,
					board: `c6 c6 c6`,
					time: 60000,
				},
				{
					name: `GET SQUARE`,
					comboLength: 4,
					board: `55 55 55`,
					time: 60000,
				},
				{
					name: `HIGH FIVE`,
					comboLength: 5,
					board: `f1 78 1a`,
					time: 60000,
				},
				{
					name: `SIX PACK`,
					comboLength: 6,
					board: `eb 69 28`,
					time: 60000,
				},
			],
			...options,
		})
	}
	createChildren() {
		return this.levels.map((level, index) => new Button({
			text: level.name,
			size: new Vector(Game.viewRes.x - 8, 11),
			pos: new Vector(4, 4 + (11 + 4) * index),
			onClick: () => this.playLevel(index),
		}))
	}
	playLevel(index) {
		const level = this.levels[index]
		Game.root.addChild(new Level({
			...level
		}))
		this.destroy()
	}
}

function range(n) {
	return new Array(n).fill(null).map((filler, index) => index)
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

	// load assets

	await gameFont.load()

	await Promise.all(Object.keys(assets).map(async key => {
		const img = new Image()
		await new Promise((resolve) => {
			img.onload = resolve
			img.src = assets[key]
		})
		assets[key] = img
	}))

	// append level

	Game.root.addChild(new LevelsScreen({}))

	// start game

	Game.play()
})()