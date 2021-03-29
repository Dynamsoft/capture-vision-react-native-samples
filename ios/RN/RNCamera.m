#import "RNCamera.h"
#import "RNCameraUtils.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>

@interface RNCamera ()

@property (nonatomic, weak) RCTBridge *bridge;
@property (nonatomic, strong) id barcodeDetector;
@property (nonatomic, copy) RCTDirectEventBlock onDynamsoftBarcodesReader;
@property (nonatomic, copy) RCTDirectEventBlock onMountError;

@end

@implementation RNCamera

BOOL _sessionInterrupted = NO;


- (id)initWithBridge:(RCTBridge *)bridge
{
    if ((self = [super init])) {
        self.bridge = bridge;
        self.session = [AVCaptureSession new];
        self.sessionQueue = dispatch_queue_create("dbrCameraQueue", DISPATCH_QUEUE_SERIAL);
        self.barcodeDetector = [self createDBR];
#if !(TARGET_IPHONE_SIMULATOR)
        self.previewLayer = [AVCaptureVideoPreviewLayer layerWithSession:self.session];
        self.previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
        self.previewLayer.needsDisplayOnBoundsChange = YES;
#endif
        self.autoFocus = -1;
        self.exposure = -1;
        self.presetCamera = AVCaptureDevicePositionUnspecified;
        self.cameraId = nil;
        _sessionInterrupted = NO;
    }
    return self;
}
-(float) getMaxZoomFactor:(AVCaptureDevice*)device {
    float maxZoom;
    if(self.maxZoom > 1){
        maxZoom = MIN(self.maxZoom, device.activeFormat.videoMaxZoomFactor);
    }else{
        maxZoom = device.activeFormat.videoMaxZoomFactor;
    }
    return maxZoom;
}

- (void)onMountingError:(NSDictionary *)event
{
    if (_onMountError) {
        _onMountError(event);
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    self.previewLayer.frame = self.bounds;
    [self setBackgroundColor:[UIColor blackColor]];
    [self.layer insertSublayer:self.previewLayer atIndex:0];
}

- (void)insertReactSubview:(UIView *)view atIndex:(NSInteger)atIndex
{
    [self insertSubview:view atIndex:atIndex + 1]; // is this + 1 really necessary?
    [super insertReactSubview:view atIndex:atIndex];
    return;
}

- (void)removeReactSubview:(UIView *)subview
{
    [subview removeFromSuperview];
    [super removeReactSubview:subview];
    return;
}


- (void)willMoveToSuperview:(nullable UIView *)newSuperview;
{
    if(newSuperview != nil){

        [[NSNotificationCenter defaultCenter] addObserver:self
         selector:@selector(orientationChanged:)
             name:UIApplicationDidChangeStatusBarOrientationNotification
           object:nil];

        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sessionWasInterrupted:) name:AVCaptureSessionWasInterruptedNotification object:self.session];

        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sessionDidStartRunning:) name:AVCaptureSessionDidStartRunningNotification object:self.session];

        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sessionRuntimeError:) name:AVCaptureSessionRuntimeErrorNotification object:self.session];


        // this is not needed since RN will update our type value
        // after mount to set the camera's default, and that will already
        // this method
        // [self initializeCaptureSessionInput];
        [self startSession];
    }
    else{
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidChangeStatusBarOrientationNotification object:nil];

        [[NSNotificationCenter defaultCenter] removeObserver:self name:AVCaptureSessionWasInterruptedNotification object:self.session];

        [[NSNotificationCenter defaultCenter] removeObserver:self name:AVCaptureSessionDidStartRunningNotification object:self.session];

        [[NSNotificationCenter defaultCenter] removeObserver:self name:AVCaptureSessionRuntimeErrorNotification object:self.session];

        [self stopSession];
    }

    [super willMoveToSuperview:newSuperview];
}



// Helper to get a device from the currently set properties (type and camera id)
// might return nil if device failed to be retrieved or is invalid
-(AVCaptureDevice*)getDevice
{
    AVCaptureDevice *captureDevice;
    if(self.cameraId != nil){
        captureDevice = [RNCameraUtils deviceWithCameraId:self.cameraId];
    }
    else{
        captureDevice = [RNCameraUtils deviceWithMediaType:AVMediaTypeVideo preferringPosition:self.presetCamera];
    }
    return captureDevice;

}

// helper to return the camera's instance default preset
// this is for pictures only, and video should set another preset
// before recording.
// This default preset returns much smoother photos than High.
-(AVCaptureSessionPreset)getDefaultPreset
{
    AVCaptureSessionPreset preset = AVCaptureSessionPreset1920x1080;
    return preset;
}

