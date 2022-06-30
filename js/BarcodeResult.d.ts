import { Quadrilateral } from "./BasicStructures";
export interface BarcodeResult {
    /**
    * The barcode text.
    */
    barcodeText: string;
    /**
    * Barcode type in string.
    */
    barcodeFormatString: string;
    /**
    * The corresponding localization result.
    */
    barcodeLocation: BarcodeLocationResult;
}
export interface BarcodeLocationResult {
    /**
     * The angle of a barcode. Values range from 0 to 360.
     */
    angle: number;
    /**
     * The quadrilateral
     */
    quadrilateral: Quadrilateral;
}
