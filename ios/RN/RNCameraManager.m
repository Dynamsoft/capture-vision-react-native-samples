#import "RNCamera.h"
#import "RNCameraManager.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>

@implementation RNCameraManager

RCT_EXPORT_MODULE(RNCameraManager);
RCT_EXPORT_VIEW_PROPERTY(onMountError, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDynamsoftBarcodesReader, RCTDirectEventBlock);


+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (UIView *)view
{
    return [[RNCamera alloc] initWithBridge:self.bridge];
}

- (NSDictionary *)constantsToExport
{
    return @{
             @"Type" :
                 @{@"front" : @(RNCameraTypeFront), @"back" : @(RNCameraTypeBack)},
             @"FlashMode" : @{
                     @"off" : @(RNCameraFlashModeOff),
                     @"on" : @(RNCameraFlashModeOn),
                     @"auto" : @(RNCameraFlashModeAuto),
                     @"torch" : @(RNCameraFlashModeTorch)
                     },
             @"AutoFocus" :
                 @{@"on" : @(RNCameraAutoFocusOn), @"off" : @(RNCameraAutoFocusOff)},
             @"VideoQuality": @{
                     @"2160p": @(RNCameraVideo2160p),
                     @"1080p": @(RNCameraVideo1080p),
                     @"720p": @(RNCameraVideo720p),
                     @"480p": @(RNCameraVideo4x3),
                     @"4:3": @(RNCameraVideo4x3),
                     @"288p": @(RNCameraVideo288p),
                     },
             @"Orientation": @{
                     @"auto": @(RNCameraOrientationAuto),
                     @"landscapeLeft": @(RNCameraOrientationLandscapeLeft),
                     @"landscapeRight": @(RNCameraOrientationLandscapeRight),
                     @"portrait": @(RNCameraOrientationPortrait),
                     @"portraitUpsideDown": @(RNCameraOrientationPortraitUpsideDown)
                     },
             @"DynamsoftBarcodeFormats": @{
                 @"BarcodeFormat": [[self class] validBarcodeFormat],
                 @"BarcodeFormat2": [[self class] validBarcodeFormat2]
             },
    };
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onMountError", @"onDynamsoftBarcodesReader"];
}

+ (NSDictionary *)validBarcodeFormat
{
#if __has_include(<DynamsoftBarcodeReader/DynamsoftBarcodeReader.h>)
    return @{
            @"OneD" : @(EnumBarcodeFormatONED),
            @"GS1DATABAR" : @(EnumBarcodeFormatGS1DATABAR),
            @"PDF417" : @(EnumBarcodeFormatPDF417),
            @"QR_CODE" : @(EnumBarcodeFormatQRCODE),
            @"DATA_MATRIX" : @(EnumBarcodeFormatDATAMATRIX),
            @"AZTEC" : @(EnumBarcodeFormatAZTEC),
            @"MAXICODE" : @(EnumBarcodeFormatMAXICODE),
            @"MICROQR" : @(EnumBarcodeFormatMICROQR),
            @"GS1COMPOSITE" : @(EnumBarcodeFormatGS1COMPOSITE),
            @"MICROPDF417" : @(EnumBarcodeFormatMICROPDF417),
            @"PATCHCODE" : @(EnumBarcodeFormatPATCHCODE),
            @"ALL" : @(EnumBarcodeFormatALL),
            @"NULL" : @(EnumBarcodeFormatNULL)
            };
#else
    return [NSDictionary new];
#endif
}

+ (NSDictionary *)validBarcodeFormat2
{
#if __has_include(<DynamsoftBarcodeReader/DynamsoftBarcodeReader.h>)
    return @{
            @"POSTALCODE" : @(EnumBarcodeFormat2POSTALCODE),
            @"DOTCODE" : @(EnumBarcodeFormat2DOTCODE),
            @"NONSTANDARDBARCODE" : @(EnumBarcodeFormat2NONSTANDARDBARCODE),
            @"NULL" : @(EnumBarcodeFormat2NULL)
            };
#else
    return [NSDictionary new];
#endif
}

RCT_CUSTOM_VIEW_PROPERTY(type, NSInteger, RNCamera)
{
    NSInteger newType = [RCTConvert NSInteger:json];
    if (view.presetCamera != newType) {
        [view setPresetCamera:newType];
        [view updateType];
    }
}

