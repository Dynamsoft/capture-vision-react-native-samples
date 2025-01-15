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
import {LicenseManager} from 'dynamsoft-capture-vision-react-native';
import {Scanner} from './Scanner.tsx';

export type ScreenNames = ['Home', 'Scanner'];
export type RootStackParamList = Record<ScreenNames[number], undefined>;

export type StackNavigation = NativeStackScreenProps<RootStackParamList>;

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
      <Button title={'Start Scanning'} onPress={() => navigation.navigate('Scanner')} />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={Scanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  contentView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  errorText: {color: 'red', margin: 20, fontSize: 16},
});

export default App;
