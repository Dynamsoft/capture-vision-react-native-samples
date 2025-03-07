import React, {useEffect, useRef} from 'react';
import {AppState, Button, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumCapturedResultItemType,
  EnumPresetTemplate,
  MultiFrameResultCrossFilter,
} from 'dynamsoft-capture-vision-react-native';
import {StackNavigation} from './App.tsx';
import {EnumCrossVerificationStatus} from 'dynamsoft-capture-vision-react-native/src/core/EnumCrossVerificationStatus.tsx';

export function Scanner({navigation}: StackNavigation): React.JSX.Element {
  const ifBtnClick = useRef(false);
  const cameraView = useRef<CameraView>(null);
  const camera = CameraEnhancer.getInstance();
  const cvr = CaptureVisionRouter.getInstance();

  CameraEnhancer.requestCameraPermission();

  useFocusEffect(
    React.useCallback(() => {
      const start = () => {
        camera.open();
        return cvr.startCapturing(EnumPresetTemplate.PT_DETECT_DOCUMENT_BOUNDARIES);
      };

      const stop = () => {
        camera.close();
        return cvr.stopCapturing();
      };

      //Start capturing and open camera when the Scanner screen is focused.
      start().catch(/*no-op*/);

      let appStateListener = AppState.addEventListener('change', nextState => {
        if (nextState === 'active') {
          //Start capturing and open camera when the App is about to return to the foreground.
          start().catch(e => console.log('appStateListener', e));
        } else {
          //Stop capturing and close camera when the App is about to return to the background.
          stop().then(/*no-op*/);
        }
      });
      return () => {
        appStateListener.remove();

        //Stop capturing and close camera when the Scanner screen is unfocused.
        stop().then(/*no-op*/);
      };
    }, [camera, cvr]),
  );

  useEffect(() => {
    cvr.setInput(camera);
    camera.setCameraView(cameraView.current!!);

    let filter = new MultiFrameResultCrossFilter();
    filter.enableResultCrossVerification(EnumCapturedResultItemType.CRIT_DETECTED_QUAD, true);
    cvr.addFilter(filter);

    let receiver = cvr.addResultReceiver({
      onDetectedQuadsReceived: result => {
        if (
          result.items &&
          result.items.length > 0 &&
          /*This means you can manually click the button to navigate to the next page,
          or navigate to the next page when the item's crossVerificationStatus is PASSED.*/
          (ifBtnClick.current || result.items[0].crossVerificationStatus === EnumCrossVerificationStatus.CVS_PASSED)
        ) {
          ifBtnClick.current = false;
          /*Since the originalImage corresponding to originalImageHashId may be released after the callback ends,
          if you want to get the originalImage,
          you should call getOriginalImage(result.originalImageHashId) within the callback.*/
          global.originalImage = cvr.getIntermediateResultManager().getOriginalImage(result.originalImageHashId);
          global.quadsResult = result;
          if (global.originalImage.width > 0 && global.originalImage.height > 0) {
            navigation.navigate('Editor');
          }
        }
      },
    });

    return () => {
      cvr.removeResultReceiver(receiver);
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
