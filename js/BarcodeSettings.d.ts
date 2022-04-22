export interface DBRRuntimeSettings {
    barcodeFormatIds: number;
    barcodeFormatIds_2: number;
    expectedBarcodesCount: number;
    timeout: number;
}
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

export interface Quadrilateral {
    points : Point[];
}

export interface Point {
    x:number;
    y:number;
}

export interface Region {
    regionBottom: number;
    regionRight: number;
    regionLeft: number;
    regionTop: number;
    regionMeasuredByPercentage: number | boolean;
}

export declare enum EnumDBRPresetTemplate {
    DEFAULT,
    VIDEO_SINGLE_BARCODE,
    VIDEO_SPEED_FIRST,
    VIDEO_READ_RATE_FIRST,
    IMAGE_SPEED_FIRST,
    IMAGE_READ_RATE_FIRST,
    IMAGE_DEFAULT
}

export declare enum EnumBarcodeFormat {
    BF_ALL = 0xFE3FFFFF,
    BF_ONED = 0x3007FF,
    BF_GS1_DATABAR = 0x3F800,
    BF_CODE_39 = 0x1,
    BF_CODE_128 = 0x2,
    BF_CODE_93 = 0x4,
    BF_CODABAR = 0x8,
    BF_CODE_11 = 0x200000,
    BF_ITF = 0x10,
    BF_EAN_13 = 0x20,
    BF_EAN_8 = 0x40,
    BF_UPC_A = 0x80,
    BF_UPC_E = 0x100,
    BF_INDUSTRIAL_25 = 0x200,
    BF_CODE_39_EXTENDED = 0x400,
    BF_GS1_DATABAR_OMNIDIRECTIONAL = 0x800,
    BF_GS1_DATABAR_TRUNCATED = 0x1000,
    BF_GS1_DATABAR_STACKED = 0x2000,
    BF_GS1_DATABAR_STACKED_OMNIDIRECTIONAL = 0x4000,
    BF_GS1_DATABAR_EXPANDED = 0x8000,
    BF_GS1_DATABAR_EXPANDED_STACKED = 0x10000,
    BF_GS1_DATABAR_LIMITED = 0x20000,
    BF_PATCHCODE = 0x40000,
    BF_PDF417 = 0x2000000,
    BF_QR_CODE = 0x4000000,
    BF_DATAMATRIX = 0x8000000,
    BF_AZTEC = 0x10000000,
    BF_MAXICODE = 0x20000000,
    BF_MICRO_QR = 0x40000000,
    BF_MICRO_PDF417 = 0x80000,
    BF_GS1_COMPOSITE = 0x80000000,
    BF_MSI_CODE = 0x100000,
    BF_NULL = 0x00
}

export declare enum EnumBarcodeFormat_2 {
    BF2_AUSTRALIANPOST = 0x00800000,
    BF2_DOTCODE = 0x02,
    BF2_NONSTANDARD_BARCODE = 0x01,
    BF2_NULL = 0x00,
    BF2_PHARMACODE = 0x0c,
    BF2_PHARMACODE_ONE_TRACK = 0x04,
    BF2_PHARMACODE_TWO_TRACK = 0x08,
    BF2_PLANET = 0x00400000,
    BF2_POSTALCODE = 0x01F00000,
    BF2_POSTNET = 0x00200000,
    BF2_RM4SCC = 0x01000000,
    BF2_USPSINTELLIGENTMAIL = 0x00100000
}
