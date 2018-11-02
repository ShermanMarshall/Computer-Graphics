var canvas = document.getElementById('canvas');
var context = initContext();

var vertexShaderSource = 
	`attribute vec4 a_Position;
	void main() {
		gl_Position = a_Position;
		gl_PointSize = 10.0;
	}`;

var fragmentShaderSource = 
	`precision mediump float;
	uniform vec4 point_color;
	void main() {
		gl_FragColor = point_color;
	}`;


var program = createProgram(context, vertexShaderSource, fragmentShaderSource);
context.useProgram(program);

var a_position = context.getAttribLocation(program, 'a_Position');
if (a_position < 0) {
	console.log('failed to get storage location');
}

var point_color = context.getUniformLocation(program, 'point_color')
if (point_color < 0) {
	console.log('failed to create uniform');
}

class Brick {
	constructor() {
		this.xPos = 0;
		this.yPos = -0.5;
		this.size = 5;
		this.color = {r: 1, g: 1, b: 1};
		this.deltaX = 0.001;
		//this.deltaY = 0.001;
	}
	r() { return this.color.r; }
	g() { return this.color.g; }
	b() { return this.color.b; }
	direction(left) {
		this.left = left ? true : false;
	}
	getWidth() {
		return this.xPos + (offset * (this.size - 1));
	}
	update(force) {
		if (force) {
			
			if (this.left && (this.xPos > -0.99)) {
				this.xPos -= this.deltaX;
			}
			if (!this.left && (this.getWidth() < 0.99)) {
				this.xPos += this.deltaX;
			}
		}
		if ((this.getWidth() < 0.99) && (this.xPos > -0.99)) {
			this.xPos -= this.left ? this.deltaX : -this.deltaX;
		}
	}
}

var brick = new Brick();
var last_time = Date.now();
var main_point = {x: 0, y: 0, z: 0};
var offset = (1 / (canvas.height / 2)) * 6;

//difference between y values is based on aspect ratio
var pointSpread = offset * (canvas.width / canvas.height);

class Block {
	constructor(color, xPos, yPos) {
		this.color = color;
		this.xPos = xPos;
		this.yPos = yPos;
		this.size = Math.floor( Math.random() * 4) + 3;
		this.isActive = true;
		this.isExposed = true;
	}
	static getColor(r, g, b) {
		return {r: r, g: g, b: b};
	}
	static randomColor() {
		var set = [0,0,0];
		for (var x = 0; x < 3; x++) {
			var num;
			do {
				num = Math.random();
			} while(num < .7);
			set[x] = num;
		}
		return {
			r: set[0],
			g: set[1],
			b: set[2]
		}
	}
	r() { return this.color.r; }
	b() { return this.color.b; }
	g() { return this.color.g; }
	setExposed(isExposed) {
		this.isExposed = isExposed;
	}
}

var initBlockArray = function() {
	var blockArray = {};
	var blocksPerRow = [];

	var yPos = 1.0 - offset;
	var maxSize = 0;
	
	for (var y = 0; y < 10; y++) {
		var xPos = -0.99;
		var numBlocks = 0;
		blockArray[yPos] = [];
		for (var x = 0; xPos < 0.99; ) {
			var block = new Block(Block.randomColor(), xPos, yPos);
			if ((xPos + (offset * block.size)) > 1.0) {
				do {
					block.size--;
				} while((xPos + (offset * block.size)) > 1.0);
			}
			if (block.size > 2) {
				xPos += offset * block.size;
				blockArray[yPos].push(block);
				x += block.size;
				numBlocks++;
			} else {
				xPos += 1;
			}
		}
		yPos -= pointSpread;
		blocksPerRow.push(numBlocks);
	}
	return blockArray;
};

var blockArray = initBlockArray();

