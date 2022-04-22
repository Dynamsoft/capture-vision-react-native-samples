//
//  DYSCameraViewManager.m
//  RCTDynamsoftBarcodeReader
//
//  Created by dynamsoft on 2022/3/16.
//

#import <React/RCTUIManager.h>
#import "DYSCameraViewManager.h"
#import "DYSCameraView.h"
#import "StaticClass.h"

@implementation DYSCameraViewManager

RCT_EXPORT_MODULE(DYSCameraView)

- (instancetype)init {
    self = [super init];
    if (self) {
        CGFloat heigth = UIScreen.mainScreen.bounds.size.height;
        CGFloat width = UIScreen.mainScreen.bounds.size.width;
        [StaticClass instance].view = [[DCECameraView alloc] initWithFrame:CGRectMake(0, 0, width, heigth)];
        [StaticClass instance].dce = [[DynamsoftCameraEnhancer alloc] initWithView:[StaticClass instance].view];
    }
    return self;
}

- (UIView *)view {
    return [[DYSCameraView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(scanRegionVisible, BOOL)
RCT_EXPORT_VIEW_PROPERTY(overlayVisible, BOOL)
RCT_EXPORT_VIEW_PROPERTY(scanRegion, NSDictionary)

RCT_EXPORT_METHOD(open:(nonnull NSNumber *)reactTag) {
    [self.bridge.uiManager addUIBlock:
     ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
         id view = viewRegistry[reactTag];
         if (!view || ![view isKindOfClass:[DYSCameraView class]]) {
             RCTLogError(@"Cannot find DYSCameraView with tag #%@", reactTag);
         } else {
             [((DYSCameraView *)view) open];
         }
     }];
}

RCT_EXPORT_METHOD(close:(nonnull NSNumber *)reactTag) {
    [self.bridge.uiManager addUIBlock:
     ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
         id view = viewRegistry[reactTag];
         if (!view || ![view isKindOfClass:[DYSCameraView class]]) {
             RCTLogError(@"Cannot find DYSCameraView with tag #%@", reactTag);
         } else {
             [((DYSCameraView *)view) close];
         }
     }];
}

RCT_EXPORT_METHOD(setScanRegion:(nonnull NSNumber *)reactTag
                  scanRegion:(NSDictionary *)scanRegion) {
    [self.bridge.uiManager addUIBlock:
     ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
         id view = viewRegistry[reactTag];
         if (!view || ![view isKindOfClass:[DYSCameraView class]]) {
             RCTLogError(@"Cannot find DYSCameraView with tag #%@", reactTag);
         } else {
             [((DYSCameraView *)view) setScanRegion:scanRegion];
         }
     }];
}

@end
