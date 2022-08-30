import React, {useState} from 'react';
import {
  Button,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BarcodeScanner from './BarcodeScanner';
import {
  BarcodeResult,
  DCVBarcodeReader,
  EnumDBRPresetTemplate,
} from 'henry-capture-vision-react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

let mdbr;

const option = {
  mediaType: 'photo',
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.8,
};

const requestPermissions = async () => {
  try {
    if (
      !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA))
    ) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
  } catch (err) {
    console.log(err);
  }
};

const decodeFile = async filePath => {
  try {
    return await mdbr.decodeFile(filePath);
  } catch (err) {
    return null;
  }
};

const mergeResultsText = (results: BarcodeResult[]) => {
  let str = '';
  if (results && results.length > 0) {
    for (let i = 0; i < results.length; i++) {
      str +=
        results[i].barcodeFormatString + ': ' + results[i].barcodeText + ' \n';
    }
  } else {
    str = 'No barcode detected.';
  }
  return str;
};

const useImagePicker = (imagePickerLauncher, setModalVisible, setModalText) => {
  imagePickerLauncher(option).then(res => {
    if (res.didCancel) {
      setModalVisible(false);
      return false;
    }
    decodeFile(res.assets[0].uri.split('file://')[1]).then(results => {
      let str = mergeResultsText(results);
      setModalVisible(true);
      setModalText(str);
    });
  });
  setModalText('Decoding...');
  setModalVisible(true);
};

function HomeScreen({navigation}) {
  (async () => {
    // Initialize the license so that you can use full feature of the Barcode Reader module.
    try {
      await DCVBarcodeReader.initLicense(
        'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9',
      );

      mdbr = await DCVBarcodeReader.createInstance();
      await mdbr.updateRuntimeSettings(
        EnumDBRPresetTemplate.IMAGE_READ_RATE_FIRST,
      );
    } catch (e) {
      console.log(e);
    }
  })();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');

  return (
    <View style={styles.contentView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            console.log('false');
            setModalVisible(false);
          }}
          style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      <Button
        title="Take Photo"
        onPress={() => {
          requestPermissions().then(() => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useImagePicker(launchCamera, setModalVisible, setModalText);
          });
        }}
      />
      <View style={styles.splitView} />
      <Button
        title="Select Photo"
        onPress={() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useImagePicker(launchImageLibrary, setModalVisible, setModalText);
        }}
      />
      <View style={styles.splitView} />
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
  centeredView: {
    flex: 1,
    backgroundColor: '#00000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: 'center',
  },
  splitView: {
    height: 100,
  },
});

export default App;
