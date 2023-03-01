//
//  DYSCameraView.m
//  RCTDynamsoftBarcodeReader
//
//  Created by dynamsoft on 2022/3/16.
//

#import "DYSCameraView.h"
#import <React/RCTLog.h>
#import "StaticClass.h"

@implementation DYSCameraView

@synthesize overlayVisible = _overlayVisible;
@synthesize scanRegionVisible = _scanRegionVisible;
@synthesize scanRegion = _scanRegion;
@synthesize torchState = _torchState;
@synthesize torchButton = _torchButton;
@synthesize cameraPosition = _cameraPosition;

- (instancetype)init {
    self = [super init];
    if (self) {
        [self addSubview:[StaticClass instance].view];
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    [StaticClass instance].view.frame = self.bounds;
}

- (void)setOverlayVisible:(BOOL)overlayVisible{
    _overlayVisible = overlayVisible;
    [StaticClass instance].view.overlayVisible = overlayVisible;
}

- (void)setScanRegionVisible:(BOOL)scanRegionVisible{
    _scanRegionVisible = scanRegionVisible;
    [StaticClass instance].dce.scanRegionVisible = scanRegionVisible;
}

- (BOOL)scanRegionVisible{
    return _scanRegionVisible;
}

- (void)setTorchState:(int)torchState{
    _torchState = torchState;
    if (torchState == 1) {
        [[StaticClass instance].dce turnOnTorch];
    }else if (torchState == 0){
        [[StaticClass instance].dce turnOffTorch];
    }
}

- (void)setTorchButton:(NSDictionary *)torchButton{
    if (torchButton) {
        _torchButton = torchButton;
        NSString *torchOnImageBase64 = [torchButton valueForKey:@"torchOnImageBase64"];
        NSString *torchOffImageBase64 = [torchButton valueForKey:@"torchOffImageBase64"];
        BOOL visible = [[torchButton valueForKey:@"visible"] boolValue];
        NSDictionary *dic = [torchButton valueForKey:@"location"];
        CGRect rect;
        if (dic) {
            NSNumber *x = [dic valueForKey:@"x"];
            NSNumber *y = [dic valueForKey:@"y"];
            NSNumber *width = [dic valueForKey:@"width"];
            NSNumber *height = [dic valueForKey:@"height"];
            rect = CGRectMake(x.floatValue, y.floatValue, width.floatValue, height.floatValue);
        }else{
            rect = CGRectMake(25, 100, 45, 45);
        }
        
        UIImage *torchOnImage, *torchOffImage;
        if (torchOnImageBase64) {
            NSData *torchOnImageData = [[NSData alloc]initWithBase64EncodedString:torchOnImageBase64 options:(NSDataBase64DecodingIgnoreUnknownCharacters)];
            torchOnImage = [UIImage imageWithData: torchOnImageData];
        }
        if (torchOffImageBase64) {
            NSData *torchOffImageData = [[NSData alloc]initWithBase64EncodedString:torchOffImageBase64 options:(NSDataBase64DecodingIgnoreUnknownCharacters)];
            torchOffImage = [UIImage imageWithData: torchOffImageData];
        }
        
        [[StaticClass instance].view setTorchButton:rect torchOnImage:torchOnImage torchOffImage:torchOffImage];
        [[StaticClass instance].view setTorchButtonVisible:visible];
    }
}

- (void)setScanRegion:(NSDictionary *)scanRegion{
    if (scanRegion) {
        _scanRegion = scanRegion;
        NSNumber *regionTop = [scanRegion valueForKey:@"regionTop"];
        NSNumber *regionLeft = [scanRegion valueForKey:@"regionLeft"];
        NSNumber *regionRight = [scanRegion valueForKey:@"regionRight"];
        NSNumber *regionBottom = [scanRegion valueForKey:@"regionBottom"];
        NSNumber *regionMeasuredByPercentage = [scanRegion valueForKey:@"regionTop"];
        iRegionDefinition *region = [iRegionDefinition new];
        region.regionTop = regionTop.integerValue;
        region.regionLeft = regionLeft.integerValue;
        region.regionRight = regionRight.integerValue;
        region.regionBottom = regionBottom.integerValue;
        region.regionMeasuredByPercentage = regionMeasuredByPercentage.integerValue;
        NSError *err;
        [[StaticClass instance].dce setScanRegion:region error:&err];
        [StaticClass instance].dce.scanRegionVisible = _scanRegionVisible;
    }
}

- (void)setCameraPosition:(int)cameraPosition{
    _cameraPosition = cameraPosition;
    NSError *error;
    if (cameraPosition == 0) {
        [[StaticClass instance].dce selectCameraWithPosition:EnumCameraPositionBack error:&error];
    }else if (cameraPosition == 1){
        [[StaticClass instance].dce selectCameraWithPosition:EnumCameraPositionFront error:&error];
    }
}

- (void)open{
    [[StaticClass instance].dce open];
}

- (void)close{
    [[StaticClass instance].dce close];
}

@end
