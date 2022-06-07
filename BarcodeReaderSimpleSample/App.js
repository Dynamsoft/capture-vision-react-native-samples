import React from 'react';
import {Text} from 'react-native';
import {
    DynamsoftBarcodeReader,
    DynamsoftCameraView,
    BarcodeResult,
    EnumDBRPresetTemplate,
    Region,
    EnumBarcodeFormat,
    DBRRuntimeSettings
} from 'henry-capture-vision-react-native';


class App extends React.Component {
    state = {
        results: null
    };

    componentDidMount() {
        (async () => {
            try {
                await DynamsoftBarcodeReader.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9")
            } catch (e) {
                console.log(e)
            }


            this.reader = await DynamsoftBarcodeReader.createInstance();
            await this.reader.updateRuntimeSettings(EnumDBRPresetTemplate.DEFAULT);
            let settings: DBRRuntimeSettings = await this.reader.getRuntimeSettings();
            // Set the expected barcode count to 0 when you are not sure how many barcodes you are scanning.
            // Set the expected barcode count to 1 can maximize the barcode decoding speed.
            settings.expectedBarcodesCount = 0;
            settings.barcodeFormatIds = EnumBarcodeFormat.BF_ONED | EnumBarcodeFormat.BF_QR_CODE;
            await this.reader.updateRuntimeSettings(settings)

            await this.reader.startScanning();
            this.reader.addResultListener((results: BarcodeResult[]) => {
                this.setState({results: results})
                console.log(results.length)
            })
        })();


    }

    async componentWillUnmount() {
        await this.reader.stopScanning()
        this.reader.removeAllResultListeners()
    }


    render() {
        let region: Region;        
        let barcode_text = "";
        region = {
            regionTop: 30,
            regionLeft: 15,
            regionBottom: 70,
            regionRight: 85,
            regionMeasuredByPercentage: true
        }
        let results: BarcodeResult[] = this.state.results;
        if (results && results.length > 0){
            for (var i=0; i<results.length; i++) {
                barcode_text += results[i].barcodeFormatString+":"+results[i].barcodeText+"\n"
            }
            console.log(barcode_text);
        }

        return (
            <DynamsoftCameraView
                style={{
                    flex: 1,
                }}
                ref = {(ref)=>{this.scanner = ref}}
                overlayVisible={true}
                scanRegionVisible={true}
                scanRegion={region}
            >
                <Text style={{
                    flex: 0.9,
                    marginTop: 100,
                    textAlign: "center",
                    color: "white",
                    fontSize: 18,
                }}>{results && results.length > 0 ? barcode_text : "null"}</Text>
            </DynamsoftCameraView>


        );
    }
}

export default App;
