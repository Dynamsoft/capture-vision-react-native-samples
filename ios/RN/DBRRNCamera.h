#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import "DBRManager.h"

@class DBRRNCamera;
NS_ASSUME_NONNULL_BEGIN
@interface DBRRNCamera : UIView <AVCaptureVideoDataOutputSampleBufferDelegate>

@property(nonatomic, strong) dispatch_queue_t sessionQueue;
@property(nonatomic, strong) AVCaptureSession *session;
@property(nonatomic, strong) AVCaptureDeviceInput *videoCaptureDeviceInput;
@property(nonatomic, strong) AVCaptureVideoDataOutput *videoDataOutput;
@property(nonatomic, strong) AVCaptureVideoPreviewLayer *previewLayer;
@property(nonatomic, strong) id runtimeErrorHandlingObserver;
@property(nonatomic, assign) NSInteger presetCamera;
@property(nonatomic, copy) NSString *cameraId; // copy required for strings/pointers
@property(assign, nonatomic) NSInteger flashMode;
@property(assign, nonatomic) CGFloat zoom;
@property(assign, nonatomic) CGFloat maxZoom;
@property(assign, nonatomic) NSInteger autoFocus;
@property(assign, nonatomic) float focusDepth;
@property(assign, nonatomic) float exposure;
@property(assign, nonatomic) float exposureIsoMin;
@property(assign, nonatomic) float exposureIsoMax;
@property(assign, nonatomic) AVCaptureSessionPreset pictureSize;
@property(nonatomic, assign) BOOL canDetectBarcodes;

@property(assign, nonatomic, nullable) NSNumber *deviceOrientation;
@property(assign, nonatomic, nullable) NSNumber *orientation;

- (id)initWithBridge:(RCTBridge *)bridge;
- (void)updateType;
- (void)updateFlashMode;
- (void)updateFocusMode;
- (void)updateFocusDepth;
- (void)updateZoom;
- (void)updateExposure;
- (void)updatePictureSize;
// Dynamsoft Barcode
- (void)updateBarcodeFormat:(id)requestedFormats;
- (void)updateBarcodeFormat2:(id)requestedFormats2;
- (void)setLicense:(id)license;
- (void)resumePreview;
- (void)pausePreview;
- (void)setupOrDisableBarcodeDetector;
- (void)onMountingError:(NSDictionary *)event;
- (void)onBarcodesDetected:(NSDictionary *)event;

@end
NS_ASSUME_NONNULL_END
