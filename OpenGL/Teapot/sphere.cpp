#include "sphere.h"

int sphereSize(float theta) {
    float tops = 180.0f/theta;
    float circRev = tops - 2;
    float slice = (tops * 2) ;
    
    return 18 * ((circRev * slice) + tops);
}

void makeSphere(float sphere[], float radius, float theta, float height) {
    int index = 0; 
    
    radius = sinf(theta * (PI180));
    height = cosf(theta * (PI180));
    
    for (float idx = 0.0f; idx < 360; ) {
        sphere[index++] = 0.0f;
        sphere[index++] = 1.0f;
        sphere[index++] = 0.0f;
        
        sphere[index++] = cosf(idx * (PI180)) * radius;
        sphere[index++] = height;
        sphere[index++] = sinf(idx * (PI180)) * radius;
        
        idx += theta;
        
        sphere[index++] = cosf(idx * (PI180)) * radius;
        sphere[index++] = height;
        sphere[index++] = sinf(idx * (PI180)) * radius;
    }
    
    for (float idx = theta; idx < 180 - theta; idx+= theta) {
        radius = sinf(idx * (PI180));
        height = cosf(idx * (PI180));
        
        for (float top = 0.0f; top < 360; top += theta) {
            sphere[index++] = cosf(top * (PI180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf(top * (PI180)) * radius;
            
            sphere[index++] = cosf((top + theta) * (PI180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf((top + theta) * (PI180)) * radius;
            
            sphere[index++] = cosf((top + (theta/2)) * (PI180)) * sinf((idx + theta) * (PI180));
            sphere[index++] = cosf((idx + theta) * (PI180));
            sphere[index++] = sinf((top + (theta/2)) * (PI180)) * sinf((idx + theta) * (PI180));
        }
        
        for (float bottom = (theta/2); bottom < 360; bottom += theta) {
            sphere[index++] = cosf(bottom * (PI180)) * sinf((idx + theta) * (PI180));
            sphere[index++] = cosf((idx + theta) * (PI180));
            sphere[index++] = sinf(bottom * (PI180)) * sinf((idx + theta) * (PI180));
            
            sphere[index++] = cosf((bottom + theta) * (PI180)) * sinf((idx + theta) * (PI180));
            sphere[index++] = cosf((idx + theta) * (PI180));
            sphere[index++] = sinf((bottom + theta) * (PI180)) * sinf((idx + theta) * (PI180));
            
            sphere[index++] = cosf((bottom + (theta/2)) * (PI180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf((bottom + (theta/2)) * (PI180)) * radius;
        }
    }
    
    for (float idx = 0.0f; idx < 360; ) {
        sphere[index++] = 0.0f;
        sphere[index++] = -1.0f;
        sphere[index++] = 0.0f;
        
        sphere[index++] = cosf(idx * (PI180)) * radius;
        sphere[index++] = height;
        sphere[index++] = sinf(idx * (PI180)) * radius;
        
        idx += theta;
        
        sphere[index++] = cosf(idx * (PI180)) * radius;
        sphere[index++] = height;
        sphere[index++] = sinf(idx * (PI180)) * radius;
    }
}