//RCT_CUSTOM_VIEW_PROPERTY(cameraId, NSString, RNCamera)
//{
//    NSString *newId = [RCTConvert NSString:json];
//
//    // also compare pointers so we check for nulls
//    if (view.cameraId != newId && ![view.cameraId isEqualToString:newId]) {
//        [view setCameraId:newId];
//        // using same call as setting the type here since they
//        // both require the same updates
//        [view updateType];
//    }
//}

//RCT_CUSTOM_VIEW_PROPERTY(flashMode, NSInteger, RNCamera)
//{
//    [view setFlashMode:[RCTConvert NSInteger:json]];
//    [view updateFlashMode];
//}

//RCT_CUSTOM_VIEW_PROPERTY(autoFocus, NSInteger, RNCamera)
//{
//    [view setAutoFocus:[RCTConvert NSInteger:json]];
//    [view updateFocusMode];
//}

//RCT_CUSTOM_VIEW_PROPERTY(zoom, NSNumber, RNCamera)
//{
//    [view setZoom:[RCTConvert CGFloat:json]];
//    [view updateZoom];
//}

//RCT_CUSTOM_VIEW_PROPERTY(exposure, NSNumber, RNCamera)
//{
//    [view setExposure:[RCTConvert float:json]];
//    [view updateExposure];
//}

//RCT_CUSTOM_VIEW_PROPERTY(pictureSize, NSString *, RNCamera)
//{
//    [view setPictureSize:[[self class] pictureSizes][[RCTConvert NSString:json]]];
//    [view updatePictureSize];
//}

RCT_CUSTOM_VIEW_PROPERTY(barcodeFormat, NSString, RNCamera)
{
    [view updateBarcodeFormat:json];
}

RCT_CUSTOM_VIEW_PROPERTY(barcodeFormat2, NSString, RNCamera)
{
    [view updateBarcodeFormat2:json];
}

RCT_CUSTOM_VIEW_PROPERTY(license, NSString *, RNCamera)
{
    [view setLicense:json];
}

RCT_CUSTOM_VIEW_PROPERTY(dynamsoftBarcodeReaderEnabled, BOOL, RNCamera)
{
    view.canDetectBarcodes = [RCTConvert BOOL:json];
    [view setupOrDisableBarcodeDetector];
}

RCT_EXPORT_METHOD(checkVideoAuthorizationStatus:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject) {
#ifdef DEBUG
    if (![[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSCameraUsageDescription"]) {
        RCTLogWarn(@"Checking video permissions without having key 'NSCameraUsageDescription' defined in your Info.plist. If you do not add it your app will crash when being built in release mode. You will have to add it to your Info.plist file, otherwise RNCamera is not allowed to use the camera.");
        resolve(@(NO));
        return;
    }
#endif
    __block NSString *mediaType = AVMediaTypeVideo;
    [AVCaptureDevice requestAccessForMediaType:mediaType completionHandler:^(BOOL granted) {
        resolve(@(granted));
    }];
}

//RCT_EXPORT_METHOD(resumePreview:(nonnull NSNumber *)reactTag)
//{
//#if TARGET_IPHONE_SIMULATOR
//    return;
//#endif
//    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RNCamera *> *viewRegistry) {
//        RNCamera *view = viewRegistry[reactTag];
//        if (![view isKindOfClass:[RNCamera class]]) {
//            RCTLogError(@"Invalid view returned from registry, expecting RNCamera, got: %@", view);
//        } else {
//            [view resumePreview];
//        }
//    }];
//}
//
//RCT_EXPORT_METHOD(pausePreview:(nonnull NSNumber *)reactTag)
//{
//#if TARGET_IPHONE_SIMULATOR
//    return;
//#endif
//    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RNCamera *> *viewRegistry) {
//        RNCamera *view = viewRegistry[reactTag];
//        if (![view isKindOfClass:[RNCamera class]]) {
//            RCTLogError(@"Invalid view returned from registry, expecting RNCamera, got: %@", view);
//        } else {
//            [view pausePreview];
//        }
//    }];
//}

@end