- (void)lockDevice:(AVCaptureDevice *)device andApplySettings:(void (^)(void))applySettings {
    NSError *error = nil;

    if(device == nil){
        return;
    }

    if (![device lockForConfiguration:&error]) {
        if (error) {
            RCTLogError(@"%s: %@", __func__, error);
        }
        return;
}

    applySettings();

    [device unlockForConfiguration];
}

-(void)updateType
{
    [self initializeCaptureSessionInput];
    [self startSession]; // will already check if session is running
}


- (void)updateFlashMode
{
    AVCaptureDevice *device = [self.videoCaptureDeviceInput device];
    if(device == nil) {
        return;
    }

    if (self.flashMode == RNCameraFlashModeTorch) {
        if (![device hasTorch] || ![device isTorchModeSupported:AVCaptureTorchModeOn]) {
            RCTLogWarn(@"%s: device doesn't support torch mode", __func__);
            return;
        }
        [self lockDevice:device andApplySettings:^{
            [device setFlashMode:AVCaptureFlashModeOff];
            [device setTorchMode:AVCaptureTorchModeOn];
        }];
    } else {
        if (![device hasFlash] || ![device isFlashModeSupported:self.flashMode]) {
            RCTLogWarn(@"%s: device doesn't support flash mode", __func__);
            return;
        }

        [self lockDevice:device andApplySettings:^{
            if ([device isTorchActive]) {
                [device setTorchMode:AVCaptureTorchModeOff];
            }
            [device setFlashMode:self.flashMode];
        }];
    }
}

// Function to cleanup focus listeners and variables on device
// change. This is required since "defocusing" might not be
// possible on the new device, and our device reference will be
// different
- (void)cleanupFocus:(AVCaptureDevice*) previousDevice {

    // cleanup listeners if we had any
    if(previousDevice != nil){

        // remove event listener
        [[NSNotificationCenter defaultCenter] removeObserver:self name:AVCaptureDeviceSubjectAreaDidChangeNotification object:previousDevice];

        // cleanup device flags
        [self lockDevice:previousDevice andApplySettings:^{
            previousDevice.subjectAreaChangeMonitoringEnabled = NO;
        }];
    }
}

- (void)updateFocusMode
{
    AVCaptureDevice *device = [self.videoCaptureDeviceInput device];
    if ([device isFocusModeSupported:self.autoFocus]) {
        [self lockDevice:device andApplySettings:^{
            [device setFocusMode:self.autoFocus];
        }];
    }
}

- (void)updateFocusDepth
{
    AVCaptureDevice *device = [self.videoCaptureDeviceInput device];
    if (device == nil || self.autoFocus < 0 || device.focusMode != RNCameraAutoFocusOff || device.position == RNCameraTypeFront) {
        return;
    }

    if (![device respondsToSelector:@selector(isLockingFocusWithCustomLensPositionSupported)] || ![device isLockingFocusWithCustomLensPositionSupported]) {
        RCTLogWarn(@"%s: Setting focusDepth isn't supported for this camera device", __func__);
        return;
    }

    [self lockDevice:device andApplySettings:^{
        [device setFocusModeLockedWithLensPosition:self.focusDepth completionHandler:nil];
    }];
}

- (void)updateZoom {
    AVCaptureDevice *device = [self.videoCaptureDeviceInput device];
    [self lockDevice:device andApplySettings:^{
        float maxZoom = [self getMaxZoomFactor:device];
        device.videoZoomFactor = (maxZoom - 1) * self.zoom + 1;
    }];
}

