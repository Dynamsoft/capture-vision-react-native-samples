import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BarcodeScanner from './BarcodeScanner';
import {DCVBarcodeReader} from 'dynamsoft-capture-vision-react-native';

(async () => {
  // Initialize license for the Barcode Decoding module of Dynamsoft Capture Vision.
	// The license string here is a time-limited trial license. Note that network connection is required for this license to work.
	// You can also request an extension for your trial license via the Request a Trial License link: https://www.dynamsoft.com/customer/license/trialLicense?product=dbr&utm_source=github&package=react_native&version=9
  await DCVBarcodeReader.initLicense(
    'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9',
  ).catch(e => {
    console.log(e);
  });
})();

function HomeScreen({navigation}) {
  return (
    <View style={styles.contentView}>
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

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export default App;
