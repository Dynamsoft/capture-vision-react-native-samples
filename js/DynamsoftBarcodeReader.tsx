import {
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native'
import { BarcodeResult } from './BarcodeResult'
import {DBRRuntimeSettings, EnumDBRPresetTemplate} from "./BarcodeSettings"

const DBRModule = NativeModules.RNDynamsoftBarcodeReader
const DBREventEmitter = new NativeEventEmitter(DBRModule)

export class DynamsoftBarcodeReader {
  
    static async initLicense(license: string): Promise<void>{
        try {
            return await DBRModule.initLicense(license)
        }catch (e) {
            throw (e)
        }
    }

    static async createInstance(): Promise<DynamsoftBarcodeReader>{
        await DBRModule.createInstance()
        return new DynamsoftBarcodeReader()
    }

    getVersion(): Promise<string>{
        return DBRModule.getVersion()
    }

    getRuntimeSettings(): Promise<DBRRuntimeSettings> {
        return DBRModule.getSettings()
    }

    resetRuntimeSettings(): Promise<boolean>{
        return DBRModule.resetSettings()
    }

    outputRuntimeSettingsToString(): Promise<string>{
        return DBRModule.outputSettings()
    }

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

    decodeFile(filePath: string): Promise<BarcodeResult[]> {
        return DBRModule.decodeFile(filePath)
    }

    startScanning(): Promise<void>{
        return DBRModule.startBarcodeScanning()
    }
  
    stopScanning(): Promise<void>{
        return DBRModule.stopBarcodeScanning()
    }

    addResultListener(listener: (results: BarcodeResult[]) => void): void{
        if(Platform.OS === 'android') {
            DBRModule.addResultListener()
        }
        DBREventEmitter.addListener(
            'resultEvent',
            listener
        );
    }

    removeAllResultListeners(): void{
        DBREventEmitter.removeAllListeners('resultEvent');
    }
    
}

export const DCVBarcodeReader = DynamsoftBarcodeReader;