/// Set the AVCaptureDevice's ISO values based on RNCamera's 'exposure' value,
/// which is a float between 0 and 1 if defined by the user or -1 to indicate that no
/// selection is active. 'exposure' gets mapped to a valid ISO value between the
/// device's min/max-range of ISO-values.
///
/// The exposure gets reset every time the user manually sets the autofocus-point in
/// 'updateAutoFocusPointOfInterest' automatically. Currently no explicit event is fired.
/// This leads to two 'exposure'-states: one here and one in the component, which is
/// fine. 'exposure' here gets only synced if 'exposure' on the js-side changes. You
/// can manually keep the state in sync by setting 'exposure' in your React-state
/// everytime the js-updateAutoFocusPointOfInterest-function gets called.
- (void)updateExposure
{
    AVCaptureDevice *device = [self.videoCaptureDeviceInput device];
    [self lockDevice:device andApplySettings:^{
        // Check that either no explicit exposure-val has been set yet
        // or that it has been reset. Check for > 1 is only a guard.
        if(self.exposure < 0 || self.exposure > 1){
            [device setExposureMode:AVCaptureExposureModeContinuousAutoExposure];
            return;
        }

        // Lazy init of range.
        if(!self.exposureIsoMin){ self.exposureIsoMin = device.activeFormat.minISO; }
        if(!self.exposureIsoMax){ self.exposureIsoMax = device.activeFormat.maxISO; }

        // Get a valid ISO-value in range from min to max. After we mapped the exposure
        // (a val between 0 - 1), the result gets corrected by the offset from 0, which
        // is the min-ISO-value.
        float appliedExposure = (self.exposureIsoMax - self.exposureIsoMin) * self.exposure + self.exposureIsoMin;

        // Make sure we're in AVCaptureExposureModeCustom, else the ISO + duration time won't apply.
        // Also make sure the device can set exposure
        if([device isExposureModeSupported:AVCaptureExposureModeCustom]){
            if(device.exposureMode != AVCaptureExposureModeCustom){
                [device setExposureMode:AVCaptureExposureModeCustom];
            }

            // Only set the ISO for now, duration will be default as a change might affect frame rate.
            @try{
                [device setExposureModeCustomWithDuration:AVCaptureExposureDurationCurrent ISO:appliedExposure completionHandler:nil];
            }
            @catch(NSException *exception){
                RCTLogError(@"Failed to update exposure: %@", exception);
            }

        } else {
            RCTLog(@"Device does not support AVCaptureExposureModeCustom");
        }
    }];
}

- (void)updatePictureSize
{
    // make sure to call this function so the right default is used if
    // "None" is used
    AVCaptureSessionPreset preset = [self getDefaultPreset];
    if (self.session.sessionPreset != preset) {
        [self updateSessionPreset: preset];
    }
}

- (void)resumePreview
{
    [[self.previewLayer connection] setEnabled:YES];
}

- (void)pausePreview
{
    [[self.previewLayer connection] setEnabled:NO];
}

- (void)startSession
{
#if TARGET_IPHONE_SIMULATOR
    return;
#endif
    dispatch_async(self.sessionQueue, ^{

        // if session already running, also return and fire ready event
        // this is helpfu when the device type or ID is changed and we must
        // receive another ready event (like Android does)
        if(self.session.isRunning){
            return;
        }

        // if camera not set (invalid type and no ID) return.
        if (self.presetCamera == AVCaptureDevicePositionUnspecified && self.cameraId == nil) {
            return;
        }

        // video device was not initialized, also return
        if(self.videoCaptureDeviceInput == nil){
            return;
        }

        _sessionInterrupted = NO;
        [self.session startRunning];
    });
}

- (void)stopSession
{
#if TARGET_IPHONE_SIMULATOR
    return;
#endif
    dispatch_async(self.sessionQueue, ^{
        if ([self.barcodeDetector isRealDetector]) {
            [self stopBarcodeDetection];
        }
        [self.previewLayer removeFromSuperlayer];
        [self.session commitConfiguration];
        [self.session stopRunning];

        for (AVCaptureInput *input in self.session.inputs) {
            [self.session removeInput:input];
        }

        for (AVCaptureOutput *output in self.session.outputs) {
            [self.session removeOutput:output];
        }

        // clean these up as well since we've removed
        // all inputs and outputs from session
        self.videoCaptureDeviceInput = nil;
    });
}

