#include "stdio.h"
#include "matrix.h"
#include "math.h"

float* makeMatrix3f(float);
float* makeMatrix4f();

void rotateX(float* data, float* output, float angle) {
	float 	y = data[1], 
		z = data[2], 
		delta = PI180 * angle;
	output[0] = data[0];
	output[1] = (cos(delta) * y) - (sin(delta) * z);
	output[2] = (sin(delta) * y) + (cos(delta) * z);
}

void rotateY(float* data, float* output, float angle) {
	float 	x = data[0],
		z = data[2],
		delta = PI180 * angle;
	output[0] = (cos(delta) * x) + (sin(delta) * z);
	output[1] = data[1];
	output[2] = (-sin(delta) * x) + (cos(delta) * z);
}

void rotateZ(float* data, float* output, float angle) {
	float	x = data[0],
		y = data[1],
		delta = PI180 * angle;
	output[0] = (cos(delta) * x) - (sin(delta) * y);
	output[1] = (-sin(delta) * x) - (cos(delta) * y);
	output[2] = data[2];
}

/** 
 * rotation around an arbitrary axis (W)
 */
void rotateW(float* data, float* data2, float* output, float angle) {
	float diffToOrigin[3] = {
		data2[0] - data[0], 
		data2[1] - data[1], 
		data2[2] - data[2]
	};

	float 	rotY[3],
		rotX[3],
		rotated[3],
		rotX2[3],
		rotY2[3];

	float 	diffToOriginX = data2[0] - data[0],
		diffToOriginY = data2[1] - data[1],
		diffToOriginZ = data2[2] - data[2],
		delta = PI180 * angle;

	float diffY = atan(fabs(diffToOriginX) / fabs(diffToOriginZ)) - 90;
	rotateY(diffToOrigin, rotY, diffY);

	float diffX = atan(fabs(rotY[1]) / fabs(rotY[0])) - 90;
	rotateX(diffToOrigin, rotX, diffX);

	rotateZ(rotX, rotated, angle);
	
	rotateX(rotated, rotX2, diffX * -1);
	
	rotateY(rotX2, rotY2, diffY * -1);

	output[0] = data[0] + rotY2[0];
	output[1] = data[1] + rotY2[1];
	output[2] = data[2] + rotY2[2];
}

float* makeMatrix3f(float n) {}

void getIdentityMatrix3() {
	static float identityMatrix3[9] = {
		1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f
	};
}

void o(){
	for (int x = 0; x < 9; x++) {
		if (x != 0) {
			if (x % 3 ==0) {
				printf("\n");
			} else {
				printf(",");
			}
		}
		//printf ("%.1f", identityMatrix3[x]);
	}
}

void func() {
	int data[10];
	int* start = data;

	for (int x = 0; x < 10; x++) {
		*start = x;
		start++;
	}

	for (int x =0 ; x< 10;x++) {
		start-=2;
		printf("%i\n",*start);
	}

	printf("%.2f\n", atan(30* PI180));
}
