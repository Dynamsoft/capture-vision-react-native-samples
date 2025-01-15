import React, {useEffect, useRef, useState} from 'react';
import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumCapturedResultItemType,
  FeedBack,
  LicenseManager,
  MultiFrameResultCrossFilter,
} from 'dynamsoft-capture-vision-react-native';
import {StackNavigation} from './App.tsx';
import {SwitchButton} from './ui/SwitchButton.tsx';
import {AppState, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {ButtonGroup} from './ui/ButtonGroup.tsx';
import {TextStartWithIcon} from './ui/TextStartWithIcon.tsx';
import {useFocusEffect} from '@react-navigation/native';
import {parsedItemToMRZResult} from './MRZResult.tsx';

export default function Scanner({navigation}: StackNavigation) {
  const cameraView = useRef<CameraView>(null);
  const camera = CameraEnhancer.getInstance();
  const cvr = CaptureVisionRouter.getInstance();
  const template = useRef<'ReadPassportAndId' | 'ReadId' | 'ReadPassport'>('ReadPassportAndId');
  const needBeep = useRef(false);
  const [displayText, setDisplayText] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [startError, setStartError] = useState('');
  CameraEnhancer.requestCameraPermission().then(/*no-op*/);

  useFocusEffect(
    React.useCallback(() => {
      const start = () => {
        camera.open();
        return cvr.startCapturing(template.current);
      };

      const stop = () => {
        camera.close();
        return cvr.stopCapturing();
      };

      //Start capturing and open camera when the Scanner screen is focused.
      start().catch(e => setStartError(e.message));

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
    LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9').catch(e => {
      setLicenseError(e.message);
    });
    camera.setCameraView(cameraView.current!!);
    cvr.setInput(camera);

    let filter = new MultiFrameResultCrossFilter();
    filter.enableResultCrossVerification(EnumCapturedResultItemType.CRIT_TEXT_LINE, true);
    cvr.addFilter(filter);

    let recognizedText = '';
    let receiver = cvr.addResultReceiver({
      onRecognizedTextLinesReceived: result => {
        recognizedText = !result.items || result.items?.length === 0 ? '' : result.items.map(item => item.text).join('\n');
      },
      onParsedResultsReceived: result => {
        let mrzResult;
        if (result.items && result.items.length > 0 && (mrzResult = parsedItemToMRZResult(result.items[0]))) {
          setDisplayText('');
          if (needBeep.current) {
            FeedBack.beep();
          }
          navigation.navigate('ResultPage', {mrzResult: mrzResult});
        } else {
          setDisplayText(recognizedText);
        }
      },
    });

    return () => {
      cvr.removeResultReceiver(receiver);
      cvr.removeFilter(filter);
    };
  }, [camera, cameraView, cvr, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <CameraView ref={cameraView} style={styles.contentView}>
        <SwitchButton style={styles.musicButton} stateListener={state => (needBeep.current = state === 'on')} />
        {startError.length > 0 && <TextStartWithIcon style={styles.iconErrorText} text={startError} />}
        {licenseError.length > 0 && <TextStartWithIcon style={styles.iconErrorText} text={`License initialization failed: ${licenseError}`} />}
        {displayText.length > 0 && (
          <View style={styles.textContainer}>
            <Text style={styles.parsedErrorText}>Error: Failed to parse the content.</Text>
            <Text style={styles.resultText}>{`The MRZ text is:\n${displayText}`}</Text>
          </View>
        )}
        <View style={styles.tipImageContainer}>
          <Image source={require('./img/passport_frame.png')} style={styles.tipImage} resizeMode={'contain'} />
        </View>
        <Text style={styles.bottomText}>{' Powered by Dynamsoft '}</Text>
        <ButtonGroup
          style={styles.btnGroup}
          buttons={['ID', 'Passport', 'Both']}
          selection={2}
          onSelectionChange={(_, button) => {
            template.current = button === 'ID' ? 'ReadId' : button === 'Passport' ? 'ReadPassport' : 'ReadPassportAndId';
            cvr.stopCapturing().then(() => {
              cvr.startCapturing(template.current).catch(e => console.log('switch template', e.message));
            });
          }}
        />
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  contentView: {flex: 1, alignItems: 'center'},
  musicButton: {width: 56, height: 56, alignSelf: 'flex-start', marginTop: 24, marginLeft: 23},
  tipImage: {width: '88%', marginBottom: 20},
  tipImageContainer: {position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 0, left:0, right: 0, bottom:0},
  btnGroup: {position: 'absolute', alignSelf: 'center', bottom: 99, width: '75%'},
  bottomText: {fontSize: 16, color: '#999999', marginTop: 10, lineHeight: 21, position: 'absolute', bottom: 36},
  textContainer: {position: 'absolute', bottom: 226, marginHorizontal: 35},
  parsedErrorText: {fontSize: 14, color: 'red', lineHeight: 24},
  resultText: {fontSize: 12, color: 'white', marginTop: 10, lineHeight: 20},
  iconErrorText: {backgroundColor: '#00000033', alignSelf: 'flex-start', marginHorizontal: 23, marginTop: 10},
});
