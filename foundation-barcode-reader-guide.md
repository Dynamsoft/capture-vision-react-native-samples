# Foundational Barcode Reader Integration Guide

In this guide, we will explore the Barcode Reader features of the [Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/core/introduction/) SDK.

## Supported Barcode Symbologies

| Linear Barcodes (1D) | 2D Barcodes | Others |
| :------------------- | :---------- | :----- |
| Code 39 (including Code 39 Extended)<br>Code 93<br>Code 128<br>Codabar<br>Interleaved 2 of 5<br>EAN-8<br>EAN-13<br>UPC-A<br>UPC-E<br>Industrial 2 of 5<br><br><br><br><br><br><br><br> | QR Code (including Micro QR Code and Model 1)<br>Data Matrix<br>PDF417 (including Micro PDF417)<br>Aztec Code<br>MaxiCode (mode 2-5)<br>DotCode<br><br><br><br><br><br><br><br><br><br><br><br> | Patch Code<br><br>GS1 Composite Code<br><br>GS1 DataBar<br><li>Omnidirectional</li><li>Truncated, Stacked</li><li>Stacked Omnidirectional, Limited</li><li>Expanded, Expanded Stacked</li><br>Postal Codes<br><li>USPS Intelligent Mail</li><li>Postnet</li><li>Planet</li><li>Australian Post</li><li>UK Royal Mail</li> |

## System Requirements

### React Native

- Supported Version: 0.71.0 or higher

### Android

- Supported OS: Android 5.0 (API Level 21) or higher.
- Supported ABI: armeabi-v7a, arm64-v8a, x86 and x86_64.
- Development Environment: Android Studio 2022.2.1 or higher.

### iOS

- Supported OS: iOS 11+ (iOS 13+ recommended).
- Supported ABI: arm64 and x86_64.
- Development Environment: Xcode 13+ (Xcode 14.1+ recommended).

### Others

- Node: 18 or higher

## Installation

Run the following commands in the root directory of your react-native project to add `dynamsoft-capture-vision-react-native` into dependencies

```bash
# using npm
npm install dynamsoft-capture-vision-react-native

# OR using Yarn
yarn add dynamsoft-capture-vision-react-native
```

then run the command to install all dependencies:

```bash
# using npm
npm install 

# OR using Yarn
yarn install
```

For iOS, you must install the necessary native frameworks from CocoaPods by running the pod install command as below:

```bash
cd ios
pod install
```

## Configure Native Projects

The Dynamsoft Capture Vision SDK needs the camera permission to use the camera device, so it can capture from video stream.

### Android

For Android, we have defined camera permission within the SDK, you don't need to do anything.

### iOS

For iOS, you need to include the camera permission in `ios/your-project-name/Info.plist` inside the `<dict>` element:

```
<key>NSCameraUsageDescription</key>
    <string></string>
```

## Build the Barcode Reader Component

Now that the package is added, it's time to start building the barcode reader component using the SDK.

### Initialize License

The first step in code configuration is to initialize a valid license via `LicenseManager.initLicense`.

```typescript jsx
import {LicenseManager} from 'dynamsoft-capture-vision-react-native';

LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9")
.then(()=>{/*Init license successfully.*/})
.catch(error => console.error("Init License failed.", error));
```

> [!NOTE]
>
>- The license string here grants a time-limited free trial which requires network connection to work.
>- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=guide&package=mobile) link.

### Request Camera Permission

Before opening camera to start scanning barcodes, you need to request camera permission from system.

```typescript jsx
import {CameraEnhancer} from 'dynamsoft-capture-vision-react-native';

CameraEnhancer.requestCameraPermission();
```

### Implement Barcode Scanning from Video Stream

The basic workflow of scanning barcodes from video stream is as follows:

- Initialize the `CameraEnhancer` object
- Initialize the `CaptureVisionRouter` object
- Bind the `CameraEnhancer` object to the `CaptureVisionRouter` object
- Register a `CapturedResultReceiver` object to listen for decoded barcodes via the callback function `onDecodedBarcodesReceived`
- Open the camera
- Start barcode scanning via `startCapturing`

