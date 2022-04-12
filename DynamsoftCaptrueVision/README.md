
# react-native-dynamsoft-captrue-vision

## Getting started

`$ npm install react-native-dynamsoft-captrue-vision --save`

### Mostly automatic installation

`$ react-native link react-native-dynamsoft-captrue-vision`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-dynamsoft-captrue-vision` and add `RNDynamsoftCaptrueVision.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNDynamsoftCaptrueVision.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNDynamsoftCaptrueVisionPackage;` to the imports at the top of the file
  - Add `new RNDynamsoftCaptrueVisionPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-dynamsoft-captrue-vision'
  	project(':react-native-dynamsoft-captrue-vision').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-dynamsoft-captrue-vision/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-dynamsoft-captrue-vision')
  	```


## Usage
```javascript
import RNDynamsoftCaptrueVision from 'react-native-dynamsoft-captrue-vision';

// TODO: What to do with the module?
RNDynamsoftCaptrueVision;
```
  