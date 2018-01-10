//
//  Shader.fsh
//  Sphere
//
//  Created by owner on 12/23/14.
//  Copyright (c) 2014 Sherman Marshall. All rights reserved.
//

varying lowp vec4 colorVarying;

void main()
{
    gl_FragColor = colorVarying;
}
