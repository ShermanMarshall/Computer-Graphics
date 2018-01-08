#include "math.h"
#define DEGREES_TO_RADIANS 0.0174532889

typedef struct {
	float x;
	float y;
	float z;
	float w;

	void (* free)(void*);
} Vector;

//Vector initializing prototypes
Vector* newVector(void);
Vector* initNewVector(float, float, float);

//Vector
void freeVectorMemory(void*);

typedef struct {
	float mat[4][4];
	void (*func1)();
	void (*func2)();
	void (*func3)();
	void (*func4)();
} Mat4Data;

typedef struct {
	float mat[3][3];
	void (*func1)();
	void (*func2)();
	void (*func3)();
	void (*func4)();
} Mat3Data;

//Matrix struct typedefs
typedef struct {
	float mat[4][4];
	Vector* (* multiplyVector)(Mat4Data*, Vector*);
	Mat4Data* (* multiplyMat4)(Mat4Data*, Mat4Data*);
	void (* transpose)(Mat4Data*);
	void (* free)(void*);
} Mat4;

Mat4* newMat4(void);
Mat4* initNewMat4(float[4][4]);
Mat4Data* multiplyMat4(Mat4Data*, Mat4Data*);
Vector* multiplyVector(Mat4Data*, Vector*);

typedef struct {
	float mat[3][3];
	void (* multiplyVector)(Mat3Data*, Vector*);
	void (* multiplyMat3)(Mat3Data*, Mat3Data*);
	void (* transpose)(Mat3Data);
	void (* free)(void*);
} Mat3;

//Affine Transformation prototypes
void rotateX(Vector*, float);
void rotateY(Vector*, float);
void rotateZ(Vector*, float);
void rotateW(Vector*, Vector*, float);
void translate(Vector*, float, float, float);

Mat4* getMat4XRotation(float);
Mat4* getMat4YRotation(float);
Mat4* getMat4ZRotation(float);
Mat4* getMat4WRotation(float);
Mat4* getMat4Translation(float, float, float);

Mat3* getMat3XRotation(float);
Mat3* getMat3YRotation(float);
Mat3* getMat3ZRotation(float);
Mat3* getMat3WRotation(float);
Mat3* getMat3Translation(float, float, float);

