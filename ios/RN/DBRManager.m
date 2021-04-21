#import "DBRManager.h"
#import <React/RCTConvert.h>

#define screenHeight        [[UIScreen mainScreen] nativeBounds].size.height
#if __has_include(<DynamsoftBarcodeReader/DynamsoftBarcodeReader.h>)
@interface DBRManager ()
@property(nonatomic, strong) DynamsoftBarcodeReader *barcodeReader;
@property(nonatomic, strong) iPublicRuntimeSettings *settings;

@property(nonatomic, assign) CGFloat h;
@property(nonatomic, assign) CGFloat w;
@end

@implementation DBRManager

- (instancetype)init
{
  if (self = [super init]) {
      self.barcodeReader = [[DynamsoftBarcodeReader alloc] init];
      self.settings = [self.barcodeReader getRuntimeSettings:nil];
      self.h = UIScreen.mainScreen.bounds.size.height;
      self.w = UIScreen.mainScreen.bounds.size.width;
  }
  return self;
}

- (BOOL)isRealDetector
{
  return true;
}

- (void)setDbrLicense:(NSString *)dbrLicense{
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        [self.barcodeReader setLicense:dbrLicense];
        self.settings.expectedBarcodesCount = 1;
        [self.barcodeReader updateRuntimeSettings:self.settings error:nil];
    });
}

- (void)setFormat:(id)json queue:(dispatch_queue_t)sessionQueue {
  EnumBarcodeFormat requestedValue = [RCTConvert NSInteger:json];
  if (sessionQueue) {
      dispatch_async(sessionQueue, ^{
          NSError* error = [[NSError alloc] init];
          self.settings.barcodeFormatIds = requestedValue;
          [self.barcodeReader updateRuntimeSettings:self.settings error:&error];
      });
  }
}

- (void)setFormat2:(id)json queue:(dispatch_queue_t)sessionQueue {
  EnumBarcodeFormat2 requestedValue = [RCTConvert NSInteger:json];
  if (sessionQueue) {
      dispatch_async(sessionQueue, ^{
          NSError* error = [[NSError alloc] init];
          self.settings.barcodeFormatIds_2 = requestedValue;
          [self.barcodeReader updateRuntimeSettings:self.settings error:&error];
      });
  }
}

- (void)findBarcodesInFrame:(NSData *)buffer width:(int)width height:(int)height stride:(int)stride completed:(postRecognitionBlock)completed {
    NSError* error = [[NSError alloc] init];
    NSArray<iTextResult*>* results = [self.barcodeReader decodeBuffer:buffer withWidth:width height:height stride:stride format:EnumImagePixelFormatNV21 templateName:@"" error:&error];
    NSMutableArray* barcodes = [NSMutableArray array];
    NSString* type = @"all";
    for (iTextResult* item in results) {
        if (item.barcodeFormat_2 != EnumBarcodeFormat2NULL) {
            type = item.barcodeFormatString_2;
        }else{
            type = item.barcodeFormatString;
        }
        NSMutableDictionary *barcode = [NSMutableDictionary dictionaryWithDictionary:@{
            @"type" : type,
            @"data" : item.barcodeText,
            @"format" : [NSNumber numberWithInteger:item.barcodeFormat],
            @"localizationResult" : [self pointsFromResults:item.localizationResult.resultPoints]
            }
        ];
        [barcodes addObject:barcode];
    }
    completed(barcodes);
}

- (BOOL)iPhoneXSeries{
    if (screenHeight == 2436 || screenHeight == 1792 || screenHeight == 2688 || screenHeight == 1624) {
        return YES;
    }
    return NO;
}

- (NSArray*)pointsFromResults:(NSArray*)array
{
    CGFloat kH = _h / 1920;
    CGFloat width = 0;
    if ([self iPhoneXSeries]) {
        width = MIN(_w, _h) * 1.1033;
    }else{
        width = MIN(_w, _h);
    }
    NSMutableArray* newPoints = [[NSMutableArray array] init];
    if (array.count > 0) {
        for (int i = 0; i < 4; i++) {
            CGPoint p = CGPointZero;
            p = (CGPoint){width - [array[i] CGPointValue].y * kH, [array[i] CGPointValue].x * kH};
            [newPoints addObject:[NSNumber numberWithFloat:p.x]];
            [newPoints addObject:[NSNumber numberWithFloat:p.y]];
        }
    }
    return [newPoints copy];
}

@end
#else
@interface DBRManager ()
@end

@implementation DBRManager

- (instancetype)init {
    self = [super init];
    return self;
}

- (BOOL)isRealDetector {
    return true;
}

- (void)setLicense:(NSString *)license{
}

- (void)findBarcodesInFrame:(NSData *)buffer width:(int)width height:(int)height stride:(int)stride completed:(void (^)(NSArray *result))completed;
{
    NSMutableDictionary *barcode = [NSMutableDictionary dictionaryWithDictionary:@{
        @"type" : @"no DynamsoftBarcodeReader",
        @"data" : @"no DynamsoftBarcodeReader",
        @"format" : [NSNumber numberWithInteger:0],
        @"localizationResult" : @[@0],
        }
    ];
    NSArray *barcodes = @[barcode];
    completed(barcodes);
}

- (void)setFormat:(id)json queue:(dispatch_queue_t)sessionQueue {
    
}

- (void)setFormat2:(id)json queue:(dispatch_queue_t)sessionQueue {
    
}

@end
#endif

