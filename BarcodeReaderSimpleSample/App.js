import React, {useState} from 'react';
import {
  Button,
  Modal,
  PermissionsAndroid,
  Platform,
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

const option = {
  mediaType: 'photo',
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.8,
};

const requestPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
  } catch (err) {
    console.log(err);
  }
};

const decodeFile = async filePath => {
  return this.dbr.decodeFile(filePath);
};

const mergeResultsText = results => {
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

const useImagePicker = (imagePickerLauncher, setModalState) => {
  imagePickerLauncher(option, res => {
    if (res.didCancel) {
      setModalState(modalInitState);
      return false;
    }
    setModalState({isVisible: true, text: 'decoding...'});
    decodeFile(res.assets[0].uri.split('file://')[1])
      .then(results => {
        let str = mergeResultsText(results);
        setModalState({isVisible: true, text: str});
      })
      .catch(err => {
        setModalState({isVisible: true, text: err.toString()});
      });
  });
};

(async () => {
  // Initialize the license so that you can use full feature of the Barcode Reader module.
  await DCVBarcodeReader.initLicense(
    'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9',
  ).catch(e => {
    console.log(e);
  });
  try {
    this.dbr = await DCVBarcodeReader.createInstance();
    await this.dbr.updateRuntimeSettings(
      EnumDBRPresetTemplate.IMAGE_READ_RATE_FIRST,
    );
  } catch (e) {
    console.log(e);
  }
})();

const modalInitState = {
  isVisible: false,
  text: '',
};

function HomeScreen({navigation}) {
  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalText, setModalText] = useState('');
  const [modalState, setModalState] = useState(modalInitState);

  return (
    <View style={styles.contentView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalState.isVisible}
        onRequestClose={() => {
          setModalState(modalInitState);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setModalState(modalInitState);
          }}
          style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalState.text}</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      <Button
        title="Take Photo"
        onPress={() => {
          requestPermissions().then(() => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useImagePicker(launchCamera, setModalState);
          });
        }}
      />
      <View style={styles.splitView} />
      <Button
        title="Select Photo"
        onPress={() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useImagePicker(launchImageLibrary, setModalState);
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
