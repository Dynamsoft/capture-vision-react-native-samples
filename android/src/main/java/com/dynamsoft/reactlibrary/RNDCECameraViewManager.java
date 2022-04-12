package com.dynamsoft.reactlibrary;

import android.app.Activity;
import android.util.Log;

import com.dynamsoft.dce.CameraEnhancer;
import com.dynamsoft.dce.CameraEnhancerException;
import com.dynamsoft.dce.EnumResolution;
import com.dynamsoft.dce.RegionDefinition;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import javax.annotation.Nullable;

public class RNDCECameraViewManager extends ViewGroupManager<RNDCECameraView> {
    private static final String OPEN = "open";
    private static final int OPEN_COMMAND = 1;
    private static final String CLOSE = "close";
    private static final int CLOSE_COMMAND = 2;

    ReactApplicationContext mReactApplicationContext;
    public static CameraEnhancer mCamera;

    public RNDCECameraViewManager(ReactApplicationContext reactContext) {
        mReactApplicationContext = reactContext;
        mCamera = new CameraEnhancer(Objects.requireNonNull(getActivity()));
    }

    private static final String REACT_CLASS = "DYSCameraView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public static Activity getActivity() {
        Class activityThreadClass = null;
        try {
            activityThreadClass = Class.forName("android.app.ActivityThread");
            Object activityThread = activityThreadClass.getMethod("currentActivityThread").invoke(null);
            Field activitiesField = activityThreadClass.getDeclaredField("mActivities");
            activitiesField.setAccessible(true);
            Map activities = (Map) activitiesField.get(activityThread);
            for (Object activityRecord : activities.values()) {
                Class activityRecordClass = activityRecord.getClass();
                Field pausedField = activityRecordClass.getDeclaredField("paused");
                pausedField.setAccessible(true);
                if (!pausedField.getBoolean(activityRecord)) {
                    Field activityField = activityRecordClass.getDeclaredField("activity");
                    activityField.setAccessible(true);
                    Activity activity = (Activity) activityField.get(activityRecord);
                    return activity;
                }
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    protected RNDCECameraView createViewInstance(ThemedReactContext reactContext) {
        return new RNDCECameraView(reactContext, mReactApplicationContext);
    }

    @ReactProp(name = "isOverlayVisible")
    public void isOverlayVisible(RNDCECameraView view, boolean isVisible) {
        view.setOverlayVisible(isVisible);
    }

    @ReactProp(name = "isScanRegionVisible")
    public void isScanRegionVisible(RNDCECameraView view, boolean isVisible) {
        mCamera.setScanRegionVisible(isVisible);
    }

    @ReactProp(name = "scanRegion")
    public void setScanRegion(RNDCECameraView view, ReadableMap scanRegion) {
        if (scanRegion != null) {
            int left = scanRegion.getInt("regionLeft");
            int top = scanRegion.getInt("regionTop");
            int right = scanRegion.getInt("regionRight");
            int bottom = scanRegion.getInt("regionBottom");

            RegionDefinition regionDefinition = new RegionDefinition();
            regionDefinition.regionLeft = left;
            regionDefinition.regionRight = right;
            regionDefinition.regionTop = top;
            regionDefinition.regionBottom = bottom;

            ReadableType byPercentageType = scanRegion.getType("regionMeasuredByPercentage");
            if (byPercentageType == ReadableType.Boolean) {
                regionDefinition.regionMeasuredByPercentage = scanRegion.getBoolean("regionMeasuredByPercentage") ? 1 : 0;
            } else if (byPercentageType == ReadableType.Number) {
                regionDefinition.regionMeasuredByPercentage = scanRegion.getInt("regionMeasuredByPercentage") > 0 ? 1 : 0;
            } else {
                regionDefinition.regionMeasuredByPercentage = 1;
            }
            try {
                mCamera.setScanRegion(regionDefinition);
            } catch (CameraEnhancerException e) {
                e.printStackTrace();
            }
        }
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        Map<String, Integer> map = new HashMap<>();
        map.put(OPEN, OPEN_COMMAND);
        map.put(CLOSE, CLOSE_COMMAND);
        return map;
    }

    @Override
    public void receiveCommand(RNDCECameraView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
        switch (commandId) {
            case OPEN_COMMAND:
                try {
                    mCamera.open();
                } catch (CameraEnhancerException e) {
                    e.printStackTrace();
                }
                break;
            case CLOSE_COMMAND:
                try {
                    mCamera.close();
                } catch (CameraEnhancerException e) {
                    e.printStackTrace();
                }
                break;
            default:
                break;
        }
    }
}