#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "matrixUtils.h"

Vector* newVector() {
	Vector* vector = (Vector*) malloc(sizeof(Vector));
	vector->x = 0.0f;
	vector->y = 0.0f;
	vector->z = 0.0f;
	vector->w = 0.0f;

	vector->free = &freeVectorMemory;
	return vector;
}

Vector* initNewVector(float x, float y, float z) {
	Vector* vector = newVector();

	vector->x = x;
	vector->y = y;
	vector->z = z;
	vector->w = 1.0f;

	return vector;
}

void freeVectorMemory (void* vector) {
	Vector* ptr = (Vector*) vector;
	free(ptr);
}

typedef struct {
	Vector vectors[4];
	
	void (* rotateX)(Vector*,float);
	void (* rotateY)(Vector*,float);
	void (* rotateZ)(Vector*,float);
	void (* rotateW)(Vector*,Vector*,float);
	void (* translate)(Vector*,float,float,float);
	
	Mat4* (* getMat4XRotation)(float);
	Mat4* (* getMat4YRotation)(float);
	Mat4* (* getMat4ZRotation)(float);
	Mat4* (* getMat4WRotation)(float);
	Mat4* (* getMat4Translation)(float,float,float);
	
	Mat3* (* getMat3XRotation)(float);
	Mat3* (* getMat3YRotation)(float);
	Mat3* (* getMat3ZRotation)(float);
	Mat3* (* getMat3WRotation)(float);
	Mat3* (* getMat3Translation)(float,float,float);

	//Using singleton, probably unnecessary
	//void (* free)();
} AffineTransformation;

void mat4Transpose(Mat4Data* mat) {
	float data[4][4];
	
	for (int x = 0; x < 4; x++) {
		for (int y = 0; y < 4; y++) {
			data[y][x] = mat->mat[x][y];
		}
	}
	memcpy(mat->mat, data, sizeof(mat->mat));
}

void mat3Transpose(Mat3Data* mat) {
	float data[3][3];
	for (int x = 0; x < 3; x++) {
		for (int y = 0; y < 3; y++) {
			data[y][x] = mat->mat[x][y];
		}
	}
	memcpy(mat->mat, data, sizeof(mat->mat));
}

Vector* multiplyVector(Mat4Data* data, Vector* vector) {
	Vector* retVal = newVector();
	//output
	float vectorData[4] = {0};
	float* input = (float*) vector;
	for (int x = 0; x < 4; x++) {
		for (int y = 0; y < 4; y++) {
			vectorData[x] += input[y] * data->mat[x][y];
		}
	}
	return memcpy(retVal, vectorData, sizeof(Vector));
}

Mat4Data* multiplyMat4(Mat4Data* thisMat, Mat4Data* thatMat) {
	Mat4* mat4 = newMat4();
	//This is multiplied right
	//The output should be y then x
	for (int x = 0; x < 4; x++) {
		for (int y = 0; y < 4; y++) {
			for (int z = 0; z < 4; z++) {
				mat4->mat[x][y] += thisMat->mat[x][z] * thatMat->mat[z][y];
			}
		}
	}
	return mat4;
}

Mat4* newMat4() {
	Mat4* mat4 = (Mat4*) malloc(sizeof(Mat4));
	memset(mat4->mat, 0, sizeof(Mat4));

	mat4->multiplyVector = &multiplyVector;
	mat4->multiplyMat4 = &multiplyMat4;

	return mat4;
}

/**
 * 	For rotating position vectors around the X axis
 */
void rotateX(Vector* vector, float angle) {
	angle *= DEGREES_TO_RADIANS;
	float tmp[3] = {vector->x, vector->y, vector->z};

	tmp[1] = (cos(angle) * tmp[1]) - (sin(angle) * tmp[2]);
	tmp[2] = (sin(angle) * tmp[2]) + (cos(angle) * tmp[2]);

	vector->x = tmp[0];
	vector->y = tmp[1];
	vector->z = tmp[2];
}

/**
 * 	Rotate input vector around the Y axis
 */
void rotateY(Vector* vector, float angle) {
	angle *= DEGREES_TO_RADIANS;
	float tmp[3] = {vector->x, vector->y, vector->z};

	tmp[0] = (cos(angle) * tmp[0]) + (sin(angle) * tmp[2]);
	tmp[2] = (-sin(angle) * tmp[0]) + (cos(angle) * tmp[2]);
	
	vector->x = tmp[0];
	vector->y = tmp[1];
	vector->z = tmp[2];
}

/**
 *
 */
void rotateZ(Vector* vector, float angle) {
	angle *= DEGREES_TO_RADIANS;
	float tmp[3] = {vector->x, vector->y, vector->z};

	tmp[0] = (cos(angle) * tmp[0]) - (sin(angle) * tmp[1]);
	tmp[1] = (-sin(angle) * tmp[0]) - (cos(angle) * tmp[1]);

	vector->x = tmp[0];
	vector->y = tmp[1];
	vector->z = tmp[2];
}

/**
 *
 */
void rotateW(Vector* vector1, Vector* vector2, float angle) {
	//TODO
}

void translate(Vector* vector, float deltaX, float deltaY, float deltaZ) {
	vector->x += deltaX;
	vector->y += deltaY;
	vector->z += deltaZ;
}

/*
AffineTransformation* getAffineTransformation(Vector* input) {
	AffineTransformation* at = (AffineTransformation*) malloc(sizeof(AffineTransformation));

	Vector one = {1.0f, 0.0f, 0.0f};
	Vector two = {0.0f, 1.0f, 0.0f};
	Vector three = {0.0f, 0.0f, 1.0f};

	at->vectors[0] = one; 	//{1.0f, 0.0f, 0.0f};
	at->vectors[1] = two; 	//{0.0f, 1.0f, 0.0f};
	at->vectors[2] = three; //{0.0f, 0.0f, 1.0f};
	at->vectors[3] = *input;

	at->rotateX = &rotateX;
	at->rotateY = &rotateY;
	//at->rotateZ = &rotateZ;
	//at->rotateW = &rotateW;

	return at;
}
*/

