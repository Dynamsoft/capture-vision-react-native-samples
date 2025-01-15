# MRZ Scanner Integration Guide

In this guide, we will explore the MRZ Scanner features of the [Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/core/introduction/) SDK.

## Supported Machine-Readable Travel Document Types

The Machine Readable Travel Documents (MRTD) standard specified by the International Civil Aviation Organization (ICAO) defines how to encode information for optical character recognition on official travel documents.

Currently, the SDK supports three types of MRTD:

> Note: If you need support for other types of MRTDs, our SDK can be easily customized. Please contact support@dynamsoft.com.

### ID (TD1 Size)

The MRZ (Machine Readable Zone) in TD1 format consists of 3 lines, each containing 30 characters.

<div>
   <img src="./assets/td1-id.png" alt="Example of MRZ in TD1 format" width="60%" />
</div>

### ID (TD2 Size)

The MRZ (Machine Readable Zone) in TD2 format  consists of 2 lines, with each line containing 36 characters.

<div>
   <img src="./assets/td2-id.png" alt="Example of MRZ in TD2 format" width="72%" />
</div>

### Passport (TD3 Size)

The MRZ (Machine Readable Zone) in TD3 format consists of 2 lines, with each line containing 44 characters.

<div>
   <img src="./assets/td3-passport.png" alt="Example of MRZ in TD2 format" width="88%" />
</div>

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

Run the following commands in the root directory of your react-native project to add `dynamsoft-capture-vision-react-native` and `dynamsoft-mrz-react-native` into dependencies

```bash
# using npm
npm install dynamsoft-capture-vision-react-native
npm install dynamsoft-mrz-react-native

# OR using Yarn
yarn add dynamsoft-capture-vision-react-native
yarn add dynamsoft-mrz-react-native

```

then run command to install all dependencies:

```bash
# using npm
npm install 

# OR using Yarn
yarn install
```

For iOS, you must install the necessary native frameworks from cocoapods by running the pod install command as below:

```bash
cd ios
pod install
```

## Configure native projects

The Dynamsoft Capture Vision SDK need the camera permission to use the camera device, so it can capture from video stream.

### Android

For Android, we have defined camera permission within the SDK, you don't need to do anything.

### IOS

For IOS, you need to include the camera permission in `ios/your-project-name/Info.plist` inside the `<dist>` element:

```
<key>NSCameraUsageDescription</key>
    <string></string>
```

## Build the MRZ Scanner Component

Now that the package is added, it's time to start building the MRZ Scanner component using the SDK.

### Initialize License

The first step in code configuration is to initialize a valid license via `LicenseManager.initLicense`.

```typescript jsx
import {LicenseManager} from 'dynamsoft-capture-vision-react-native';

LicenseManager.initLicense("your-license-key")
.then(()=>{/*Init license sussessfully.*/})
.catch(error => console.error("Init License failed.", error));
```

>Note:
>
>- The license string here grants a time-limited free trial which requires network connection to work.
>- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=mrz&utm_source=guide&package=mobile){:target="_blank"} link.

## Request Camera Permission

Before open camera to start capturing, you need request camera permission from system.

```typescript jsx
import {CameraEnhancer} from 'dynamsoft-capture-vision-react-native';

CameraEnhancer.requestCameraPermission();
```

## Implement MRZ Scanning from Video Stream

The basic workflow of scanning MRZ from video stream is as follows:

- Initialize the `CameraEnhancer` object
- Initialize the `CaptureVisionRouter` object
- Bind the `CameraEnhancer` object to the `CaptureVisionRouter` object
- Register a `CapturedResultReceiver` object to listen for parsed MRZ via the callback function `onParsedResultsReceived`
- Open the camera
- Start MRZ scanning via `startCapturing`

```typescript jsx
import React, {useEffect, useRef, useState} from 'react';
import {parsedItemToMRZResult} from 'MRZResult.tsx';
import {
  CameraEnhancer,
  CameraView,
  CaptureVisionRouter,
  DecodedBarcodesResult,
  EnumPresetTemplate,
  ParsedResult
} from 'dynamsoft-capture-vision-react-native';

export function Scanner() {
  const cameraView = useRef<CameraView>(null); // Create a reference to the CameraView component using useRef.
  const camera = CameraEnhancer.getInstance(); //Get the sington instance of CameraEnhancer
  const router = CaptureVisionRouter.getInstance(); //Get the singleton instance of CaptureVisionRouter

  useEffect(() => {
    router.setInput(camera); //Bind the CaptureVisionRouter and ImageSourceAdapter before router.startCapturing()
    camera.setCameraView(cameraView.current!!); //Bind the CameraEnhancer and CameraView before camera.open()

    /**
     * Adds a CapturedResultReceiver object to listen the captured result.
     * In this sample, we only listen RecognizedTextLinesResult generated by Dyanmsoft Label Recognizer module
     * and ParsedResult generated by Code Parser Module.
     * */
    let resultReceiver = router.addResultReceiver({
      onRecognizedTextLinesReceived: (result: RecognizedTextLinesResult) => {
        //Handle the `result`. You can get the raw text here, not the parsed result
      },
      onParsedResultsReceived: (result: ParsedResult) => {
        let mrzResult = parsedItemToMRZResult(result)
        //Handle the `mrzResult`.
      },
    })

    /**
     * Open the camera when the component is mounted.
     * Please remember request camera permission before it.
     * */
    camera.open();

    /**
     * Start capturing when the component is mounted.
     * In this sample codes, we start capturing by using `ReadPassportAndId` template.
     * You can also try `ReadId` which only support recognizing ID or 
     * `ReadPassport` which only support recognizing passport.
     * */
    router.startCapturing("ReadPassportAndId");

    return () => {
      //Remove the receiver when the component is unmounted.
      router.removeResultReceiver(receiver);

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

> Note:
>
> - The `parsedItemToMRZResult` function is a helper function to convert `ParsedResult` into an easier-to-read structure(`MRZResult`). You can get the source code from [`MRZResult.tsx`](./ScanMRZ/src/MRZResult.tsx).

## Customize the MRZ Scanner

### Specify the scanning document type

```typescript jsx
import {
  CaptureVisionRouter
} from "dynamsoft-capture-vision-react-native";

let router = CaptureVisionRouter.getInstance()
// Set the expected scanning document type, such as "ReadPassportAndId", "ReadId", "ReadPassport"
router.startCapturing("ReadPassport");
```

### Specify the scan region

You can also limit the scan region of the SDK so that it doesn't exhaust resources trying to read from the entire image or frame.

```typescript jsx
import {CameraEnhancer} from "dynamsoft-capture-vision-react-native";

let camera = CameraEnhancer.getInstance()
let scanRegion = {
  top: 45,
  bottom: 65,
  left: 15,
  right: 85,
  measuredInPercentage: true,
}
camera.setScanRegion(scanRegion);
```

## Run the project

Go to your project folder, Open a _new_ terminal and run the following command:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For IOS

#### Signing

- Open the **workspace** file `*.xcworkspace` (not .xcodeproj) from the `ios` directory in Xcode.
- Adjust *Provisioning* and *Signing* settings.

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your device.
This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## How to use the new architecture of React Native (Optional)

[How to enable new architecture in Android](https://reactnative.dev/architecture/landing-page#android)

[How to enable new architecture in IOS](https://reactnative.dev/architecture/landing-page#ios)
> Note:
>
> If you enable new architecture and want to run Android via `Windows`, You may encounter some build errors due to the `Windows Maximum Path Length Limitation`.
>
> Therefore, we recommend that you move the project to a directory with a shorter path before enable the new architecture.

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=mrz&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
