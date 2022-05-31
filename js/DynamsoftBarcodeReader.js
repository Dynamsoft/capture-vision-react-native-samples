import PropTypes from 'prop-types'
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native'
import {DBRRuntimeSettings, EnumDBRPresetTemplate} from "./BarcodeSettings"

const DBRModule = NativeModules.RNDynamsoftBarcodeReader
const DBREventEmitter = new NativeEventEmitter(DBRModule)

export class DynamsoftBarcodeReader {
  
    static async initLicense(license:String) {
        try {
            return await DBRModule.initLicense(license)
        }catch (e) {
            throw (e)
        }
    }

    static async createInstance(){
        await DBRModule.createInstance()
        return new DynamsoftBarcodeReader()
    }

    getVersion():Promise<String>{
        return DBRModule.getVersion()
    }

    getRuntimeSettings():Promise<DBRRuntimeSettings> {
        return DBRModule.getSettings()
    }

    resetRuntimeSettings():Promise<boolean>{
        return DBRModule.resetSettings()
    }

    outputRuntimeSettingsToString():Promise<String>{
        return DBRModule.outputSettings()
    }

    updateRuntimeSettings(settings: DBRRuntimeSettings | number |EnumDBRPresetTemplate | String):Promise<boolean>{
        if (typeof settings === 'object') {
            return DBRModule.updateSettingsFromDictionary(settings)
        } else if (typeof settings === 'number') {
            return DBRModule.updateSettingsFromNumber(settings)
        } else if (typeof settings === 'string') {
            return DBRModule.updateSettingsFromString(settings)
        }
    }

    startScanning(): Promise<void>{
        DBRModule.startBarcodeScanning()
    }
  
    stopScanning(): Promise<void>{
        DBRModule.stopBarcodeScanning()
    }

    addResultListener(listener:Function){
        if(Platform.OS === 'android') {
            DBRModule.addResultListener()
        }
        DBREventEmitter.addListener(
            'resultEvent',
            listener
        );
    }

    removeAllResultListeners(){
        DBREventEmitter.removeAllListeners('resultEvent');
    }
    
}