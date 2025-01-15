/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {DetectedQuadsResult, ImageData, LicenseManager} from 'dynamsoft-capture-vision-react-native';
import {Scanner} from './Scanner.tsx';
import {Editor} from './Editor.tsx';
import {NormalizedImage} from './NormalizedImage.tsx';

declare global {
  var originalImage: ImageData; //Used in Scanner.tsx and Editor.tsx
  var quadsResult: DetectedQuadsResult; //Used in Scanner.tsx and Editor.tsx
  var normalizedImage: ImageData;  //Used in Editor.tsx and NormalizedImage.tsx
}

export type ScreenNames = ['Home', 'Scanner', 'Editor', 'NormalizedImage'];
export type RootStackParamList = Record<ScreenNames[number], undefined>;
export type StackNavigation = NativeStackScreenProps<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();
function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="Editor" component={Editor} />
        <Stack.Screen name="NormalizedImage" component={NormalizedImage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({navigation}: StackNavigation) {
  const [error, setError] = useState<string | null>(null);
  const initLicense = () =>
    LicenseManager.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9').catch(e => {
      console.log('Init license failed. Error: ' + e.message);
      setError('Init license failed. \nError: ' + e.message);
    });
  initLicense().then(/*no-op*/);
  return (
    <View style={styles.contentView}>
      <Button title={'Scan a Document'} onPress={() => navigation.navigate('Scanner')} />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contentView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  errorText: {color: 'red', margin: 20, fontSize: 16},
  fullScreen: {flex: 1},
  bottomView: {position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center'},
});

export default App;