/** 
 *
 */
AffineTransformation* newTranslation(float x, float y, float z) {
	AffineTransformation* at = (AffineTransformation*) malloc(sizeof(AffineTransformation));
	
	Vector one = {1.0f, 0.0f, 0.0f};
	Vector two = {0.0f, 1.0f, 0.0f};
	Vector three = {0.0f, 0.0f, 1.0f};
	
	at->vectors[0] = one; 	//{1.0f, 0.0f, 0.0f};
	at->vectors[1] = two; 	//{0.0f, 1.0f, 0.0f};
	at->vectors[2] = three; //{0.0f, 0.0f, 1.0f};
	at->vectors[3] = *((Vector*) malloc(sizeof(Vector)));
	
	printf("Start: %p\n", &at->vectors[0]);
	printf("AF-1: %p\n", &at->vectors[1]);
	printf("AF-2: %p\n", &at->vectors[2]);
	printf("AF-3: %p\n", &at->vectors[3]);

	printf("One: %p\n", &one);
	printf("Two: %p\n", &two);
	printf("Three: %p\n", &three);
	printf("Input: %p\n", &at->vectors[3]);

	return at;
}

AffineTransformation* getAffineTransformation() {
	static AffineTransformation at[1];
	AffineTransformation* ptr = NULL;

	if (!(at->rotateX && at->rotateY && at->rotateZ && at->rotateW && at->translate && at->getMat4XRotation && at->getMat4YRotation && at->getMat4ZRotation && at->getMat4WRotation && at->getMat4Translation && at->getMat3XRotation && at->getMat3YRotation && at->getMat3ZRotation && at->getMat3WRotation && at->getMat3Translation)) {
		at->rotateX = &rotateX;
		at->rotateY = &rotateY;
		at->rotateZ = &rotateZ;
	}
	return at;
}

AffineTransformation* identityMatrixCopy() {
	static AffineTransformation* identityComponents;
	return identityComponents;
}

int mainy() {
	Vector* v = newVector();
	AffineTransformation* at = newTranslation(0, 1, 0);

	printf("Initial Vector values:\nX: %.2f, Y: %.2f, Z: %.2f\n", v->x, v->y, v->z);

	Vector test = {1.0f, 2.0f, 3.0f};
	printf("%p\n", &test);
	
	printf("%.2f, %.2f, %.2f\n", test.x, test.y, test.z);

	printf("Affine Transformations\n");
	for (int x = 0; x < 3; x++) {
		printf("%p\n", &at->vectors[x]);
		printf("%.2f, %.2f, %.2f\n", at->vectors[x].x, at->vectors[x].y, at->vectors[x].z);
		at->vectors[x].x = x;
		at->vectors[x].y = x;
		at->vectors[x].z = x;
	}

	printf("Affine Transformations\n");
	for (int x = 0; x < 3; x++) {
		printf("%.2f, %.2f, %.2f\n", at->vectors[x].x, at->vectors[x].y, at->vectors[x].z);
	}

	at = newTranslation(0, 0, 1);
	
	for (int x = 0; x < 3; x++) {
		printf("%p\n", &at->vectors[x]);
		printf("%.2f, %.2f, %.2f\n", at->vectors[x].x, at->vectors[x].y, at->vectors[x].z);
	}

	at = getAffineTransformation();
	if (at->rotateX) {
		printf("defined\n");
	} else {
		printf("undef\n");
	}

	//Test of AffineTransformation functionPointers
	v->x = 1.0f;
	v->y = 1.0f;
	v->z = 1.0f;

	//Vector* output =
	at->rotateX(v, -30.0f);
	printf("X: %.2f, Y: %.2f, Z: %.2f\n", v->x, v->y, v->z);

	if (at->rotateY) {
		printf("defined\n");
	} else {
		printf("undef\n");
	}

	v->x = 1.0f;
	v->y = 1.0f;
	v->z = 1.0f;

	at->rotateY(v, -30.0f);
	printf("X: %.2f, Y: %.2f, Z: %.2f\n", v->x, v->y, v->z);

	v->x = 1.0f;
	v->y = 1.0f;
	v->z = 1.0f;

	at->rotateZ(v, -30.0f);
	printf("X: %.2f, Y: %.2f, Z: %.2f\n", v->x, v->y, v->z);
}

int main() {
	Mat4* rowMajor = newMat4();
	Mat4* columnMajor = newMat4();
	
	rowMajor->mat[0][0] = 1.0f;
	rowMajor->mat[1][1] = 1.0f;
	rowMajor->mat[2][2] = 1.0f;
	rowMajor->mat[3][3] = 1.0f;

	columnMajor->mat[3][0] = 2.0f;
	columnMajor->mat[3][1] = 2.0f;
	columnMajor->mat[3][2] = 2.0f;

	printf("initial mats\n");
	for (int x = 0; x < 4; x++) {
		for (int y = 0; y < 4; y++) {
			printf("%.2f\n", rowMajor->mat[x][y]);
			printf("%.2f\n", columnMajor->mat[x][y]);
		}
	}

	printf("product\n");
	Mat4* retVal = rowMajor->multiplyMat4(rowMajor, columnMajor);
	for (int y = 0; y < 4; y++) {
		for (int x = 0; x < 4; x++) {
			printf("%.2f\n", retVal->mat[x][y]);
		}
	}
}
