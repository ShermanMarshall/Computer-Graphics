#include <stdlib.h>
#include <stdio.h>

typedef struct {
	float x;
	float y;
	float z;
} Vector;

Vector* newVector(void);
Vector* initNewVector(float,float,float);

Vector* newVector(void) {
	Vector* v = (Vector*) malloc(sizeof(Vector));
	v->x = 0.0f;
	v->y = 0.0f;
	v->z = 0.0f;
	return v;
}

Vector* initNewVector(float x, float y, float z) {
	Vector* v = (Vector*) malloc(sizeof(Vector));
	v->x = x;
	v->y = y;
	v->z = z;
	return v;
}

typedef struct {
	float* xyz;
} Vector2;

typedef struct {
	Vector vectors[4];
	//Vector one;
	//Vector two;
	//Vector three;
	//Vector input;

	//Vector* (* rotateX)(Vector*)(float);
	//Vector* (* rotateY)(Vector*)(float);
	//Vector* (* rotateZ)(Vector*)(float);
	//Vector* (* rotateW)(Vector*)(float);
	//Vector* (* translate)(Vector*)(float,float,float);
	//void (* free)();
} AffineTransformation;

AffineTransformation* getAffineTransformation(Vector* input) {
	AffineTransformation* at = (AffineTransformation*) malloc(sizeof(AffineTransformation));

	Vector one = {1.0f, 0.0f, 0.0f};
	Vector two = {0.0f, 1.0f, 0.0f};
	Vector three = {0.0f, 0.0f, 1.0f};

	at->vectors[0] = one; 	//{1.0f, 0.0f, 0.0f};
	at->vectors[1] = two; 	//{0.0f, 1.0f, 0.0f};
	at->vectors[2] = three; //{0.0f, 0.0f, 1.0f};
	at->vectors[3] = *input;

	return at;
}

/** 
 *
 */
AffineTransformation* newTranslation(float x, float y, float z) {
	AffineTransformation* af = (AffineTransformation*) malloc(sizeof(AffineTransformation));

	Vector one = {1.0f, 0.0f, 0.0f};
	Vector two = {0.0f, 1.0f, 0.0f};
	Vector three = {0.0f, 0.0f, 1.0f};

	af->vectors[0] = one; 	//{1.0f, 0.0f, 0.0f};
	af->vectors[1] = two; 	//{0.0f, 1.0f, 0.0f};
	af->vectors[2] = three; //{0.0f, 0.0f, 1.0f};
	af->vectors[3] = *((Vector*) malloc(sizeof(Vector)));
	
	printf("Start: %p\n", &af->vectors[0]);
	printf("AF-1: %p\n", &af->vectors[1]);
	printf("AF-2: %p\n", &af->vectors[2]);
	printf("AF-3: %p\n", &af->vectors[3]);

	printf("One: %p\n", &one);
	printf("Two: %p\n", &two);
	printf("Three: %p\n", &three);
	printf("Input: %p\n", &af->vectors[3]);

	return af;
}

AffineTransformation* identityMatrixCopy() {
	static AffineTransformation* identityComponents;
	return identityComponents;
}

int main() {
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
}

