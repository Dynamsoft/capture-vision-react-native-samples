# Dynamsoft Capture Vision React-Native Edition

Dynamsoft Capture Vision (DCV) is an aggregating SDK of a series of specific functional products including:

- Dynamsoft Barcode Reader (DBR) which provides barcode decoding algorithm and APIs.
- Dynamsoft Label Recognizer (DLR) which provides label content recognizing algorithm and APIs.
- Dynamsoft Document Normalizer (DDN) which provides document scanning algorithms and APIs.
- Dynamsoft Camera Enhancer (DCE) which provides camera enhancements and UI configuration.

## Environment

- Node
- JDK
- Xcode
- Android Studio

## Quick Deployment

In this section, you will be guided on how to work with DCV on a new project.

Firstly, in the newly created project, open the **package.json** file and add the dependency of DCV.

```json
"dependencies": {
   "react": "17.0.2",
   "react-native": "0.65.0",
   "dynamsoft-capture-vision-react-native": "1.0.0"
}
```

In the command line, use yarn or npm to add the library.

Now, the DCV library is added to your project. You can add the following code to activate barcode decoding, label recognizing or document scanning features in your project.

### Add Code for Barcode Decoding

Open the **App.js** file in your project and replace the content with the following code.

```js
import React from 'react';
import {Text} from 'react-native';
import {
   DynamsoftBarcodeReader,
   DynamsoftCameraView,
   BarcodeResult,
   EnumDBRPresetTemplate,
   Region,
   EnumBarcodeFormat,
   DBRRuntimeSettings
} from 'henry-capture-vision-react-native';

class App extends React.Component {
   state = {
      results: null
   };

   componentDidMount() {
      (async () => {
         try {
            // Initialize license for DynamsoftBarcodeReader Module.
            // The string "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9" here is a time-limited public trial license. Note that network connection is required for this license to work.
            // You can also request an extension for your trial license in the customer portal: https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=guide&package=rn
            await DynamsoftBarcodeReader.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9")
         } catch (e) {
            console.log(e)
         }

         this.reader = await DynamsoftBarcodeReader.createInstance();
         await this.reader.updateRuntimeSettings(EnumDBRPresetTemplate.DEFAULT);
         let settings: DBRRuntimeSettings = await this.reader.getRuntimeSettings();
         // Set the expected barcode count to 0 when you are not sure how many barcodes you are scanning.
         // Set the expected barcode count to 1 can maximize the barcode decoding speed.
         settings.expectedBarcodesCount = 0;
         settings.barcodeFormatIds = EnumBarcodeFormat.BF_ONED | EnumBarcodeFormat.BF_QR_CODE;
         await this.reader.updateRuntimeSettings(settings)

         await this.reader.startScanning();
         this.reader.addResultListener((results: BarcodeResult[]) => {
            this.setState({results: results})
            console.log(results.length)
         })
      })();
   }

   async componentWillUnmount() {
      await this.reader.stopScanning()
      this.reader.removeAllResultListeners()
   }

   render() {
      let region: Region;        
      let barcode_text = "";
      region = {
         regionTop: 30,
         regionLeft: 15,
         regionBottom: 70,
         regionRight: 85,
         regionMeasuredByPercentage: true
      }

      let results: BarcodeResult[] = this.state.results;
      if (results && results.length > 0){
         for (var i=0; i<results.length; i++) {
            barcode_text += results[i].barcodeFormatString+":"+results[i].barcodeText+"\n"
         }
         console.log(barcode_text);
      }

      return (
         <DynamsoftCameraView
            style={{
               flex: 1,
            }}
            ref = {(ref)=>{this.scanner = ref}}
            overlayVisible={true}
            scanRegionVisible={true}
            scanRegion={region}
         >
         <Text style={{
            flex: 0.9,
            marginTop: 100,
            textAlign: "center",
            color: "white",
            fontSize: 18,
         }}>{results && results.length > 0 ? barcode_text : "null"}</Text>
         </DynamsoftCameraView>
      );
   }
}

export default App;
```

### Build and Run Android

In the command line, run the following command:

```bash
npx react-native run-android
```

### Build and Run iOS

1. Go to the iOS folder. Run pod install to add the library to your iOS project.

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

## View Sample

You can view all the DCV samples via the following links:

- <a href = "https://github.com/Dynamsoft/capture-vision-react-native-samples/BarcodeReaderSimpleSample" target = "_blank" >DCV barcode decoding simple sample</a>

## API References

View the API reference of DCV React Native Edition to explore the full feature of DCV.

- <a href = "https://www.dynamsoft.com/capture-vision/docs/programming/react-native/api-reference/?ver=latest" target = "_blank" >DCV API Reference - React Native Edition</a>
  - <a href = "https://www.dynamsoft.com/capture-vision/docs/programming/react-native/api-reference/barcode-reader.html?ver=latest" target = "_blank" >DynamsoftBarcodeReader Class</a>
  - <a href = "https://www.dynamsoft.com/capture-vision/docs/programming/react-native/api-reference/camera-view.html?ver=latest" target = "_blank" >DynamsoftCameraEnhancer Class</a>

Feel free to <a href = "https://www.dynamsoft.com/company/contact/" target = "_blank">contact us</a> if you have any questions about DCV.
