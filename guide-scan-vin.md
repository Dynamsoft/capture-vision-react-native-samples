# VIN Scanner Integration Guide

In this guide, we will explore the VIN Scanner features of the [Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/core/introduction/) SDK.

## Description

Scan the VIN code from a barcode or a text line and extract the vehicle information.

## System Requirements

### React Native

- Supported Version: 0.71.0 or higher

### Android

- Supported OS: Android 5.0 (API Level 21) or higher.
- Supported ABI: armeabi-v7a, arm64-v8a, x86 and x86_64.
- Development Environment: Android Studio 2022.2.1 or higher.

### iOS

- Supported OS: iOS 13+.
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

## Append Model Into Your Project

Scanning the VIN code from a Text line needs to load the model(VINCharRecognition.data). 

You can get `VINCharRecognition.data` from [here](ScanVIN/android/app/src/main/assets/Models/VINCharRecognition.data).

Then copy the `VINCharRecognition.data` into `android/app/src/main/assets/Models/` and `ios/DynamsoftResources.bundle/Models/` of your React Native Project.

## Build the VIN Scanner Component

Now that the package is added, it's time to start building the VIN Scanner component using the SDK.

### Initialize License

The first step in code configuration is to initialize a valid license via `LicenseManager.initLicense`.

```typescript jsx
import {LicenseManager} from 'dynamsoft-capture-vision-react-native';

LicenseManager.initLicense("your-license-key")
.then(()=>{/*Init license successfully.*/})
.catch(error => console.error("Init License failed.", error));
```

> [!NOTE]
>
>- The license string here grants a time-limited free trial which requires network connection to work.
>- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&utm_source=guide&package=mobile) link.

## Request Camera Permission

Before opening camera to start capturing, you need to request camera permission from system.

```typescript jsx
import {CameraEnhancer} from 'dynamsoft-capture-vision-react-native';

CameraEnhancer.requestCameraPermission();
```

## Implement VIN Scanning from Video Stream

The basic workflow of scanning VIN code from video stream is as follows:

- Initialize the `CameraEnhancer` object
- Initialize the `CaptureVisionRouter` object
- Bind the `CameraEnhancer` object to the `CaptureVisionRouter` object
- Add a 'MultiFrameResultCrossFilter' object to enable the verification for text recognition
- Register a `CapturedResultReceiver` object to listen for parsed VIN code via the callback function `onParsedResultsReceived`
- Open the camera
- Start VIN scanning via `startCapturing`

```typescript jsx
import React, {useEffect, useRef, useState} from 'react';
import {VINData, parsedItemToVINData} from './VINScanResult.tsx';
import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  DecodedBarcodesResult,
  RecognizedTextLinesResult,
  EnumPresetTemplate,
  ParsedResult,
  MultiFrameResultCrossFilter,
  EnumCapturedResultItemType
} from 'dynamsoft-capture-vision-react-native';

export function Scanner() {
  const cameraView = useRef<CameraView>(null); // Create a reference to the CameraView component using useRef.
  const camera = CameraEnhancer.getInstance(); //Get the singleton instance of CameraEnhancer
  const router = CaptureVisionRouter.getInstance(); //Get the singleton instance of CaptureVisionRouter

  useEffect(() => {
    router.setInput(camera); //Bind the CaptureVisionRouter and ImageSourceAdapter before router.startCapturing()
    camera.setCameraView(cameraView.current!!); //Bind the CameraEnhancer and CameraView before camera.open()

    //Enable the verification for text recognition
    let filter = new MultiFrameResultCrossFilter();
    filter.enableResultCrossVerification(EnumCapturedResultItemType.CRIT_TEXT_LINE,  true);
    cvr.addFilter(filter);
    
    /**
     * Adds a CapturedResultReceiver object to listen for the captured result.
     * In this sample, we listen DecodedBarcodesResult generated by Dynamsoft Barcode Reader module,
     * RecognizedTextLinesResult generated by Dynamsoft Label Recognizer module 
     * and ParsedResult generated by Code Parser Module.
     * */
    let resultReceiver = router.addResultReceiver({
      onDecodedBarcodesReceived: (result: DecodedBarcodesResult) => {
        //Handle the `result`. You can get the raw text like following, not the parsed result
        if(result && result.items && result.items.length > 0) {
          let rawText = result.items[0].text;
        }
      },
      onRecognizedTextLinesReceived: (result: RecognizedTextLinesResult) => {
        //Handle the `result`. You can get the raw text like following, not the parsed result
        if(result && result.items && result.items.length > 0) {
          let rawText = result.items[0].text;
        }
      },
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
          const vinData = parsedItemToVINData(parsedItem!!);
          //Handle the `vinData`
        }
      },
    });

    /**
     * Open the camera when the component is mounted.
     * Please remember to request camera permission before it.
     * */
    camera.open();

    /**
     * Start capturing when the component is mounted.
     * In this sample codes, we start capturing by using `ReadVIN` template.
     * */
    router.startCapturing("ReadVIN");

    return () => {
      //Remove the filter when the component is unmounted.
      cvr.removeFilter(filter);
      
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

> [!NOTE]
>
> - The `parsedItemToVINData` function is a helper function to convert `ParsedResultItem` into an easier-to-read structure(`VINData`). You can get the source code from [VINScanResult.tsx](./ScanVIN/src/VINScanResult.tsx)

## Customize the Vin Scanner

### Specify the Scan Region

You can also limit the scan region of the SDK so that it doesn't exhaust resources trying to read from the entire image or frame.

```typescript jsx
import {CameraEnhancer} from "dynamsoft-capture-vision-react-native";

let camera = CameraEnhancer.getInstance()
let scanRegion = {
  top: 0.45,
  bottom: 0.65,
  left: 0.15,
  right: 0.85,
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

## How to Use the New Architecture of React Native (Optional)

[How to enable new architecture in Android](https://reactnative.dev/architecture/landing-page#android)

[How to enable new architecture in iOS](https://reactnative.dev/architecture/landing-page#ios)

## Full Sample Code

The full sample code is available [here](./ScanVIN).

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
