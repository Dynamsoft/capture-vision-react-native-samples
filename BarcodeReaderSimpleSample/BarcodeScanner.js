import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  DCVBarcodeReader,
  DCVCameraView,
  EnumBarcodeFormat,
  EnumTorchState,
} from 'henry-capture-vision-react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const option = {
  mediaType: 'photo',
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.7,
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

const modalInitState = {
  isVisible: false,
  modalText: '',
};

class BarcodeScanner extends React.Component {
  state = {
    results: null,
    isVisible: false,
    modalText: '',
  };

  decodeFile = async filePath => {
    return this.reader.decodeFile(filePath);
  };

  useImagePicker = imagePickerLauncher => {
    console.log(this.reader);
    imagePickerLauncher(option, res => {
      if (res.didCancel) {
        // this.setState(modalInitState);
        return false;
      }

      // setModalState({isVisible: true, modalText: 'decoding...'});
      console.log(res.assets[0].uri.split('file://')[1]);
      this.decodeFile(res.assets[0].uri.split('file://')[1])
        .then(results => {
          let str = mergeResultsText(results);
          console.log(str);
          this.setState({isVisible: true, modalText: str});
        })
        .catch(err => {
          console.log(err);
          this.setState({isVisible: true, modalText: err.toString()});
        });
    });
  };

  async componentDidMount() {
    console.log('start');
    // Create a barcode reader instance.
    this.reader = await DCVBarcodeReader.createInstance();

    await this.reader.resetRuntimeSettings();

    // Get the current runtime settings of the barcode reader.
    let settings = await this.reader.getRuntimeSettings();

    // Set the expected barcode count to 0 when you are not sure how many barcodes you are scanning.
    // Set the expected barcode count to 1 can maximize the barcode decoding speed.
    settings.expectedBarcodesCount = 0;

    // Set the barcode format to read.
    settings.barcodeFormatIds =
      EnumBarcodeFormat.BF_ONED |
      EnumBarcodeFormat.BF_QR_CODE |
      EnumBarcodeFormat.BF_PDF417 |
      EnumBarcodeFormat.BF_DATAMATRIX;

    // Apply the new runtime settings to the barcode reader.
    await this.reader.updateRuntimeSettings(settings);

    // Add a result listener. The result listener will handle callback when barcode result is returned.
    this.reader.addResultListener(results => {
      // Update the newly detected barcode results to the state.
      this.setState({results: results});
    });

    // Enable video barcode scanning.
    // If the camera is opened, the barcode reader will start the barcode decoding thread when you triggered the startScanning.
    // The barcode reader will scan the barcodes continuously before you trigger stopScanning.
    this.reader.startScanning();

    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <Entypo
            style={{paddingRight: 15}}
            name={'camera'}
            size={35}
            onPress={() => {
              this.useImagePicker(launchCamera);
            }}
          />
          <Entypo
            style={{paddingLeft: 15}}
            name={'folder-images'}
            size={35}
            onPress={() => {
              this.useImagePicker(launchImageLibrary);
            }}
          />
        </View>
      ),
    });
  }

  async componentWillUnmount() {
    // Stop the barcode decoding thread when your component is unmount.
    await this.reader.stopScanning();
    // Remove the result listener when your component is unmount.
    this.reader.removeAllResultListeners();
  }

  render() {
    let barcode_text = '';
    // let region = {
    //   regionTop: 30,
    //   regionLeft: 15,
    //   regionBottom: 70,
    //   regionRight: 85,
    //   regionMeasuredByPercentage: true,
    // };       // Define the scan region.
    let results = this.state.results;
    if (results && results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        barcode_text +=
          results[i].barcodeFormatString + ':' + results[i].barcodeText + '\n';
      }
    }

    return (
      <DCVCameraView
        style={{
          flex: 1,
        }}
        ref={ref => {
          this.scanner = ref;
        }}
        overlayVisible={true}
        torchButton={{
          visible: true,
        }}
        torchState={EnumTorchState.OFF}
        // scanRegionVisible={true}
        // scanRegion={region}  // Set scan region.
      >
        <Text
          style={{
            flex: 0.9,
            marginTop: 200,
            textAlign: 'center',
            color: 'white',
            fontSize: 18,
          }}>
          {results && results.length > 0 ? barcode_text : ''}
        </Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isVisible}
          onRequestClose={() => {
            this.setState(modalInitState);
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setState(modalInitState);
            }}
            style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{this.state.modalText}</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      </DCVCameraView>
    );
  }
}

const styles = StyleSheet.create({
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
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BarcodeScanner;
