import {
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native'
import { BarcodeResult } from './BarcodeResult'
import {DBRRuntimeSettings, EnumDBRPresetTemplate} from "./BarcodeSettings"

const DBRModule = NativeModules.RNDynamsoftBarcodeReader
const DBREventEmitter = new NativeEventEmitter(DBRModule)

export class DCVBarcodeReader {
  
    /**
    * Initialize the license with a license key.
    */
    static async initLicense(license: string): Promise<void>{
        try {
            return await DBRModule.initLicense(license)
        }catch (e) {
            throw (e)
        }
    }

    /**
    * Create an instance of the DCVBarcode reader.
    */
    static async createInstance(): Promise<DCVBarcodeReader>{
        await DBRModule.createInstance()
        return new DynamsoftBarcodeReader()
    }

    /**
    * Get the version of the barcode reader library.
    */
    getVersion(): Promise<string>{
        return DBRModule.getVersion()
    }

    /**
    * Get the current runtime settings as a DBRRuntimeSettings object.
    */
    getRuntimeSettings(): Promise<DBRRuntimeSettings> {
        return DBRModule.getSettings()
    }

    /**
    * Reset the runtime settings.
    */
    resetRuntimeSettings(): Promise<boolean>{
        return DBRModule.resetSettings()
    }

    /**
    * Output the current runtime settings as a string.
    */
    outputRuntimeSettingsToString(): Promise<string>{
        return DBRModule.outputSettings()
    }

    /**
    * Update the current runtime settings with a DBRRuntimeSettings object / a preset template / a JSON string.
    */
    updateRuntimeSettings(settings: DBRRuntimeSettings | EnumDBRPresetTemplate | string): Promise<boolean>{
        if (typeof settings === 'object') {
            return DBRModule.updateSettingsFromDictionary(settings)
        } else if (typeof settings === 'number') {
            return DBRModule.updateSettingsFromNumber(settings)
        } else if (typeof settings === 'string') {
            return DBRModule.updateSettingsFromString(settings)
        } else {
            return new Promise<boolean>((reslove, reject) => {reject(false)} )
        }
    }

    /**
    * Decode barcode(s) from an image file with the file path.
    */
    decodeFile(filePath: string): Promise<BarcodeResult[]> {
        return DBRModule.decodeFile(filePath)
    }

    /**
    * Start barcode decoding from the video streaming.
    */
    startScanning(): Promise<void>{
        return DBRModule.startBarcodeScanning()
    }
  
    /**
    * Stop barcode decoding from the video streaming.
    */
    stopScanning(): Promise<void>{
        return DBRModule.stopBarcodeScanning()
    }

    /**
    * Register a listener to receive callback when barcode result is output.
    */
    addResultListener(listener: (results: BarcodeResult[]) => void): void{
        if(Platform.OS === 'android') {
            DBRModule.addResultListener()
        }
        DBREventEmitter.addListener(
            'resultEvent',
            listener
        );
    }

    /**
    * Remove all the result listeners.
    */
    removeAllResultListeners(): void{
        DBREventEmitter.removeAllListeners('resultEvent');
    }
    
}

/**
 * @deprecated since version 1.1.5,
 * use DCVBarcodeReader instead.
 */
export const DynamsoftBarcodeReader = DCVBarcodeReader;