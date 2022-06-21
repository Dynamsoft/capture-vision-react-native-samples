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
  
    static async initLicense(license) {
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

    getVersion(){
        return DBRModule.getVersion()
    }

    getRuntimeSettings() {
        return DBRModule.getSettings()
    }

    resetRuntimeSettings(){
        return DBRModule.resetSettings()
    }

    outputRuntimeSettingsToString(){
        return DBRModule.outputSettings()
    }

    updateRuntimeSettings(settings){
        if (typeof settings === 'object') {
            return DBRModule.updateSettingsFromDictionary(settings)
        } else if (typeof settings === 'number') {
            return DBRModule.updateSettingsFromNumber(settings)
        } else if (typeof settings === 'string') {
            return DBRModule.updateSettingsFromString(settings)
        }
    }

    startScanning(){
        DBRModule.startBarcodeScanning()
    }
  
    stopScanning(){
        DBRModule.stopBarcodeScanning()
    }

    addResultListener(listener){
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