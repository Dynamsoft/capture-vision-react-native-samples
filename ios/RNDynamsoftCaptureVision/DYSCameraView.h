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

@property (nonatomic) BOOL scanRegionVisible;

@property (nonatomic) BOOL overlayVisible;

@property (nonatomic, strong, nullable) NSDictionary *scanRegion;

- (void)open;
- (void)close;

@end

NS_ASSUME_NONNULL_END
