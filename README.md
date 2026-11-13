# Dynamsoft Capture Vision samples for React-Native edition

This repository contains multiple samples that demonstrate how to use the [Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/core/introduction/) React-Native Edition.

## Samples

| Sample Name | Description | Build & Run |
|-------------|-------------|-------------|
| [ScanDocument](ScanDocument) | Demonstrates how to detect and deskew document pages from live camera preview, review the normalized image, adjust the detected boundaries, and export the result as a PNG file. | [README](ScanDocument/README.md) |

> **📌 Note on sample types**
>
> `ScanDocument` is a **React Native CLI sample** (non-Expo), so its native projects are part of the repository and no `prebuild` step is required.
>
> Please refer to the README of the sample you want to try for its own build instructions.

### How to build and run a sample

Each sample folder contains its own `README.md` with the prerequisites, the exact commands to install dependencies, install CocoaPods, and build for Android and iOS. Open the folder of the sample you want to try and follow its README.

> [!NOTE]
>
> - The application needs to run on a physical device rather than a simulator as it requires the use of the camera. If you try running it on a simulator, you will most likely run into a number of errors/failures.
> - The sample uses native modules, so it does not run in Expo Go — a bare React Native CLI project is required.
> - If you want to run Android via `Windows`, you may encounter some build errors due to the `Windows Maximum Path Length Limitation`. The sample pins CMake 3.31.6 to work around it, but we still recommend that you keep the project in a directory with a shorter path.

## Integration Guide For Your Project

Adding document scanning to your own React Native app takes four steps: install the package, initialize the license, declare the camera permission, and run a capture loop.

### 1. Install the package

```bash
# using npm
npm install dynamsoft-capture-vision-react-native

# OR using Yarn
yarn add dynamsoft-capture-vision-react-native
```

For iOS, install the native frameworks from CocoaPods:

```bash
cd ios
pod install
```

### 2. Initialize the license

```typescript tsx
import {LicenseManager} from 'dynamsoft-capture-vision-react-native';

LicenseManager.initLicense('your-license-key')
  .then(() => {/* Init license successfully. */})
  .catch(error => console.error('Init license failed.', error));
```

> [!NOTE]
>
> - A trial license requires a network connection to validate.
> - You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&utm_source=github&package=mobile) link.

### 3. Declare the camera permission

- **Android** — the camera permission is declared in the SDK's own manifest and merged into your app, so nothing needs to be added.
- **iOS** — add `NSCameraUsageDescription` to `ios/your-project-name/Info.plist`.

### 4. Capture documents from the video stream

The workflow is: initialize the `CameraEnhancer`, initialize the `CaptureVisionRouter`, bind them together, register a `CapturedResultReceiver`, open the camera, then start capturing with a document template.

```typescript tsx
import {CameraEnhancer, CameraView, CaptureVisionRouter, EnumPresetTemplate, ProcessedDocumentResult} from 'dynamsoft-capture-vision-react-native';

const camera = CameraEnhancer.getInstance();
const router = CaptureVisionRouter.getInstance();

router.setInput(camera);                                  // bind the router and the image source
camera.setCameraView(cameraViewRef.current!);             // bind the enhancer and the CameraView

const receiver = router.addResultReceiver({
  // Received when capturing with PT_DETECT_AND_NORMALIZE_DOCUMENT.
  onProcessedDocumentResultReceived: (result: ProcessedDocumentResult) => {
    if (result.deskewedImageResultItems?.length) {
      const deskewed = result.deskewedImageResultItems[0].imageData;
      // ...
    }
  },
});

camera.open();
router.startCapturing(EnumPresetTemplate.PT_DETECT_AND_NORMALIZE_DOCUMENT);
```

To detect the page boundary without normalizing it, start capturing with `EnumPresetTemplate.PT_DETECT_DOCUMENT_BOUNDARIES` instead, then read `detectedQuadResultItems`. The [Editor component](ScanDocument/src/Editor.tsx) shows how to draw those quads on the original image and let the user adjust them before cropping.

Each sample README also contains an **Integration Notes For Your Own Project** section with the platform-specific configuration the SDK needs:

- **Android** — the `externalNativeBuild` CMake block in `android/app/build.gradle`
- **iOS** — the `NSCameraUsageDescription` entry in `Info.plist`

## API References

- [Dynamsoft Capture Vision React-Native documentation](https://www.dynamsoft.com/capture-vision/docs/mobile/programming/react-native/)
- [API Reference](https://www.dynamsoft.com/capture-vision/docs/mobile/programming/react-native/api-reference/)
- [CaptureVisionTemplate parameters](https://www.dynamsoft.com/capture-vision/docs/core/parameters/file/)

## License

- You can request a 30-day trial license via the [Request a Trial License](https://www.dynamsoft.com/customer/license/trialLicense?product=dcv&utm_source=github&package=mobile) link.

## Contact

https://www.dynamsoft.com/company/contact/
