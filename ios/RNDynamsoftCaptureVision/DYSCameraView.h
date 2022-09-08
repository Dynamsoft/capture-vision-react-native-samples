//
//  DYSCameraView.h
//  RCTDynamsoftBarcodeReader
//
//  Created by dynamsoft on 2022/3/16.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

NS_ASSUME_NONNULL_BEGIN

@interface DYSCameraView : UIView

@property (nonatomic, assign) BOOL scanRegionVisible;

@property (nonatomic, assign) BOOL overlayVisible;

@property (nonatomic, assign) int torchState;

@property (nonatomic, strong, nullable) NSDictionary *scanRegion;

@property (nonatomic, strong, nullable) NSDictionary *torchButton;

@property (nonatomic, assign) int cameraPosition;

- (void)open;
- (void)close;

@end

NS_ASSUME_NONNULL_END
