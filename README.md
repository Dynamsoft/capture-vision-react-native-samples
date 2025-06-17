# Dynamsoft Capture Vision samples for React-Native edition

This repository contains multiple samples that demonstrate how to use the Dynamsoft Capture Vision React-Native Edition.

## Integration Guide For Your Project

- [MRZ Scanner Integration Guide](./guide-scan-mrz.md)
- [Document Scanner Integration Guide](./guide-scan-document.md)
- [VIN Scanner Integration Guide](./guide-scan-vin.md)

## API References

- [Ready-to-use MRZScanner APIs](https://dynamsoft.github.io/capture-vision-react-native-samples/APIReferences/dynamsoft-mrz-scanner-bundle-react-native)
- [Foundational APIs](https://dynamsoft.github.io/capture-vision-react-native-samples/APIReferences/dynamsoft-capture-vision-react-native)

## Samples

| Sample Name                                          | Description                                                                                                            |
|------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| [ScanMRZ](ScanMRZ) | This sample illustrates how to scan passport and ID cards from video streaming.                                        |
| [ScanDocument](ScanDocument) | This sample illustrates how to detect and deskew document pages from the video stream.                                 |
| [ScanVIN](ScanVIN) | This sample illustrates how to Scan the VIN code from a barcode or a text line and extract the vehicle information  from video streaming. |

### How to build and run a sample

1. Enter a sample folder that you want to try

```bash
cd ScanDocument
```

or

```bash
cd ScanMRZ
```

or

```bash
cd ScanVIN
```

2. Install node modules

Run the following command:

```bash
yarn install
```

or

```bash
npm install
```

3. Prepare iOS

You must install the necessary native frameworks from CocoaPods to run the application. In order to do this, the `pod install` command needs to be run as such:

```bash
cd ios
pod install
```

Open the **workspace** file `*.xcworkspace` (not .xcodeproj) from the `ios` directory in Xcode. Adjust *Provisioning* and *Signing* settings.

4. Build and Run

- **Android**

Go to your project folder and run the following command:

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

- **iOS**

In the terminal, go to the project folder in your project:

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

> [!NOTE]
>
>- The application needs to run on a physical device rather than a simulator as it requires the use of the camera. If you try running it on a simulator, you will most likely run into a number of errors/failures.
>- On iOS, in order to run the React Native app on a physical device you will need to install the [`ios-deploy`](https://www.npmjs.com/package/ios-deploy) library. Afterwards, you can run the react native app from the terminal as such `npx react-native run-ios --device` assuming it's the only device connected to the Mac.
>- Alternatively on iOS, you can simply open the xcworkspace of the project found in the `ios` folder using Xcode and run the sample on your connected iOS device from there. The advantage that this offers is that it is easier to deal with the developer signatures for deployment in there.

### How to use the new architecture of React Native (Optional)

[How to enable new architecture in Android](https://reactnative.dev/architecture/landing-page#android)

[How to enable new architecture in iOS](https://reactnative.dev/architecture/landing-page#ios)

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
