
package com.dynamsoft.reactlibrary;


import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.dynamsoft.dce.CameraEnhancer;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;
public class RNDynamsoftCaptrueVisionPackage implements ReactPackage {
    CameraEnhancer mCamera;
    RNDynamsoftBarcodeReaderModule mDbrModule;
    RNDCECameraViewManager mDCEViewManager;

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        mDbrModule = new RNDynamsoftBarcodeReaderModule(reactContext);
        return Arrays.<NativeModule>asList(mDbrModule);
    }

    // Deprecated from RN 0.47
    public List<Class<? extends JavaScriptModule>> createJSModules() {
      return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        mDCEViewManager = new RNDCECameraViewManager(reactContext, mDbrModule);
        return Arrays.<ViewManager>asList(mDCEViewManager);
    }
}