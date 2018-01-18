//
//  GameViewController.m
//  Sphere
//
//  Created by owner on 12/23/14.
//  Copyright (c) 2014 Sherman Marshall. All rights reserved.
//

#import "GameViewController.h"
#import <OpenGLES/ES2/glext.h>

#define BUFFER_OFFSET(i) ((char *)NULL + (i))

// Uniform index.
enum
{
    UNIFORM_MODELVIEWPROJECTION_MATRIX,
    UNIFORM_NORMAL_MATRIX,
    NUM_UNIFORMS
};
GLint uniforms[NUM_UNIFORMS];

// Attribute index.
enum
{
    ATTRIB_VERTEX,
    ATTRIB_NORMAL,
    NUM_ATTRIBUTES
};

enum
{
    SPHERE
};

struct myObject {
    int size;
    GLfloat data[(6 + ( 360 * 180 * 3)) * 2];
};

#define PI 3.1415629

//struct myObject sphere;

GLfloat sphere[2*(18*(360/5)*((180/5)-1)) + (2*(3+(3*360/5)))];//[(6+(360*3*180))*2];

/*GLfloat gCubeVertexData[216] =
{
    // Data layout for each line below is:
    // positionX, positionY, positionZ,     normalX, normalY, normalZ,
    0.5f, -0.5f, -0.5f,        1.0f, 0.0f, 0.0f,
    0.5f, 0.5f, -0.5f,         1.0f, 0.0f, 0.0f,
    0.5f, -0.5f, 0.5f,         1.0f, 0.0f, 0.0f,
    0.5f, -0.5f, 0.5f,         1.0f, 0.0f, 0.0f,
    0.5f, 0.5f, -0.5f,          1.0f, 0.0f, 0.0f,
    0.5f, 0.5f, 0.5f,         1.0f, 0.0f, 0.0f,
    
    0.5f, 0.5f, -0.5f,         0.0f, 1.0f, 0.0f,
    -0.5f, 0.5f, -0.5f,        0.0f, 1.0f, 0.0f,
    0.5f, 0.5f, 0.5f,          0.0f, 1.0f, 0.0f,
    0.5f, 0.5f, 0.5f,          0.0f, 1.0f, 0.0f,
    -0.5f, 0.5f, -0.5f,        0.0f, 1.0f, 0.0f,
    -0.5f, 0.5f, 0.5f,         0.0f, 1.0f, 0.0f,
    
    -0.5f, 0.5f, -0.5f,        -1.0f, 0.0f, 0.0f,
    -0.5f, -0.5f, -0.5f,       -1.0f, 0.0f, 0.0f,
    -0.5f, 0.5f, 0.5f,         -1.0f, 0.0f, 0.0f,
    -0.5f, 0.5f, 0.5f,         -1.0f, 0.0f, 0.0f,
    -0.5f, -0.5f, -0.5f,       -1.0f, 0.0f, 0.0f,
    -0.5f, -0.5f, 0.5f,        -1.0f, 0.0f, 0.0f,
    
    -0.5f, -0.5f, -0.5f,       0.0f, -1.0f, 0.0f,
    0.5f, -0.5f, -0.5f,        0.0f, -1.0f, 0.0f,
    -0.5f, -0.5f, 0.5f,        0.0f, -1.0f, 0.0f,
    -0.5f, -0.5f, 0.5f,        0.0f, -1.0f, 0.0f,
    0.5f, -0.5f, -0.5f,        0.0f, -1.0f, 0.0f,
    0.5f, -0.5f, 0.5f,         0.0f, -1.0f, 0.0f,
    
    0.5f, 0.5f, 0.5f,          0.0f, 0.0f, 1.0f,
    -0.5f, 0.5f, 0.5f,         0.0f, 0.0f, 1.0f,
    0.5f, -0.5f, 0.5f,         0.0f, 0.0f, 1.0f,
    0.5f, -0.5f, 0.5f,         0.0f, 0.0f, 1.0f,
    -0.5f, 0.5f, 0.5f,         0.0f, 0.0f, 1.0f,
    -0.5f, -0.5f, 0.5f,        0.0f, 0.0f, 1.0f,
    
    0.5f, -0.5f, -0.5f,        0.0f, 0.0f, -1.0f,
    -0.5f, -0.5f, -0.5f,       0.0f, 0.0f, -1.0f,
    0.5f, 0.5f, -0.5f,         0.0f, 0.0f, -1.0f,
    0.5f, 0.5f, -0.5f,         0.0f, 0.0f, -1.0f,
    -0.5f, -0.5f, -0.5f,       0.0f, 0.0f, -1.0f,
    -0.5f, 0.5f, -0.5f,        0.0f, 0.0f, -1.0f
};*/

