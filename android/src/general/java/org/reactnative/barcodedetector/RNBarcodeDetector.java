package org.reactnative.barcodedetector;

import android.util.Log;

import org.reactnative.camera.utils.ImageDimensions;

import com.dynamsoft.dbr.BarcodeReaderException;
import com.dynamsoft.dbr.EnumBarcodeFormat;
import com.dynamsoft.dbr.EnumBarcodeFormat_2;
import com.dynamsoft.dbr.EnumImagePixelFormat;
import com.dynamsoft.dbr.TextResult;
import com.dynamsoft.dbr.BarcodeReader;
import com.dynamsoft.dbr.PublicRuntimeSettings;

public class RNBarcodeDetector {

    public static String license = "";
    public static int ALL_FORMATS = EnumBarcodeFormat.BF_ALL;
    public static int ALL_FORMATS2 = EnumBarcodeFormat_2.BF2_NULL;

    private BarcodeReader mBarcodeReader = null;
    private ImageDimensions mPreviousDimensions;
    private PublicRuntimeSettings mSettings;

    private int mBarcodeFormat = EnumBarcodeFormat.BF_ALL;
    private int mBarcodeFormat2 = EnumBarcodeFormat_2.BF2_NULL;

    public RNBarcodeDetector() {
        if (mBarcodeReader == null) {
            createBarcodeDetector();
        }
    }

    public TextResult[] detect(byte[] data, int width, int height) {
        // If the frame has different dimensions, create another barcode detector.
        // Otherwise we will most likely get nasty "inconsistent image dimensions" error from detector
        // and no barcode will be detected.
//        if (!frame.getDimensions().equals(mPreviousDimensions)) {
//            releaseBarcodeDetector();
//        }

        if (mBarcodeReader == null) {
            createBarcodeDetector();
//            mPreviousDimensions = frame.getDimensions();
        }

        TextResult[] textResults = null;
        try{
            textResults = mBarcodeReader.decodeBuffer(data, width, height,width*4,EnumImagePixelFormat.IPF_NV21,"");
        } catch (BarcodeReaderException e){
            Log.e("dynamsoft", "getErrorCode " + e.getErrorCode());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return textResults;
    }

    public void setBarcodeFormat(int barcodeFormat) {
        if (barcodeFormat != mBarcodeFormat) {
            mSettings.barcodeFormatIds = barcodeFormat;
            mBarcodeFormat = barcodeFormat;
            try{
                mBarcodeReader.updateRuntimeSettings(mSettings);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void setBarcodeFormat2(int barcodeFormat2) {
        if (barcodeFormat2 != mBarcodeFormat) {
            mSettings.barcodeFormatIds_2 = barcodeFormat2;
            mBarcodeFormat2 = barcodeFormat2;
            try{
                mBarcodeReader.updateRuntimeSettings(mSettings);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static void setLicense(String license) {
        RNBarcodeDetector.license = license;
    }

    public void release() {
        releaseBarcodeDetector();
        mPreviousDimensions = null;
    }

    // Lifecycle methods

    private void releaseBarcodeDetector() {
        if (mBarcodeReader != null) {
            mBarcodeReader.destroy();
            mBarcodeReader = null;
        }
    }

    private void createBarcodeDetector() {
        try{
            mBarcodeReader = new BarcodeReader(license);
            mSettings = mBarcodeReader.getRuntimeSettings();
            mSettings.deblurLevel = 0;
            mSettings.expectedBarcodesCount = 1;
            mBarcodeReader.updateRuntimeSettings(mSettings);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
