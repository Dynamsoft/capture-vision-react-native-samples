# React Native Mobile Barcode Scanner

A barcode scanner component for React Native built on top of [Dynamsoft Mobile Barcode SDK](https://www.dynamsoft.com/barcode-reader/sdk-mobile/).

## What You Should Know

- [![](https://img.shields.io/badge/Download-Offline%20SDK-orange)](https://www.dynamsoft.com/barcode-reader/downloads)
- [![](https://img.shields.io/badge/Get-30--day%20FREE%20Trial%20License-blue)](https://www.dynamsoft.com/customer/license/trialLicense/?product=dbr)

## Required Environment

- Node
- JDK
- Xcode
- Android Studio

## Getting Started

### Preparations

1. Create a new React Native project.

```bash
npx react-native init newBarcodeScanner
```

2. Open the project folder and find **package.json**. In the file, add the library to your project dependencies.

```json
"dependencies": {
    "react": "16.9.0",
    "react-native": "0.61.1",
    "react-native-canvas": "^0.1.37",
    "rn-mobile-barcode-scanner": "^8.9.3",
    "react-native-webview": "^11.2.0"
}
```

3. In the command line, open your project folder and run yarn install.

```bash
yarn install
```

4. Return to the project folder. In **App.js**, use the following code to replace the original code.

```js
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { DBRRNCamera } from 'rn-mobile-barcode-scanner';
import Canvas from 'react-native-canvas';
const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width
class CameraScreen extends React.Component {
  state = {
    license: '-- put your license here -- ',
    barcodeFormat: DBRRNCamera.Constants.DynamsoftBarcodeFormats.BarcodeFormat.ALL,
    barcodeFormat2: DBRRNCamera.Constants.DynamsoftBarcodeFormats.BarcodeFormat2.NULL,
    type: 'back',
    canDetectBarcode: false,
    barcodes: [{
      type: '',
      data: '',
      localizationResult: []
    }]
  };

  toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

  barcodeRecognized = ({ barcodes }) => {
    this.setState({
      barcodes: barcodes
    });
  }

  handleCanvas = (canvas,barcodes) => {
    if (canvas) {
      canvas.width = deviceW
      canvas.height = deviceH
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'green'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.5
      for(let res of this.state.barcodes){
        if (res.localizationResult.length > 0) {
          let loc = res.localizationResult
          // console.log('canvas', res.data)
          ctx.beginPath()
          ctx.moveTo(loc[0], loc[1])
          ctx.lineTo(loc[2], loc[3])
          ctx.lineTo(loc[4], loc[5])
          ctx.lineTo(loc[6], loc[7])
          ctx.fill()
          ctx.closePath()
          ctx.stroke()
        }
      }
    }else{
      // console.log('no canvas')
    }
  }

  renderBarcodes = () => (
    <React.Fragment key={this.state.barcodes.length}>
      {this.state.barcodes.map((barcodes)=><Canvas style={[styles.overlay]} ref={cvs=>this.handleCanvas(cvs,barcodes)} key={this.state.barcodes.length}/>)}
      <Text style={styles.textBlock}>{this.state.barcodes[0] ?'result:'+ this.state.barcodes[0].data:'result: null'}</Text>
    </React.Fragment>
  );

  renderCamera() {
    const { canDetectBarcode } = this.state;
    return (
        <DBRRNCamera
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
        </DBRRNCamera>
    );
  }

  render() {
    return (
    <View style={styles.container}>{this.renderCamera()}</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    height: 'auto',
    color: 'white',
    textAlign: 'center',
    padding: 10,
    flexWrap: 'wrap'
  },
  overlay: {
    flex: 1,
  },
});

export default CameraScreen;
```

### Build And Run Android

If you have completed the preparations, use the following command to run the project on your device.

```bash
npx react-native run-android
```

### Build And Run iOS

1. Go to the **ios** folder in your project, run pod install

```bash
cd ios
```

```bash
pod install
```

2. Go back to the project folder and run the project.

```bash
cd ..
```

```bash
npx react-native run-ios
```
