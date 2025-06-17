import React, {useEffect, useRef} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumCapturedResultItemType,
  EnumPresetTemplate,
  MultiFrameResultCrossFilter,
  EnumCrossVerificationStatus,
} from 'dynamsoft-capture-vision-react-native';
import {StackNavigation} from './App.tsx';

export function Scanner({navigation}: StackNavigation): React.JSX.Element {
  const ifBtnClick = useRef(false);
  const cameraView = useRef<CameraView>(null);
  const camera = CameraEnhancer.getInstance();
  const cvr = CaptureVisionRouter.getInstance();

  useFocusEffect(
    React.useCallback(() => {
      //Open camera when the Scanner screen is focused.
      camera.open();

      return () => {

        //Close camera when the Scanner screen is unfocused.
        camera.close();
      };
    }, [camera]),
  );

  useEffect(() => {
    CameraEnhancer.requestCameraPermission().then(/*no-op*/);
    cvr.setInput(camera);
    camera.setCameraView(cameraView.current!!);

    let filter = new MultiFrameResultCrossFilter();
    filter.enableResultCrossVerification(EnumCapturedResultItemType.CRIT_DETECTED_QUAD, true);
    cvr.addFilter(filter);

    let receiver = cvr.addResultReceiver({
      onProcessedDocumentResultReceived: result => {
        if (
          result.detectedQuadResultItems &&
          result.detectedQuadResultItems.length > 0 &&
          /*This means you can manually click the button to navigate to the next page,
          or navigate to the next page when the item's crossVerificationStatus is PASSED.*/
          (ifBtnClick.current || result.detectedQuadResultItems[0].crossVerificationStatus === EnumCrossVerificationStatus.CVS_PASSED)
        ) {
          ifBtnClick.current = false;
          /*Since the originalImage corresponding to originalImageHashId may be released after the callback ends,
          if you want to get the originalImage,
          you should call getOriginalImage(result.originalImageHashId) within the callback.*/
          global.originalImage = cvr.getIntermediateResultManager().getOriginalImage(result.originalImageHashId);
          global.processedDocumentResult = result;
          if (global.originalImage.width > 0 && global.originalImage.height > 0) {
            navigation.navigate('Editor');
          }
        }
      },
    });
    cvr.startCapturing(EnumPresetTemplate.PT_DETECT_DOCUMENT_BOUNDARIES).catch(/*no-op*/);

    return () => {
      cvr.removeResultReceiver(receiver);
      cvr.stopCapturing().catch(/*no-op*/);
    };
  }, [cvr, camera, cameraView, ifBtnClick, navigation]);

  return (
    <CameraView style={styles.fullScreen} ref={cameraView}>
      <View style={styles.bottomView}>
        <Button title={'Capture'} onPress={() => (ifBtnClick.current = true)} />
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {flex: 1},
  bottomView: {position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center'},
});
