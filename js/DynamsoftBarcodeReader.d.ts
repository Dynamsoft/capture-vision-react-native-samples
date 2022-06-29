import { BarcodeResult, DBRRuntimeSettings } from "./BarcodeSettings";
export declare class DynamsoftBarcodeReader {
    static initLicense(license: string): Promise<any>;
    static createInstance(): Promise<DynamsoftBarcodeReader>;
    getVersion(): any;
    getRuntimeSettings(): any;
    resetRuntimeSettings(): any;
    outputRuntimeSettingsToString(): any;
    updateRuntimeSettings(settings: DBRRuntimeSettings): any;
    startScanning(): void;
    stopScanning(): void;
    addResultListener(listener: (results: BarcodeResult[]) => void): void;
    removeAllResultListeners(): void;
}
