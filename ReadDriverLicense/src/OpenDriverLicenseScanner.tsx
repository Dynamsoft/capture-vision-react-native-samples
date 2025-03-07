import React, {useEffect, useRef, useState, useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  LicenseManager,
  ParsedResult,
} from 'dynamsoft-capture-vision-react-native';
import {
  DriverLicenseScanResult,
  EnumResultStatus,
  parsedItemToDriverLicenseData,
} from './DriverLicenseScanResult.tsx';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {Text} from 'react-native';

type routeType = {
  route: RouteProp<
    Record<'DriverLicenseScanner', {resolverId: string}>,
    'DriverLicenseScanner'
  >;
};

//Driver License Scanner Page
function DriverLicenseScanner({route}: routeType) {
  const {resolverId} = route.params;
  const navigation = useNavigation();
  const cameraView = useRef<CameraView | null>(null);
  const camera = CameraEnhancer.getInstance();
  const cvr = CaptureVisionRouter.getInstance();
  const [tips, setTips] = useState('');
  const handleComplete = useCallback((result: DriverLicenseScanResult) => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      resolvePromise(resolverId, result);
    }, [navigation, resolverId]);

  useEffect(() => {
    LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9').catch(() => {
      //Do nothing here. This error will also be caught and handled in startCapturing.
    });
    CameraEnhancer.requestCameraPermission();

    return () => {
      handleComplete({
        resultStatus: EnumResultStatus.RS_CANCELED,
      });
    };
  }, [handleComplete]);

  useEffect(() => {
    cvr.setInput(camera);
    camera.setCameraView(cameraView.current!!);
    const receiver = cvr.addResultReceiver({
      onParsedResultsReceived: (result: ParsedResult) => {
        if (result.items && result.items.length > 0) {
          let data = parsedItemToDriverLicenseData(result.items[0]);
          if (data) {
            handleComplete({
              resultStatus: EnumResultStatus.RS_FINISHED,
              errorCode: 0,
              data: data,
            });
          } else {
            setTips('Failed to parse the result.\nThe driver\'s information does not exist in the barcode or important details (name or license number) are missing.');
          }
        }
      },
    });
    cvr.addResultReceiver(receiver);
    camera.open();
    cvr.startCapturing('ReadDriversLicense').catch(e => {
      handleComplete({
        resultStatus: EnumResultStatus.RS_ERROR,
        errorString: e.message,
      });
    });

    return () => {
      cvr.removeResultReceiver(receiver);
      cvr.stopCapturing();
      camera.close();
    };
  }, [cameraView, camera, cvr, handleComplete]);

  return (
    <CameraView style={{flex: 1}} ref={cameraView}>
      <Text style={{color: 'white', position: 'absolute', bottom: 60}}>
        {tips}
      </Text>
    </CameraView>
  );
}

const resolvers: {[key: string]: (r: DriverLicenseScanResult) => void} = {};
const createResolver = (resolverId: string, resolve: (r: DriverLicenseScanResult) => void) => {
  resolvers[resolverId] = resolve;
};
const resolvePromise = (resolverId: string, result: DriverLicenseScanResult) => {
  if (resolvers[resolverId]) {
    resolvers[resolverId](result);
    delete resolvers[resolverId];
  }
};

type Navigation = {
  navigate: (route: string, params: {[key: string]: any}) => void;
};
export const openDriverLicenseScanner = (navigation: Navigation): Promise<DriverLicenseScanResult> => {
  return new Promise(resolve => {
    const resolverId = Date.now().toString();
    createResolver(resolverId, resolve);
    navigation.navigate('DriverLicenseScanner', {resolverId: resolverId});
  });
};

const Stack = createNativeStackNavigator<{DriverLicenseScanner: {resolverId:string}}>();
export const getDriverLicenseScannerScreen = () => {
  return (
    <Stack.Screen
      name="DriverLicenseScanner"
      options={{headerShown: false}}
      component={DriverLicenseScanner}
    />
  );
};