@interface GameViewController () {
    GLuint _program;
    
    GLKMatrix4 _modelViewProjectionMatrix;
    GLKMatrix3 _normalMatrix;
    float _rotation;
    
    BOOL rotate;
    
    GLuint _vertexArray, _otherArray;
    GLuint _vertexBuffer, _otherBuffer;
}
@property (strong, nonatomic) EAGLContext *context;
@property (strong, nonatomic) GLKBaseEffect *effect;

- (void)setupGL;
- (void)tearDownGL;

- (BOOL)loadShaders;
- (BOOL)compileShader:(GLuint *)shader type:(GLenum)type file:(NSString *)file;
- (BOOL)linkProgram:(GLuint)prog;
- (BOOL)validateProgram:(GLuint)prog;

@end

@implementation GameViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES2];

    if (!self.context) {
        NSLog(@"Failed to create ES context");
    }
    
    GLKView *view = (GLKView *)self.view;
    view.context = self.context;
    view.drawableDepthFormat = GLKViewDrawableDepthFormat24;
    
    [self setupGL];
}

- (void)dealloc
{    
    [self tearDownGL];
    
    if ([EAGLContext currentContext] == self.context) {
        [EAGLContext setCurrentContext:nil];
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];

    if ([self isViewLoaded] && ([[self view] window] == nil)) {
        self.view = nil;
        
        [self tearDownGL];
        
        if ([EAGLContext currentContext] == self.context) {
            [EAGLContext setCurrentContext:nil];
        }
        self.context = nil;
    }

    // Dispose of any resources that can be recreated.
}

- (BOOL)prefersStatusBarHidden {
    return YES;
}

