//
//  StaticClass.m
//  RCTDynamsoftBarcodeReader
//
//  Created by dynamsoft on 2022/3/23.
//

#import "StaticClass.h"

@implementation StaticClass

+ (StaticClass *)instance{
    static StaticClass *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [super allocWithZone:NULL];
    });
    return instance;
}

@end
