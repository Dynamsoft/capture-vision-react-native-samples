"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamsoftBarcodeReader = exports.DCVBarcodeReader = void 0;
const react_native_1 = require("react-native");
const DBRModule = react_native_1.NativeModules.RNDynamsoftBarcodeReader;
const DBREventEmitter = new react_native_1.NativeEventEmitter(DBRModule);
class DCVBarcodeReader {
    /**
    * Initialize the license with a license key.
    */
    static initLicense(license) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DBRModule.initLicense(license);
            }
            catch (e) {
                throw (e);
            }
        });
    }
    /**
    * Create an instance of the DCVBarcode reader.
    */
    static createInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DBRModule.createInstance();
            return new exports.DynamsoftBarcodeReader();
        });
    }
    /**
    * Get the version of the barcode reader library.
    */
    getVersion() {
        return DBRModule.getVersion();
    }
    /**
    * Get the current runtime settings as a DBRRuntimeSettings object.
    */
    getRuntimeSettings() {
        return DBRModule.getSettings();
    }
    /**
    * Reset the runtime settings.
    */
    resetRuntimeSettings() {
        return DBRModule.resetSettings();
    }
    /**
    * Output the current runtime settings as a string.
    */
    outputRuntimeSettingsToString() {
        return DBRModule.outputSettings();
    }
    /**
    * Update the current runtime settings with a DBRRuntimeSettings object / a preset template / a JSON string.
    */
    updateRuntimeSettings(settings) {
        if (typeof settings === 'object') {
            return DBRModule.updateSettingsFromDictionary(settings);
        }
        else if (typeof settings === 'number') {
            return DBRModule.updateSettingsFromNumber(settings);
        }
        else if (typeof settings === 'string') {
            return DBRModule.updateSettingsFromString(settings);
        }
        else {
            return new Promise((reslove, reject) => { reject(false); });
        }
    }
    /**
    * Decode barcode(s) from an image file with the file path.
    */
    decodeFile(filePath) {
        return DBRModule.decodeFile(filePath);
    }
    /**
    * Start barcode decoding from the video streaming.
    */
    startScanning() {
        return DBRModule.startBarcodeScanning();
    }
    /**
    * Stop barcode decoding from the video streaming.
    */
    stopScanning() {
        return DBRModule.stopBarcodeScanning();
    }
    /**
     * Enable Duplicated Filter in video stream
     * */
    enableDuplicateFilter(isEnabled) {
        return DBRModule.enableDuplicateFilter(isEnabled);
    }
    /**
    * Register a listener to receive callback when barcode result is output.
    */
    addResultListener(listener) {
        if (react_native_1.Platform.OS === 'android') {
            DBRModule.addResultListener();
        }
        DBREventEmitter.addListener('resultEvent', listener);
    }
    /**
    * Remove all the result listeners.
    */
    removeAllResultListeners() {
        DBREventEmitter.removeAllListeners('resultEvent');
    }
}
exports.DCVBarcodeReader = DCVBarcodeReader;
/**
 * @deprecated since version 1.1.5,
 * use DCVBarcodeReader instead.
 */
exports.DynamsoftBarcodeReader = DCVBarcodeReader;
//# sourceMappingURL=DynamsoftBarcodeReader.js.map