//
//  StaticClass.h
//  RCTDynamsoftBarcodeReader
//
//  Created by dynamsoft on 2022/3/23.
//

#import <Foundation/Foundation.h>
#import <DynamsoftBarcodeReader/DynamsoftBarcodeReader.h>
#import <DynamsoftCameraEnhancer/DynamsoftCameraEnhancerSDK.h>

NS_ASSUME_NONNULL_BEGIN

@interface StaticClass : NSObject

@property (nonatomic, strong) DynamsoftBarcodeReader *dbr;

@property (nonatomic, strong) DynamsoftCameraEnhancer *dce;

@property (nonatomic, strong) DCECameraView *view;

+ (StaticClass *)instance;

@end

NS_ASSUME_NONNULL_END
