# MRZ Scanner Integration Guide

In this guide, we will guide you to develop a MRZ scanning app with the [`MRZScanner`](https://dynamsoft.github.io/capture-vision-react-native-samples/APIReferences/dynamsoft-mrz-scanner-bundle-react-native) component.

`MRZScanner` is a ready-to-use component that allows developers to quickly set up an MRZ scanning app. With the built-in component, it streamlines the integration of MRZ scanning functionality into any application.

## Supported Machine-Readable Travel Document Types

The Machine Readable Travel Documents (MRTD) standard specified by the International Civil Aviation Organization (ICAO) defines how to encode information for optical character recognition on official travel documents.

Currently, the SDK supports three types of MRTD:

> [!NOTE]
> If you need support for other types of MRTDs, our SDK can be easily customized. Please contact support@dynamsoft.com.

### ID (TD1 Size)

The MRZ (Machine Readable Zone) in TD1 format consists of 3 lines, each containing 30 characters.

<div>
   <img src="./assets/td1-id.png" alt="Example of MRZ in TD1 format" width="60%" />
</div>

### ID (TD2 Size)

The MRZ (Machine Readable Zone) in TD2 format consists of 2 lines, with each line containing 36 characters.

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

- Supported OS: iOS 13+.
- Supported ABI: arm64 and x86_64.
- Development Environment: Xcode 13+ (Xcode 14.1+ recommended).

### Others

- Node: 18 or higher

## Installation

Run the following commands in the root directory of your react-native project to add `dynamsoft-capture-vision-react-native` and `dynamsoft-mrz-scanner-bundle-react-native` into dependencies

```bash
# using npm
npm install dynamsoft-capture-vision-react-native
npm install dynamsoft-mrz-scanner-bundle-react-native

# OR using Yarn
yarn add dynamsoft-capture-vision-react-native
yarn add dynamsoft-mrz-scanner-bundle-react-native

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

## Build the MRZ Scanner Component

Now that the package is added, it's time to start building the MRZ Scanner component using the SDK.

### Import
To use the MRZScanner API, please import `MRZScanner` class
and the related `MRZScanConfig` and `MRZScanResult` from `dynamsoft-mrz-scanner-bundle-react-native`

### Simplest Example
```typescript jsx
import { MRZScanner, MRZScanResult, MRZScanConfig } from 'dynamsoft-mrz-scanner-bundle-react-native';

async function scanMRZ() {
  const config = {
    license: 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9',
  } as MRZScanConfig;
  const result = await MRZScanner.launch(config);
  // do something with the result
}
```

You can call the above function anywhere (e.g., when the app starts, on a button click, etc.) to achieve the effect:
open an MRZ scanning interface, and after scanning is complete, close the interface and return the result. 
Following is the simplest example of how to use the `scanMRZ` function:

```typescript jsx
import {Button, Text, View} from 'react-native';

function App(): React.JSX.Element {
  return (
    <View style={{flex:1}}>
      <Button title={'Scan MRZ'} onPress={() => scanMRZ()}/>
    </View>
  );
}
```

> [!NOTE]
>
>- The license string here grants a time-limited free trial which requires network connection to work.
>- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=mrz&utm_source=github&package=mobile) link.

### MRZ Scan Result And MRZ Data

Also see it in the [MRZScanResult](https://dynamsoft.github.io/capture-vision-react-native-samples/APIReferences/dynamsoft-mrz-scanner-bundle-react-native/interfaces/MRZScanResult.html) 
and [MRZData](https://dynamsoft.github.io/capture-vision-react-native-samples/APIReferences/dynamsoft-mrz-scanner-bundle-react-native/interfaces/MRZData.html)  section of API References.

`MRZScanResult` structure:

- resultStatus: The status of the MRZ scan result, of type `EnumResultStatus`.
  - RS_SUCCESS: The MRZ scan was successful.
  - RS_CANCELED: The MRZ scanning activity is closed before the process is finished.
  - RS_EXCEPTION: Failed to start MRZ scanning or an error occurs when scanning the MRZ.
- errorCode: The error code indicates if something went wrong during the MRZ scanning process (0 means no error). Only defined when `resultStatus` is RS_EXCEPTION.
- errorString: The error message associated with the error code if an error occurs during MRZ scanning process. Only defined when `resultStatus` is RS_EXCEPTION.
- data: The parsed MRZ data.

`MRZData` structure:

- documentType: The type of document, such as `'ID cards'` or `'passports'`.
- firstName: The first name of the user of the MRZ document.
- lastName: The last name of the user of the MRZ document.
- sex: The sex of the user of the MRZ document.
- issuingState: The issuing state of the MRZ document.
- nationality: The nationality of the user of the MRZ document.
- dateOfBirth: The date of birth of the user of the MRZ document.
- dateOfExpiry: The expiry date of the MRZ document.
- documentNumber: The MRZ document number.
- age: The age of the user of the MRZ document.
- mrzText: The raw text of the MRZ.

### (Optional)Change the MRZScanConfig to meet your needs

Also see it in the [MRZScanConfig](https://dynamsoft.github.io/capture-vision-react-native-samples/APIReferences/dynamsoft-mrz-scanner-bundle-react-native/interfaces/MRZScanConfig.html) section of API References.

```typescript jsx
import {MRZScanConfig, EnumDocumentType} from 'dynamsoft-mrz-scanner-bundle-react-native';

const config = {
  /**
   * The license key required to initialize the MRZ Scanner.
   */
  license: "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9", //The license string here grants a time-limited free trial which requires network connection to work.
  
  /**
   * Determines whether the torch (flashlight) button is visible in the scanning UI.
   * Set to true to display the torch button, enabling users to turn the flashlight on/off. Default is true.
   */
  isTorchButtonVisible: true,

  /**
   * Specifies the type of document to be scanned for MRZ.
   * This property accepts values defined in the EnumDocumentType, such as {@link EnumDocumentType.DT_ALL}, {@link EnumDocumentType.DT_ID}, or {@link EnumDocumentType.DT_PASSPORT}.
   * It helps the scanner to optimize its processing based on the expected document type.
   * Default is EnumDocumentType.DT_ALL.
   */
  documentType: EnumDocumentType.DT_ALL,

  /**
   * Specifies if a beep sound should be played when an MRZ is successfully detected.
   * Set to true to enable the beep sound, or false to disable it. Default is false.
   */
  isBeepEnabled: false,

  /**
   * Determines whether the close button is visible on the scanner UI.
   * This button allows users to exit the scanning interface. Default is true.
   */
  isCloseButtonVisible: true,

  /**
   * Specifies whether the camera toggle button is displayed.
   * This button lets users switch between available cameras (e.g., front and rear). Default is false.
   */
  isCameraToggleButtonVisible: false,

  /**
   * Determines whether a guide frame is visible during scanning.
   * The guide frame assists users in properly aligning the document for optimal MRZ detection.
   * When set to true, a visual overlay is displayed on the scanning interface. Default is true.
   */
  isGuideFrameVisible: true,


  /**
   * Specifies the template configuration for the MRZ scanner.
   * This can be either a file path or a JSON string that defines various scanning parameters.
   * Default is undefined, which means the default template will be used.
   */
  templateFile: {/*JSON template string*/},

  /**
   * Provides a Node.js 'require' function to load the template file when running in a Node environment.
   * This facilitates importing external template configuration files.
   * Default is undefined, which means the default template will be used.
   * Only available when `templateFile` is set to undefined/null or empty string.
   */
  templateNodeRequire: require('./settings.json'),
} as MRZScanConfig;
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

## Full Sample Code

The full sample code is available [here](./ScanMRZ).

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=mrz&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
