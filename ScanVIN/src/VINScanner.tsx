import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  EnumCapturedResultItemType,
  LicenseManager,
  MultiFrameResultCrossFilter,
  ParsedResult,
  ParsedResultItem
} from 'dynamsoft-capture-vision-react-native';
import {EnumResultStatus, parsedItemToVINData, VINScanResult,} from './VINScanResult.tsx';

export interface ScannerViewProps {
  onComplete: (result: VINScanResult) => void;
}

export function ScannerView({onComplete}: ScannerViewProps) {
  const cameraView = useRef<CameraView | null>(null);
  const camera = CameraEnhancer.getInstance();
  const cvr = CaptureVisionRouter.getInstance();
  const [tips, setTips] = useState<string>('');

  // License and permission setup
  useEffect(() => {
    // Initialize the license.
    // The license string here is a trial license. Note that network connection is required for this license to work.
    // You can request an extension via the following link: https://www.dynamsoft.com/customer/license/trialLicense?product=cvs&utm_source=samples&package=react-native
    LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9').catch(() => {
      // Ignore error here; it will be handled by startCapturing
    });
    CameraEnhancer.requestCameraPermission();

    // Handle Android back button as cancel action
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onComplete({resultStatus: EnumResultStatus.RS_CANCELED});
      return true;
    });

    return () => {
      sub.remove();
      onComplete({resultStatus: EnumResultStatus.RS_CANCELED});
    };
  }, [onComplete]);

  // Start scanning and capture result
  useEffect(() => {
    cvr.setInput(camera);

    //Enable the verification for text recognition
    let filter = new MultiFrameResultCrossFilter();
    filter.enableResultCrossVerification(EnumCapturedResultItemType.CRIT_TEXT_LINE,  true);
    cvr.addFilter(filter);

    camera.setCameraView(cameraView.current!);
    camera.setScanRegion({left: 0.1, top: 0.4, right: 0.9, bottom: 0.6, measuredInPercentage: true});

    const receiver = cvr.addResultReceiver({
      onParsedResultsReceived: (result: ParsedResult) => {
        if (result.items && result.items.length > 0) {
          let parsedItem: ParsedResultItem;
          if(result.items.length === 1) {
            parsedItem = result.items[0];
          } else if(result.items.length > 1) {
            for (let item of result.items) {
              //Information extracted from a barcode should have a higher priority
              if(item.targetROIDefName?.includes('vin-barcode')) {
                parsedItem = item;
              }
            }
          }
          const data = parsedItemToVINData(parsedItem!!);
          if (data) {
            onComplete({
              resultStatus: EnumResultStatus.RS_FINISHED,
              errorCode: 0,
              data,
            });
          } else {
            setTips('Failed to parse result: essential information (name or license number) is missing.');
          }
        }
      },
    });

    camera.open();
    cvr.startCapturing('ReadVIN').catch((e) => {
      onComplete({
        resultStatus: EnumResultStatus.RS_ERROR,
        errorCode: e.code,
        errorString: e.message,
      });
    });

    return () => {
      cvr.removeResultReceiver(receiver);
      cvr.removeFilter(filter);
      cvr.stopCapturing();
      camera.close();
      camera.setCameraView(null);
    };
  }, [camera, cameraView, cvr, onComplete]);

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraView}/>

      <TouchableOpacity style={styles.imageButton} onPress={()=>onComplete({resultStatus: EnumResultStatus.RS_CANCELED})}>
        <Image
          source={require('./assets/icon_close.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Text style={styles.tips}>{tips}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  tips: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 20,
  },
  imageButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
