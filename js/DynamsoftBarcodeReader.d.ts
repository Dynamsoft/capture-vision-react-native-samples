import { BarcodeResult } from './BarcodeResult';
import { DBRRuntimeSettings, EnumDBRPresetTemplate } from "./BarcodeSettings";
export declare class DCVBarcodeReader {
    static initLicense(license: string): Promise<void>;
    static createInstance(): Promise<DCVBarcodeReader>;
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
/**
 * @deprecated since version 1.1.5,
 * use DCVBarcodeReader instead.
 */
export declare const DynamsoftBarcodeReader: typeof DCVBarcodeReader;
