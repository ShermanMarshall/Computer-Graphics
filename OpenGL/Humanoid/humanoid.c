#include "humanoid.h"

int humanoidSize() {
	return 0;
}

void makeHumanoid(float humanoid[], float radius, float theta, float height) {
    int index = 0; 
    
    radius = sinf(theta * (PI180)) * 0.1f;
    height = cosf(theta * (PI180)) * 0.1f;

    for (float idx = 0.0f; idx < 360; ) {
        humanoid[index++] = 0.0f;
        humanoid[index++] = 0.1f;
        humanoid[index++] = 0.0f;
        
        humanoid[index++] = cosf(idx * (PI180)) * radius;
        humanoid[index++] = height;
        humanoid[index++] = sinf(idx * (PI180)) * radius;
        
        idx += theta;
        
        humanoid[index++] = cosf(idx * (PI180)) * radius;
        humanoid[index++] = height;
        humanoid[index++] = sinf(idx * (PI180)) * radius;
    }
    
    for (float idx = theta; idx < 160 - theta; idx+= theta) {
        radius = sinf(idx * (PI180)) * 0.1f;
        height = cosf(idx * (PI180)) * 0.1f;

        for (float top = 0.0f; top < 360; top += theta) {
            humanoid[index++] = cosf(top * (PI180)) * radius;
            humanoid[index++] = height;
            humanoid[index++] = sinf(top * (PI180)) * radius;
            
            humanoid[index++] = cosf((top + theta) * (PI180)) * radius;
            humanoid[index++] = height;
            humanoid[index++] = sinf((top + theta) * (PI180)) * radius;
            
            humanoid[index++] = cosf((top + (theta/2)) * (PI180)) * sinf((idx + theta) * (PI180)) * 0.1f;
            humanoid[index++] = cosf((idx + theta) * (PI180)) * 0.1f;
            humanoid[index++] = sinf((top + (theta/2)) * (PI180)) * sinf((idx + theta) * (PI180)) * 0.1f;
        }
        
        for (float bottom = (theta/2); bottom < 360; bottom += theta) {
            humanoid[index++] = cosf(bottom * (PI180)) * sinf((idx + theta) * (PI180)) * 0.1f;
            humanoid[index++] = cosf((idx + theta) * (PI180)) * 0.1f;
            humanoid[index++] = sinf(bottom * (PI180)) * sinf((idx + theta) * (PI180)) * 0.1f;
            
            humanoid[index++] = cosf((bottom + theta) * (PI180)) * sinf((idx + theta) * (PI180)) * 0.1f;
            humanoid[index++] = cosf((idx + theta) * (PI180)) * 0.1f;
            humanoid[index++] = sinf((bottom + theta) * (PI180)) * sinf((idx + theta) * (PI180)) * 0.1f;
            
            humanoid[index++] = cosf((bottom + (theta/2)) * (PI180)) * radius;
            humanoid[index++] = height;
            humanoid[index++] = sinf((bottom + (theta/2)) * (PI180)) * radius;
        }
    }

    printf("Head: %i\n", index);

    for (float idx = theta; idx < 160 - theta; idx+= theta) {
        radius = sinf(idx * (PI180)) * 0.1f;
        height = 1.0f;
	//height = cosf(idx * (PI180)) * 0.1f;

        for (float top = 0.0f; top < 360; top += theta + theta) {
            humanoid[index++] = cosf(top * (PI180)) * radius;
            humanoid[index++] = height;
            humanoid[index++] = sinf(top * (PI180)) * radius;
    
            humanoid[index++] = cosf((top + theta) * (PI180)) * radius;
            humanoid[index++] = height;
            humanoid[index++] = sinf((top + theta) * (PI180)) * radius;
    
            humanoid[index++] = cosf(top * (PI180));
            humanoid[index++] = -(height + height);
            humanoid[index++] = sinf(top * (PI180));

	    humanoid[index++] = cosf(top * (PI180)) * radius;
	    humanoid[index++] = -(height + height);
 	    humanoid[index++] = sinf(top * (PI180)) * radius;

	    humanoid[index++] = cosf((top + theta) * (PI180)) * radius;
	    humanoid[index++] = -(height + height);
	    humanoid[index++] = sinf((top + theta) * (PI180)) * radius;

	    humanoid[index++] = cosf((top + theta) * (PI180)) * radius;
	    humanoid[index++] = height;
	    humanoid[index++] = sinf((top + theta) * (PI180)) * radius;
        }
    }

    printf("Neck: %i\n", index);
}
