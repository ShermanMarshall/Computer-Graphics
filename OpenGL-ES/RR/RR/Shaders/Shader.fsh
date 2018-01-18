//
//  Shader.fsh
//  RR
//
//  Created by owner on 1/7/15.
//  Copyright (c) 2015 Sherman Marshall. All rights reserved.
//

varying lowp vec4 colorVarying;

void main()
{
    gl_FragColor = colorVarying;
}
