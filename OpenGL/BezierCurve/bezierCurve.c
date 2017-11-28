#include "bezierCurve.h"

void makeCubicBezier(float* curve, int segments, float xCoords[], float yCoords[], float zCoords[]) {
    float t = 0.0f;
    for (int x = (0); t < segments; ) {
        curve[x++] = sumPoint(t / ((float) segments), xCoords);
        curve[x++] = sumPoint(t / ((float) segments), yCoords);
        curve[x++] = sumPoint(t++/ ((float) segments), zCoords);
    }
}

float sumPoint(float t, float coords[]) {
    float base = 1 - t, sum = 0.0f;
    for (int x = 0; x < 4; x++) {
        switch (x) {
            case 0: sum += (base * base * base * coords[x]);
                break;
            case 1: sum += (base * base * 3 * t * coords[x]);
                break;
            case 2: sum += (base * 3 * t * t * coords[x]);
                break;
            case 3: sum += (t * t * t * coords[x]);
                break;
            default: break;
        }
    }
    return sum;
}
