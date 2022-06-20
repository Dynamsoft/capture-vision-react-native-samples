# Dynamsoft Capture Vision samples for React-Native edition

This repository contains multiple samples that demonstrate how to use the [Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/introduction/) React-Native Edition.

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

## Samples

| Sample Name | Description |
| ----------- | ----------- |
| `BarcodeReaderSimpleSample` | This is a sample that illustrates the simplest way to recognize barcodes from video streaming with Dynamsoft Capture Vision React-Native SDK. |

### Install the Dependencies

Go to your project folder and run the following command:

```bash
yarn install
```

or

```bash
npm install
```

**For iOS**, you must install the necessary native frameworks from cocoapods to run the application. In order to do this, the `pod install` command needs to be run as such:

```bash
cd ios
```

```bash
pod install
```

### Build and Run

- **Android**

Go to your project folder and run the following command:

```bash
npx react-native run-android
```

- **iOS**

In the terminal, go to the project folder in your project:

```bash
npx react-native run-ios
```

> Note:
>
>- The application needs to run on a physical device rather than a simulator as it requires the use of the camera. If you try running it on a simulator, you will most likely run into a number of errors/failures.
>- On iOS, in order to run the React Native app on a physical device you will need to install the [`ios-deploy`](https://www.npmjs.com/package/ios-deploy) library. Afterwards, you can run the react native app from the terminal as such `npx react-native run-ios --device` assuming it's the only device connected to the Mac.
>- Alternatively on iOS, you can simply open the xcworkspace of the project found in the `ios` folder using Xcode and run the sample on your connected iOS device from there. The advantage that this offers is that it is easier to deal with the developer signatures for deployment in there.

## License

- You can also request an extension for your trial license in the [customer portal](https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=github)

## Contact

https://www.dynamsoft.com/company/contact/
