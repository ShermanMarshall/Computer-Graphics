#version 330 core

// Input vertex data, different for all executions of this shader.
layout(location = 0) in vec3 vertexPosition_modelspace;

out vec3 colorvarying;

//Input uniform specifying 
uniform float val;
uniform ivec4 vectorTest;

void main(){

    //z-axis rotation
    mat3 A = mat3(cos(val), sin(val), 0,
		 -sin(val), cos(val), 0,
		 0, 0, 0);

    gl_Position = vec4(vertexPosition_modelspace * A, 1);

    colorvarying = vectorTest.xyz; 
}

