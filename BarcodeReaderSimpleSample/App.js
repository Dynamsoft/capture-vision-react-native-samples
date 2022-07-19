import React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BarcodeScanner from './BarcodeScanner';
import {DynamsoftBarcodeReader} from 'henry-capture-vision-react-native';

function HomeScreen({navigation}) {
  (async () => {
    // Initialize the license so that you can use full feature of the Barcode Reader module.
    try {
      await DynamsoftBarcodeReader.initLicense('DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9');
    } catch (e) {
      console.log(e);
    }
  })();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        title="Start Scanning"
        onPress={() => navigation.navigate('Barcode')}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Barcode" component={BarcodeScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
