//
//  RCTDynamsoftBarcodeReader.m
//  RCTDynamsoftBarcodeReader
//
//  Created by dynamsoft on 2022/3/16.
//

#import "RCTDynamsoftBarcodeReader.h"
#import <React/RCTLog.h>
#import "StaticClass.h"

@interface RCTDynamsoftBarcodeReader() <DBRLicenseVerificationListener, DBRTextResultListener>

@end

@implementation RCTDynamsoftBarcodeReader
{
    bool hasListeners;
    RCTPromiseResolveBlock licenseResolve;
    RCTPromiseRejectBlock licenseReject;
}

- (instancetype)init {
    self = [super init];
    if (self) {

    }
    return self;
}

+ (BOOL)requiresMainQueueSetup{
    return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"resultEvent"];
}

-(void)startObserving {
    hasListeners = YES;
    [[StaticClass instance].dbr setDBRTextResultListener:self];
}

-(void)stopObserving {
    hasListeners = NO;
}

RCT_EXPORT_MODULE(RNDynamsoftBarcodeReader)

RCT_EXPORT_METHOD(initLicense:(NSString *)license
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
    licenseResolve = resolve;
    licenseReject = reject;
    [DynamsoftBarcodeReader initLicense:license verificationDelegate:self];
}

RCT_EXPORT_METHOD(createInstance) {
    [StaticClass instance].dbr = [DynamsoftBarcodeReader new];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSString *, getVersion) {
    return [DynamsoftBarcodeReader getVersion];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSString *, getInternalVersion) {
    return @"1.0.0";
}

RCT_EXPORT_METHOD(getSettings:(RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
    NSError *error = [NSError new];
    iPublicRuntimeSettings *settings = [[StaticClass instance].dbr getRuntimeSettings:&error];
    if (error.code != 0) {
        resolve(@(NO));
    }else{
        NSDictionary *barcode = @{
            @"barcodeFormatIds" : [NSNumber numberWithInteger:settings.barcodeFormatIds],
            @"barcodeFormatIds_2" : [NSNumber numberWithInteger:settings.barcodeFormatIds_2],
            @"expectedBarcodeCount" : [NSNumber numberWithInteger:settings.expectedBarcodesCount],
            @"timeout" : [NSNumber numberWithInteger:settings.timeout]
        };
        resolve(barcode);
    }
}

RCT_EXPORT_METHOD(resetSettings:(RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
    NSError *error = [NSError new];
    [[StaticClass instance].dbr resetRuntimeSettings:&error];
    if (error.code != 0) {
        resolve(@(NO));
    }else{
        resolve(@(YES));
    }
}

RCT_EXPORT_METHOD(outputSettings:(RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
    resolve([[StaticClass instance].dbr outputSettingsToString:@"" error:nil]);
}

RCT_EXPORT_METHOD(updateSettingsFromString:(NSString *)settings
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
    NSError *error = [NSError new];
    [[StaticClass instance].dbr initRuntimeSettingsWithString:settings conflictMode:EnumConflictModeOverwrite error:&error];
    if (error.code != 0) {
        resolve(@(NO));
    }else{
        resolve(@(YES));
    }
}

RCT_EXPORT_METHOD(updateSettingsFromDictionary:(NSDictionary *)dic
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
    if (dic) {
        NSError *error = [NSError new];
        NSNumber *barcodeFormatIds = [dic valueForKey:@"barcodeFormatIds"];
        NSNumber *barcodeFormatIds_2 = [dic valueForKey:@"barcodeFormatIds_2"];
        NSNumber *expectedBarcodeCount = [dic valueForKey:@"expectedBarcodeCount"];
        NSNumber *timeout = [dic valueForKey:@"timeout"];
        iPublicRuntimeSettings *setting = [[StaticClass instance].dbr getRuntimeSettings:nil];
        setting.barcodeFormatIds = barcodeFormatIds.integerValue;
        setting.barcodeFormatIds_2 = barcodeFormatIds_2.integerValue;
        setting.expectedBarcodesCount = expectedBarcodeCount.integerValue;
        setting.timeout = timeout.integerValue;
        
        [[StaticClass instance].dbr updateRuntimeSettings:setting error:&error];
        if (error.code != 0) {
            resolve(@(NO));
        }else{
            resolve(@(YES));
        }
    }else{
        resolve(@(NO));
    }
}

RCT_EXPORT_METHOD(updateSettingsFromNumber:(nonnull NSNumber *)number
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
    if (number) {
        if (number.integerValue < 0 || number.integerValue > 6) {
            resolve(@(NO));
            return;
        }
        [[StaticClass instance].dbr updateRuntimeSettings:(EnumPresetTemplate)number.integerValue];
        resolve(@(YES));
    }else{
        resolve(@(NO));
    }
}

RCT_EXPORT_METHOD(startBarcodeScanning) {
    [[StaticClass instance].dbr setCameraEnhancer:[StaticClass instance].dce];
    [[StaticClass instance].dbr startScanning];
}

RCT_EXPORT_METHOD(stopBarcodeScanning) {
    [[StaticClass instance].dbr stopScanning];
}

- (void)DBRLicenseVerificationCallback:(bool)isSuccess error:(NSError * _Nullable)error {
    if(isSuccess){
        licenseResolve(@(YES));
    }else{
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:error.userInfo options:0 error:nil];
        NSString *msg = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSError *err = [NSError errorWithDomain:@"com.dynamsoft.license.error" code:error.code userInfo:nil];
        NSString *code = [NSString stringWithFormat:@"%ld",(long)error.code];
        licenseReject(code, msg, err);
    }
}

- (void)textResultCallback:(NSInteger)frameId imageData:(iImageData * _Nonnull)imageData results:(NSArray<iTextResult *> * _Nullable)results {
    if (results.count > 0) {
        NSMutableArray* barcodes = [NSMutableArray array];
        NSString* formatString = @"all";
        for (iTextResult* res in results) {
            if (res.barcodeFormat_2 != EnumBarcodeFormat2NULL) {
                formatString = res.barcodeFormatString_2;
            }else{
                formatString = res.barcodeFormatString;
            }
            NSMutableArray* points = [NSMutableArray array];
            for (int i = 0; i < 4; i++) {
                NSDictionary *point = @{
                    @"x": [NSNumber numberWithFloat:[res.localizationResult.resultPoints[i] CGPointValue].x],
                    @"y": [NSNumber numberWithFloat:[res.localizationResult.resultPoints[i] CGPointValue].y]
                };
                [points addObject:point];
            }
            NSDictionary *quad = @{
                @"points" : points
            };
            NSDictionary *location = @{
                @"angle" : [NSNumber numberWithInteger:res.localizationResult.angle],
                @"location" : quad
            };
            NSDictionary *barcode = @{
                @"barcodeText" : res.barcodeText,
                @"barcodeFormatString" : formatString,
                @"barcodeLocation" : location
            };
            [barcodes addObject:barcode];
        }
        if (hasListeners) {
            [self sendEventWithName:@"resultEvent" body:[barcodes copy]];
        }
    }
}

@end
