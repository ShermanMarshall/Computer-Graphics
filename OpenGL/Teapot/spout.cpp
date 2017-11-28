#include <stdio.h>
#include <stdlib.h>
#include <GL/glew.h>
#include <glfw3.h>
#include "loadShaders.cpp"
#include "BezierCurve/bezierCurve.c"
#include "utils/math/matrix.cpp"

GLFWwindow* window;

int main( void )
{
	if( !glfwInit() )
	{
		fprintf( stderr, "Failed to initialize GLFW\n" );
		getchar();
		return -1;
	}

	glfwWindowHint(GLFW_SAMPLES, 4);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE); // To make MacOS happy; should not be needed
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	// Open a window and create its OpenGL context
	window = glfwCreateWindow( 1024, 768, "Img", NULL, NULL);
	if( window == NULL ) {
		fprintf( stderr, "Failed to open GLFW window. If you have an Intel GPU, they are not 3.3 compatible. Try the 2.1 version of the tutorials.\n" );
		getchar();
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);

	// Initialize GLEW
	glewExperimental = true; // Needed for core profile
	if (glewInit() != GLEW_OK) {
		fprintf(stderr, "Failed to initialize GLEW\n");
		getchar();
		glfwTerminate();
		return -1;
	}

	// Ensure we can capture the escape key being pressed below
	glfwSetInputMode(window, GLFW_STICKY_KEYS, GL_TRUE);

	// Background color
	glClearColor(0.4f, 0.4f, 0.4f, 0.0f);

	GLuint VertexArrayID;
	glGenVertexArrays(1, &VertexArrayID);
	glBindVertexArray(VertexArrayID);

	// Create and compile our GLSL program from the shaders
	GLuint programID = LoadShaders( "SimpleVertexShader.vertexshader", "SimpleFragmentShader.fragmentshader" );

	static GLfloat cubicBezier[60];
	static GLfloat rotatedBezier[72*20*3];

	float* xCoords = (float*) malloc(sizeof(double) *4); // {0.0, 5, -2, 1.0};
	float* yCoords = (float*) malloc(sizeof(double) *4); // {0.0, 1, -1, 1.0};
	float* zCoords = (float*) malloc(sizeof(double) *4); // {0.0, -3, -3.0, -8.0};

	xCoords[0] = -1.0;
	yCoords[0] = 0.0;
	zCoords[0] = 0.0;

	xCoords[1] = -0.5f;
	yCoords[1] = 0.5f;
	zCoords[1] = 1.0f;

	xCoords[2] = 0.86f;
	yCoords[2] = 0.54f;
	zCoords[2] = -1.0f;

	xCoords[3] = 1.0f;
	yCoords[3] = 1.0f;
	zCoords[3] = 1.0f;

	makeCubicBezier(cubicBezier, 20, xCoords, yCoords, zCoords);

	for (int x = 0; x < 60 ; x++) { 
		//printf("%.2f\n", cubicBezier[x]); 
	}

	GLfloat* initial = cubicBezier;
	GLfloat* nextVertex = cubicBezier + 3;
	GLfloat* bezierPtr = cubicBezier;
	GLfloat* rotatedPtr = rotatedBezier;

	float angle = 0.0f;
	for (int x = 0; x < 4; x++) {
		for (int y = 0; y < 72; y++) {
			angle = (y * 5);
			rotateW(bezierPtr, nextVertex, rotatedPtr, angle);
			bezierPtr += 3;

			nextVertex += 3;
			rotatedPtr += 3;

			rotateW(bezierPtr, nextVertex, rotatedPtr, angle);
			rotatedPtr += 3;
			
			rotateW(bezierPtr, nextVertex, rotatedPtr, angle + 5);
			rotatedPtr += 3;

			bezierPtr -= 3;
			nextVertex -=3;

			rotateW(bezierPtr, nextVertex, rotatedPtr, angle + 5);
			rotatedPtr += 3;
		
			rotateW(bezierPtr, nextVertex, rotatedPtr, angle);
			rotatedPtr += 3;
	
			bezierPtr +=3;
			nextVertex += 3;
		
			rotateW(bezierPtr, nextVertex, rotatedPtr, angle + 5);
			rotatedPtr += 3;

			//Need to set nextVertex to the initial of cubicBezier to avoid overflow
			if (y == 70) {
				nextVertex = initial;
			}
		}
		bezierPtr = initial;
		nextVertex += 3;
	}

	GLuint vertexbuffer;
	glGenBuffers(1, &vertexbuffer);
	glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(rotatedBezier), rotatedBezier, GL_STATIC_DRAW);

	do {
		// Clear the screen
		glClear( GL_COLOR_BUFFER_BIT );

		// Use our shader
		glUseProgram(programID);

		// 1rst attribute buffer : vertices
		glEnableVertexAttribArray(0);
		glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
		glVertexAttribPointer(
			0,                  // attribute 0. No particular reason for 0, but must match the layout in the shader.
			3,                  // size
			GL_FLOAT,           // type
			GL_FALSE,           // normalized?
			0,                  // stride
			(void*)0            // array buffer offset
		);

		glDrawArrays(GL_TRIANGLES, 0, 72 * 20);

		glDisableVertexAttribArray(0);

		// Swap buffers
		glfwSwapBuffers(window);
		glfwPollEvents();

	} // Check if the ESC key was pressed or the window was closed
	while( glfwGetKey(window, GLFW_KEY_ESCAPE ) != GLFW_PRESS &&
		   glfwWindowShouldClose(window) == 0 );

	// Cleanup VBO
	glDeleteBuffers(1, &vertexbuffer);
	glDeleteVertexArrays(1, &VertexArrayID);
	glDeleteProgram(programID);

	// Close OpenGL window and terminate GLFW
	glfwTerminate();

	return 0;
}

