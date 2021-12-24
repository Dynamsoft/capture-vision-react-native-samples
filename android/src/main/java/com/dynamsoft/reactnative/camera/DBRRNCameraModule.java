package com.dynamsoft.reactnative.camera;

import com.dynamsoft.dbr.EnumBarcodeFormat;
import com.dynamsoft.dbr.EnumBarcodeFormat_2;
import com.facebook.react.bridge.*;

import com.dynamsoft.reactnative.camera.utils.ScopedContext;

import javax.annotation.Nullable;
import java.util.Collections;
import java.util.Map;
import java.util.HashMap;


public class DBRRNCameraModule extends ReactContextBaseJavaModule {
  private static final String TAG = "DBRRNCameraModule";

  private ScopedContext mScopedContext;
  static final int VIDEO_2160P = 0;
  static final int VIDEO_1080P = 1;
  static final int VIDEO_720P = 2;
  static final int VIDEO_480P = 3;
  static final int VIDEO_4x3 = 4;

  public DBRRNCameraModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mScopedContext = new ScopedContext(reactContext);
  }

  public ScopedContext getScopedContext() {
    return mScopedContext;
  }

  @Override
  public String getName() {
    return "DBRRNCameraModule";
  }

  @Nullable
  @Override
  public Map<String, Object> getConstants() {
    return Collections.unmodifiableMap(new HashMap<String, Object>() {
      {
        put("Type", getTypeConstants());
        put("FlashMode", getFlashModeConstants());
        put("AutoFocus", getAutoFocusConstants());
        put("WhiteBalance", getWhiteBalanceConstants());
        put("VideoQuality", getVideoQualityConstants());
        put("DynamsoftBarcodeFormats", Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("BarcodeFormat", getEnumBarcodeFormat());
            put("BarcodeFormat2", getEnumBarcodeFormat2());
          }
        }));
        put("Orientation", Collections.unmodifiableMap(new HashMap<String, Object>() {
            {
              put("auto", Constants.ORIENTATION_AUTO);
              put("portrait", Constants.ORIENTATION_UP);
              put("portraitUpsideDown", Constants.ORIENTATION_DOWN);
              put("landscapeLeft", Constants.ORIENTATION_LEFT);
              put("landscapeRight", Constants.ORIENTATION_RIGHT);
            }
        }));
      }

      private Map<String, Object> getEnumBarcodeFormat() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("OneD", EnumBarcodeFormat.BF_ONED);
            put("DATA_MATRIX", EnumBarcodeFormat.BF_DATAMATRIX);
            put("QR_CODE", EnumBarcodeFormat.BF_QR_CODE);
            put("PDF417", EnumBarcodeFormat.BF_PDF417);
            put("AZTEC", EnumBarcodeFormat.BF_AZTEC);
            put("ALL", EnumBarcodeFormat.BF_ALL);
            put("NULL", EnumBarcodeFormat.BF_NULL);
          }
        });
      }

      private Map<String, Object> getEnumBarcodeFormat2() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("POSTALCODE", EnumBarcodeFormat_2.BF2_POSTALCODE);
            put("DOTCODE", EnumBarcodeFormat_2.BF2_DOTCODE);
            put("NONSTANDARDBARCODE", EnumBarcodeFormat_2.BF2_NONSTANDARD_BARCODE);
            put("NULL", EnumBarcodeFormat_2.BF2_NULL);
          }
        });
      }

      private Map<String, Object> getTypeConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("front", Constants.FACING_FRONT);
            put("back", Constants.FACING_BACK);
          }
        });
      }

      private Map<String, Object> getFlashModeConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("off", Constants.FLASH_OFF);
            put("on", Constants.FLASH_ON);
            put("auto", Constants.FLASH_AUTO);
            put("torch", Constants.FLASH_TORCH);
          }
        });
      }

      private Map<String, Object> getAutoFocusConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("on", true);
            put("off", false);
          }
        });
      }

      private Map<String, Object> getWhiteBalanceConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("auto", Constants.WB_AUTO);
            put("cloudy", Constants.WB_CLOUDY);
            put("sunny", Constants.WB_SUNNY);
            put("shadow", Constants.WB_SHADOW);
            put("fluorescent", Constants.WB_FLUORESCENT);
            put("incandescent", Constants.WB_INCANDESCENT);
          }
        });
      }

      private Map<String, Object> getVideoQualityConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
          {
            put("2160p", VIDEO_2160P);
            put("1080p", VIDEO_1080P);
            put("720p", VIDEO_720P);
            put("480p", VIDEO_480P);
            put("4:3", VIDEO_4x3);
          }
        });
      }

    });
  }

//    @ReactMethod
//    public void pausePreview(final int viewTag) {
//        final ReactApplicationContext context = getReactApplicationContext();
//        UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
//        uiManager.addUIBlock(new UIBlock() {
//            @Override
//            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
//                final RNCameraView cameraView;
//
//                try {
//                    cameraView = (RNCameraView) nativeViewHierarchyManager.resolveView(viewTag);
//                    if (cameraView.isCameraOpened()) {
//                        cameraView.pausePreview();
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            }
//        });
//    }
//
//    @ReactMethod
//    public void resumePreview(final int viewTag) {
//        final ReactApplicationContext context = getReactApplicationContext();
//        UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
//        uiManager.addUIBlock(new UIBlock() {
//            @Override
//            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
//                final RNCameraView cameraView;
//
//                try {
//                    cameraView = (RNCameraView) nativeViewHierarchyManager.resolveView(viewTag);
//                    if (cameraView.isCameraOpened()) {
//                        cameraView.resumePreview();
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            }
//        });
//    }
//
//
//  @ReactMethod
//  public void getCameraIds(final int viewTag, final Promise promise) {
//      final ReactApplicationContext context = getReactApplicationContext();
//      UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
//      uiManager.addUIBlock(new UIBlock() {
//          @Override
//          public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
//              final RNCameraView cameraView;
//              try {
//                  cameraView = (RNCameraView) nativeViewHierarchyManager.resolveView(viewTag);
//                  WritableArray result = Arguments.createArray();
//                  List<Properties> ids = cameraView.getCameraIds();
//                  for (Properties p : ids) {
//                      WritableMap m = new WritableNativeMap();
//                      m.putString("id", p.getProperty("id"));
//                      m.putInt("type", Integer.valueOf(p.getProperty("type")));
//                      result.pushMap(m);
//                  }
//                  promise.resolve(result);
//              } catch (Exception e) {
//                  e.printStackTrace();
//                  promise.reject("E_CAMERA_FAILED", e.getMessage());
//              }
//          }
//      });
//  }
}
