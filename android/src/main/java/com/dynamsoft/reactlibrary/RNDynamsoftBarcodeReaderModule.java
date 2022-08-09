
package com.dynamsoft.reactlibrary;

import android.app.Activity;
import android.util.Log;

import com.dynamsoft.dbr.BarcodeReader;
import com.dynamsoft.dbr.BarcodeReaderException;
import com.dynamsoft.dbr.DBRLicenseVerificationListener;
import com.dynamsoft.dbr.EnumBarcodeFormat_2;
import com.dynamsoft.dbr.EnumConflictMode;
import com.dynamsoft.dbr.EnumPresetTemplate;
import com.dynamsoft.dbr.ImageData;
import com.dynamsoft.dbr.LocalizationResult;
import com.dynamsoft.dbr.Point;
import com.dynamsoft.dbr.PublicRuntimeSettings;
import com.dynamsoft.dbr.TextResult;
import com.dynamsoft.dbr.TextResultListener;
import com.dynamsoft.dce.CameraEnhancer;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;


public class RNDynamsoftBarcodeReaderModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext mReactContext;

    public BarcodeReader mReader;
    public boolean mIsCameraAttached;
    public CameraEnhancer mCamera;

    public RNDynamsoftBarcodeReaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mIsCameraAttached = false;
    }

    @Override
    public String getName() {
        return "RNDynamsoftBarcodeReader";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return Collections.unmodifiableMap(new HashMap<String, Object>() {
            {
                put("TorchState", getFlashModeConstants());
            }

            private Map<String, Object> getFlashModeConstants() {
                return Collections.unmodifiableMap(new HashMap<String, Object>() {
                    {
                        put("off", Constants.TORCH_OFF);
                        put("on", Constants.TORCH_ON);
                    }
                });
            }

        });
    }

    @ReactMethod
    public void initLicense(String license, final Promise promise) {
        BarcodeReader.initLicense(license, new DBRLicenseVerificationListener() {
            @Override
            public void DBRLicenseVerificationCallback(boolean b, Exception e) {
                if (b) {
                    promise.resolve(true);
                } else {
                    BarcodeReaderException be = (BarcodeReaderException) e;
                    promise.reject(be.getErrorCode() + "", e);
                }
            }
        });
    }

    @ReactMethod
    public void createInstance() {
        if(mReader == null) {
            try {
                mReader = new BarcodeReader();
            } catch (BarcodeReaderException e) {
                e.printStackTrace();
            }
        }
        if (mCamera != null && !mIsCameraAttached) {
            mIsCameraAttached = true;
            mReader.setCameraEnhancer(mCamera);
        }
    }

    @ReactMethod
    public void getVersion(Promise promise) {
        promise.resolve(mReader.getVersion());
    }

    @ReactMethod
    public void addResultListener() {
        mReader.setTextResultListener(new TextResultListener() {
            @Override
            public void textResultCallback(int i, ImageData imageData, final TextResult[] textResults) {
                WritableArray results = serializeResults(textResults);
                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(
                        "resultEvent",
                        results);
            }
        });
    }

    @ReactMethod
    public void addListener(String eventName) {

    }

    @ReactMethod
    public void removeListeners(Integer count) {

    }

    @ReactMethod
    public void startBarcodeScanning() {
        if (mCamera != null && !mIsCameraAttached) {
            mReader.setCameraEnhancer(mCamera);
            mIsCameraAttached = true;
        }
        mReader.startScanning();
    }

    @ReactMethod
    public void stopBarcodeScanning() {
        mReader.stopScanning();
    }

    @ReactMethod
    public void updateSettingsFromDictionary(ReadableMap map, Promise promise) {
        if (map == null) {
            promise.resolve(false);
            return;
        }
        try {
            PublicRuntimeSettings settings = mReader.getRuntimeSettings();
            settings.barcodeFormatIds = map.getInt("barcodeFormatIds");
            settings.barcodeFormatIds_2 = map.getInt("barcodeFormatIds_2");
            settings.expectedBarcodesCount = map.getInt("expectedBarcodesCount");
            settings.timeout = map.getInt("timeout");
            mReader.updateRuntimeSettings(settings);
            promise.resolve(true);
        } catch (BarcodeReaderException e) {
            e.printStackTrace();
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void updateSettingsFromNumber(int PresetTpl, Promise promise) {
        if (PresetTpl >= 0 && PresetTpl <= 6) {
            mReader.updateRuntimeSettings(EnumPresetTemplate.fromValue(PresetTpl));
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void updateSettingsFromString(String settingsStr, Promise promise) {
        try {
            mReader.initRuntimeSettingsWithString(settingsStr, EnumConflictMode.CM_OVERWRITE);
            promise.resolve(true);
        } catch (BarcodeReaderException e) {
            e.printStackTrace();
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void resetSettings(Promise promise) {
        try {
            mReader.resetRuntimeSettings();
        } catch (BarcodeReaderException e) {
            e.printStackTrace();
            promise.resolve(false);
        }
        promise.resolve(true);
    }

    @ReactMethod
    public void outputSettings(Promise promise) {
        try {
            promise.resolve(mReader.outputSettingsToString(""));
        } catch (BarcodeReaderException e) {
            e.printStackTrace();
            promise.reject(e.getErrorCode() + "", e.getCause());
        }
    }

    @ReactMethod
    public void getSettings(Promise promise) {
        WritableMap settingsMap = Arguments.createMap();
        try {
            PublicRuntimeSettings settings = mReader.getRuntimeSettings();
            settingsMap.putInt("barcodeFormatIds", settings.barcodeFormatIds);
            settingsMap.putInt("barcodeFormatIds_2", settings.barcodeFormatIds_2);
            settingsMap.putInt("expectedBarcodesCount", settings.expectedBarcodesCount);
            settingsMap.putInt("timeout", settings.timeout);
        } catch (BarcodeReaderException e) {
            e.printStackTrace();
            promise.reject(e.getErrorCode() + "", e.getCause());
        }
        promise.resolve(settingsMap);
        // return settingsMap;
    }

    private WritableArray serializeResults(TextResult[] barcodes) {
        WritableArray barcodeList = Arguments.createArray();

        for (int i = 0; i < barcodes.length; i++) {
            TextResult barcode = barcodes[i];
            WritableMap serializedBarcode = Arguments.createMap();

            if (barcode.barcodeFormat_2 != EnumBarcodeFormat_2.BF2_NULL) {
                serializedBarcode.putString("barcodeFormatString", barcode.barcodeFormatString_2);
            } else {
                serializedBarcode.putString("barcodeFormatString", barcode.barcodeFormatString);
            }
            serializedBarcode.putString("barcodeText", barcode.barcodeText);
            serializedBarcode.putMap("barcodeLocation", handleLocationResult(barcode.localizationResult));
            barcodeList.pushMap(serializedBarcode);
        }

        return barcodeList;
    }

    private WritableMap handleLocationResult(LocalizationResult result) {
        if (result == null) {
            return null;
        }
        WritableMap location = Arguments.createMap();
        location.putInt("angle", result.angle);
        location.putMap("quadrilateral", handleQuadrilateral(result.resultPoints));
        return location;
    }

    private WritableMap handleQuadrilateral(Point[] points) {
        if (points == null) {
            return null;
        }
        WritableMap quadrilateral = Arguments.createMap();

        quadrilateral.putArray("points", handlePoints(points));
        return quadrilateral;
    }

    private WritableArray handlePoints(Point[] points) {
        if (points == null) {
            return null;
        }
        WritableArray pointArray = Arguments.createArray();
        for (int i = 0; i < 4; i++) {
            pointArray.pushMap(handleSinglePoint(points[i]));
        }
        return pointArray;
    }

    private WritableMap handleSinglePoint(Point point) {
        WritableMap pointMap = Arguments.createMap();
        pointMap.putInt("x", point.x);
        pointMap.putInt("y", point.y);
        return pointMap;
    }
}
