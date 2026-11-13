# ScanDocument

Demonstrates how to detect and deskew document pages from live camera preview, review the normalized image, adjust the detected boundaries, and export the result as a PNG file.

## What This Sample Does

- Initializes the license once on the **Home** screen and reports any failure inline instead of crashing
- Detects and normalizes documents from the video stream with `EnumPresetTemplate.PT_DETECT_AND_NORMALIZE_DOCUMENT`
- Uses a `MultiFrameResultCrossFilter` with `enableResultCrossVerification(CRIT_DESKEWED_IMAGE, true)`, so a page is only accepted once successive frames agree — this filters out the flicker of a boundary that is still settling
- Gives the user two ways to move on: wait for `crossVerificationStatus === CVS_PASSED`, or tap **Capture** to accept the current result immediately
- Keeps the original image, the deskewed image and the source deskew quad on `global` (declared in `src/global.d.ts`) so the screens can share them
- Shows the normalized page in the **NormalizedImage** screen, with a bottom bar to:
  - **Back to Edit** — open the **Editor** and re-adjust the quad
  - **Switch Colour** — switch between `colour`, `grayscale` (`convertToGray`) and `binary` (`convertToBinaryLocal`) rendering
  - **Export** — save the image as a PNG through `ImageIO.saveToFile` into the cache directory, then show the path
- Releases every `ImageData` object when the screen is unmounted, because these buffers live in native memory

The **Editor** screen uses `ImageEditorView.setQuads()` with `EnumDrawingLayerId.DDN_LAYER_ID` to draw the detected quad on the original image and lets the user drag it. **Confirm** reads the edited quad back with `getSelectedQuad()` and re-crops the image with `ImageProcessor.cropAndDeskewImage()`.

## Requirements

- A recent Node.js LTS release (the minimum is declared in the `engines` field of `package.json`)
- A React Native CLI project; the React Native, React and Dynamsoft package versions are declared in `package.json`
- A physical iOS or Android device with a camera — the sample relies on live camera input and is not meant to run on a simulator
- Dynamsoft packages, already listed in `package.json`:
  - `dynamsoft-capture-vision-react-native`
- Supporting packages used by the sample UI and export step:
  - `@react-navigation/native` and `@react-navigation/native-stack`
  - `@dr.pogodin/react-native-fs` (cache directory used as the export target)

## How to Run

1. Enter the sample folder

```bash
cd ScanDocument
```

2. Install node modules

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

Open the **workspace** file `*.xcworkspace` (not `.xcodeproj`) from the `ios` directory in Xcode. Adjust *Provisioning* and *Signing* settings.

4. Build and run

- **Android**

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

- **iOS**

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see a **Scan a Document** button. Tap it, point the camera at a document, and the app moves to the normalized image once the page is stable.

> [!NOTE]
> If you want to run Android via `Windows`, you may encounter some build errors due to the `Windows Maximum Path Length Limitation`. The CMake version pinned in `android/app/build.gradle` already mitigates most of it, but we still recommend that you move the project to a directory with a shorter path.

> [!NOTE]
> The application needs to run on a physical device rather than a simulator as it requires the use of the camera.

## Integration Notes For Your Own Project

### Android: pin a newer CMake

The Dynamsoft native libraries are built with CMake. Add the following block inside the `android` section of your app-level `android/app/build.gradle`, next to `compileSdkVersion`:

```gradle
android {
    // ... your existing configuration

    externalNativeBuild {
        cmake {
            version "3.31.6"
        }
    }
}
```

The Android Gradle Plugin defaults to CMake 3.22.1, which bundles ninja 1.10.2. That version of ninja cannot handle paths longer than 260 characters, so builds break as soon as the project (or its Gradle cache) lives in a deep directory on Windows. CMake 3.31 and later bundle ninja 1.12, which supports Windows long paths, so pinning 3.31.6 keeps the native build working regardless of where the project is checked out.

### Android: camera permission

Nothing to add. The SDK declares `android.permission.CAMERA` in its own manifest and the manifest merger lifts it into your app; the sample manifest only lists `INTERNET`, which the license check needs.

### iOS: camera permission

The camera is opened from native code, so iOS requires a usage description. Add the `NSCameraUsageDescription` key to `ios/ScanDocument/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Open camera to scan document.</string>
```

- The value is shown to the user in the permission prompt, so describe your own use case instead of copying the sample text verbatim.
- Without this key the app is terminated by the system the first time it touches the camera, and App Store review will reject the build.
- If you create the project with a newer React Native template, the key may already be present — check before adding a duplicate.

### Rendering the result in React Native

`imageDataToBase64()` converts an `ImageData` into a base64 string that an `<Image>` can display. Keep a reference to the `ImageData` and release it when you no longer need it — base64 conversion copies the pixels, but the native buffer is not freed automatically.

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&utm_source=github&package=mobile) link.
- The trial license string is embedded in `src/App.tsx` and requires a network connection to activate. Replace it with your own license for production use.

## Contact

https://www.dynamsoft.com/company/contact/