- (void)initializeCaptureSessionInput
{
    dispatch_async(self.sessionQueue, ^{

        // Do all camera initialization in the session queue
        // to prevent it from
        AVCaptureDevice *captureDevice = [self getDevice];

        // if setting a new device is the same we currently have, nothing to do
        // return.
        if(self.videoCaptureDeviceInput != nil && captureDevice != nil && [self.videoCaptureDeviceInput.device.uniqueID isEqualToString:captureDevice.uniqueID]){
            return;
        }

        // if the device we are setting is also invalid/nil, return
        if(captureDevice == nil){
            [self onMountingError:@{@"message": @"Invalid camera device."}];
            return;
        }

        // get orientation also in our session queue to prevent
        // race conditions and also blocking the main thread
        __block UIInterfaceOrientation interfaceOrientation;

        dispatch_sync(dispatch_get_main_queue(), ^{
            interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];
        });

        AVCaptureVideoOrientation orientation = [RNCameraUtils videoOrientationForInterfaceOrientation:interfaceOrientation];


        [self.session beginConfiguration];

        NSError *error = nil;
        AVCaptureDeviceInput *captureDeviceInput = [AVCaptureDeviceInput deviceInputWithDevice:captureDevice error:&error];

        if(error != nil){
            NSLog(@"Capture device error %@", error);
        }

        if (error || captureDeviceInput == nil) {
            RCTLog(@"%s: %@", __func__, error);
            [self.session commitConfiguration];
            [self onMountingError:@{@"message": @"Failed to setup capture device."}];
            return;
        }


        // Do additional cleanup that might be needed on the
        // previous device, if any.
        AVCaptureDevice *previousDevice = self.videoCaptureDeviceInput != nil ? self.videoCaptureDeviceInput.device : nil;

        [self cleanupFocus:previousDevice];


        // Remove inputs
        [self.session removeInput:self.videoCaptureDeviceInput];

        // clear this variable before setting it again.
        // Otherwise, if setting fails, we end up with a stale value.
        // and we are no longer able to detect if it changed or not
        self.videoCaptureDeviceInput = nil;

        // setup our capture preset based on what was set from RN
        // and our defaults
        // if the preset is not supported (e.g., when switching cameras)
        // canAddInput below will fail
        self.session.sessionPreset = [self getDefaultPreset];


        // reset iso cached values, these might be different
        // from camera to camera. Otherwise, the camera may crash
        // when changing cameras and exposure.
        self.exposureIsoMin = 0;
        self.exposureIsoMax = 0;


        if ([self.session canAddInput:captureDeviceInput]) {
            [self.session addInput:captureDeviceInput];

            self.videoCaptureDeviceInput = captureDeviceInput;

            // Update all these async after our session has commited
            // since some values might be changed on session commit.
            dispatch_async(self.sessionQueue, ^{
                [self updateZoom];
                [self updateFocusMode];
                [self updateFocusDepth];
                [self updateExposure];
                [self updateFlashMode];
            });

            [self.previewLayer.connection setVideoOrientation:orientation];
        }
        else{
            RCTLog(@"The selected device does not work with the Preset [%@] or configuration provided", self.session.sessionPreset);

            [self onMountingError:@{@"message": @"Camera device does not support selected settings."}];
        }

        [self.session commitConfiguration];
    });
}

#pragma mark - internal

- (void)updateSessionPreset:(AVCaptureSessionPreset)preset
{
#if !(TARGET_IPHONE_SIMULATOR)
    if ([preset integerValue] < 0) {
        return;
    }
    if (preset) {
        if ([preset isEqual:AVCaptureSessionPresetPhoto]) {
            RCTLog(@"AVCaptureSessionPresetPhoto not supported during face detection. Falling back to AVCaptureSessionPresetHigh");
            preset = AVCaptureSessionPresetHigh;
        }
        dispatch_async(self.sessionQueue, ^{
            if ([self.session canSetSessionPreset:preset]) {
                [self.session beginConfiguration];
                self.session.sessionPreset = preset;
                [self.session commitConfiguration];

                // Need to update these since it gets reset on preset change
                [self updateFlashMode];
                [self updateZoom];
            }
            else{
                RCTLog(@"The selected preset [%@] does not work with the current session.", preset);
            }
        });
    }
#endif
}

// session interrupted events
- (void)sessionWasInterrupted:(NSNotification *)notification
{
    // Mark session interruption
    _sessionInterrupted = YES;

    // get event info and fire RN event if our session was interrupted
    // due to audio being taken away.
    NSDictionary *userInfo = notification.userInfo;
    NSInteger type = [[userInfo valueForKey:AVCaptureSessionInterruptionReasonKey] integerValue];
    NSLog(@"AVCaptureSessionInterruptionReasonKey : %ld",(long)type);
}


// update flash and our interrupted flag on session resume
- (void)sessionDidStartRunning:(NSNotification *)notification
{
    //NSLog(@"sessionDidStartRunning Was interrupted? %d", _sessionInterrupted);

    if(_sessionInterrupted){
        // resume flash value since it will be resetted / turned off
        dispatch_async(self.sessionQueue, ^{
            [self updateFlashMode];
        });
    }

    _sessionInterrupted = NO;
}

- (void)sessionRuntimeError:(NSNotification *)notification
{
    // Manually restarting the session since it must
    // have been stopped due to an error.
    dispatch_async(self.sessionQueue, ^{
         _sessionInterrupted = NO;
        [self.session startRunning];
    });
}

- (void)orientationChanged:(NSNotification *)notification
{
    UIInterfaceOrientation orientation = [[UIApplication sharedApplication] statusBarOrientation];
    [self changePreviewOrientation:orientation];
}

