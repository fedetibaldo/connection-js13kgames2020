// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
// There is a small bit of optional code to improve compatibility.
// Feel free to minify it further for your own needs!

'use strict';let zzfx,zzfxV,zzfxX,zzfxR

// ZzFXMicro - Zuper Zmall Zound Zynth 
zzfxV=.3    // volume
zzfx=       // play sound
(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);q=zzfxX.createBuffer(1,h,zzfxR);q.getChannelData(0).set(Z);c=zzfxX.createBufferSource();c.buffer=q;c.connect(zzfxX.destination);c.start();return c}
zzfxX=new(window.AudioContext||webkitAudioContext) // audio context
zzfxR=44100 // sample rate

class Sound {
	static buttonClick() {
		// zzfx(1, 0, 200, 0, .01, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0) // Blip 126
		zzfx(1,0,10,.04,0,.09,0,1,0,0,100,.06,0,0,0,0,0,1,0) // Blip 377
	}
	static buttonLocked() {
		// zzfx(1, 0, 202, .03, .04, .01, 2, 0, 0, 0, 0, 0, 0, 0, 1.9, 0, 0, 0, .01) // Random 50
		// zzfx(1,0,20,.04,0,.09,0,10,0,0,0,.06,0,0,0,0,0,1,0) // Blip 377
		zzfx(1,0,20,.04,0,.09,1,10,0,0,-50,.06,0,0,0,0,0,1,0); // Blip 377
	}
	static wrongCombination() {
		Sound.buttonLocked()
		// zzfx(1, 0, 300, .03, .04, .01, 1, 0, 0, 0, 0, 0, 0, 0, 2.5, 0, 0, 0, .01) // Random 50
	}
	static tileSelect(index) {
		// zzfx(1, 0, 100, .02, .05, .02, 0, 0, 0, 0, 100, .05, 0, 0, 0, 0, 0, 1, 0)
		zzfx(1,0,20,.04,0,.09,0,1,0,0,50 * (index + 1),.06,0,0,0,0,0,1,0) // Blip 377
	}
	static score() {
		// zzfx(1, 0, 800, .01, .025, .18, 0, 0, 0, 0, 200, .06, 0, 0, 0, 0, 0, 2, .025) // Select - Mutation 9
		zzfx(1,0,400,.04,0,.09,0,1,0,100,0,0,0,0,0,0,0,1,0); // Blip 377
	}
	static coming() {
		zzfxV=.1
		Sound.buttonClick()
		// zzfx(.25,0,2e4,.03,0,.01,0,0,0,0,0,0,0,1e5,0,0,0,1,0); // coming
		zzfxV=.3
	}
	static opening() {
		// zzfx(.25,0,2e3,.1,0,.6,0,1,100,100,0,0,0,100,0,0,0,1,0) // coming
		// zzfx(...[,0,34,,.25,1.75,,6,,.2,,,,.2,5,,.4,.9]); // Explosion 381
	}
}

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
	round() {
		return new Vector(Math.round(this.x), Math.round(this.y))
	}
	floor() {
		return new Vector(Math.floor(this.x), Math.floor(this.y))
	}
	clone() {
		return new Vector(this.x, this.y)
	}
}

const logins = +localStorage.getItem(`logins`) || 0
localStorage.setItem(`logins`, logins + 1)

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
Color.darkGrey = new Color(33, 33, 33)
Color.grey = new Color(45, 45, 45)
Color.lightGrey = new Color(92, 92, 92)
Color.yellow = new Color(255, 255)

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
		freezed = false,
		children = [],
		...unknownOptions
	} = {}) {
		super()

		this.pos = pos
		this.opacity = opacity
		this.scale = scale
		this.freezed = freezed
		this.children = []

		for (let key in unknownOptions) {
			this[key] = unknownOptions[key]
		}

		this.addChildren(children || [])
		this.addChildren(this.createChildren())
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
		this.trigger(`childrenChange`)
	}
	getChild(id) {
		if (id === this.id) {
			return this
		} else {
			for (let i = 0; i < this.children.length; i++) {
				let needle = this.children[i].getChild(id)
				if (needle) {
					return needle
				}
			}
		}
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
		this.trigger(`childrenChange`)
	}
	update(deltaT) {
		this.children.forEach(child => child.update(deltaT))
	}
	render(ctx) {
		this.children.forEach(child => {
			ctx.save()
			const { x, y } = child.pos.round()
			ctx.translate(x, y)
			ctx.scale(child.scale, child.scale)
			ctx.globalAlpha = child.opacity * this.getGlobalOpacity()
			// ctx.strokeStyle = 'red'
			// child.size && ctx.strokeRect(0, 0, child.size.x, child.size.y)
			child.render(ctx)
			ctx.restore()
		})
	}
	isFreezed() {
		const freezed = this.freezed
		if (this.parent && !freezed) {
			return this.parent.isFreezed()
		}
		return freezed
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
	viewRes: new Vector(64 * 1.5, 96 * 1.5)
})

class Trophy {
	constructor(name, message, condition) {
		this.name = name
		this.message = message
		this.unlocked = this.getMessage() != null
		this.condition = condition
	}
	getFullPath() {
		return `OS13kTrophy,🟣,Connection,${this.name}`
	}
	getMessage() {
		return window.localStorage.getItem(this.getFullPath())
	}
	unlock() {
		this.unlocked = true
		this.setMessage(this.message)
	}
	setMessage(newMessage) {
		window.localStorage.setItem(this.getFullPath(), newMessage)
	}
}

class Record extends Trophy {
	constructor(levelName) {
		super(levelName, ``, () => true)
		this.message = this.getBest()
		this.unlocked = true
	}
	getFullPath() {
		return `OS13kTrophy,🟣,Connection,HIGH SCORE: ${this.name}`
	}
	getBest() {
		return parseInt(this.getMessage()) || 0
	}
	setBest(newBest) {
		this.setMessage(parseInt(newBest))
	}
}