```typescript jsx
import React, {useEffect, useRef, useState} from 'react';
import {CameraEnhancer, CameraView, CaptureVisionRouter, DecodedBarcodesResult, EnumPresetTemplate} from 'dynamsoft-capture-vision-react-native';

export function Scanner() {
  const cameraView = useRef<CameraView>(null); // Create a reference to the CameraView component using useRef.
  const camera = CameraEnhancer.getInstance(); //Get the singleton instance of CameraEnhancer
  const router = CaptureVisionRouter.getInstance(); //Get the singleton instance of CaptureVisionRouter

  useEffect(() => {
    router.setInput(camera); //Bind the CaptureVisionRouter and ImageSourceAdapter before router.startCapturing()
    camera.setCameraView(cameraView.current!!); //Bind the CameraEnhancer and CameraView before camera.open()
    
    /**
     * Adds a CapturedResultReceiver object to listen the captured result.
     * In this sample, we only listen DecodedBarcodesResult generated by Dynamsoft Barcode Reader module.
     * */
    let resultReceiver = router.addResultReceiver({
      onDecodedBarcodesReceived: (result: DecodedBarcodesResult) =>  {
        //Handle the `result`    
      },
    });

    /**
     * Open the camera when the component is mounted. 
     * Please remember to request camera permission before it.
     * */
    camera.open();
    
    /**
     * Start capturing when the component is mounted.
     * In this sample, we start capturing by using `readSingleBarcode` template.
     * You can also try other Preset-Template in EnumPresetTemplate. 
     * */
    router.startCapturing(EnumPresetTemplate.PT_READ_SINGLE_BARCODE);
    
    return () => {
      //Remove the receiver when the component is unmounted.
      router.removeResultReceiver(resultReceiver);
      
      //Close the camera when the component is unmounted.
      camera.close();
      
      //Stop capturing when the component is unmounted.
      router.stopCapturing();
    }
  }, [camera, router, cameraView]);

  return (
    <CameraView style={{flex: 1}} ref={cameraView}>
    {/* you can add your own view here as the children view of CameraView */}
    </CameraView>
  );
}
```

## Customize the Barcode Reader

### Specify Barcode Formats and Count

There are several ways in which you can customize the Barcode Reader.

- Using the `SimplifiedCaptureVisionSettings` interface and `updateSettings` API

```typescript jsx
import {
  CaptureVisionRouter,
  EnumBarcodeFormat, EnumPresetTemplate,
  SimplifiedCaptureVisionSettings
} from "dynamsoft-capture-vision-react-native";

let router = CaptureVisionRouter.getInstance()
let settings: SimplifiedCaptureVisionSettings = {
  timeout: 1000,
  barcodeSettings: {
    // Set the expected barcode count to 0 when you are not sure how many barcodes you are scanning.
    // Set the expected barcode count to 1 can maximize the barcode decoding speed.
    expectedBarcodesCount: 0,
    barcodeFormatIds: EnumBarcodeFormat.BF_ONED | EnumBarcodeFormat.BF_QR_CODE | EnumBarcodeFormat.BF_PDF417 | EnumBarcodeFormat.BF_DATAMATRIX,
  }
};
//Only timeout, expectedBarcodesCount and barcodeFormatIds will be updated and undefined properties will retain their original values.
router.updateSettings(settings, EnumPresetTemplate.PT_READ_SINGLE_BARCODE);
router.startCapturing(EnumPresetTemplate.PT_READ_SINGLE_BARCODE);
```

- Using the `initSettings` API. It must be called before `CaptureVisionRouter.startCapturing`

```typescript jsx
import {CaptureVisionRouter} from "dynamsoft-capture-vision-react-native";
let router = CaptureVisionRouter.getInstance();

//Use require to get the jsonString or you can directly use initSettings("{raw Json String}")
router.initSettings(JSON.stringify(require('./settings.json')));
//...
router.startCapturing();
```

> [!NOTE]
>
> - A template file is a JSON file that includes a series of algorithm parameter settings. It is always used to customize the performance for different usage scenarios. [Contact us](https://www.dynamsoft.com/company/contact/) to get a customized template for your barcode scanner.

### Specify the Scan Region

You can also limit the scan region of the SDK so that it doesn't exhaust resources trying to read from the entire image or frame.

```typescript jsx
import {CameraEnhancer} from "dynamsoft-capture-vision-react-native";

let camera = CameraEnhancer.getInstance()
let scanRegion = {
  top: 0.25,
  bottom: 0.75,
  left: 0.25,
  right: 0.75,
  measuredInPercentage: true,
}
camera.setScanRegion(scanRegion);
```

## Run the Project

Go to your project folder, open a _new_ terminal and run the following command:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

#### Signing

- Open the **workspace** file `*.xcworkspace` (not .xcodeproj) from the `ios` directory in Xcode.
- Adjust *Provisioning* and *Signing* settings.

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running on your device.
This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

> [!NOTE]
> If you want to run Android via `Windows`, You may encounter some build errors due to the `Windows Maximum Path Length Limitation`.
> Therefore, we recommend that you move the project to a directory with a shorter path.

## How to Use the New Architecture of React Native (Optional)

[How to enable new architecture in Android](https://reactnative.dev/architecture/landing-page#android)

[How to enable new architecture in iOS](https://reactnative.dev/architecture/landing-page#ios)

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
