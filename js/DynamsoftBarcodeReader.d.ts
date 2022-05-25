import PropTypes from 'prop-types';
import { DBRRuntimeSettings, EnumDBRPresetTemplate } from "./BarcodeSettings";
export declare class DynamsoftBarcodeReader {
    static initLicense(license: String): Promise<void>;
    static createInstance(): Promise<DynamsoftBarcodeReader>;
    getVersion(): Promise<String>;
    getRuntimeSettings(): Promise<DBRRuntimeSettings>;
    resetRuntimeSettings(): Promise<boolean>;
    outputRuntimeSettingsToString(): Promise<String>;
    updateRuntimeSettings(settings: DBRRuntimeSettings | number | EnumDBRPresetTemplate | String): Promise<boolean>;
    startScanning(): Promise<void>;
    stopScanning(): Promise<void>;
    addResultListener(listener: Function): void;
    removeAllResultListeners(): void;
}