- (void)changePreviewOrientation:(UIInterfaceOrientation)orientation
{
    __weak typeof(self) weakSelf = self;
    AVCaptureVideoOrientation videoOrientation = [RNCameraUtils videoOrientationForInterfaceOrientation:orientation];
    dispatch_async(dispatch_get_main_queue(), ^{
        __strong typeof(self) strongSelf = weakSelf;
        if (strongSelf && strongSelf.previewLayer.connection.isVideoOrientationSupported) {
            [strongSelf.previewLayer.connection setVideoOrientation:videoOrientation];
        }
    });
}

- (void)cleanupCamera {
    if ([self.barcodeDetector isRealDetector]) {
        [self setupOrDisableBarcodeDetector];
    }

    // reset preset to current default
    AVCaptureSessionPreset preset = [self getDefaultPreset];
    if (self.session.sessionPreset != preset) {
        [self updateSessionPreset: preset];
    }
}

# pragma mark - DynamsoftBarcodeReader

-(id)createDBR
{
    Class dbrMannagerClass = NSClassFromString(@"DBRManager");
    return [[dbrMannagerClass alloc] init];
}

- (void)setupOrDisableBarcodeDetector
{
    if (self.canDetectBarcodes && [self.barcodeDetector isRealDetector]){
        AVCaptureSessionPreset preset = AVCaptureSessionPreset1920x1080;
        self.session.sessionPreset = preset;
        if (!self.videoDataOutput) {
            self.videoDataOutput = [[AVCaptureVideoDataOutput alloc] init];
            if (![self.session canAddOutput:_videoDataOutput]) {
                NSLog(@"Failed to setup video data output");
                [self stopBarcodeDetection];
                return;
            }

            NSDictionary *rgbOutputSettings = [NSDictionary
                                               dictionaryWithObject:[NSNumber numberWithInt:kCVPixelFormatType_420YpCbCr8BiPlanarFullRange]
                                               forKey:(id)kCVPixelBufferPixelFormatTypeKey];
            [self.videoDataOutput setVideoSettings:rgbOutputSettings];
            [self.videoDataOutput setAlwaysDiscardsLateVideoFrames:YES];
            [self.videoDataOutput setSampleBufferDelegate:self queue:self.sessionQueue];
            [self.session addOutput:_videoDataOutput];
        }
    } else {
        [self stopBarcodeDetection];
    }
}

- (void)stopBarcodeDetection
{
    if (self.videoDataOutput) {
        [self.session removeOutput:self.videoDataOutput];
    }
//    AVCaptureSessionPreset preset = [self getDefaultPreset];
//    if (self.session.sessionPreset != preset) {
//        [self updateSessionPreset: preset];
//    }
}

- (void)updateBarcodeFormat:(id)requestedFormats
{
    [self.barcodeDetector setFormat:requestedFormats queue:self.sessionQueue];
}

- (void)updateBarcodeFormat2:(id)requestedFormats2
{
    [self.barcodeDetector setFormat2:requestedFormats2 queue:self.sessionQueue];
}

- (void)setLicense:(id)license
{
    if ([self.barcodeDetector isRealDetector]) {
        [self.barcodeDetector setDbrLicense:[RCTConvert NSString:license]];
    }
}

- (void)onBarcodesDetected:(NSDictionary *)event
{
    if (_onDynamsoftBarcodesReader && _session) {
        _onDynamsoftBarcodesReader(event);
    }
}

# pragma mark - captureOutput

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer fromConnection:(AVCaptureConnection *)connection
{
    
    if (![self.barcodeDetector isRealDetector]) {
        NSLog(@"failing real check");
        return;
    }
    
    BOOL canSubmitForBarcodeDetection = self.canDetectBarcodes && [self.barcodeDetector isRealDetector];
    if (canSubmitForBarcodeDetection) {
        CVImageBufferRef imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
        CVPixelBufferLockBaseAddress(imageBuffer, kCVPixelBufferLock_ReadOnly);
        size_t bpr = CVPixelBufferGetBytesPerRowOfPlane(imageBuffer, 0);       //y
        int width = (int)CVPixelBufferGetWidthOfPlane(imageBuffer, 0);         //y
        int height = (int)CVPixelBufferGetHeightOfPlane(imageBuffer, 0);       //y
        void *baseAddress = CVPixelBufferGetBaseAddressOfPlane(imageBuffer, 0);
        CVPixelBufferUnlockBaseAddress(imageBuffer, kCVPixelBufferLock_ReadOnly);
        NSData *buffer = [NSData dataWithBytes:baseAddress length:height*bpr];
        [self.barcodeDetector findBarcodesInFrame:buffer width:width height:height stride:(int)bpr completed:^(NSArray * barcodes) {
            NSDictionary *eventBarcode = @{@"type" : @"barcode", @"barcodes" : barcodes};
            [self onBarcodesDetected:eventBarcode];
        }];
    }
}

@end
