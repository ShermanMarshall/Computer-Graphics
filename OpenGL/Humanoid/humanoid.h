#ifndef __humanoid_h_included__
#define __humanoid_h_included__

#include "math.h"
#include "stdio.h"
#include "time.h"

#define PI 3.1415926
#define PI180 PI/180

//int humanSize (float theta);
 int humanoidSize();
void makeHumanoid (float humanoid[], float radius, float theta, float height);
#endif
