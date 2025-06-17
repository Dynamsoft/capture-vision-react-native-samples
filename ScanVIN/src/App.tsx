import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {EnumResultStatus} from './VINScanResult.tsx';
import {ScannerView} from './VINScanner.tsx';
import {useScanner} from './useScanner.tsx';

function App(): React.JSX.Element {
  const [display, setDisplay] = useState({text: '', isError: false});
  const { visible, openScanner, onComplete } = useScanner();

  useEffect(() => {
    console.log('useEffect');
    return () => {
      console.log('useEffect cleanup');
    };
  }, []);

  const scanVIN = async () => {
    const result = await openScanner();
    let displayString: string;
    if (result.resultStatus === EnumResultStatus.RS_FINISHED) {
      displayString = Object.entries(result.data!)
        .map(([key, value]) => `${key}: \t${value}`)
        .join('\n\n');
    } else if (result.resultStatus === EnumResultStatus.RS_CANCELED) {
      displayString = 'Scan cancelled.';
    } else {
      displayString = `ErrorCode: ${result.errorCode}\n\nErrorMessage: ${result.errorString}`;
    }
    setDisplay({text: displayString, isError: result.resultStatus === EnumResultStatus.RS_ERROR});
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={[styles.text, display.isError ? styles.error : null]}>
          {display.text}
        </Text>
      </ScrollView>
      <Button title="Open VIN Scanner" onPress={scanVIN}/>

      {visible && (
        <View style={styles.overlay}>
          <ScannerView onComplete={onComplete} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  scroll: {flex: 1, padding: 16},
  text: {fontSize: 16},
  error: {color: 'red'},
  overlay: {
    position: 'absolute',
    top: 0, left: 0,
    right: 0, bottom: 0,
    zIndex: 999,
    elevation: 999,
  },
});

export default App;
