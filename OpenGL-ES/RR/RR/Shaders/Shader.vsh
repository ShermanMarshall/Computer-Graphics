//
//  Shader.vsh
//  RR
//
//  Created by owner on 1/7/15.
//  Copyright (c) 2015 Sherman Marshall. All rights reserved.
//

attribute vec4 position;
attribute vec3 normal;



varying lowp vec4 colorVarying;

uniform mat4 modelViewProjectionMatrix;
uniform mat3 normalMatrix;
uniform float delta_depth;
uniform float off_x;
uniform off_y;
uniform off_z;

void main()
{
    vec4 newPos = position;
    newPos.x += off_x;
    newPos.y += off_y;
    newPos.z -= off_z;
    
    newPos.z += delta_depth;
    
    /*
    if (d != 0) {
        newPos.z += d;
        newPos.x = newPos.x * d/ newPos.z;
        newPos.y = newPos.y * d/ newPos.z;
    }*/
    
    vec3 eyeNormal = normalize(normalMatrix * normal);
    vec3 lightPosition = vec3(0.0, 0.0, 1.0);
    vec4 diffuseColor = vec4(0.4, 0.4, 1.0, 1.0);
    
    float nDotVP = max(0.0, dot(eyeNormal, normalize(lightPosition)));
                 
    colorVarying = diffuseColor * nDotVP;
    
    gl_Position = modelViewProjectionMatrix * newPos;
}
