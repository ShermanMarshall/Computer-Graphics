//
//  GameViewController.h
//  RR
//
//  Created by owner on 1/7/15.
//  Copyright (c) 2015 Sherman Marshall. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <GLKit/GLKit.h>
#import "Sphere.h"

@interface GameViewController : GLKViewController
@property Sphere* sphereMaker;
@end
