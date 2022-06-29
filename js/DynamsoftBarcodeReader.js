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
exports.DynamsoftBarcodeReader = void 0;
const react_native_1 = require("react-native");
const DBRModule = react_native_1.NativeModules.RNDynamsoftBarcodeReader;
const DBREventEmitter = new react_native_1.NativeEventEmitter(DBRModule);
class DynamsoftBarcodeReader {
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
    static createInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DBRModule.createInstance();
            return new DynamsoftBarcodeReader();
        });
    }
    getVersion() {
        return DBRModule.getVersion();
    }
    getRuntimeSettings() {
        return DBRModule.getSettings();
    }
    resetRuntimeSettings() {
        return DBRModule.resetSettings();
    }
    outputRuntimeSettingsToString() {
        return DBRModule.outputSettings();
    }
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
    }
    startScanning() {
        DBRModule.startBarcodeScanning();
    }
    stopScanning() {
        DBRModule.stopBarcodeScanning();
    }
    addResultListener(listener) {
        if (react_native_1.Platform.OS === 'android') {
            DBRModule.addResultListener();
        }
        DBREventEmitter.addListener('resultEvent', listener);
    }
    removeAllResultListeners() {
        DBREventEmitter.removeAllListeners('resultEvent');
    }
}
exports.DynamsoftBarcodeReader = DynamsoftBarcodeReader;
//# sourceMappingURL=DynamsoftBarcodeReader.js.map