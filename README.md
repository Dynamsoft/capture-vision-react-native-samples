# Dynamsoft Capture Vision React-Native Edition

![version](https://img.shields.io/npm/v/dynamsoft-capture-vision-react-native.svg)
![downloads](https://img.shields.io/npm/dm/dynamsoft-capture-vision-react-native.svg)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/dynamsoft-capture-vision-react-native.svg)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/dynamsoft-capture-vision-react-native.svg)

<a href="https://www.dynamsoft.com/capture-vision/docs/introduction/">Dynamsoft Capture Vision (DCV) </a> is an aggregating SDK of a series of specific functional products including:

- Dynamsoft Camera Enhancer (DCE) which provides camera enhancements and UI configuration APIs.
- Dynamsoft Barcode Reader (DBR) which provides barcode decoding algorithm and APIs.
- Dynamsoft Label Recognizer (DLR) which provides label content recognizing algorithm and APIs.
- Dynamsoft Document Normalizer (DDN) which provides document scanning algorithms and APIs.

>Note: DCV React-Native edition currently only includes DCE and DBR modules. DLR and DDN modules are still under development and will be included in the future.

<span style="font-size:20px">Table of Contents</span>

- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Build Your Barcode Scanner App](#build-your-barcode-scanner-app)
  - [Set up Development Environment](#set-up-development-environment)
  - [Initialize the Project](#initialize-the-project)
  - [Include the Library](#include-the-library)
  - [Configure the Barcode Reader](#configure-the-barcode-reader)
  - [Rendering the UI](#rendering-the-ui)
  - [Configure Camera Permissions](#configure-camera-permissions)
  - [Run the Project](#run-the-project)
- [Samples](#samples)
- [API References](#api-references)
- [License](#license)
- [Contact](#contact)

## System Requirements

### React Native

- Supported Version: 0.60 or higher

### Android

- Supported OS: Android 5.0 (API Level 21) or higher.
- Supported ABI: **armeabi-v7a**, **arm64-v8a**, **x86** and **x86_64**.
- Development Environment: Android Studio 3.4+ (Android Studio 4.2+ recommended).
- JDK: 1.8+

### iOS

- Supported OS: **iOS 10.0** or higher.
- Supported ABI: **arm64** and **x86_64**.
- Development Environment: Xcode 7.1 and above (Xcode 13.0+ recommended), CocoaPods 1.11.0+.

### Others

- Node: 16.15.1 recommended

## Installation

- **yarn**

  ```bash
  yarn add dynamsoft-capture-vision-react-native
  ```

- **npm**

  ```bash
  npm install dynamsoft-capture-vision-react-native
  ```

## Build Your Barcode Scanner App

Now you will learn how to create a simple barcode scanner using Dynamsoft Capture Vision SDK.

### Set up Development Environment

If you are a beginner on React Native, please follow the guide on <a href="https://reactnative.dev/docs/environment-setup" target="_blank">React Native official website</a> to set up the development environment.

### Initialize the Project

Create a new React Native project.

```bash
npx react-native init SimpleBarcodeScanner
```

>Note: This sample uses react 17.0.2 and react-native 0.65.0.

### Include the Library

Add the SDK to your new project. Once the SDK is added, you will see a reference to it in the **package.json**.

- **yarn**

  ```bash
  yarn add dynamsoft-capture-vision-react-native
  ```

- **npm**

  ```bash
  npm install dynamsoft-capture-vision-react-native
  ```

For iOS, you must install the necessary native frameworks from cocoapods to run the application. In order to do this, the `pod install` command needs to be run as such:

```bash
cd ios
```

```bash
pod install
```

### Configure the Barcode Reader

In `App.js`, import the following components:

```js
import React from 'react';
import {Text} from 'react-native';
import {
    DynamsoftBarcodeReader,
    DynamsoftCameraView,
    EnumBarcodeFormat
} from 'dynamsoft-capture-vision-react-native';
```

Next in `App.js`, let's define the `state` to your component. In the `state`, add a `results` variable, initialized to null. In the following steps, we will store the newly decoded barcodes to `results`.

```js
class App extends React.Component {
    state = {
        results: null
    };
}
export default App;
```

Next is the `componentDidMount` implementation. First up is adding the code to start barcode decoding:

```js
class App extends React.Component {
    ...
    componentDidMount() {
        (async () => {
            // Initialize the license so that you can use full feature of the Barcode Reader module.
            try {
                await DynamsoftBarcodeReader.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9")
            } catch (e) {
                console.log(e);
            }
            // Create a barcode reader instance.
            this.reader = await DynamsoftBarcodeReader.createInstance();
            // Enable video barcode scanning.
            // If the camera is opened, the barcode reader will start the barcode decoding thread when you triggered the startScanning.
            // The barcode reader will scan the barcodes continuously before you trigger stopScanning.
            await this.reader.startScanning();
            // Add a result listener. The result listener will handle callback when barcode result is returned. 
            this.reader.addResultListener((results) => {
                // Update the newly detected barcode results to the state.
                this.setState({results});
            });
        })();
    }
    ...
}
```

After implementing `componentDidMount`, `componentWillUnmount` will then include code to stop the barcode decoding and remove the result listener.

```js
class App extends React.Component {
    ...
    async componentWillUnmount() {
        // Stop the barcode decoding thread when your component is unmount.
        await this.reader.stopScanning();
        // Remove the result listener when your component is unmount.
        this.reader.removeAllResultListeners();
    }
    ...
}
```

### Rendering the UI

Lastly, let's create the `DynamsoftCameraView` UI component in the `render` function.

```jsx
class App extends React.Component {
    ...
    render() {
        // Add code to fetch barcode text and format from the BarcodeResult
        let results = this.state.results;
        let resultBoxText = "";
        if (results && results.length>0){
            for (let i=0;i<results.length;i++){
                resultBoxText+=results[i].barcodeFormatString+"\n"+results[i].barcodeText+"\n";
            }
        }
        // Render DynamsoftCameraView componment.
        return (
            <DynamsoftCameraView
                style={
                    {
                        flex: 1
                    }
                }
                ref = {(ref)=>{this.scanner = ref}}
                overlayVisible={true}
            >
                {/*Add a text box to display the barcode result.*/}
                <Text style={
                    {
                        flex: 0.9,
                        marginTop: 100,
                        textAlign: "center",
                        color: "white",
                        fontSize: 18,
                    }
                }>{results && results.length > 0 ? resultBoxText : "No Barcode Detected"}</Text>
            </DynamsoftCameraView>
        );
    }
}
```

### Configure Camera Permissions

You need to set the "Privacy - Camera Usage Description" field in the `Info.plist` file for iOS. If this property is not set, the iOS application will fail at runtime. In order to set this property, you might need to use Xcode and open the corresponding `.xcworkspace` located in the `ios` folder. Once open, you can edit the `Info.plist` to include this property.

### Run the Project

#### Run Android on Windows

In the command line interface (we recommend using Powershell), go to your project folder and run the following command:

```bash
npx react-native run-android
```

#### Run iOS on macOS

In the terminal, go to the project folder in your project:

```bash
npx react-native run-ios
```

> Note:
>
>- The application needs to run on a physical device rather than a simulator as it requires the use of the camera. If you try running it on a simulator, you will most likely run into a number of errors/failures.
>- On iOS, in order to run the React Native app on a physical device you will need to install the [`ios-deploy`](https://www.npmjs.com/package/ios-deploy) library. Afterwards, you can run the react native app from the terminal as such `npx react-native run-ios --device` assuming it's the only device connected to the Mac.
>- Alternatively on iOS, you can simply open the `xcworkspace` of the project found in the `ios` folder using Xcode and run the sample on your connected iOS device from there. The advantage that this offers is that it is easier to deal with the developer signatures for deployment in there.

## Samples

You can view all the DCV React Native samples via the following links:

- <a href = "https://github.com/Dynamsoft/capture-vision-react-native-samples/tree/main/BarcodeReaderSimpleSample" target = "_blank" >Barcode reader simple sample</a>

## API References

View the API reference of DCV React Native Edition to explore the full feature of DCV:

- <a href = "https://www.dynamsoft.com/capture-vision/docs/programming/react-native/api-reference/?ver=latest" target = "_blank" >DCV API Reference - React Native Edition</a>
  - <a href = "https://www.dynamsoft.com/capture-vision/docs/programming/react-native/api-reference/barcode-reader.html?ver=latest" target = "_blank" >DynamsoftBarcodeReader Class</a>
  - <a href = "https://www.dynamsoft.com/capture-vision/docs/programming/react-native/api-reference/camera-view.html?ver=latest" target = "_blank" >DynamsoftCameraEnhancer Class</a>

## License

- You can also request an extension for your trial license in the [customer portal](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=github)

## Contact

https://www.dynamsoft.com/company/contact/
