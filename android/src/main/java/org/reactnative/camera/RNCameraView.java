package org.reactnative.camera;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.Point;
import android.os.Build;
import androidx.core.content.ContextCompat;

import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;

import com.dynamsoft.dbr.EnumBarcodeFormat_2;
import com.dynamsoft.dbr.TextResult;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.ThemedReactContext;
import com.google.android.cameraview.CameraView;
import org.reactnative.barcodedetector.RNBarcodeDetector;
import org.reactnative.camera.tasks.BarcodeDetectorAsyncTask;
import org.reactnative.camera.tasks.BarcodeDetectorAsyncTaskDelegate;

public class RNCameraView extends CameraView implements LifecycleEventListener, BarcodeDetectorAsyncTaskDelegate {
  private ThemedReactContext mThemedReactContext;
  private boolean mDetectedImageInEvent = false;

  private ScaleGestureDetector mScaleGestureDetector;

  private boolean mIsPaused = false;
  private boolean mIsNew = true;
  private boolean mUseNativeZoom=false;

  // Concurrency lock for scanners to avoid flooding the runtime
  public volatile boolean barcodeTaskLock = false;

  // Scanning-related properties
  private RNBarcodeDetector mDynamsoftBarcodeReader;
  private boolean mShouldDetectBarcodes = false;
  private int mBarcodeFormat = RNBarcodeDetector.ALL_FORMATS;
  private int mBarcodeFormat2 = RNBarcodeDetector.ALL_FORMATS2;

  private String mLicense = RNBarcodeDetector.license;
  private int mPaddingX;
  private int mPaddingY;
  private float mDensity;
  private boolean dependOnWid;
  private double mPreviewScale;
  // Limit Android Scan Area
  private boolean mLimitScanArea = false;
  private float mScanAreaX = 0.0f;
  private float mScanAreaY = 0.0f;
  private float mScanAreaWidth = 0.0f;
  private float mScanAreaHeight = 0.0f;
  private int mCameraViewWidth = 0;
  private int mCameraViewHeight = 0;

  public RNCameraView(ThemedReactContext themedReactContext) {
    super(themedReactContext, true);
    mThemedReactContext = themedReactContext;
    themedReactContext.addLifecycleEventListener(this);

    mDensity = getResources().getDisplayMetrics().density;

    addCallback(new Callback() {
      @Override
      public void onCameraOpened(CameraView cameraView) {
        RNCameraViewHelper.emitCameraReadyEvent(cameraView);
      }

      @Override
      public void onMountError(CameraView cameraView) {
        RNCameraViewHelper.emitMountErrorEvent(cameraView, "Camera view threw an error - component could not be rendered.");
      }

      @Override
      public void onFramePreview(CameraView cameraView, byte[] data, int width, int height, int rotation) {
        int correctRotation = RNCameraViewHelper.getCorrectCameraRotation(rotation, getFacing(), getCameraOrientation());
        boolean callBarcodeTask = mShouldDetectBarcodes && !barcodeTaskLock;
        if (!callBarcodeTask) {
            return;
        }

        if (data.length < (1.5 * width * height)) {
            return;
        }

        if (callBarcodeTask) {
          barcodeTaskLock = true;
//            TextResult[] barcodes = mDynamsoftBarcodeReader.detect(data,width,height);
//            if (barcodes == null) {
//                onBarcodeDetectionError(mDynamsoftBarcodeReader);
//            } else {
//                if (barcodes.length > 0) {
//                  onBarcodesDetected(serializeEventData(barcodes, height, width));
//                }
//              barcodeTaskLock = false;
//            }
            BarcodeDetectorAsyncTaskDelegate delegate = (BarcodeDetectorAsyncTaskDelegate) cameraView;
            new BarcodeDetectorAsyncTask(delegate, mDynamsoftBarcodeReader, data, width, height,
                    correctRotation, getResources().getDisplayMetrics().density, getFacing(),
                    getWidth(), getHeight(), mPaddingX, mPaddingY).execute();
          }
      }
    });
  }
  private WritableArray serializeEventData(TextResult[] barcodes, int height, int width) {
    WritableArray barcodesList = Arguments.createArray();
    double mScaleX = (double) getWidth() / height;
    double mScaleY = (double) getHeight() / width;
    mPreviewScale = mScaleX > mScaleY ? mScaleX:mScaleY;
    dependOnWid = mScaleX > mScaleY;

    for (int i = 0; i < barcodes.length; i++) {
      TextResult barcode = barcodes[i];
      WritableMap serializedBarcode = Arguments.createMap();

      if (barcode.barcodeFormat_2 != EnumBarcodeFormat_2.BF2_NULL){
        serializedBarcode.putString("type", barcode.barcodeFormatString_2);
      }else {
        serializedBarcode.putString("type", barcode.barcodeFormatString);
      }
      serializedBarcode.putString("data", barcode.barcodeText);
      serializedBarcode.putArray("localizationResult", handlePoints(barcode.localizationResult.resultPoints,mPreviewScale,height,width));
      barcodesList.pushMap(serializedBarcode);
    }

    return barcodesList;
  }

