import React, {useEffect, useRef, useState} from 'react';
import {AppState, StyleSheet, Text} from 'react-native';
import {CameraEnhancer, CameraView, CaptureVisionRouter, DecodedBarcodesResult, EnumPresetTemplate} from 'dynamsoft-capture-vision-react-native';

const mergeBarcodeResultsText = (result: DecodedBarcodesResult) => {
  if (result.items && result.items.length > 0) {
    return result.items
      .map(item => {
        return item.formatString + ': ' + item.text;
      })
      .join('\n');
  } else {
    return 'No barcode detected.';
  }
};

export function Scanner(): React.JSX.Element {
  const cameraView = useRef<CameraView>(null);
  const camera = CameraEnhancer.getInstance();
  const cvr = CaptureVisionRouter.getInstance();
  const [resultText, setResultText] = useState<string>('No barcode detected.');

  CameraEnhancer.requestCameraPermission();

  useEffect(() => {
    const start = () => {
      camera.open();
      cvr.startCapturing(EnumPresetTemplate.PT_READ_SINGLE_BARCODE).catch(()=>{/*no-op*/});
      // If you want to decode multiple barcodes simultaneously, you can use startCapturing(EnumPresetTemplate.PT_READ_BARCODES)
      // cvr.startCapturing(EnumPresetTemplate.PT_READ_BARCODES).catch(()=>{/*no-op*/});
    };

    const stop = () => {
      camera.close();
      cvr.stopCapturing();
    };


    cvr.setInput(camera);
    camera.setCameraView(cameraView.current!!);
    let receiver = cvr.addResultReceiver({
      onDecodedBarcodesReceived: result =>  {
        /*Since the originalImage corresponding to originalImageHashId may be released after the callback ends,
        if you want to get the originalImage,
        you should call getOriginalImage(result.originalImageHashId) within the callback.*/
        // let originalImage = cvr.getIntermediateResultManager().getOriginalImage(result.originalImageHashId);

        /*We provide an API imageDataToBase64() to convert ImageData to base64 String.*/
        // let base64 = imageDataToBase64(originalImage);

        /*We provide API saveToFile() to save ImageData in file format to the path you specify.*/
        // new ImageManager().saveToFile(originalImage, "your absolute path", true);
        setResultText(mergeBarcodeResultsText(result));
      },
    });

    //Start capturing and open camera when the Scanner Screen did mount.
    start();

    let appStateListener = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        //Start capturing and open camera when the App is about to return to the foreground.
        start();
      } else {
        //Stop capturing and close camera when the App is about to return to the background.
        stop();
      }
    });

    return () => {
      appStateListener.remove();
      cvr.removeResultReceiver(receiver);
      //Stop capturing and close camera when the Scanner Screen is about to unmount.
      stop();
    };
  }, [cvr, camera, cameraView]);

  return (
    <CameraView style={styles.cameraView} ref={cameraView}>
      <Text style={styles.resultText}>{resultText}</Text>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  cameraView: {flex: 1},
  resultText: {
    color: 'white',
    fontSize: 16,
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