class Projectile {
	constructor(blockArray) {
		this.xPos = 0;
		this.yPos = 0.5;
		this.delta = 0.002;
		this.color = {r: 1, g: 1, b: 1};
		var isNegative = (Math.random() * 2) > 1;
		this.angle = (isNegative ? -1 : 1) * (Math.random() * 90);
		this.angle = 45;
		this.radians = this.toRadians();

		this.deltaX = Math.cos(this.radians) * this.delta;
		this.deltaY = Math.sin(this.radians) * this.delta;

		this.blockArray = blockArray;
		this.xMax = this.xPos + offset;
	}
	update(altered) {
		if (altered) {
			this.xPos += this.deltaX;
                	this.yPos += this.deltaY; 
			
			return;
		} else {
			this.continue = false;
		}

		//colliding with right bound
		if (this.xPos > 0.99) {
			this.quadrant = 2;
			if (!this.continue) {
				this.alterAngle();
			}
			this.update(true);
			this.continue = true;
		}
		//colliding with left bound
		if (this.xPos < -0.99) {
			this.quadrant = 4;
			if (!this.continue) {
				this.alterAngle();
			}
			this.update(true);
			this.continue = true;
		}

		//colliding with ceiling
		if (this.yPos > 1.0) {
			this.quadrant = 3;
			this.alterAngle();
			this.update(true);
		}

		this.xPos += this.deltaX; 
		this.yPos += this.deltaY; 

		if ((this.xPos > brick.xPos) && ((this.xPos + offset) < brick.getWidth()) && 
			(this.yPos > brick.yPos) && (this.yPos < (brick.yPos + pointSpread))) {
			this.quadrant = 1;
			this.alterAngle();
			this.update(true);
		}
	}
	toRadians() {
		return (this.angle / 180) * Math.PI; 
	}
	isIntersectingRow(block) {
		var upper = block.yPos;
		var lower = block.yPos - pointSpread;
		return ((this.yPos < upper) && (this.yPos > lower));
	}
	isIntersecting(block) {
		var upper = block.yPos;
		var lower = block.yPos - pointSpread;
		var lefter = block.xPos;
		var righter = block.xPos + offset;
		
		//colliding with top bound
		if (((this.xPos > lefter) && ((this.xPos + (offset/2)) < righter))) {  
			this.quadrant = 3;
			this.alterAngle()
			this.update(true);
			return true;
		}
		return false;
	}
	alterAngle() {
		if (this.quadrant == 1) {
			this.radians = -Math.atan( this.deltaY / this.deltaX );
			
			this.deltaX = Math.cos(this.radians) * (this.deltaX < 0 ? -1 : 1);
			this.deltaY = Math.sin(this.radians) * (this.deltaX < 0 ? -1 : 1);
		} else if (this.quadrant == 2) {
			this.radians = -Math.atan( this.deltaX / this.deltaY );
			
			this.deltaY = Math.cos(this.radians) * (this.deltaY < 0 ? -1 : 1);
			this.deltaX = Math.sin(this.radians) * (this.deltaY < 0 ? -1 : 1);

		} else if (this.quadrant == 3) {
			this.radians = -Math.atan( this.deltaY / this.deltaX );

			this.deltaX = Math.cos(this.radians) * (this.deltaX < 0 ? -1 : 1);
			this.deltaY = Math.sin(this.radians) * (this.deltaX < 0 ? -1 : 1);
	
		} else if (this.quadrant == 4) {
			this.radians = -Math.atan( this.deltaX / this.deltaY );
			
			this.deltaY = Math.cos(this.radians) * (this.deltaY < 0 ? -1 : 1);
			this.deltaX = Math.sin(this.radians) * (this.deltaY < 0 ? -1 : 1);

		}

		//modify rate of translation by delta
		this.deltaY *= this.delta;
		this.deltaX *= this.delta;
	}
	detectCollisions() { 
		var depths = Object.keys(this.blockArray);
		var keys = Object.keys(this.blockArray).reverse();
		for (var key in keys) {
			var row = blockArray[keys[key]];
			var x = 0;
			do {
				var block = row[x++];
				if (this.isIntersectingRow(block)) {
					if (this.isIntersecting(block)) {
						block.isActive = false;
						console.log(block);
						return;
					}
				} else {
					x = row.length;
				}
			} while (x < row.length);
		}
	}
	r() { return this.color.r; }
	b() { return this.color.b; }
	g() { return this.color.g; }
}

var theProjectile = new Projectile(blockArray);

setInterval(()=> {
	theProjectile.update();
	brick.update(false);
	theProjectile.detectCollisions();
}, 10);

window.onkeypress = function(evt) {
	if (Date.now() - last_time > 500) {
		brick.direction( evt.key == 'a' || evt.key == 'A' );
		brick.update(true);
	}
};

var convertCoords = function(inX, inY) {
	var width = canvas.width / 2;
	var height = canvas.height / 2;
	return {x: (inX - width) / width, y: -(inY - height) / height};
};

var renderTimer = Date.now();

var func = function() {
	if ((Date.now() - renderTimer) > 100) {
		renderTimer = Date.now();
		context.clearColor(0.0, 0.0, 0.0, 1.0);
		context.clear(context.COLOR_BUFFER_BIT);

		var keys = Object.keys(blockArray);
		for (var key in blockArray) {
			var row = blockArray[key];
			for (var x = 0; x < row.length; x++) {
				var block = row[x];
				if (block.isActive) {
					context.uniform4f(point_color, block.r(), block.g(), block.b(), 1);
					for (var z = 0; z < block.size; z++) {
						context.vertexAttrib3f(a_position, block.xPos + (offset * z), block.yPos, 0, 1);
						context.drawArrays(context.GL_POINTS, 0, 1);
					}
				}
			}
		}

		context.uniform4f(point_color, theProjectile.r(), theProjectile.g(), theProjectile.b(), 1);
		context.vertexAttrib3f(a_position, theProjectile.xPos, theProjectile.yPos, 0, 1);
		context.drawArrays(context.GL_POINTS, 0 , 1);

		context.uniform4f(point_color, brick.r(), brick.g(), brick.b(), 1);
		for (var z = 0; z < brick.size; z++) {
			context.vertexAttrib3f(a_position, brick.xPos + (offset * z), brick.yPos, 0, 1);
			context.drawArrays(context.GL_POINTS, 0, 1);
		}
	}
	requestAnimationFrame(func);
};

func();
