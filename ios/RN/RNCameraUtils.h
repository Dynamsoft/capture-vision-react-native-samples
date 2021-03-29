#import <UIKit/UIKit.h>
#import "RNCameraManager.h"

@interface RNCameraUtils : NSObject

// Camera utilities
+ (AVCaptureDevice *)deviceWithMediaType:(NSString *)mediaType preferringPosition:(AVCaptureDevicePosition)position;

+ (AVCaptureDevice *)deviceWithCameraId:(NSString *)cameraId;

// Enum conversions
+ (NSString *)captureSessionPresetForVideoResolution:(RNCameraVideoResolution)resolution;
+ (AVCaptureVideoOrientation)videoOrientationForDeviceOrientation:(UIDeviceOrientation)orientation;
+ (AVCaptureVideoOrientation)videoOrientationForInterfaceOrientation:(UIInterfaceOrientation)orientation;

// Text and Face detector utilities
+ (UIImage *)convertBufferToUIImage:(CMSampleBufferRef)sampleBuffer previewSize:(CGSize)previewSize position:(NSInteger)position;

@end

