import React from 'react';
import {Text, Dimensions} from 'react-native';
import {
  DynamsoftBarcodeReader,
  DynamsoftCameraView,
  EnumBarcodeFormat,
  EnumTorchState
} from 'henry-capture-vision-react-native';

class BarcodeScanner extends React.Component {
  state = {
    results: null,
  };

  async componentDidMount() {
    // Create a barcode reader instance.
    this.reader = await DynamsoftBarcodeReader.createInstance();

    // Get the current runtime settings of the barcode reader.
    let settings = await this.reader.getRuntimeSettings();

    // Set the expected barcode count to 0 when you are not sure how many barcodes you are scanning.
    // Set the expected barcode count to 1 can maximize the barcode decoding speed.
    settings.expectedBarcodesCount = 0;

    // Set the barcode format to read.
    settings.barcodeFormatIds = EnumBarcodeFormat.BF_ONED | EnumBarcodeFormat.BF_QR_CODE | EnumBarcodeFormat.BF_PDF417 | EnumBarcodeFormat.BF_DATAMATRIX;

    // Apply the new runtime settings to the barcode reader.
    await this.reader.updateRuntimeSettings(settings);

    // Add a result listener. The result listener will handle callback when barcode result is returned. 
    this.reader.addResultListener((results) => {
      // Update the newly detected barcode results to the state.
      this.setState({results: results})
    })

    // Enable video barcode scanning.
    // If the camera is opened, the barcode reader will start the barcode decoding thread when you triggered the startScanning.
    // The barcode reader will scan the barcodes continuously before you trigger stopScanning.
    this.reader.startScanning();
  }

  async componentWillUnmount() {
    // Stop the barcode decoding thread when your component is unmount.
    await this.reader.stopScanning();
    // Remove the result listener when your component is unmount.
    this.reader.removeAllResultListeners();
  }

  render() {
    let barcode_text = '';
    // Define the scan region.
    let region = {
      regionTop: 30,
      regionLeft: 15,
      regionBottom: 70,
      regionRight: 85,
      regionMeasuredByPercentage: true,
    };
    let results = this.state.results;
    if (results && results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        barcode_text += results[i].barcodeFormatString + ':' + results[i].barcodeText + '\n';
      }
    }

    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;

    return (
      <DynamsoftCameraView
        style={{
          width: deviceWidth,
          height: deviceHeight,
        }}
        ref={ref => {
          this.scanner = ref;
        }}
        overlayVisible={true}
        scanRegionVisible={true}
        scanRegion={region}
        torchButton={{
          visible: true
        }}
        torchState={ EnumTorchState.OFF }
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
      </DynamsoftCameraView>
    );
  }
}

export default BarcodeScanner;
