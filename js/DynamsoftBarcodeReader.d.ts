import { BarcodeResult, DBRRuntimeSettings } from "./BarcodeSettings";
export declare class DynamsoftBarcodeReader {
    static initLicense(license: string): Promise<any>;
    static createInstance(): Promise<DynamsoftBarcodeReader>;
    getVersion(): Promise<string>;
    getRuntimeSettings(): Promise<DBRRuntimeSettings>;
    resetRuntimeSettings(): Promise<boolean>;
    outputRuntimeSettingsToString(): Promise<string>;
    updateRuntimeSettings(settings: DBRRuntimeSettings): Promise<boolean>;
    startScanning(): Promise<void>;
    stopScanning(): Promise<void>;
    addResultListener(listener: (results: BarcodeResult[]) => void): void;
    removeAllResultListeners(): void;
}