  public WritableArray handlePoints(com.dynamsoft.dbr.Point[] dbrpoint, double previewScale, int srcBitmapHeight, int srcBitmapWidth) {
    if (dbrpoint == null) {
      return null;
    }

    WritableArray rectCoord = Arguments.createArray();
    Point point = new Point(0,0);
    if (dependOnWid){
      for (int j = 0; j < 4; j++) {
        point.x = (int)((srcBitmapHeight - dbrpoint[j].y) * previewScale - (srcBitmapHeight * previewScale - getWidth()) / 2);
        point.y = (int)(dbrpoint[j].x * previewScale - (srcBitmapWidth * previewScale - getHeight() / 2));
        rectCoord.pushInt(point.x);
        rectCoord.pushInt(point.y);
      }
    }else {
      for (int j = 0; j < 4; j++) {
        point.x = (int)(getWidth() / mDensity - dbrpoint[j].y * previewScale);
        // point.x = (int)((srcBitmapHeight - dbrpoint[j].y) * previewScale - (srcBitmapHeight * previewScale - getWidth()) / 2);
        point.y = (int)(dbrpoint[j].x * previewScale / mDensity);
        rectCoord.pushInt(point.x);
        rectCoord.pushInt(point.y);
      }
    }
    return rectCoord;
  }

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    View preview = getView();
    if (null == preview) {
      return;
    }
    float width = right - left;
    float height = bottom - top;
    float ratio = getAspectRatio() == null ? Constants.DEFAULT_ASPECT_RATIO.toFloat() : getAspectRatio().toFloat();
    int orientation = getResources().getConfiguration().orientation;
    int correctHeight;
    int correctWidth;
    this.setBackgroundColor(Color.BLACK);
    if (orientation == android.content.res.Configuration.ORIENTATION_LANDSCAPE) {
      if (ratio * height < width) {
        correctHeight = (int) (width / ratio);
        correctWidth = (int) width;
      } else {
        correctWidth = (int) (height * ratio);
        correctHeight = (int) height;
      }
    } else {
      if (ratio * width > height) {
        correctHeight = (int) (width * ratio);
        correctWidth = (int) width;
      } else {
        correctWidth = (int) (height / ratio);
        correctHeight = (int) height;
      }
    }
    int paddingX = (int) ((width - correctWidth) / 2);
    int paddingY = (int) ((height - correctHeight) / 2);
    mPaddingX = paddingX;
    mPaddingY = paddingY;
    preview.layout(paddingX, paddingY, correctWidth + paddingX, correctHeight + paddingY);
  }

  @SuppressLint("all")
  @Override
  public void requestLayout() {
    // React handles this for us, so we don't need to call super.requestLayout();
  }

  public void setDetectedImageInEvent(boolean detectedImageInEvent) {
    this.mDetectedImageInEvent = detectedImageInEvent;
  }

  // Limit Scan Area
  public void setRectOfInterest(float x, float y, float width, float height) {
    this.mLimitScanArea = true;
    this.mScanAreaX = x;
    this.mScanAreaY = y;
    this.mScanAreaWidth = width;
    this.mScanAreaHeight = height;
  }
  public void setCameraViewDimensions(int width, int height) {
    this.mCameraViewWidth = width;
    this.mCameraViewHeight = height;
  }

  public void setUseNativeZoom(boolean useNativeZoom){
    if(!mUseNativeZoom && useNativeZoom){
      mScaleGestureDetector = new ScaleGestureDetector(mThemedReactContext,onScaleGestureListener);
    }else{
      mScaleGestureDetector=null;
    }
    mUseNativeZoom=useNativeZoom;
  }

  @Override
  public boolean onTouchEvent(MotionEvent event) {
    if(mUseNativeZoom) {
      mScaleGestureDetector.onTouchEvent(event);
    }
    return true;
  }

  /**
   * Initial setup of the barcode Reader
   */
  public void setDynamsoftBarcodeReader(boolean shouldDetectBarcodes) {
    if (shouldDetectBarcodes && mDynamsoftBarcodeReader == null) {
        mDynamsoftBarcodeReader = new RNBarcodeDetector();
        mDynamsoftBarcodeReader.setBarcodeFormat(mBarcodeFormat);
        mDynamsoftBarcodeReader.setBarcodeFormat2(mBarcodeFormat2);
    }
    this.mShouldDetectBarcodes = shouldDetectBarcodes;
    setScanning(mShouldDetectBarcodes);
  }

  public void setDynamsoftBarcodeFormat(int barcodeFormat) {
    mBarcodeFormat = barcodeFormat;
    if (mDynamsoftBarcodeReader != null) {
        mDynamsoftBarcodeReader.setBarcodeFormat(barcodeFormat);
    }
  }

  public void setDynamsoftBarcodeFormat2(int barcodeFormat2) {
    mBarcodeFormat2 = barcodeFormat2;
    if (mDynamsoftBarcodeReader != null) {
      mDynamsoftBarcodeReader.setBarcodeFormat2(barcodeFormat2);
    }
  }

  public void setLicense(String license) {
    mLicense = license;
    RNBarcodeDetector.license = license;
    mDynamsoftBarcodeReader = new RNBarcodeDetector();
    mDynamsoftBarcodeReader.setBarcodeFormat(mBarcodeFormat);
    mDynamsoftBarcodeReader.setBarcodeFormat2(mBarcodeFormat2);
  }


  public void onBarcodesDetected(WritableArray barcodesDetected) {
    if (!mShouldDetectBarcodes) {
      return;
    }

    RNCameraViewHelper.emitBarcodesDetectedEvent(this, barcodesDetected);
  }

  public void onBarcodeDetectionError(RNBarcodeDetector barcodeDetector) {
    if (!mShouldDetectBarcodes) {
      return;
    }

    RNCameraViewHelper.emitBarcodeDetectionErrorEvent(this, barcodeDetector);
  }

  @Override
  public void onBarcodesDetected(WritableArray barcodes, int width, int height, byte[] imageData) {
    if (!mShouldDetectBarcodes) {
      return;
    }

    RNCameraViewHelper.emitBarcodesDetectedEvent(this, barcodes);
  }

  public void onBarcodeDetectingTaskCompleted() {
    barcodeTaskLock = false;
  }

  @Override
  public void onHostResume() {
    if (hasCameraPermissions()) {
      mBgHandler.post(new Runnable() {
        @Override
        public void run() {
          if ((mIsPaused && !isCameraOpened()) || mIsNew) {
            mIsPaused = false;
            mIsNew = false;
            start();
          }
        }
      });
    } else {
      RNCameraViewHelper.emitMountErrorEvent(this, "Camera permissions not granted - component could not be rendered.");
    }
  }

  @Override
  public void onHostPause() {
    if (!mIsPaused && isCameraOpened()) {
      mIsPaused = true;
      stop();
    }
  }

  @Override
  public void onHostDestroy() {

    if (mDynamsoftBarcodeReader != null) {
      mDynamsoftBarcodeReader.release();
    }
    mThemedReactContext.removeLifecycleEventListener(this);

    // camera release can be quite expensive. Run in on bg handler
    // and cleanup last once everything has finished
    mBgHandler.post(new Runnable() {
        @Override
        public void run() {
          stop();
          cleanup();
        }
      });
  }
  private void onZoom(float scale){
    float currentZoom=getZoom();
    float nextZoom=currentZoom+(scale-1.0f);

    if(nextZoom > currentZoom){
      setZoom(Math.min(nextZoom,1.0f));
    }else{
      setZoom(Math.max(nextZoom,0.0f));
    }

  }

  private boolean hasCameraPermissions() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      int result = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.CAMERA);
      return result == PackageManager.PERMISSION_GRANTED;
    } else {
      return true;
    }
  }
  private int scalePosition(float raw){
    Resources resources = getResources();
    Configuration config = resources.getConfiguration();
    DisplayMetrics dm = resources.getDisplayMetrics();
    return (int)(raw/ dm.density);
  }
  private ScaleGestureDetector.OnScaleGestureListener onScaleGestureListener = new ScaleGestureDetector.OnScaleGestureListener() {

    @Override
    public boolean onScale(ScaleGestureDetector scaleGestureDetector) {
      onZoom(scaleGestureDetector.getScaleFactor());
      return true;
    }

    @Override
    public boolean onScaleBegin(ScaleGestureDetector scaleGestureDetector) {
      onZoom(scaleGestureDetector.getScaleFactor());
      return true;
    }

    @Override
    public void onScaleEnd(ScaleGestureDetector scaleGestureDetector) {
    }

  };

}
