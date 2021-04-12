# React Native Mobile Barcode Scanner

A barcode scanner component for React Native built on top of [Dynamsoft Mobile Barcode SDK](https://www.dynamsoft.com/barcode-reader/sdk-mobile/). 



## Development Requirements

- Node
- JDK
- Xcode 
- Android Studio. 

## Quick Start
1. Find the examples/basic folder:

    ```bash
    yarn(recommend) or npm install 
    ```

2. for iOS, find the examples/basic/ios, run `pod install`.
3. Build and run the demo:

    ```bash
    npx react-native run-android
    npx react-native run-ios
    ```

### Screenshots
<kbd><img src="https://www.dynamsoft.com/codepool/img/2021/react-native-barcode-scanner.png" width="50%">

## How to Use the Barcode Scanner Module

1. Create a new React Native project:

    ```bash
    react-native init NewProject
    ```
2. Mostly automatic install with autolinking (RN > 0.60)
    ```bash
    1). `npm install RN-mobile-barcode-scanner --save`
    2). Run `cd ios && pod install && cd ..`
    Mostly automatic install with react-native link (RN < 0.60)
    1). `npm install RN-mobile-barcode-scanner --save`
    2). `react-native link RN-mobile-barcode-scanner`
    ```
3. Install the latest `rn-mobile-barcode-scanner` and save it to `package.json`.

    ```json
    "dependencies": {
        "react": "16.9.0",
        "react-native": "^0.61.1",
        "rn-mobile-barcode-scanner": "^8.2.0"
    },
    ```

4. Use the module in `App.js`.

    ```js
    import {NativeModules} from 'react-native';
    import { RNCamera } from 'rn-mobile-barcode-scanner';
    import Canvas from 'react-native-canvas';
    
    state = {
        license: '-- put your license here -- ',
        barcodeFormat: RNCamera.Constants.DynamsoftBarcodeFormats.BarcodeFormat.ALL,
        barcodeFormat2: RNCamera.Constants.DynamsoftBarcodeFormats.BarcodeFormat2.NULL,
        type: 'back',
        canDetectBarcode: false,
        barcodes: [{
          type: '',
          data: '',
          localizationResult: []
        }]
      };
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
        type={this.state.type}
        license={this.state.license}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onDynamsoftBarcodesReader={canDetectBarcode ? this.barcodeRecognized : null}
        barcodeFormat={this.state.barcodeFormat}
        barcodeFormat2={this.state.barcodeFormat2}
      >
        <View style={{height:'100%'}}>
          <View style={{height:'90%'}}>
          {!!canDetectBarcode && this.renderBarcodes()}
          </View>
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <TouchableOpacity 
              onPress={this.toggle('canDetectBarcode')}
              style={[styles.flipButton, { flex: 0.5, alignSelf: 'center' }]}
            >
              <Text style={styles.flipText}>{!canDetectBarcode ? 'Decode' : 'Decoding'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNCamera>  
    ```

## License Key

You can get a [30-day FREE Trial License](https://www.dynamsoft.com/customer/license/trialLicense) online. Without a valid license, the SDK can work but only return obfuscated results.

## Contact Us
If there are any questions, please feel free to contact support@dynamsoft.com.
