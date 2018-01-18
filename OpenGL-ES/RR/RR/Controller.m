//
//  Controller.m
//  RR
//
//  Created by owner on 1/7/15.
//  Copyright (c) 2015 Sherman Marshall. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Controller.h"
#import "OpenGLES/ES2/gl.h"

#define PI 3.1415926

@interface Controller ()

@end

GLfloat controllerCoords[74*3];

@implementation Controller


-(instancetype) initWithScreenSize:(float [])screenSize {
    self = [super init];
    
    if (self) {
        float width = screenSize[0], height = screenSize[1];
        int index = 0;
        
        for (int x = 0; x < 3; x++)
            controllerCoords[index++] = 0.0f;
        
        for (float x = 0, radius = width / 8; x <= 360; x+= 5.0f) {
            controllerCoords[index++] = cosf(x * (PI/180));
            controllerCoords[index++] = 0.0f;
            controllerCoords[index++] = sinf(x * (PI/180));
        }
        
        
        
    }
    
    return self;
}

-(void) handleInput: (float[]) input {
    
    
    
}

@end