#include <stdio.h>
#include <stdlib.h>
#include <GL/glew.h>
#include <glfw3.h>
#include </usr/local/include/loadShaders>
#include </usr/local/include/utils/math/matrixUtils.c>

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
	window = glfwCreateWindow( 1024, 768, "Basic Map", NULL, NULL);
	if( window == NULL ){
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

	// Dark blue background
	glClearColor(0.0f, 0.0f, 0.4f, 0.0f);

	GLuint VertexArrayID;
	glGenVertexArrays(1, &VertexArrayID);
	glBindVertexArray(VertexArrayID);

	// Create and compile our GLSL program from the shaders
	GLuint programID = LoadShaders( "RotatingTriangle.vsh", "RotatingTriangle.fsh" );

	static GLfloat coloredOutline[9];


	coloredOutline[0] = -0.5f;
	coloredOutline[1] = 0.5f;
	coloredOutline[2] = -1.0f;

	coloredOutline[3] = 0.5f;
	coloredOutline[4] = 0.5f;
	coloredOutline[5] = -1.0f;

	coloredOutline[6] = 0.5f;
	coloredOutline[7] = -1.0f;
	coloredOutline[8] = -1.0f;

	GLuint vertexbuffer;
	glGenBuffers(1, &vertexbuffer);
	glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(coloredOutline), coloredOutline, GL_STATIC_DRAW);

	printf("Prepping uniforms\n");

	GLuint uIdx = glGetUniformLocation(programID, "val");
	GLuint vectorTest = glGetUniformLocation(programID, "vectorTest");
	GLuint matrixTest = glGetUniformLocation(programID, "zrotation");

	GLint uniSize;

	glGetActiveUniformBlockiv(programID, uIdx, GL_UNIFORM_BLOCK_DATA_SIZE, &uniSize);
	glGetActiveUniformBlockiv(programID, vectorTest, GL_UNIFORM_BLOCK_DATA_SIZE, &uniSize);
	glGetActiveUniformBlockiv(programID, matrixTest, GL_UNIFORM_BLOCK_DATA_SIZE, &uniSize);

	GLfloat val = 0.0f;
	Vector* v = (Vector*) malloc(sizeof(Vector));

	v->x = 1;
	v->y = 1;
	v->z = 1;
	v->w = 1;

	Mat3* mat3 = newMat3();
	
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

		val += 0.001f;

		glUniform1f(uIdx, val);
		glUniform4iv(vectorTest, 1, (int*) v);

		memset(mat3->mat, 0, sizeof(GLfloat) * 9);
		mat3->mat[0][0] = cos(val);
		mat3->mat[1][0] = sin(val);
		mat3->mat[0][1] = -sin(val);
		mat3->mat[1][1] = cos(val);

		glUniformMatrix3fv(matrixTest, 1, GL_TRUE, (GLfloat*) mat3->mat);
		glDrawArrays(GL_TRIANGLES, 0, 9/3);

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

