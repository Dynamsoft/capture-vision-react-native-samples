import { BarcodeResult } from './BarcodeResult';
import { DBRRuntimeSettings, EnumDBRPresetTemplate } from "./BarcodeSettings";
export declare class DynamsoftBarcodeReader {
    static initLicense(license: string): Promise<void>;
    static createInstance(): Promise<DynamsoftBarcodeReader>;
    getVersion(): Promise<string>;
    getRuntimeSettings(): Promise<DBRRuntimeSettings>;
    resetRuntimeSettings(): Promise<boolean>;
    outputRuntimeSettingsToString(): Promise<string>;
    updateRuntimeSettings(settings: DBRRuntimeSettings | EnumDBRPresetTemplate | string): Promise<boolean>;
    decodeFile(filePath: string): Promise<BarcodeResult[]>;
    startScanning(): Promise<void>;
    stopScanning(): Promise<void>;
    addResultListener(listener: (results: BarcodeResult[]) => void): void;
    removeAllResultListeners(): void;
}
export declare const DCVBarcodeReader: typeof DynamsoftBarcodeReader;
