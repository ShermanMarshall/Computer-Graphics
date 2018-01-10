//
//  Controller.h
//  RR
//
//  Created by owner on 1/7/15.
//  Copyright (c) 2015 Sherman Marshall. All rights reserved.
//

#ifndef RR_Controller_h
#define RR_Controller_h


@interface Controller : NSObject


-(instancetype) initWithScreenSize: (float[]) screenSize;
-(void) handleInput: (float[]) point;

@end


#endif
