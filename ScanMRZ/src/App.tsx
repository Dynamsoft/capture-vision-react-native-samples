/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {MRZScanner, EnumResultStatus, MRZScanConfig} from 'dynamsoft-capture-vision-react-native';

function App(): React.JSX.Element {
  const [displayText, setDisplayText] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const ScanMRZ = async () => {
    let mrzScanConfig = {
      license: 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9',
    } as MRZScanConfig;
    let mrzResult = await MRZScanner.launch(mrzScanConfig);
    let displayString: string;
    if (mrzResult.resultStatus === EnumResultStatus.RS_FINISHED) {
      let mrzData = mrzResult?.data!;
      displayString = Object.entries(mrzData)
        .map(([fieldName, fieldValue]) => `${fieldName} : \t${fieldValue}`)
        .join('\n\n');
    } else if (mrzResult.resultStatus === EnumResultStatus.RS_CANCELED) {
      displayString = 'Scan cancelled.';
    } else {
      displayString = `ErrorCode: ${mrzResult.errorCode}\n\nErrorMessage: ${mrzResult.errorString}`;
    }
    setDisplayText(displayString);
    setIsError(mrzResult.resultStatus === EnumResultStatus.RS_EXCEPTION);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={[styles.text, isError ? styles.errorText : null]}>
          {displayText}
        </Text>
      </ScrollView>
      <Button title={'Scan MRZ'} onPress={ScanMRZ}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, marginBottom: 50},
  text: {marginTop: 20, fontSize: 16, color: 'black'},
  errorText: {color: 'red'},
});

export default App;
