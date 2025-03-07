/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  getDriverLicenseScannerScreen,
  openDriverLicenseScanner,
} from './OpenDriverLicenseScanner.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {EnumResultStatus} from './DriverLicenseScanResult.tsx';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name={'Home'} component={HomeScreen} />
        {getDriverLicenseScannerScreen()}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen() {
  const [displayText, setDisplayText] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const navigation = useNavigation();
  const scanDriverLicense = async () => {
    let result = await openDriverLicenseScanner(navigation);

    let displayString;
    if (result.resultStatus === EnumResultStatus.RS_FINISHED) {
      let dlData = result?.data!;
      displayString = Object.entries(dlData)
        .map(([fieldName, fieldValue]) => `${fieldName} : \t${fieldValue}`)
        .join('\n\n');
      setDisplayText(displayString);
    } else if (result.resultStatus === EnumResultStatus.RS_CANCELED) {
      displayString = 'Scan cancelled.';
    } else {
      displayString = `ErrorCode: ${result.errorCode}\n\nErrorMessage: ${result.errorString}`;
    }
    setDisplayText(displayString);
    setIsError(result.resultStatus === EnumResultStatus.RS_ERROR);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={[styles.text, isError ? styles.errorText : null]}>
          {displayText}
        </Text>
      </ScrollView>
      <Button
        title={"Open Drivers' License Scanner"}
        onPress={scanDriverLicense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 50,
  },
  text: {marginTop: 20, fontSize: 16, color: 'black'},
  errorText: {color: 'red'},
  spacer: {height: 20},
});

export default App;
