import PropTypes from 'prop-types';
import { DBRRuntimeSettings, EnumDBRPresetTemplate } from "./BarcodeSettings";
export declare class DynamsoftBarcodeReader {
    static initLicense(license: String): Promise<void>;
    static createInstance(): Promise<DynamsoftBarcodeReader>;
    getVersion(): Promise<String>;
    getDBRRuntimeSettings(): Promise<DBRRuntimeSettings>;
    resetDBRRuntimeSettings(): Promise<boolean>;
    outputDBRRuntimeSettingsToString(): Promise<String>;
    updateDBRRuntimeSettings(settings: DBRRuntimeSettings | number | EnumDBRPresetTemplate | String): Promise<boolean>;
    startScanning(): Promise<void>;
    stopScanning(): Promise<void>;
    addResultListener(listener: Function): void;
    removeAllResultListeners(): void;
}
