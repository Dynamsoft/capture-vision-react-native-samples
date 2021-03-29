#import <UIKit/UIKit.h>
#if __has_include(<DynamsoftBarcodeReader/DynamsoftBarcodeReader.h>)
    #import <DynamsoftBarcodeReader/DynamsoftBarcodeReader.h>
#endif
@interface DBRManager : NSObject
typedef void(^postRecognitionBlock)(NSArray *barcodes);

@property(nonatomic, strong) NSString *dbrLicense;
- (instancetype)init;
- (BOOL)isRealDetector;
- (void)setFormat:(id)json queue:(dispatch_queue_t)sessionQueue;
- (void)setFormat2:(id)json queue:(dispatch_queue_t)sessionQueue;
- (void)findBarcodesInFrame:(NSData *)buffer width:(int)width height:(int)height stride:(int)stride completed:(postRecognitionBlock)completed;

@end 
