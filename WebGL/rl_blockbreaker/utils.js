/*
 * Create a program
 * Initialize shaders
 * Link the program object
 */
function createProgram(glCtx, vertexShaderSrc, fragmentShaderSrc) {
	var vertexShader = loadShader(glCtx, glCtx.VERTEX_SHADER, vertexShaderSrc);
	var fragmentShader = loadShader(glCtx, glCtx.FRAGMENT_SHADER, fragmentShaderSrc);

	if (!vertexShader || !fragmentShader) {
		console.log('Could not create shaders for program');
		return null;
	}

	var program = glCtx.createProgram();
	if (program) {
		glCtx.attachShader(program, vertexShader);
		glCtx.attachShader(program, fragmentShader);
		glCtx.linkProgram(program);

		var isLinked = glCtx.getProgramParameter(program, glCtx.LINK_STATUS);
		if (!isLinked) {
			var error = glCtx.getProgramInfoLog(program);
			glCtx.deleteProgram(program);
			glCtx.deleteShader(vertexShader);
			glCtx.deleteShader(fragmentShader);
			console.log('Error linking program: ' + error);
		} else {
			return program;
		}
	} else {
		console.log('Error creating program');
	}

	return null;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(glCtx, type, source) {
	// Create shader object
	var shader = glCtx.createShader(type);
	if (shader == null) {
		console.log('unable to create shader');
		return null;
	}
  
	// Set the shader program
	glCtx.shaderSource(shader, source);

	// Compile the shader
	glCtx.compileShader(shader);

	// Check the result of compilation
	var compiled = glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS);
	if (!compiled) {
		var error = glCtx.getShaderInfoLog(shader);
		console.log('Failed to compile shader: ' + error);
		glCtx.deleteShader(shader);
		return null;
	}

	return shader;
}

/**
 * Create the WebGL context for the platform
 */
function initContext() {
	var names = ["experimental-webgl", "webkit-3d", "moz-webgl", "webgl"];
	var context;

	var canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth - 50;
	canvas.height = window.innerHeight;
	for (var x = 0; x < names.length; x++) {
		try {
			context = canvas.getContext(names[x]);
			if (context) {
				break; 
			}
	    	} catch (e) {
			console.log(context);
	    	}
	}
	return context;
}
