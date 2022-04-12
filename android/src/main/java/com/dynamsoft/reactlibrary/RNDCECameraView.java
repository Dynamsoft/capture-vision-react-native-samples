package com.dynamsoft.reactlibrary;

import com.dynamsoft.dce.CameraEnhancerException;
import com.dynamsoft.dce.DCECameraView;
import com.dynamsoft.dce.DCEFrame;
import com.dynamsoft.dce.DCEFrameListener;
import com.dynamsoft.dce.EnumResolution;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import static com.dynamsoft.reactlibrary.RNDCECameraViewManager.mCamera;

public class RNDCECameraView extends DCECameraView implements LifecycleEventListener {

    public RNDCECameraView(ThemedReactContext context, ReactApplicationContext appContext) {
        super(context);
        context.addLifecycleEventListener(this);
        mCamera.setCameraView(this);
//        mCamera.addListener(new DCEFrameListener() {
//            @Override
//            public void frameOutputCallback(DCEFrame dceFrame, long l) {
//                WritableMap frame = Arguments.createMap();
//                frame.putInt("id",dceFrame.getFrameId());
//                frame.putInt("width",dceFrame.getWidth());
//                frame.putInt("height",dceFrame.getHeight());
//                frame.putInt("stride",dceFrame.getStrides()[0]);
//                frame.putInt("dataLength",dceFrame.getImageData().length);
//                frame.putInt("format",dceFrame.getPixelFormat());
//
//                ReactContext reactContext = (ReactContext)getContext();
//                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(
//                        "getFrameFromBuffer",
//                        frame);
//            }
//        });
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        // The spinner relies on a measure + layout pass happening after it calls requestLayout().
        // Without this, the widget never actually changes the selection and doesn't call the
        // appropriate listeners. Since we override onLayout in our ViewGroups, a layout pass never
        // happens after a call to requestLayout, so we simulate one here.
        post(measureAndLayout);
    }

    private final Runnable measureAndLayout = new Runnable() {
        @Override
        public void run() {
            measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));

            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };

    @Override
    public void onHostResume() {
        if(mCamera!=null){
            try {
                mCamera.open();
            } catch (CameraEnhancerException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onHostPause() {
        if(mCamera != null) {
            try {
                mCamera.close();
            } catch (CameraEnhancerException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onHostDestroy() {
        if(mCamera != null) {
            mCamera = null;
        }
    }
}