- (void)setupGL
{
    [EAGLContext setCurrentContext:self.context];
    
    [self loadShaders];
    
    int index = 0, terms = 0;
    float radius = 0.5f, height = 1.0f, theta = 360/72;
    
    sphere[index++] = 0.0f;
    sphere[index++] = height;
    sphere[index++] = 0.0f;
    
    sphere[index++] = 0.0f;
    sphere[index++] = height;
    sphere[index++] = 0.0f;
    
    radius = sinf(theta * (PI/180));
    height = cosf(theta * (PI/180)) * 1.0f;
    
    for (float threed = 0; threed <= 360; threed += theta) {
        sphere[index++] = cosf(threed * (PI/180)) * radius;
        sphere[index++] = height;
        sphere[index++] = sinf(threed * (PI/180)) * radius;
        
        sphere[index++] = cosf(threed * (PI/180)) * radius;
        sphere[index++] = height;
        sphere[index++] = sinf(threed * (PI/180)) * radius;
    }
    
    for (float threed = theta; threed < 180; threed+=theta) {
        radius = sinf( threed * (PI/180) );
        height = cosf( threed * (PI/180) ) * 1.0;
        
        for (float degree = 0; degree < 360; degree+=theta) {
            sphere[index++] = cosf(degree * (PI/180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf(degree * (PI/180)) * radius;
            
            sphere[index++] = cosf(degree * (PI/180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf(degree * (PI/180)) * radius;
    //1
            
            sphere[index++] = cosf((degree + theta) * (PI/180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf((degree + theta) * (PI/180)) * radius;
            
            sphere[index++] = cosf((degree + theta) * (PI/180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf((degree + theta) * (PI/180)) * radius;
    //2
        
            sphere[index++] = cosf(degree * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            sphere[index++] = cosf( (threed + theta) * (PI/180) ) * 1.0f;
            sphere[index++] = sinf(degree * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            
            sphere[index++] = cosf(degree * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            sphere[index++] = cosf( (threed + theta) * (PI/180) ) * 1.0f;
            sphere[index++] = sinf(degree * (PI/180)) * sinf( (threed + theta) * (PI/180) );
    //3
            
            sphere[index++] = cosf(degree * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            sphere[index++] = cosf( (threed + theta) * (PI/180) ) * 1.0f;
            sphere[index++] = sinf(degree * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            
            sphere[index++] = cosf(degree * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            sphere[index++] = cosf( (threed + theta) * (PI/180) ) * 1.0f;
            sphere[index++] = sinf(degree * (PI/180)) * sinf( (threed + theta) * (PI/180) );
    //4
    
            sphere[index++] = cosf((degree + theta) * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            sphere[index++] = cosf( (threed + theta) * (PI/180) ) * 1.0f;
            sphere[index++] = sinf((degree + theta) * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            
            sphere[index++] = cosf((degree + theta) * (PI/180)) * sinf( (threed + theta) * (PI/180) );
            sphere[index++] = cosf( (threed + theta) * (PI/180) ) * 1.0f;
            sphere[index++] = sinf((degree + theta) * (PI/180)) * sinf( (threed + theta) * (PI/180) );
    //5
            
            sphere[index++] = cosf((degree + theta) * (PI/180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf((degree + theta) * (PI/180)) * radius;
            
            sphere[index++] = cosf((degree + theta) * (PI/180)) * radius;
            sphere[index++] = height;
            sphere[index++] = sinf((degree + theta) * (PI/180)) * radius;
    //6
        }
        
        if (threed + theta + theta > 180)
            break;
    }
    
    sphere[index++] = 0.0f;
    sphere[index++] = height;
    sphere[index++] = 0.0f;
    
    sphere[index++] = 0.0f;
    sphere[index++] = height;
    sphere[index++] = 0.0f;
    
    radius = sinf((180-theta) * (PI/180));
    height = cosf((180-theta) * (PI/180)) * 1.0f;
    /*
    for (float threed = 0; threed <= 360; threed += theta) {
        sphere[index++] = cosf(threed * (PI/180)) * radius;
        sphere[index++] = height;
        sphere[index++] = sinf(threed * (PI/180)) * radius;
        
        terms += 6;
    }*/
    
    //NSLog(@"%i", terms);
    
    glEnable(GL_DEPTH_TEST);
    
    glGenVertexArraysOES(1, &_vertexArray);
    glBindVertexArrayOES(_vertexArray);
    
    /*
    glGenVertexArraysOES(1, &_otherArray);
    glBindVertexArrayOES(_otherArray);
    */
    
    glGenBuffers(1, &_vertexBuffer);
    glBindBuffer(GL_ARRAY_BUFFER, _vertexBuffer);
   
    glBufferData(GL_ARRAY_BUFFER, sizeof(sphere), sphere, GL_STATIC_DRAW);
    
    /*
    glGenBuffers(1, &_otherBuffer);
    glBindBuffer(GL_ARRAY_BUFFER, _otherBuffer);
    glBufferData(GL_ARRAY_BUFFER, sizeof(lines), lines, GL_STATIC_DRAW);
    */
    
    glEnableVertexAttribArray(GLKVertexAttribPosition);
    glVertexAttribPointer(GLKVertexAttribPosition, 3, GL_FLOAT, GL_FALSE, 24, BUFFER_OFFSET(0));
    
    glEnableVertexAttribArray(GLKVertexAttribNormal);
    glVertexAttribPointer(GLKVertexAttribNormal, 3, GL_FLOAT, GL_FALSE, 24, BUFFER_OFFSET(12));
    
    rotate = YES;
    
    glBindVertexArrayOES(0);
}

-(void) touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    rotate = !rotate;
}

- (void)tearDownGL
{
    [EAGLContext setCurrentContext:self.context];
    
    glDeleteBuffers(1, &_vertexBuffer);
    glDeleteVertexArraysOES(1, &_vertexArray);
    
    self.effect = nil;
    
    if (_program) {
        glDeleteProgram(_program);
        _program = 0;
    }
}

#pragma mark - GLKView and GLKViewController delegate methods

- (void)update
{
    float aspect = fabsf(self.view.bounds.size.width / self.view.bounds.size.height);
    GLKMatrix4 projectionMatrix = GLKMatrix4MakePerspective(GLKMathDegreesToRadians(65.0f), aspect, 0.1f, 100.0f);
    
    GLKMatrix4 baseModelViewMatrix = GLKMatrix4MakeTranslation(0.0f, 0.0f, -4.0f);
    //baseModelViewMatrix = GLKMatrix4Rotate(baseModelViewMatrix, _rotation, 1.0f, 0.0f, 0.0f);
    
    // Compute the model view matrix for the object rendered with GLKit
    GLKMatrix4 modelViewMatrix = GLKMatrix4MakeTranslation(0.0f, 0.0f, -1.5f);
    modelViewMatrix = GLKMatrix4Rotate(modelViewMatrix, _rotation, 1.0f, 1.0f, 1.0f);
    modelViewMatrix = GLKMatrix4Multiply(baseModelViewMatrix, modelViewMatrix);
    
    _normalMatrix = GLKMatrix3InvertAndTranspose(GLKMatrix4GetMatrix3(modelViewMatrix), NULL);
    
    _modelViewProjectionMatrix = GLKMatrix4Multiply(projectionMatrix, modelViewMatrix);
    
    if (rotate)
        _rotation += self.timeSinceLastUpdate * 0.5f;
}

- (void)glkView:(GLKView *)view drawInRect:(CGRect)rect
{
    glClearColor(0.65f, 0.65f, 0.65f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    
    glBindVertexArrayOES(_vertexArray);
    
    // Render the object with GLKit
    [self.effect prepareToDraw];
    
    //glDrawArrays(GL_TRIANGLES, 0, 36);
    
    // Render the object again with ES2
    glUseProgram(_program);
    
    glUniformMatrix4fv(uniforms[UNIFORM_MODELVIEWPROJECTION_MATRIX], 1, 0, _modelViewProjectionMatrix.m);
    glUniformMatrix3fv(uniforms[UNIFORM_NORMAL_MATRIX], 1, 0, _normalMatrix.m);
    
    //glDrawArrays(GL_TRIANGLE_STRIP, 0, 360*178*3);
    
    //glBindVertexArrayOES(_otherArray);
    glDrawArrays(GL_TRIANGLE_FAN, 0, 74);
    
    glDrawArrays(GL_TRIANGLES, 74, 6*72*35 );
}

#pragma mark -  OpenGL ES 2 shader compilation

- (BOOL)loadShaders
{
    GLuint vertShader, fragShader;
    NSString *vertShaderPathname, *fragShaderPathname;
    
    // Create shader program.
    _program = glCreateProgram();
    
    // Create and compile vertex shader.
    vertShaderPathname = [[NSBundle mainBundle] pathForResource:@"Shader" ofType:@"vsh"];
    if (![self compileShader:&vertShader type:GL_VERTEX_SHADER file:vertShaderPathname]) {
        NSLog(@"Failed to compile vertex shader");
        return NO;
    }
    
    // Create and compile fragment shader.
    fragShaderPathname = [[NSBundle mainBundle] pathForResource:@"Shader" ofType:@"fsh"];
    if (![self compileShader:&fragShader type:GL_FRAGMENT_SHADER file:fragShaderPathname]) {
        NSLog(@"Failed to compile fragment shader");
        return NO;
    }
    
    // Attach vertex shader to program.
    glAttachShader(_program, vertShader);
    
    // Attach fragment shader to program.
    glAttachShader(_program, fragShader);
    
    // Bind attribute locations.
    // This needs to be done prior to linking.
    glBindAttribLocation(_program, GLKVertexAttribPosition, "position");
    glBindAttribLocation(_program, GLKVertexAttribNormal, "normal");
    
    // Link program.
    if (![self linkProgram:_program]) {
        NSLog(@"Failed to link program: %d", _program);
        
        if (vertShader) {
            glDeleteShader(vertShader);
            vertShader = 0;
        }
        if (fragShader) {
            glDeleteShader(fragShader);
            fragShader = 0;
        }
        if (_program) {
            glDeleteProgram(_program);
            _program = 0;
        }
        
        return NO;
    }
    
    // Get uniform locations.
    uniforms[UNIFORM_MODELVIEWPROJECTION_MATRIX] = glGetUniformLocation(_program, "modelViewProjectionMatrix");
    uniforms[UNIFORM_NORMAL_MATRIX] = glGetUniformLocation(_program, "normalMatrix");
    
    // Release vertex and fragment shaders.
    if (vertShader) {
        glDetachShader(_program, vertShader);
        glDeleteShader(vertShader);
    }
    if (fragShader) {
        glDetachShader(_program, fragShader);
        glDeleteShader(fragShader);
    }
    
    return YES;
}

- (BOOL)compileShader:(GLuint *)shader type:(GLenum)type file:(NSString *)file
{
    GLint status;
    const GLchar *source;
    
    source = (GLchar *)[[NSString stringWithContentsOfFile:file encoding:NSUTF8StringEncoding error:nil] UTF8String];
    if (!source) {
        NSLog(@"Failed to load vertex shader");
        return NO;
    }
    
    *shader = glCreateShader(type);
    glShaderSource(*shader, 1, &source, NULL);
    glCompileShader(*shader);
    
#if defined(DEBUG)
    GLint logLength;
    glGetShaderiv(*shader, GL_INFO_LOG_LENGTH, &logLength);
    if (logLength > 0) {
        GLchar *log = (GLchar *)malloc(logLength);
        glGetShaderInfoLog(*shader, logLength, &logLength, log);
        NSLog(@"Shader compile log:\n%s", log);
        free(log);
    }
#endif
    
    glGetShaderiv(*shader, GL_COMPILE_STATUS, &status);
    if (status == 0) {
        glDeleteShader(*shader);
        return NO;
    }
    
    return YES;
}

- (BOOL)linkProgram:(GLuint)prog
{
    GLint status;
    glLinkProgram(prog);
    
#if defined(DEBUG)
    GLint logLength;
    glGetProgramiv(prog, GL_INFO_LOG_LENGTH, &logLength);
    if (logLength > 0) {
        GLchar *log = (GLchar *)malloc(logLength);
        glGetProgramInfoLog(prog, logLength, &logLength, log);
        NSLog(@"Program link log:\n%s", log);
        free(log);
    }
#endif
    
    glGetProgramiv(prog, GL_LINK_STATUS, &status);
    if (status == 0) {
        return NO;
    }
    
    return YES;
}

- (BOOL)validateProgram:(GLuint)prog
{
    GLint logLength, status;
    
    glValidateProgram(prog);
    glGetProgramiv(prog, GL_INFO_LOG_LENGTH, &logLength);
    if (logLength > 0) {
        GLchar *log = (GLchar *)malloc(logLength);
        glGetProgramInfoLog(prog, logLength, &logLength, log);
        NSLog(@"Program validate log:\n%s", log);
        free(log);
    }
    
    glGetProgramiv(prog, GL_VALIDATE_STATUS, &status);
    if (status == 0) {
        return NO;
    }
    
    return YES;
}

@end
