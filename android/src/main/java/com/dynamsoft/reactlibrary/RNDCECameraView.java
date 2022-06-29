package com.dynamsoft.reactlibrary;

import com.dynamsoft.dce.CameraEnhancer;
import com.dynamsoft.dce.CameraEnhancerException;
import com.dynamsoft.dce.DCECameraView;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;

public class RNDCECameraView extends DCECameraView implements LifecycleEventListener {

    CameraEnhancer mCamera;

    public RNDCECameraView(ThemedReactContext context, ReactApplicationContext appContext, CameraEnhancer cameraEnhancer) {
        super(context);
        context.addLifecycleEventListener(this);
        mCamera = cameraEnhancer;
        mCamera.setCameraView(this);
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