class TrophyCase {
	static getTrophy(name) {
		return this.trophies.find(trophy => trophy.name == name)
	}
	static updateTrophyStatus() {
		const unlockedTrophies = []
		this.trophies.forEach(trophy => {
			if (!trophy.unlocked && trophy.condition()) {
				trophy.unlock()
				unlockedTrophies.push(trophy)
			}
		})
		TrophyCase.notifyTrophies(unlockedTrophies)
	}
	static async notifyTrophies(trophies) {
		for (let i = 0; i < trophies.length; i++) {
			await TrophyCase.notifyTrophy(trophies[i])
		}
	}
	static async notifyTrophy(trophy) {
		const padding = new Vector(4, 4)
		const implicitButtonPadding = new Vector(5, 5)
		const tempText = new GameText({
			text: trophy.name,
			size: Game.viewRes.diff(padding.mul(2)).diff(implicitButtonPadding.mul(2)),
		})
		const startPos = new Vector(padding.x, -tempText.getTextMetrics().y - implicitButtonPadding.mul(2).y)
		const popup = new Button({
			text: trophy.name,
			freezed: true,
			size: new Vector(Game.viewRes.diff(padding.mul(2)).x, tempText.getTextMetrics().y + implicitButtonPadding.mul(2).y),
			pos: startPos,
		})
		Game.root.getChild(`popup`).addChild(popup)
		await Promise.all([
			Animate.slide(popup, { delay: 400, duration: 400, to: padding }).promise,
			Animate.fadeIn(popup, { delay: 400, duration: 400 }).promise
		])
		await Promise.all([
			Animate.slide(popup, { delay: 1000, duration: 400, to: startPos }).promise,
			Animate.fadeOut(popup, { delay: 1000, duration: 400 }).promise
		])
	}
}
TrophyCase.trophies = [
	new Record(`3 IN A ROW`),
	new Record(`GET SQUARE`),
	new Record(`HIGH FIVE`),
	new Record(`SIX PACK`),
	new Record(`ARCADE`),
	new Trophy(`WELCOME BACK`, `OPEN THE GAME TWICE`, () => +localStorage.getItem('logins') > 1),
	new Trophy(`RETURNING CUSTOMER`, `OPEN THE GAME TEN TIMES`, () => +localStorage.getItem('logins') > 10),
	new Trophy(`TIME TO SETTLE IT DOWN`, `UNLOCK 'GET SQUARE'`, () => TrophyCase.getTrophy(`3 IN A ROW`).getBest() > 20),
	new Trophy(`YOU'RE AWESOME`, `UNLOCK 'HIGH FIVE'`, () => TrophyCase.getTrophy(`GET SQUARE`).getBest() > 15),
	new Trophy(`THEORETICALLY ENDLESS FUN`, `UNLOCK 'ARCADE'`, () => TrophyCase.getTrophy(`HIGH FIVE`).getBest() > 10),
	new Trophy(`CULTURIST`, `UNLOCK 'SIX PACK'`, () => TrophyCase.getTrophy(`ARCADE`).getBest() > 30),
	new Trophy(`OVERACHIEVER I`, `SCORE MORE THAN 25 POINTS IN '3 IN A ROW'`, () => TrophyCase.getTrophy(`3 IN A ROW`).getBest() > 25),
	new Trophy(`OVERACHIEVER II`, `SCORE MORE THAN 20 POINTS IN 'GET SQUARE'`, () => TrophyCase.getTrophy(`GET SQUARE`).getBest() > 20),
	new Trophy(`OVERACHIEVER III`, `SCORE MORE THAN 15 POINTS IN 'HIGH FIVE'`, () => TrophyCase.getTrophy(`HIGH FIVE`).getBest() > 15),
	new Trophy(`OVERACHIEVER IV`, `SCORE MORE THAN 40 POINTS IN 'ARCADE'`, () => TrophyCase.getTrophy(`ARCADE`).getBest() > 40),
	new Trophy(`OVERACHIEVER V`, `SCORE MORE THAN 15 POINTS IN 'SIX PACK'`, () => TrophyCase.getTrophy(`SIX PACK`).getBest() > 15),
	new Trophy(`ALL STARS`, `UNLOCK ALL TROPHIES`, () => TrophyCase.trophies.filter(trophy => !(trophy instanceof Record) && trophy.name != `ALL STARS`).every(trophy => trophy.unlocked)),
]

