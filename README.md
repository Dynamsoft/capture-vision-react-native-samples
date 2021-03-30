# react-native-dynamsoft-barcode-scanner

This is a sample that shows how to implement barcode scanning in React Native using Dynamsoft Barcode Reader SDK. 

To learn more about Dynamsoft Barcode Reader, please visit http://www.dynamsoft.com/Products/Dynamic-Barcode-Reader.aspx.


## License

You can request for a free trial license online. [Get a trial license >](https://www.dynamsoft.com/CustomerPortal/Portal/Triallicense.aspx)

Without a valid license, the SDK can work but will not return a full result.

## Dependencies
```bash
Node, Python2, JDK, Watchman, Xcode and Android Studio. 
(Windows: The version of Node must be greater than or equal to 10 and less than or equal to 12.11, the version of Python must be 2.x (does not support 3.x), and the version of JDK must be 1.8)
```

## How to Run the Example

### iOS
Run `npm install or yarn (npm install -g yarn)` from the `rn-mobile-barcode-scanner/examples/basic` first, then `pod install` in the `rn-mobile-barcode-scanner/examples/basic/ios`
And make sure `Your Project Target -> Build Settings -> Search Paths -> Frameworks Search Paths` and `Pods-BarcodeReaderManager.debug(release).xcconfig`:
```bash
Frameworks Search Paths = "${PODS_ROOT}/DynamsoftBarcodeReader"
HEADER_SEARCH_PATHS = $(inherited) "${PODS_ROOT}/DynamsoftBarcodeReader/DynamsoftBarcodeReader.framework/Headers"
OTHER_LDFLAGS = $(inherited) -ObjC -framework "DynamsoftBarcodeReader"
```
Then `react-native run-ios`.

### Android
```bash
npm install or yarn (npm install -g yarn)
react-native run-android
```

### Screenshots
<kbd><img src="https://www.dynamsoft.com/codepool/img/2021/react-native-barcode-scanner.png" width="50%">

## How to Use the Barcode Scanning Module

### In Android

1. Create a new React Native project if you donnot have one.

    ```bash
    react-native init NewProject
    ```

2. Add the local module to dependencies in `package.json`.

    ```json
    "dependencies": {
        "react": "16.9.0",
        "react-native": "^0.61.1",
        "react-native-dbr": "^8.2.0"
    },
    ```

3. On `android/settings.gradle`.

    ```
    include(':react-native-dbr')
    project(':react-native-dbr').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-dbr/android')
    include(':react-native-webview')
    project(':react-native-webview').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-webview/android')
   ```

4. Add `':react-native-dbr'` dependency in `android/app/build.gradle`.

    ```
    dependencies {
        implementation project(path: ':react-native-dbr')
    }
    ```
5. On the MainApplication of your Android project add the import of BarcodeReaderPackage line to:

    ```java
    import com.demo.barcodescanner.BarcodeReaderPackage;
    
    ...
    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new BarcodeReaderPackage()); // add BarcodeReaderPackage here!!
      return packages;
    }
    ...
    
    ```
6. Use the module in `App.js`.

    ```javascript
    import {NativeModules} from 'react-native';
    import { RNCamera } from 'react-native-dbr';
    import Canvas from 'react-native-canvas';
    
    state = {
        license: '-- put your license here -- ',
        barcodeFormat: RNCamera.Constants.DynamsoftBarcodeFormats.BarcodeFormat.ALL,
        barcodeFormat2: RNCamera.Constants.DynamsoftBarcodeFormats.BarcodeFormat2.NULL,
        type: 'back',
        canDetectBarcode: false,
        barcodes: [{
          type: '',
          data: '',
          localizationResult: []
        }]
      };
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
        type={this.state.type}
        license={this.state.license}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onDynamsoftBarcodesReader={canDetectBarcode ? this.barcodeRecognized : null}
        barcodeFormat={this.state.barcodeFormat}
        barcodeFormat2={this.state.barcodeFormat2}
      >
        <View style={{height:'100%'}}>
          <View style={{height:'90%'}}>
          {!!canDetectBarcode && this.renderBarcodes()}
          </View>
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <TouchableOpacity 
              onPress={this.toggle('canDetectBarcode')}
              style={[styles.flipButton, { flex: 0.5, alignSelf: 'center' }]}
            >
              <Text style={styles.flipText}>{!canDetectBarcode ? 'Decode' : 'Decoding'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNCamera>  
    ......
    --> See ./RNCamera.js&&./examples/basic/App.js for details.
    ```

### In iOS

1. Create a new React Native project if you donnot have one.

    ```bash
    react-native init NewProject
    ```

2. Add the local module to dependencies in `NewProject/package.json`.

    ```json
    "dependencies": {
        "react": "16.9.0",
        "react-native": "^0.61.1",
        "react-native-dbr": "^8.2.0"
    }
    ```

3. Remove `node_moudules` and install.

    ```bash
    sudo rm -rf node_moudules 
    npm install or yarn
    ```

4. Add `BarcodeReaderManager.xcodeproj` to  your project libraries. And make sure `Pods/Target Support Files/Pods-BarcodeReaderManager.debug.xcconfig`:

```
  FRAMEWORK_SEARCH_PATHS = "${PODS_ROOT}/DynamsoftBarcodeReader"
  HEADER_SEARCH_PATHS = "${PODS_ROOT}/DynamsoftBarcodeReader/DynamsoftBarcodeReader.framework/Headers"
  LIBRARY_SEARCH_PATHS = "${PODS_ROOT}/DynamsoftBarcodeReader"
  OTHER_LDFLAGS = -framework "DynamsoftBarcodeReader"
```

5.  In your NewProject: 

```
  Project -> Build Settings -> FRAMEWORK_SEARCH_PATHS = `$(PROJECT_DIR)/../ios` 
  HEADER_SEARCH_PATHS = `$(PROJECT_DIR)/../ios`
```

6. Modify the module in `App.js`(same as android).

## Blog

[Android Barcode Detection Component for React Native](http://www.codepool.biz/android-barcode-detection-component-react-native.html)
