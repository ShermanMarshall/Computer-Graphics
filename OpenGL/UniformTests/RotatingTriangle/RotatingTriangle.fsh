#version 330 core

// Ouput data
out vec3 color;

in vec3 colorvarying;

void main() {
	color = colorvarying;
}
