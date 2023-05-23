import { BarcodeResult } from './BarcodeResult';
import { DBRRuntimeSettings, EnumDBRPresetTemplate } from "./BarcodeSettings";
export declare class DCVBarcodeReader {
    /**
    * Initialize the license with a license key.
    */
    static initLicense(license: string): Promise<void>;
    /**
    * Create an instance of the DCVBarcode reader.
    */
    static createInstance(): Promise<DCVBarcodeReader>;
    /**
    * Get the version of the barcode reader library.
    */
    getVersion(): Promise<string>;
    /**
    * Get the current runtime settings as a DBRRuntimeSettings object.
    */
    getRuntimeSettings(): Promise<DBRRuntimeSettings>;
    /**
    * Reset the runtime settings.
    */
    resetRuntimeSettings(): Promise<boolean>;
    /**
    * Output the current runtime settings as a string.
    */
    outputRuntimeSettingsToString(): Promise<string>;
    /**
    * Update the current runtime settings with a DBRRuntimeSettings object / a preset template / a JSON string.
    */
    updateRuntimeSettings(settings: DBRRuntimeSettings | EnumDBRPresetTemplate | string): Promise<boolean>;
    /**
    * Decode barcode(s) from an image file with the file path.
    */
    decodeFile(filePath: string): Promise<BarcodeResult[]>;
    /**
    * Start barcode decoding from the video streaming.
    */
    startScanning(): Promise<void>;
    /**
    * Stop barcode decoding from the video streaming.
    */
    stopScanning(): Promise<void>;
    /**
     * Enable Duplicated Filter in video stream
     * */
    enableDuplicateFilter(isEnabled: boolean): Promise<void>;
    /**
    * Register a listener to receive callback when barcode result is output.
    */
    addResultListener(listener: (results: BarcodeResult[]) => void): void;
    /**
    * Remove all the result listeners.
    */
    removeAllResultListeners(): void;
}
/**
 * @deprecated since version 1.1.5,
 * use DCVBarcodeReader instead.
 */
export declare const DynamsoftBarcodeReader: typeof DCVBarcodeReader;
