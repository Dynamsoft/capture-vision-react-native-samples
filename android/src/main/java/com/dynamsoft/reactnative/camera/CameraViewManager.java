package com.dynamsoft.reactnative.camera;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.dynamsoft.reactnative.cameraview.Size;

import java.util.Map;

public class CameraViewManager extends ViewGroupManager<RNCameraView> {
  public enum Events {
    EVENT_CAMERA_READY("onCameraReady"),
    EVENT_ON_MOUNT_ERROR("onMountError"),
    EVENT_ON_BARCODES_DETECTED("onDynamsoftBarcodesReader"),
    EVENT_ON_BARCODE_DETECTION_ERROR("onGoogleVisionBarcodeDetectionError");


    private final String mName;

    Events(final String name) {
      mName = name;
    }

    @Override
    public String toString() {
      return mName;
    }
  }

  private static final String REACT_CLASS = "DBRRNCamera";

  @Override
  public void onDropViewInstance(RNCameraView view) {
    view.onHostDestroy();
    super.onDropViewInstance(view);
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected RNCameraView createViewInstance(ThemedReactContext themedReactContext) {
    return new RNCameraView(themedReactContext);
  }

  @Override
  @Nullable
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
    for (Events event : Events.values()) {
      builder.put(event.toString(), MapBuilder.of("registrationName", event.toString()));
    }
    return builder.build();
  }

  @ReactProp(name = "type")
  public void setType(RNCameraView view, int type) {
    view.setFacing(type);
  }

  @ReactProp(name = "cameraId")
  public void setCameraId(RNCameraView view, String id) {
    view.setCameraId(id);
  }

//  @ReactProp(name = "ratio")
//  public void setRatio(RNCameraView view, String ratio) {
//    view.setAspectRatio(AspectRatio.parse(ratio));
//  }

  @ReactProp(name = "flashMode")
  public void setFlashMode(RNCameraView view, int torchMode) {
    view.setFlash(torchMode);
  }

  @ReactProp(name = "exposure")
  public void setExposureCompensation(RNCameraView view, float exposure){
    view.setExposureCompensation(exposure);
  }

  @ReactProp(name = "autoFocus")
  public void setAutoFocus(RNCameraView view, boolean autoFocus) {
    view.setAutoFocus(autoFocus);
  }

  @ReactProp(name = "zoom")
  public void setZoom(RNCameraView view, float zoom) {
    view.setZoom(zoom);
  }

  @ReactProp(name = "useNativeZoom")
  public void setUseNativeZoom(RNCameraView view, boolean useNativeZoom) {
    view.setUseNativeZoom(useNativeZoom);
  }
  @ReactProp(name = "whiteBalance")
  public void setWhiteBalance(RNCameraView view, int whiteBalance) {
    view.setWhiteBalance(whiteBalance);
  }

  @ReactProp(name = "pictureSize")
  public void setPictureSize(RNCameraView view, String size) {
    view.setPictureSize(size.equals("None") ? null : Size.parse(size));
  }

  @ReactProp(name = "playSoundOnCapture")
  public void setPlaySoundOnCapture(RNCameraView view, boolean playSoundOnCapture) {
    view.setPlaySoundOnCapture(playSoundOnCapture);
  }

  @ReactProp(name = "detectedImageInEvent")
  public void setDetectedImageInEvent(RNCameraView view, boolean detectedImageInEvent) {
    view.setDetectedImageInEvent(detectedImageInEvent);
  }

  @ReactProp(name = "useCamera2Api")
  public void setUseCamera2Api(RNCameraView view, boolean useCamera2Api) {
    view.setUsingCamera2Api(useCamera2Api);
  }

  @ReactProp(name = "dynamsoftBarcodeReaderEnabled")
  public void setDynamsoftBarcodeReader(RNCameraView view, boolean dynamsoftBarcodeReaderEnabled) {
    view.setDynamsoftBarcodeReader(dynamsoftBarcodeReaderEnabled);
  }

  @ReactProp(name = "barcodeFormat")
  public void setDynamsoftBarcodeFormat(RNCameraView view, int barcodeFormat) {
    view.setDynamsoftBarcodeFormat(barcodeFormat);
  }

  @ReactProp(name = "barcodeFormat2")
  public void setDynamsoftBarcodeFormat2(RNCameraView view, int barcodeFormat2) {
    view.setDynamsoftBarcodeFormat2(barcodeFormat2);
  }

  @ReactProp(name = "license")
  public void setLicense(RNCameraView view, String license) {
    view.setLicense(license);
  }

  /**---limit scan area addition---**/
  @ReactProp(name = "rectOfInterest")
  public void setRectOfInterest(RNCameraView view, ReadableMap coordinates) {
    if(coordinates != null){
      float x = (float) coordinates.getDouble("x");
      float y = (float) coordinates.getDouble("y");
      float width = (float) coordinates.getDouble("width");
      float height = (float) coordinates.getDouble("height");
      view.setRectOfInterest(x, y, width, height);
    }
  }

  @ReactProp(name = "cameraViewDimensions")
  public void setCameraViewDimensions(RNCameraView view, ReadableMap dimensions) {
    if(dimensions != null){
      int cameraViewWidth = (int) dimensions.getDouble("width");
      int cameraViewHeight = (int) dimensions.getDouble("height");
      view.setCameraViewDimensions(cameraViewWidth, cameraViewHeight);
    }
  }
  /**---limit scan area addition---**/
}
