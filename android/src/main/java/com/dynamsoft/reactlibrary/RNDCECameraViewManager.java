package com.dynamsoft.reactlibrary;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.provider.ContactsContract;
import android.util.Base64;

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

    @ReactProp(name = "overlayVisible")
    public void setOverlayVisible(RNDCECameraView view, boolean isVisible) {
        view.setOverlayVisible(isVisible);
    }

    @ReactProp(name = "torchState")
    public void setTorchState(RNDCECameraView view, int torchState) {
        try {
            if (torchState == Constants.TORCH_ON) {
                mCamera.turnOnTorch();
            } else if (torchState == Constants.TORCH_OFF) {
                mCamera.turnOffTorch();
            }
        } catch (CameraEnhancerException e) {
            e.printStackTrace();
        }
    }

    @ReactProp(name = "torchButton")
    public void setTorchButton(RNDCECameraView view, ReadableMap torchButton) {
        if (torchButton != null) {
            boolean isVisible = (torchButton.hasKey("visible") && !torchButton.isNull("visible")) ? torchButton.getBoolean("visible") : false;
            if (isVisible) {
                ReadableMap location = torchButton.getMap("location");
                Point startPoint;
                int width;
                int height;
                if (location != null) {
                    int x = (location.hasKey("x") && !location.isNull("x")) ? location.getInt("x") : 25;
                    int y = (location.hasKey("y") && !location.isNull("y")) ? location.getInt("y") : 100;
                    startPoint = new Point(x,y);
                    width = (location.hasKey("width") && !location.isNull("width")) ? location.getInt("width") : 45;
                    height = (location.hasKey("height") && !location.isNull("height")) ? location.getInt("height") : 45;
                } else {
                    //Default location. Unit is dp.
                    startPoint = new Point(25, 100);
                    width = 45;
                    height = 45;
                }
                String torchOnImageBase64 = torchButton.getString("torchOnImageBase64");
                String torchOffImageBase64 = torchButton.getString("torchOffImageBase64");
                Drawable torchOnDrawable = bitmapToDrawable((base64ToBitmap(torchOnImageBase64)));
                Drawable torchOffDrawable = bitmapToDrawable((base64ToBitmap(torchOffImageBase64)));
                view.setTorchButton(startPoint, width, height, torchOnDrawable, torchOffDrawable);
                view.setTorchButtonVisible(true);
            } else {
                view.setTorchButtonVisible(false);
            }
        }
    }

    private static Bitmap base64ToBitmap(String base64Data) {
        if (base64Data == null) {
            return null;
        }
        byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
        if (bytes != null) {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
            if (options.outWidth * options.outHeight > 2000 * 2000) {
                options.inTargetDensity = options.outWidth * options.outHeight;
                options.inDensity = 2000 * 2000;
            }
            options.inJustDecodeBounds = false;
            return BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
        } else {
            return null;
        }
    }

    private Drawable bitmapToDrawable(Bitmap bitmap) {
        if (bitmap != null) {
            BitmapDrawable bd = new BitmapDrawable(mReactApplicationContext.getResources(), bitmap);
            Drawable img = bd;
            return img;
        } else {
            return null;
        }
    }

//    @Nullable
//    @Override
//    public Map<String, Object> getExportedViewConstants() {
//        return super.getExportedViewConstants();
//    }


    @ReactProp(name = "scanRegionVisible")
    public void setScanRegionVisible(RNDCECameraView view, boolean isVisible) {
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