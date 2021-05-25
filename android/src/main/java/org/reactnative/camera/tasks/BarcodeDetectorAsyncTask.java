package org.reactnative.camera.tasks;

import android.graphics.Point;
import android.graphics.Rect;
import android.content.Context;

import com.dynamsoft.dbr.EnumBarcodeFormat_2;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.dynamsoft.dbr.TextResult;

import org.reactnative.camera.utils.ImageDimensions;
import org.reactnative.barcodedetector.RNBarcodeDetector;

public class BarcodeDetectorAsyncTask extends android.os.AsyncTask<Void, Void, TextResult[]> {

  private byte[] mImageData;
  private int mWidth;
  private int mHeight;
  private RNBarcodeDetector mBarcodeDetector;
  private BarcodeDetectorAsyncTaskDelegate mDelegate;
  private double mScaleX;
  private double mScaleY;
  private ImageDimensions mImageDimensions;
  private int mPaddingLeft;
  private int mPaddingTop;

  private int mViewWidth;
  private int mViewHeight;
  public boolean dependOnWid;
  private double mPreviewScale;
  private float mDensity;

  public BarcodeDetectorAsyncTask(
          BarcodeDetectorAsyncTaskDelegate delegate,
          RNBarcodeDetector barcodeDetector,
          byte[] imageData,
          int width,
          int height,
          int rotation,
          float density,
          int facing,
          int viewWidth,
          int viewHeight,
          int viewPaddingLeft,
          int viewPaddingTop) {
    mImageData = imageData;
    mWidth = width;
    mHeight = height;
    mDelegate = delegate;
    mBarcodeDetector = barcodeDetector;
    mImageDimensions = new ImageDimensions(width, height, rotation, facing);
    mScaleX = (double) (viewWidth) / (mImageDimensions.getWidth() * density);
    mScaleY = (double) (viewHeight) / (mImageDimensions.getHeight() * density);
    mDensity = density;
    mViewWidth = viewWidth;
    mViewHeight = viewHeight;
    mPaddingLeft = viewPaddingLeft;
    mPaddingTop = viewPaddingTop;
  }


  @Override
  protected TextResult[] doInBackground(Void... ignored) {
    if (isCancelled() || mDelegate == null || mBarcodeDetector == null) {
      return null;
    }
    return mBarcodeDetector.detect(mImageData,mWidth,mHeight);
  }

  @Override
  protected void onPostExecute(TextResult[] barcodes) {
    super.onPostExecute(barcodes);
    if (barcodes == null) {
      mDelegate.onBarcodeDetectionError(mBarcodeDetector);
    } else {
      if (barcodes.length > 0) {
        mDelegate.onBarcodesDetected(serializeEventData(barcodes), mWidth, mHeight, mImageData);
      }
      mDelegate.onBarcodeDetectingTaskCompleted();
    }
  }

  private WritableArray serializeEventData(TextResult[] barcodes) {
    WritableArray barcodesList = Arguments.createArray();

    for (int i = 0; i < barcodes.length; i++) {
      TextResult barcode = barcodes[i];
      WritableMap serializedBarcode = Arguments.createMap();

      if (barcode.barcodeFormat_2 != EnumBarcodeFormat_2.BF2_NULL){
        serializedBarcode.putString("type", barcode.barcodeFormatString_2);
      }else {
        serializedBarcode.putString("type", barcode.barcodeFormatString);
      }
      serializedBarcode.putString("data", barcode.barcodeText);
      mPreviewScale = mScaleX > mScaleY ? mScaleX:mScaleY;
      dependOnWid = mScaleX > mScaleY;
      serializedBarcode.putArray("localizationResult", handlePoints(barcode.localizationResult.resultPoints,mPreviewScale,mHeight,mWidth));
      barcodesList.pushMap(serializedBarcode);
    }

    return barcodesList;
  }

  private WritableMap processBounds(Rect frame) {
    WritableMap origin = Arguments.createMap();
    int x = frame.left;
    int y = frame.top;

    if (frame.left < mWidth / 2) {
      x = x + mPaddingLeft / 2;
    } else if (frame.left > mWidth /2) {
      x = x - mPaddingLeft / 2;
    }

    if (frame.top < mHeight / 2) {
      y = y + mPaddingTop / 2;
    } else if (frame.top > mHeight / 2) {
      y = y - mPaddingTop / 2;
    }

    origin.putDouble("x", x * mScaleX);
    origin.putDouble("y", y * mScaleY);

    WritableMap size = Arguments.createMap();
    size.putDouble("width", frame.width() * mScaleX);
    size.putDouble("height", frame.height() * mScaleY);

    WritableMap bounds = Arguments.createMap();
    bounds.putMap("origin", origin);
    bounds.putMap("size", size);
    return bounds;
  }

  public WritableArray handlePoints(com.dynamsoft.dbr.Point[] dbrpoint, double previewScale, int srcBitmapHeight, int srcBitmapWidth) {
    if (dbrpoint == null) {
      return null;
    }

    WritableArray rectCoord = Arguments.createArray();
    Point point = new Point(0,0);
    if (dependOnWid){
      for (int j = 0; j < 4; j++) {
        point.x = (int)((srcBitmapHeight - dbrpoint[j].y) * previewScale - (srcBitmapHeight * previewScale - mViewWidth) / 2);
        point.y = (int)(dbrpoint[j].x * previewScale - (srcBitmapWidth * previewScale - mViewHeight / 2));
        rectCoord.pushInt(point.x);
        rectCoord.pushInt(point.y);
      }
    }else {
      for (int j = 0; j < 4; j++) {
        point.x = (int)(mViewWidth / mDensity - dbrpoint[j].y * previewScale);
        point.y = (int)(dbrpoint[j].x * previewScale / mDensity);
        rectCoord.pushInt(point.x);
        rectCoord.pushInt(point.y);
      }
    }
    return rectCoord;
  }
}