class GameText extends GameObject {
	constructor({
		text = ``,
		font = gameFont,
		fontSize = 1, // em
		lineHeight = 1.5, // em
		size = null,
		align = `left`,
		color = Color.white,
		...options
	}) {
		super({ text, font, fontSize, lineHeight, size, align, color, ...options })
		if (!this.size) {
			this.fixedSize = false
			this.recalculateSize()
		} else {
			this.fixedSize = true
		}
	}
	recalculateSize() {
		this.size = this.getTextMetrics(this.get(`text`))
	}
	render(ctx) {
		if (!this.fixedSize) {
			this.recalculateSize()
		}
		let startPos = new Vector()
		if (this.get(`align`) == `center`) {
			startPos = this.size.mul(1/2).diff(
				this.getTextMetrics(this.get(`text`)).mul(1/2)
			)
		}

		const text = this.get(`text`)

		const height = this.font.getHeight()
		const actualHeight = height * this.fontSize

		let fromLeft = Math.round(startPos.x)
		let fromTop = 0 /* startPos.y */

		const lines = this.splitText(text)

		lines.forEach(line => {
			line.trim().split(``).forEach(char => {

				const width = this.font.getWidth(char)
				const offset = this.font.getOffset(char)

				const actualWidth = width * this.fontSize

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

			fromLeft = 0
			fromTop += Math.round(actualHeight * this.lineHeight)
		})
		super.render(ctx)
	}
	splitText(text) {
		const lines = [[]]
		let cumulativeWidth = 0
		text.trim().split(` `).forEach((word, index) => {
			if (lines[lines.length - 1] && lines[lines.length - 1].length) {
				word = ` ${word}`
			}
			const width = this.getTextMetrics(word).x
			if (cumulativeWidth + width > this.size.x) {
				if (width > this.size.x) {
					const hyphenWidth = this.getTextMetrics(`-`).x
					const index = word.split(``).findIndex((char, index, word) => {
						const wordSoFar = word.slice(0, index + 1)
						return cumulativeWidth + this.getTextMetrics(wordSoFar.join(``)).x + hyphenWidth > this.size.x
					})
					if (index > 1) {
						lines[lines.length - 1].push(`${word.slice(0, index)}-`)
						word = word.slice(index)
					}
					cumulativeWidth = this.getTextMetrics(word).x
				} else {
					cumulativeWidth = width
				}
				lines.push([word.trim()])
			} else {
				lines[lines.length - 1].push(word.trim())
				cumulativeWidth += width
			}
		})
		return lines.map(words => words.join(` `))
	}
	getTextMetrics(text) {
		const lines = this.fixedSize && !text
			? this.splitText(this.get(`text`))
			: [text]
		return new Vector(
			Math.max(
				...lines.map(line => line.split(``).reduce((width, char) => {
					return width + this.font.getWidth(char) * this.fontSize
				}, 0))
			),
			lines.length * this.font.getHeight() * this.fontSize * this.lineHeight - (this.lineHeight - 1)
		).floor()
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

	getHeight() {
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

class Spritesheet {
	constructor(sourcePath, meta) {
		this.sourcePath = sourcePath
		this.source = new Image()
		this.meta = meta
	}
	async load() {
		// fetch resources
		await new Promise(resolve => {
			this.source.onload = resolve
			this.source.src = this.sourcePath
		})
	}
	getIndex(name) {
		return this.meta.assetNames.indexOf(name)
	}
	getHeight() {
		return this.meta.height
	}
	getWidth() {
		return this.meta.width
	}
	getOffset(index) {
		if (isNaN(parseInt(index))) {
			index = this.getIndex(index)
		}
		return this.meta.width * index
	}
}

const assets = new Spritesheet(`./assets/sprites.png`, {
	width: 11,
	height: 11,
	assetNames: [`triangle`, `square`, `circle`, `cross`, `lock`],
})

class InputSingleton extends Observable {
	constructor() {
		super()

		this.isMouseDown = false
		this.isTouchDevice = false
		this.isScrolling = false
		this.mousePos = new Vector(0, 0)
		this.scrollVelocity = 5
		this.sensitivity = 2

		this.lastDragPoint = null

		Game.canvas.onmousedown = (e) => this.onCanvasMouseDown(e)
		Game.canvas.onmouseup = (e) => this.onCanvasMouseUp(e)
		Game.canvas.onmousemove = (e) => this.onCanvasMouseMove(e)

		Game.canvas.ontouchstart = (e) => this.onCanvasTouchStart(e)
		Game.canvas.ontouchend = (e) => this.onCanvasTouchEnd(e)
		Game.canvas.ontouchmove = (e) => this.onCanvasTouchMove(e)

		Game.canvas.onwheel = (e) => this.onCanvasWheel(e)
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
		this.isTouchDevice = true
		e.clientX = e.changedTouches[0].clientX
		e.clientY = e.changedTouches[0].clientY
		e.isTouchEvent = true
		return e
	}
	onCanvasMouseDown(e) {
		this.isMouseDown = true
		this.lastDragPoint = this.initialDragPoint = this.normalizePosition(this.eventToVector(e))
		this.stopMomentum && this.stopMomentum()
		this.triggerMouseEvent(`mousedown`, e)
	}
	onCanvasMouseUp(e) {
		this.isMouseDown = false
		this.triggerMouseEvent(`mouseup`, e)
		if (this.isScrolling) {
			this.stopMomentum = Game.on(`tick`, (deltaT) => {
				const delta = this.lastDelta = this.lastDelta.diff(this.lastDelta.mul(this.scrollVelocity * (deltaT / 1000)))
				this.triggerEvent(`scroll`, { delta })
				if (delta.length() < 0.1) {
					this.stopMomentum()
				}
			})
		}
		this.isScrolling = false
	}
	onCanvasMouseMove(e) {
		this.triggerMouseEvent(`mousemove`, e)
		if (this.isMouseDown) {
			const newDragPoint = this.normalizePosition(this.eventToVector(e))
			if (!this.isScrolling) {
				const deltaFromStart = newDragPoint.diff(this.initialDragPoint)
				if (deltaFromStart.length() > this.sensitivity) {
					this.isScrolling = true
				}
			}
			if (this.isScrolling) {
				const delta = newDragPoint.diff(this.lastDragPoint)
				this.lastDelta = delta
				this.lastDragPoint = newDragPoint
				this.triggerEvent(`scroll`, { delta })
			}
		}
	}
	onCanvasWheel(e) {
		const delta = (e.shiftKey ? new Vector(e.deltaY, 0) : new Vector(0, e.deltaY)).mul(this.scrollVelocity).mul(-1)
		// const delta = dir.mul(this.scrollVelocity)
		this.triggerEvent(`scroll`, { delta })
	}
	triggerMouseEvent(name, e) {
		if (!e.isTouchEvent && this.isTouchDevice) {
			return
		}
		const pos = this.normalizePosition(this.eventToVector(e))
		this.mousePos = pos
		this.triggerEvent(name, { pos })
	}
	triggerEvent(name, args) {
		this.trigger(name, { name, ...args })
	}
	eventToVector(e) {
		return new Vector(e.clientX, e.clientY)
	}
	normalizePosition(pos) {
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

class Interval extends Observable {
	constructor(interval) {
		super()
		this.interval = interval
		this.stopped = false
		this.onTimerCompleted()
	}
	onTimerCompleted() {
		if (!this.stopped) {
			this.trigger(`tick`)
			this.timer = new Timer(this.interval)
			this.timer.on(`completed`, () => this.onTimerCompleted())
		} else {
			this.destroy()
		}
	}
	stop() {
		this.stopped = true
	}
}

class GameAnimation extends Observable {
	constructor({ duration, delay = 0 }) {
		super()
		this.promise = new Promise((resolve) => {
			const delayTimer = new Timer(delay)
			delayTimer.on(`completed`, () => {
				this.trigger(`start`)
				const animationTimer = new Timer(duration)
				animationTimer.on(`tick`, (progress) => this.trigger(`progress`, progress))
				animationTimer.on(`completed`, () => {
					this.trigger(`end`)
					resolve()
					this.destroy()
				})
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
			// y = -8 + (8x - sqrt8)^2
			gameObject.pos.y = base + (-8 + Math.pow(8 * progress - Math.sqrt(8), 2))
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
	static fadeTo(gameObject, { duration, delay, to }) {
		const animation = new GameAnimation({ duration, delay })
		const { opacity: from } = gameObject
		animation.on(`progress`, progress => {
			const opacity = from + (to - from) * progress
			gameObject.opacity = opacity
		})
		return animation
	}
	static fadeIn(gameObject, options) {
		return Animate.fadeTo(gameObject, { ...options, to: 1 })
	}
	static fadeOut(gameObject, options) {
		return Animate.fadeTo(gameObject, { ...options, to: 0 })
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
	static zoomTo(gameObject, { duration, delay, to }) {
		const animation = new GameAnimation({ duration, delay })
		const { pos, size, scale: from } = gameObject
		const ogPos = pos.add(size.mul(from).diff(size).mul(1 / 2))
		animation.on(`progress`, progress => {
			const scale = from + (to - from) * progress
			// gameObject.pos = pos.add(pos.diff(size.mul(scale).mul(1/2)))
			gameObject.pos = ogPos.diff(
				size.mul(scale).diff(size).mul(1 / 2)
			)
			gameObject.scale = scale
		})
		return animation
	}
	static zoomIn(gameObject, options) {
		gameObject.scale = 0
		return Animate.zoomTo(gameObject, { ...options, to: 1 })
	}
	static zoomOut(gameObject, options) {
		gameObject.scale = 1
		return Animate.zoomTo(gameObject, { ...options, to: 0 })
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
	static counter(gameObject, { duration, delay, to }) {
		const animation = new GameAnimation({ duration, delay })
		gameObject.text = `0`
		animation.on(`progress`, progress => {
			gameObject.text = `${Math.round(to * progress)}`
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
		this.trophy = TrophyCase.getTrophy(this.level.name)
		this.previousBest = this.trophy.getBest()
		this.on(`mount`, () => this.updateTrophy())
		this.on(`mount`, () => this.entryAnimation())
	}
	updateTrophy() {
		if (this.previousBest < this.score) {
			this.trophy.setBest(this.score)
		}
	}
	async entryAnimation() {
		this.freezed = true
		const title = this.getChild(`title`)
		const ogPos = title.pos.clone()
		const center = Game.viewRes.mul(1/2).diff(title.getGlobalPosition())
		title.pos = new Vector(ogPos.x, center.y)
		await Animate.blink(title, { duration: 800 }).promise
		await Animate.slide(title, { duration: 600, delay: 400, to: ogPos }).promise
		const scoreLabel = this.getChild(`scoreLabel`)
		const score = this.getChild(`score`)
		const scoreAnimation = Animate.counter(score, { duration: 1200, to: this.score })
		await Promise.all([
			Animate.fadeIn(scoreLabel, { duration: 600 }).promise,
			Animate.fadeIn(score, { duration: 600 }).promise,
		])
		const bestLabel = this.getChild(`bestLabel`)
		const best = this.getChild(`best`)
		await Promise.all([
			Animate.fadeIn(bestLabel, { duration: 600 }).promise,
			Animate.fadeIn(best, { duration: 600 }).promise,
		])
		await scoreAnimation.promise
		if (this.previousBest < this.score) {
			const newBest = new GameText({
				...best,
				size: null,
				pos: best.getGlobalPosition(),
				scale: 20,
				opacity: 0,
				text: `${this.score} NEW`,
				color: Color.yellow,
			})
			newBest.pos = newBest.pos.diff(
				newBest.size.mul(newBest.scale).diff(newBest.size).mul(1 / 2)
			)
			this.addChild(newBest)
			await Promise.all([
				Animate.explode(best, { duration: 400 }).promise,
				Animate.zoomTo(newBest, { duration: 400, to: 1 }).promise,
				Animate.fadeIn(newBest, { duration: 400 }).promise,
			])
		}
		TrophyCase.updateTrophyStatus()
		const retry = this.getChild(`retry`)
		const menu = this.getChild(`menu`)
		await Promise.all([
			Animate.fadeIn(retry, { duration: 600 }).promise,
			Animate.fadeIn(menu, { duration: 600 }).promise,
		])
		this.freezed = false
	}
	createChildren() {
		const scoreLabel = new GameText({
			id: `scoreLabel`,
			text: `SCORE: `,
			pos: new Vector(4, 28 + 8 + 4 + 2),
			opacity: 0,
		})
		const score = new GameText({
			id: `score`,
			text: `0`,
			pos: new Vector(4 + scoreLabel.size.x, 28 + 8 + 4 + 2),
			opacity: 0,
		})
		const bestLabel = new GameText({
			id: `bestLabel`,
			text: `BEST: `,
			pos: new Vector(4, 28 + 8 + 4 + 2 + 4 + 4),
			opacity: 0,
		})
		const best = new GameText({
			id: `best`,
			text: `${TrophyCase.getTrophy(this.level.name).getBest()}`,
			pos: new Vector(4 + bestLabel.size.x, 28 + 8 + 4 + 2 + 4 + 4),
			opacity: 0,
		})
		const padding = new Vector(8, 8)
		const flexSize = Game.viewRes.diff(padding.mul(2))
		return [
			new Flexbox({
				direction: `column`,
				pos: padding,
				size: flexSize,
				spaceBetween: 8,
				align: `center`,
				justify: `center`,
				children: [
					new GameText({
						id: `title`,
						text: `TIME'S UP`,
						fontSize: 2,
						opacity: 0,
						pos: new Vector(0, Game.viewRes.y / 2),
						align: `center`,
					}),
					new Flexbox({
						size: new Vector(flexSize.x, 7),
						justify: `start`,
						children: [
							scoreLabel,
							score,
						],
					}),
					new Flexbox({
						size: new Vector(flexSize.x, 7),
						justify: `start`,
						children: [
							bestLabel,
							best,
						],
					}),
					new Flexbox({
						direction: `row`,
						size: new Vector(flexSize.x, 17),
						spaceBetween: 4,
						justify: `center`,
						children: [
							new Button({
								id: `retry`,
								text: `RETRY`,
								align: `center`,
								opacity: 0,
								onClick: () => this.retry(),
								size: new Vector(flexSize.x / 2, 17),
							}),
							new Button({
								id: `menu`,
								text: `MENU`,
								align: `center`,
								opacity: 0,
								onClick: () => this.goToMenu(),
								size: new Vector(flexSize.x / 2, 17),
							}),
						],
					}),
				],
			}),
		]
	}
	retry() {
		Sound.buttonClick()
		if (this.level instanceof Arcade) {
			Game.root.getChild(`main`).addChild(new Arcade({ ...this.level, children: null, opacity: 1 }))
		} else {
			Game.root.getChild(`main`).addChild(new Level({ ...this.level, children: null, opacity: 1 }))
		}
		this.destroy()
	}
	async goToMenu() {
		const viewWidth = new Vector(Game.viewRes.x, 0)
		const config = {
			pos: viewWidth.mul(-1),
		}

		const nextScreen = this.level instanceof Arcade && !(this.previousBest <= 30 && this.score > 30) || (this.level.name == `HIGH FIVE` && this.previousBest <= 10 && this.score > 10)
			? new Menu(config)
			: new LevelsScreen(config)

		Game.root.getChild(`main`).addChild(nextScreen)
		const slideDuration = 300
		await Promise.all([
			Animate.slide(this, { duration: slideDuration, to: this.pos.add(viewWidth) }).promise,
			Animate.fadeOut(this, { duration: slideDuration }).promise,
			Animate.slide(nextScreen, { duration: slideDuration, to: new Vector() }).promise,
			Animate.fadeIn(nextScreen, { duration: slideDuration }).promise,
		])
		this.destroy()
	}
}

class Sprite extends GameObject {
	constructor({
		asset = ``,
		spritesheet = assets,
		...options
	}) {
		super({ asset, spritesheet, ...options })
	}
	render(ctx) {
		ctx.drawImage(
			this.spritesheet.source,
			this.spritesheet.getOffset(this.asset), 0,
			this.spritesheet.getWidth(), this.spritesheet.getHeight(),
			0, 0, this.spritesheet.getWidth(), this.spritesheet.getHeight()
		)
		super.render(ctx)
	}
}

class ColoredSprite extends GameObject {
	constructor({
		asset = ``,
		spritesheet = assets,
		size = new Vector(),
		...options
	}) {
		super({ asset, spritesheet, size, ...options })

		this.accentColor = null
		this.shiftDur = 200

		this.canvas = document.createElement('canvas')
		this.canvas.width = spritesheet.getWidth()
		this.canvas.height = spritesheet.getHeight()
		this.ctx = this.canvas.getContext('2d')

		const ogSprite = new Sprite({ asset, spritesheet })
		ogSprite.render(this.ctx)

		this.colorArray = this.toColorArray(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
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
		), this.canvas.width)
	}
	render(ctx) {
		this.ctx.putImageData(this.toImageData(this.colorArray), 0, 0)
		ctx.drawImage(this.canvas, 0, 0, this.size.x, this.size.y)
		super.render(ctx)
	}
}

class Area extends GameObject {
	constructor({
		size = new Vector(),
		...options
	}) {
		super({ size, ...options })

		this.isInside = false
		this.isPressed = false

		// event listeners
		this.listeners = [
			Input.on(`mouseup`, (e) => this.onMouseEvent(`mouseup`, e)),
			Input.on(`mousedown`, (e) => this.onMouseEvent(`mousedown`, e)),
			Input.on(`mousemove`, (e) => this.onMouseEvent(`mousemove`, e)),
		]
	}
	destroy() {
		super.destroy()
		this.listeners.forEach(sub => sub())
		this.listeners = []
	}
	onMouseEvent(name, event) {
		if (!this.isFreezed() && this.isPointWithinObject(event.pos)) {
			if (!this.isInside) {
				this.trigger(`mouseenter`, event)
				this.isInside = true
			}
			if (name == `mousedown`) {
				this.isPressed = true
			}
			this.trigger(name, event)
			if (name == `mouseup` && this.isPressed) {
				if (!Input.isScrolling) {
					this.trigger(`click`, event)
				}
				this.isPressed = false
			}
		} else {
			if (this.isInside) {
				this.trigger(`mouseexit`, event)
				this.isPressed = false
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
		this.baseColor = Color.grey
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

class Modal extends GameObject {
	constructor({
		text = ``,
		pos = Game.viewRes.mul(1 / 2),
		size = Game.viewRes,
		...options
	}) {
		super({ text, size, pos, ...options })
	}
	onMount() {
		Animate.zoomIn(this, { duration: 200 })
	}
	createChildren() {
		const padding = new Vector(8, 8)
		const flexSize = this.size.diff(padding.mul(2))
		return [
			new Flexbox({
				pos: padding,
				size: flexSize,
				direction: `column`,
				align: `end`,
				justify: `start`,
				spaceBetween: 12,
				children: [
					new Button({
						text: `X`,
						fillStyle: Color.grey,//new Color(),
						strokeStyle: Color.lightGrey,
						padding: (17 - 2 - 6) / 2,
						size: new Vector(17, 18),
						onClick: () => this.close(),
					}),
					new GameText({
						size: flexSize,
						text: this.text,
						lineHeight: 2,
					}),
				],
			}),
		]
	}
	close() {
		Animate
			.zoomOut(this, { duration: 200 })
			.on(`end`, () => {
				this.trigger(`close`)
				this.destroy()
			})
	}
	render(ctx) {
		ctx.strokeStyle = Color.lightGrey.toString()
		ctx.fillStyle = Color.darkGrey.toString()
		ctx.fillRect(0, 0, this.size.x, this.size.y)
		ctx.strokeRect(0.5, 0.5, this.size.x - 1, this.size.y - 1)
		super.render(ctx)
	}
}

class Button extends Area {
	constructor({
		text = ``,
		locked = false,
		padding = 4,
		size = new Vector(),
		align = `left`,
		strokeStyle = Color.lightGrey,
		fillStyle = Color.darkGrey,
		playSounds = true,
		...options
	}) {
		super({
			text, size, align,
			locked,
			padding, border: 1,
			strokeStyle, fillStyle,
			playSounds,
			...options
		})
		if (this.locked) {
			this.opacity = 0.5
			this.on(`click`, () => {
				this.playSounds && Sound.buttonLocked()
				Animate.shake(this, { duration: 200 })
			})
		} else {
			this.on(`click`, () => {
				this.playSounds && Sound.buttonClick()
			})
		}
	}
	createChildren() {
		const children = [
			new GameText({
				text: this.text,
				align: this.align,
				size: this.size.diff(new Vector(this.padding + this.border + (this.locked ? 11 / 2 : 0), this.padding + this.border).mul(2)),
				pos: new Vector(this.padding + this.border, this.padding + this.border),
			}),
		]
		if (this.locked) {
			children.push(this.createLock())
		}
		return children
	}
	createLock() {
		return new Sprite({
			asset: `lock`,
			size: new Vector(11, 11),
			pos: new Vector(this.size.x - 11 - this.padding, (this.size.y - 11) / 2),
		})
	}
	render(ctx) {
		ctx.strokeStyle = this.strokeStyle.toString()
		ctx.fillStyle = this.fillStyle.toString()

		if (!this.isPressed || this.locked) {
			ctx.fillRect(0, 0, this.size.x, this.size.y)
		}
		ctx.strokeRect(
			(this.isPressed && !this.locked ? 1.5 : 0.5),
			(this.isPressed && !this.locked ? 1.5 : 0.5),
			this.size.x - (this.isPressed && !this.locked ? 3 : 1),
			this.size.y - (this.isPressed && !this.locked ? 3 : 1)
		)

		super.render(ctx)
	}
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
		this.children[0] && this.children[0].children.forEach(child => child.accentColor = Color.yellow)
	}
	swap() {
		// Animate old children out
		const oldFlex = this.children[0]
		if (oldFlex) {
			Promise.all(oldFlex.children.map((oldChild, index) => {
				return Animate.jumpOut(oldChild, {
					duration: 400,
					delay: 50 * index
				}).promise
			})).then(() => this.removeChild(oldFlex))
		}
		// Generate and add new children
		const combo = this.get(`combo`)
		const newRow = this.createRow(combo)
		this.addChild(newRow)
		// Animate new children in
		newRow.children.forEach((newChild, index) => {
			Animate.jumpIn(newChild, {
				duration: 200,
				delay: (oldFlex ? 300 : 0) + 50 * index,
			})
		})
	}
	createRow(combination) {
		return new Flexbox({
			size: new Vector(this.parent.size.x, 11),
			direction: `row`,
			justify: `center`,
			align: `start`,
			spaceBetween: 3,
			children: combination.map((value, index) => new ColoredSprite({
				asset: value,
				size: new Vector(11, 11),
			})),
		})
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
			this.progress = Math.max(0, Math.min(this.progress + deltaT, this.duration))
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
		this.trailColor = new Color(255, 0, 0, 255)
	}
	incrementBy(time) {
		this.trail = this.progress
		this.update(-time)
		this.trailColor = new Color(0, 255, 0, 255)
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
			pos: coord.mul(21),
			size: new Vector(17, 17),
			children: [
				new ColoredSprite({
					pos: new Vector(3, 3),
					size: new Vector(11, 11),
					asset: value,
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
					tile.opacity = 0
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
					to: new Vector(x * 21, index * 21),
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
		return this.getTile(coord).children[0].asset
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
			Sound.tileSelect(this.tilesPlayed.length)
			this.tilesPlayed.push(coord)
			this.comboPlayed.push(value)
			tile.accentColor = Color.yellow
			tile.children[0].accentColor = Color.yellow
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
		if (!this.tilesPlayed.length) {
			return
		}
		const combo = this.get(`combo`)
		const reverseCombo = Array.from(combo).reverse()
		if (combo.length == this.comboPlayed.length && (serializeData(combo) == serializeData(this.comboPlayed) || serializeData(reverseCombo) == serializeData(this.comboPlayed))) {
			this.replaceTiles(this.tilesPlayed, range(combo.length).map(() => this.generateValue()))
			this.trigger(`submit`)
		} else {
			this.tilesPlayed.map(coord => {
				const tile = this.getTile(coord)
				tile.accentColor = null
				tile.children[0].accentColor = null
				Animate.shake(tile, { duration: 200 })
			})
			Sound.wrongCombination()
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
			ctx.strokeStyle = (Color.yellow).toString()
			ctx.lineWidth = 5
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
		name = ``,
		board = ``,
		time = 0,
		...options
	}) {
		super({ name, comboLength, board, time, ...options })

		this.score = 0
		this.turn = -1
		this.combo = []

		this.nextTurn()
	}
	createChildren() {
		const padding = new Vector(8, 8)
		const flexSize = Game.viewRes.diff(padding.mul(2))
		return [
			new Flexbox({
				pos: padding,
				size: flexSize,
				direction: `column`,
				justify: `start`,
				align: `start`,
				spaceBetween: 8,
				children: [
					new Score({
						id: `score`,
						size: new Vector(flexSize.x, 7),
						score: () => this.score
					}),
					new Combination({
						id: `combination`,
						size: new Vector(flexSize.x, 11),
						combo: () => this.combo,
					}),
					new Countdown({
						id: `countdown`,
						duration: this.time,
						size: new Vector(flexSize.x, 1),
						length: flexSize.x,
						onCompleted: () => this.gameOver(),
					}),
					new GameBoard({
						id: `board`,
						data: this.board,
						size: new Vector(flexSize.x, 59),
						combo: () => this.combo,
						onSubmit: (e) => this.onCombinationSubmit(e),
					}),
					new Button({
						id: `button`,
						align: `center`,
						text: `NOT FOUND`,
						size: new Vector(Game.viewRes.x - 16, 17),
						playSounds: false,
						onClick: () => this.onCombinationNotFound(),
					}),
				],
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
		Game.root.getChild(`main`).addChild(new ResultsScreen({ score: this.score, level: this }))
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
			Sound.score()
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
		if (this.getChild(`board`).findCombination(this.combo)) {
			const button = this.getChild(`button`)
			button.freezed = true
			const freezeTimer = new Timer(600)
			freezeTimer.on(`completed`, () => button.freezed = false)
			this.getChild(`countdown`).reduceBy(2000)
			Animate.shake(this.getChild(`combination`), { duration: 200 })
			Animate.shake(this.getChild(`board`), { duration: 200 })
			Sound.buttonLocked()
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
			size: new Vector(Game.viewRes.x - 16, 0),
		})
		this.addChild(this.labelObject)
	}
	increment() {
		const popup = new GameText({
			text: `+1`,
			color: Color.yellow,
			pos: new Vector(Math.round((Game.viewRes.x - 16) / 2 + this.labelObject.getTextMetrics().x / 2), 0),
		})
		this.addChild(popup)
		const liftAnimation = Animate.lift(popup, { duration: 1000 })
		liftAnimation.on(`end`, () => popup.destroy())
	}
}

class Arcade extends Level {
	constructor(options = {}) {
		super({
			...options,
			name: `ARCADE`,
			comboLength: 3,
			board: `e4 1b b4`,
			time: 60000,
		})
	}
	nextTurn() {
		if (this.turn >= 0) {
			this.getChild(`countdown`).incrementBy(2000)
		}
		this.comboLength = Math.min(3 + Math.floor((this.score + 1) / 10), 6)
		super.nextTurn()
	}
}

window.localStorage.setItem(`unlocked,3 IN A ROW`, true)

class LevelsScreen extends GameObject {
	constructor(options = {}) {
		super({
			levels: [
				{
					name: `3 IN A ROW`,
					comboLength: 3,
					locked: false,
					board: `c6 c6 c6`,
					time: 60000,
				},
				{
					name: `GET SQUARE`,
					comboLength: 4,
					locked: TrophyCase.getTrophy(`3 IN A ROW`).getBest() <= 20,
					unlockCondition: `SCORE MORE THAN 20 POINTS IN '3 IN A ROW' TO UNLOCK`,
					board: `55 55 55`,
					time: 60000,
				},
				{
					name: `HIGH FIVE`,
					comboLength: 5,
					locked: TrophyCase.getTrophy(`GET SQUARE`).getBest() <= 15,
					unlockCondition: `SCORE MORE THAN 15 POINTS IN 'GET SQUARE' TO UNLOCK`,
					board: `f1 78 1a`,
					time: 60000,
				},
				{
					name: `SIX PACK`,
					comboLength: 6,
					locked: TrophyCase.getTrophy(`ARCADE`).getBest() <= 30,
					unlockCondition: `SCORE MORE THAN 30 POINTS IN ARCADE TO UNLOCK`,
					board: `eb 69 28`,
					time: 60000,
				},
			],
			...options,
		})
	}
	createChildren() {
		const padding = new Vector(8, 12)
		const flexSize = Game.viewRes.diff(padding.mul(2))
		return [
			new Flexbox({
				pos: padding,
				size: flexSize,
				direction: `column`,
				justify: `start`,
				align: `start`,
				spaceBetween: 6,
				children: [
					new Area({
						size: new Vector(flexSize.x / 2, 7 + 12 - 6),
						onClick: () => this.back(),
						children: [
							new GameText({
								text: `< BACK`,
							}),
						],
					}),
					...this.levels.map((level, index) => new Button({
						text: level.name,
						locked: level.locked,
						size: new Vector(flexSize.x, 17),
						onClick: () => this.playLevel(index),
						onMount: function () {
							if (!this.locked && !window.localStorage.getItem(`unlocked,${level.name}`)) {
								const lock = this.createLock()
								this.addChild(lock)
								this.opacity = .5
								Animate.explode(lock, { duration: 400, delay: 400 })
								Animate.fadeIn(this, { duration: 400, delay: 400 })
								window.localStorage.setItem(`unlocked,${level.name}`, true)
							}
						},
					})),
				],
			}),
		]
	}
	async back() {
		const viewWidth = new Vector(Game.viewRes.x, 0)
		const nextScreen = new Menu({
			pos: viewWidth.mul(-1),
		})
		Sound.buttonClick()
		Game.root.getChild(`main`).addChild(nextScreen)
		const slideDuration = 300
		await Promise.all([
			Animate.slide(this, { duration: slideDuration, to: this.pos.add(viewWidth) }).promise,
			Animate.fadeOut(this, { duration: slideDuration }).promise,
			Animate.slide(nextScreen, { duration: slideDuration, to: new Vector() }).promise,
			Animate.fadeIn(nextScreen, { duration: slideDuration }).promise,
		])
		this.destroy()
	}
	playLevel(index) {
		const level = this.levels[index]
		if (!level.locked) {
			Sound.buttonClick()
			Game.root.getChild(`main`).addChild(new Level({
				...level
			}))
			this.destroy()
		} else {
			this.freezed = true
			const modal = new Modal({
				text: level.unlockCondition,
			})
			Game.root.getChild(`main`).addChild(modal)
			modal.on(`close`, () => this.freezed = false)
		}
	}
}

class Menu extends GameObject {
	createChildren() {
		const offset = new Vector(0, 8)
		const padding = new Vector(8, 8)
		const title = new Title({
			id: `title`,
			animate: this.animate,
		})
		const flexSize = Game.viewRes.diff(padding.mul(2)).diff(offset)
		return [
			new Flexbox({
				pos: offset.add(padding),
				size: new Vector(flexSize.x, title.size.y),
				children: [
					title,
				],
			}),
			new Flexbox({
				id: `body`,
				pos: new Vector(offset.add(padding).x, offset.add(padding.mul(3)).add(title.size).y),
				size: flexSize,
				align: `center`,
				justify: `start`,
				direction: `column`,
				spaceBetween: 6,
				children: [
					new Button({
						text: `LEVELS`,
						size: new Vector(flexSize.x, 17),
						onClick: () => this.browseLevels(),
					}),
					new Button({
						text: `ARCADE`,
						locked: TrophyCase.getTrophy(`HIGH FIVE`).getBest() <= 10,
						size: new Vector(flexSize.x, 17),
						onClick: () => this.playArcade(),
						onMount: function () {
							if (!this.locked && !window.localStorage.getItem(`unlocked,ARCADE`)) {
								const lock = this.createLock()
								this.addChild(lock)
								this.opacity = .5
								Animate.explode(lock, { duration: 400, delay: 400 })
								Animate.fadeIn(this, { duration: 400, delay: 400 })
								window.localStorage.setItem(`unlocked,ARCADE`, true)
							}
						},
					}),
					new Button({
						text: `TROPHIES`,
						size: new Vector(flexSize.x, 17),
						onClick: () => this.browseTrophies(),
					}),
					// new Button({
					// 	text: `TUTORIAL`,
					// 	locked: true,
					// 	size: new Vector(flexSize.x, 17),
					// 	onClick: () => this.comingSoon(),
					// }),
				],
			}),
		]
	}
	comingSoon() {
		Game.root.getChild(`main`).addChild(new Modal({
			text: `COMING SOON`,
		}))
	}
	async nextScreen(screen, direction = 1) {
		const viewWidth = Game.viewRes.x
		const offset = new Vector(viewWidth * direction, 0)
		const nextScreen = new screen({
			pos: offset,
		})
		Game.root.getChild(`main`).addChild(nextScreen)
		const slideDuration = 300
		await Promise.all([
			Animate.slide(this, { duration: slideDuration, to: this.pos.diff(offset) }).promise,
			Animate.fadeOut(this, { duration: slideDuration }).promise,
			Animate.slide(nextScreen, { duration: slideDuration, to: new Vector() }).promise,
			Animate.fadeIn(nextScreen, { duration: slideDuration }).promise,
		])
		this.destroy()
	}
	browseLevels() {
		this.nextScreen(LevelsScreen)
	}
	browseTrophies() {
		this.nextScreen(TrophiesScreen)
	}
	playArcade() {
		if (TrophyCase.getTrophy(`HIGH FIVE`).getBest() > 10) {
			Sound.buttonClick()
			Game.root.getChild(`main`).addChild(new Arcade())
			this.destroy()
		} else {
			Game.root.getChild(`main`).addChild(new Modal({
				text: `SCORE MORE THAN 10 POINTS IN 'HIGH FIVE' TO UNLOCK`,
			}))
		}
	}
}

class Flexbox extends GameObject {
	constructor({
		direction = `row`,
		spaceBetween = 0,
		align = `center`,
		justify = `center`,
		...options
	}) {
		super({ direction, spaceBetween, align, justify, ...options })
	}
	onChildrenChange() {
		const mainAxis = this.direction == `row` ? `x` : `y`
		const secondaryAxis = this.direction == `row` ? `y` : `x`

		const direction = new Vector()
		direction[mainAxis] = 1

		const childrenCumulativeSize = this.children.reduce(
			(size, child) => size.add(child.size),
			new Vector()
		)
		const spaceBetweenVector = direction.mul(this.spaceBetween)
		const childrenTotalSize = childrenCumulativeSize.add(spaceBetweenVector.mul(this.children.length - 1))

		const offset = new Vector()

		/* The main axis offset is global and increments child after child */

		// justify == `start` -> offset[mainAxis] = 0 (already is)
		if (this.justify == `center`) {
			offset[mainAxis] = this.size.mul(1 / 2).diff(childrenTotalSize.mul(1 / 2))[mainAxis]
		} else if (this.justify == `end`) {
			offset[mainAxis] = this.size.diff(childrenTotalSize)[mainAxis]
		}

		this.children.forEach(child => {

			/* The secondary axis offset is local and child-dependent */

			// align == `start` -> offset[secondaryAxis] = 0 (already is)
			if (this.align == `center`) {
				offset[secondaryAxis] = this.size.mul(1 / 2).diff(child.size.mul(1 / 2))[secondaryAxis]
			} else if (this.align == `end`) {
				offset[secondaryAxis] = this.size.diff(child.size)[secondaryAxis]
			}

			child.pos = offset.floor()
			offset[mainAxis] += child.size[mainAxis] + spaceBetweenVector[mainAxis]
		})
	}
}

class Title extends GameObject {
	constructor({
		size = new Vector(45, 17),
		animate = false,
		...options
	} = {}) {
		super({ size, animate, ...options })
	}
	createChildren() {
		const duration = this.animate ? 400 : 0
		const delay = this.animate ? 400 : 0
		// const expectedGlobalPosition = new Vector(Game.viewRes.x / 2 - this.size.x / 2, 17).floor()
		// Animate.slide(this, { duration, delay: duration + delay * 2, to: this.pos.diff(this.getGlobalPosition().diff(expectedGlobalPosition)) })
		const slideAmount = 20
		const tweenedMovement = function () {
			Animate.slide(this, { delay, duration, to: this.pos.diff(new Vector(slideAmount)) })
		}
		const timer = new Timer(delay)
		this.animate && /* timer.on(`completed`, () => */ Sound.opening()/* ) */
		const tilePos = (new Vector(this.size.x / 2 - 17 / 2, 0)).floor()
		return [
			new Tile({
				pos: tilePos,
				size: new Vector(17, 17),
				onMount: tweenedMovement,
			}),
			new Rectangle({
				pos: tilePos.add(new Vector(16, 3)),
				size: new Vector(1, 11),
				color: Color.grey,
				onMount: tweenedMovement,
			}),
			new Rectangle({
				pos: tilePos.add(new Vector(16, 3)),
				size: new Vector(1, 11),
				opacity: 0,
				onMount: function () {
					Animate.fadeIn(this, { delay, duration })
					tweenedMovement.call(this)
				}
			}),
			new GameText({
				pos: tilePos.add(new Vector(-31, 5)),
				text: `NNECTION`,
				onMount: function () {
					Animate.slide(this, { delay, duration, to: this.pos.add(new Vector(47 - slideAmount)) })
				}
			}),
			new Rectangle({
				pos: tilePos.add(new Vector(0, 3)),
				size: new Vector(1, 11),
				color: Color.grey,
				onMount: tweenedMovement,
			}),
			new Rectangle({
				pos: tilePos.add(new Vector(0, 3)),
				size: new Vector(1, 11),
				opacity: 0,
				onMount: function () {
					Animate.fadeIn(this, { delay, duration })
					tweenedMovement.call(this)
				}
			}),
			new Rectangle({
				pos: tilePos.add(new Vector(-Game.viewRes.x, 3)),
				size: new Vector(Game.viewRes.x, 11),
				onMount: tweenedMovement,
			}),
			new GameText({
				pos: tilePos.add(new Vector(2, 5)),
				text: `C`,
				onMount: function () {
					Animate.slide(this, { delay, duration, to: this.pos.diff(new Vector(slideAmount + 6)) })
				}
			}),
			new Rectangle({
				pos: tilePos.add(new Vector(1, 3)),
				size: new Vector(15, 11),
				onMount: tweenedMovement
			}),
			new ColoredSprite({
				pos: tilePos.add(new Vector(3, 3)),
				size: new Vector(11, 11),
				asset: `circle`,
				onMount: tweenedMovement,
			}),
		]
	}
}

class OpeningScreen extends GameObject {
	createChildren() {
		return [
			new GameText({
				text: `FEDETIBALDO PRESENTS`,
				size: Game.viewRes,
				pos: new Vector(8, Game.viewRes.y - 11 /* 7 * 1.5 */ - 7 - 8),
				opacity: 0,
				onMount: async function () {
					await Animate.fadeIn(this, { duration: 1000 }).promise
					await Animate.fadeOut(this, { duration: 1000, delay: 500 }).promise
					this.destroy()
				},
			}),
			new Flexbox({
				size: Game.viewRes,
				align: `center`,
				justify: `center`,
				direction: `row`,
				spaceBetween: 3,
				opacity: 0,
				onMount: function () {
					const initialChildrenCount = 4
					const lifeSpan = 600
					const animation = Animate.fadeIn(this, { duration: initialChildrenCount * lifeSpan, delay: 2500 })
					animation.on(`start`, () => {
						this.addChildren(range(4).map(index => new Tile({
							size: new Vector(17, 17),
							createChildren: function () {
								return [this.createChild(index - 1)]
							},
							createChild: (assetIndex) => {
								return new ColoredSprite({
									pos: new Vector(3, 3),
									size: new Vector(11, 11),
									asset: Math.abs(assetIndex % 4),
								})
							},
							onMount: function () {
								const life = new Timer((index + 1) * lifeSpan)

								
								const interval = new Interval(0)
								let currentAssetIndex = index - 1
								interval.on(`tick`, () => {
									if (index + 1 == initialChildrenCount) {
										Sound.coming()
									}
									interval.interval = life.progress / initialChildrenCount / 4
									currentAssetIndex = (currentAssetIndex + 1) % 4
									this.children[0].destroy()
									this.addChild(this.createChild(currentAssetIndex))
								})

								life.on(`completed`, () => {
									this.destroy()
									interval.stop()
								})
							},
						})))
					})
					animation.on(`end`, async () => {
						const menu = new Menu({ animate: true })
						menu.freezed = true
						const title = menu.getChild(`title`)
						const body = menu.getChild(`body`)
						body.opacity = 0
						Sound.coming()
						Game.root.getChild(`main`).addChild(menu)
						const ogPos = title.pos.clone()
						const center = Game.viewRes.mul(1/2).diff(title.getGlobalPosition()).diff(title.size.mul(1/2).round())
						const startPos = new Vector(ogPos.x, center.y)
						title.pos = startPos
						await Animate.slide(title, { duration: 800, delay: 800 + 500, to: ogPos }).promise
						await Animate.fadeIn(body, { duration: 400 })
						menu.freezed = false
					})
				},
			})
		]
	}
}

class TrophiesScreen extends GameObject {
	onMount() {
		this.listener = Input.on(`scroll`, ({ delta }) => {
			if (!this.isFreezed()) {
				this.pos = this.pos.add(new Vector(0, delta.y))
				this.pos.y = Math.max(-316, Math.min(this.pos.y, 0))
			}
		})
	}
	destroy() {
		this.listener()
		super.destroy()
	}
	createChildren() {
		const padding = new Vector(8, 12)
		const flexSize = Game.viewRes.diff(padding.mul(2))
		return [
			new Flexbox({
				pos: padding,
				size: flexSize,
				direction: `column`,
				justify: `start`,
				align: `start`,
				spaceBetween: 6,
				children: [
					new Area({
						size: new Vector(flexSize.x / 2, 7 + 12 - 6),
						onClick: () => this.back(),
						children: [
							new GameText({
								text: `< BACK`,
							}),
						],
					}),
					...TrophyCase.trophies
						.filter(trophy => !(trophy instanceof Record))
						// .sort((a, z) => {
						// 	if (a.unlocked && z.unlocked) {
						// 		return TrophyCase.trophies.indexOf(a) - TrophyCase.trophies.indexOf(z)
						// 	} else if (a.unlocked) {
						// 		return -1
						// 	} else if (z.unlocked) {
						// 		return 1
						// 	} else {
						// 		return TrophyCase.trophies.indexOf(a) - TrophyCase.trophies.indexOf(z)
						// 	}
						// })
						.map((trophy, index) => {
							const locked = !trophy.unlocked
							const tempText = new GameText({
								text: trophy.name,
								size: new Vector(flexSize.x - 10 - (locked ? 11 : 0), 7),
							})
							return new Button({
								text: trophy.name,
								locked,
								size: new Vector(flexSize.x, tempText.getTextMetrics().y + 8),
								onClick: () => this.openModal(trophy.message),
							})
						}),
				],
			}),
		]
	}
	openModal(text) {
		this.freezed = true
		const modal = new Modal({ text })
		Game.root.getChild(`main`).addChild(modal)
		modal.on(`close`, () => this.freezed = false)
	}
	async back() {
		Sound.buttonClick()
		const viewWidth = new Vector(Game.viewRes.x, 0)
		const nextScreen = new Menu({
			pos: viewWidth.mul(-1),
		})
		Game.root.getChild(`main`).addChild(nextScreen)
		const slideDuration = 300
		await Promise.all([
			Animate.slide(this, { duration: slideDuration, to: this.pos.add(viewWidth) }).promise,
			Animate.fadeOut(this, { duration: slideDuration }).promise,
			Animate.slide(nextScreen, { duration: slideDuration, to: new Vector() }).promise,
			Animate.fadeIn(nextScreen, { duration: slideDuration }).promise,
		])
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
	await Promise.all([gameFont.load(), assets.load()])

	Game.root.addChildren([
		new GameObject({ id: `main` }),
		new GameObject({ id: `popup` }),
	])

	// append level
	Game.root.getChild(`main`).addChild(+localStorage.getItem('logins') > 1
		? new Menu({ animate: true })
		: new OpeningScreen()
	)

	TrophyCase.updateTrophyStatus()

	// start game
	Game.play()
})()