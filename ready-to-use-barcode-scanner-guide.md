# Barcode Reader Integration Guide

In this guide, we will explore the Barcode Reader features of the [Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/core/introduction/) SDK.

We provide BarcodeScanner APIs, which is a ready-to-use component that allows developers to quickly set up a barcode scanning app.
With the built-in component, it streamlines the integration of barcode scanning functionality into any application.

In the BarcodeScanner APIs, we provide some customization features based on easy integration to meet your needs. 
However, if you want to achieve a higher level of customization, we recommend that you use our Foundation APIs and see this [Foundation Barcode Reader Guide](./foundation-barcode-reader-guide.md).

## Supported Barcode Symbologies

- Linear Barcodes (1D)
  - Code 39 (including Code 39 Extended)
  - Code 93
  - Code 128
  - Codabar
  - Interleaved 2 of 5
  - EAN-8
  - EAN-13
  - UPC-A
  - UPC-E
  - Industrial 2 of 5

- 2D Barcodes
  - QR Code (including Micro QR Code and Model 1)
  - Data Matrix
  - PDF417 (including Micro PDF417)
  - Aztec Code
  - MaxiCode (mode 2-5)
  - DotCode

- Patch Code

- GS1 Composite Code

- GS1 DataBar
  - Omnidirectional,
  - Truncated, Stacked, 
  - Stacked Omnidirectional, Limited,
  - Expanded, Expanded Stacked

- Postal Codes
  - USPS Intelligent Mail
  - Postnet
  - Planet
  - Australian Post
  - UK Royal Mail

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

### Import
To use the BarcodeScanner API, please import `BarcodeScanner` class 
and the related `BarcodeScanConfig` and `BarcodeScanResult` from `dynamsoft-capture-vision-react-native`

### Simplest Example
```typescript jsx
import { BarcodeScanner, BarcodeScanConfig, BarcodeScanResult } from 'dynamsoft-capture-vision-react-native';

async function scanBarcode() {
  const config = {
    license: 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9',
  } as BarcodeScanConfig;
  const result = await BarcodeScanner.launch(config);
  // do something with the result
}
```
You can call the above function anywhere (e.g., when the app starts, on a button click, etc.) to achieve the effect: 
open a barcode scanning interface, and after scanning is complete (with `BarcodeScanConfig.scanningMode` determining whether a single barcode or multiple barcodes are captured), 
close the interface and return the result. Following is the simplest example of how to use the `scanBarcode` function:
```typescript jsx
import {Button, Text, View} from 'react-native';

function App(): React.JSX.Element {
  return (
    <View style={{flex:1}}>
      <Button title={'Scan Barcode'} onPress={() => scanBarcode()}/>
    </View>
  );
}
```
>Note:
>
>- The license string here grants a time-limited free trial which requires network connection to work.
>- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=guide&package=mobile) link.

### Barcode Scan Result
Also see it in the [BarcodeScanResult](./APIReferences/interfaces/rtu.BarcodeScanResult.html) section of API References.

`BarcodeScanResult` structure:
- resultStatus: The status of the barcode result, of type `EnumResultStatus`.
  - RS_SUCCESS: The barcode scan was successful.
  - RS_CANCELED: The barcode scanning activity is closed before the process is finished.
  - RS_EXCEPTION: Failed to start barcode scanning or an error occurs when scanning the barcodes.
- errorCode: The error code indicates if something went wrong during the barcode scanning process (0 means no error).
- errorString: The error message associated with the error code if an error occurs during barcode scanning process.
- barcodes: An array of `BarcodeResultItem`.

### (Optional) Change the BarcodeScanConfig to meet your needs
Also see it in the [BarcodeScanConfig](./APIReferences/interfaces/rtu.BarcodeScanConfig.html) section of API References.
```typescript jsx
import {BarcodeScanConfig, EnumBarcodeFormat} from 'dynamsoft-capture-vision-react-native';

const config = {
  /**
   * The license key required to initialize the barcode reader.
   */
  license: "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9", //The license string here grants a time-limited free trial which requires network connection to work.
  
  /**
   * Sets the barcode format(s) to read.
   * This value is a combination of EnumBarcodeFormat flags that determine which barcode types to read.
   * For example, to scan QR codes and OneD codes,
   * set the value to `EnumBarcodeFormat.BF_QR_CODE | EnumBarcodeFormat.BF_ONED`.
   * */
  barcodeFormats: EnumBarcodeFormat.BF_QR_CODE | EnumBarcodeFormat.BF_ONED,
  
  /**
   * Defines the scanning area as a DSRect object where barcodes will be detected.
   * Only the barcodes located within this defined region will be processed. 
   * Default is undefined, which means the full screen will be scanned.
   */
  scanRegion: {top: 0.25, bottom: 0.75, left: 0.25, right: 0.75, measuredInPercentage: true}, // scan the middle 50% of the screen
  
  /**
   * Determines whether the torch (flashlight) button is visible in the scanning UI.
   * Set to true to display the torch button, enabling users to turn the flashlight on/off. Default is true.
   */
  isTorchButtonVisible: true,

  /**
   * Specifies if a beep sound should be played when a barcode is successfully detected.
   * Set to true to enable the beep sound, or false to disable it. Default is false.
   */
  isBeepEnabled: false,

  /**
   * Enables or disables the auto-zoom feature during scanning.
   * When enabled (true), the scanner will automatically zoom in to improve barcode detection. Default is false.
   */
  isAutoZoomEnabled: false,

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
   * Determines if a scanning laser overlay is shown on the scanning screen.
   * This visual aid (scan laser) helps indicate the scanning line during barcode detection. Default is true.
   */
  isScanLaserVisible: true,

  /**
   * Sets the scanning mode for the barcode reader.
   * The mode is defined by the EnumScanningMode and affects the scanning behavior. Default is SM_SINGLE.
   */
  scanningMode: EnumScanningMode.SM_SINGLE,

  /**
   * Defines the expected number of barcodes to be scanned.
   * The scanning process will automatically stop when the number of detected barcodes reaches this count.
   * Only available when `scanningMode` is set to SM_MULTIPLE. Default is 999.
   */
  expectedBarcodesCount: 999,

  /**
   * Specifies the maximum number of consecutive stable frames to process before exiting scanning.
   * A "stable frame" is one where no new barcode is detected.
   * Only available when `scanningMode` is set to SM_MULTIPLE. Default is 10.
   */
  maxConsecutiveStableFramesToExit: 10,

  /**
   * Specifies the template configuration for the barcode scanner.
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
} as BarcodeScanConfig;
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

> Note:
> If you want to run Android via `Windows`, You may encounter some build errors due to the `Windows Maximum Path Length Limitation`.
> Therefore, we recommend that you move the project to a directory with a shorter path.

## How to Use the New Architecture of React Native (Optional)

[How to enable new architecture in Android](https://reactnative.dev/architecture/landing-page#android)

[How to enable new architecture in iOS](https://reactnative.dev/architecture/landing-page#ios)
## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
