"use strict";
exports.__esModule = true;

var EnumDBRPresetTemplate;
(function (EnumDBRPresetTemplate) {
    EnumDBRPresetTemplate["DEFAULT"] = 0;
    EnumDBRPresetTemplate["VIDEO_SINGLE_BARCODE"] = 1;
    EnumDBRPresetTemplate["VIDEO_SPEED_FIRST"] = 2;
    EnumDBRPresetTemplate["VIDEO_READ_RATE_FIRST"] = 3;
    EnumDBRPresetTemplate["IMAGE_SPEED_FIRST"] = 4;
    EnumDBRPresetTemplate["IMAGE_READ_RATE_FIRST"] = 5;
    EnumDBRPresetTemplate["IMAGE_DEFAULT"] = 6;
})(EnumDBRPresetTemplate = exports.EnumDBRPresetTemplate || (exports.EnumDBRPresetTemplate = {}));

var EnumBarcodeFormat;
(function (EnumBarcodeFormat) {
    EnumBarcodeFormat["BF_ALL"] = 0xFE3FFFFF;
    EnumBarcodeFormat["BF_ONED"] = 0x3007FF;
    EnumBarcodeFormat["BF_GS1_DATABAR"] = 0x3F800;
    EnumBarcodeFormat["BF_CODE_39"] = 0x1;
    EnumBarcodeFormat["BF_CODE_128"] = 0x2;
    EnumBarcodeFormat["BF_CODE_93"] = 0x4;
    EnumBarcodeFormat["BF_CODABAR"] = 0x8;
    EnumBarcodeFormat["BF_CODE_11"] = 0x200000;
    EnumBarcodeFormat["BF_ITF"] = 0x10;
    EnumBarcodeFormat["BF_EAN_13"] = 0x20;
    EnumBarcodeFormat["BF_EAN_8"] = 0x40;
    EnumBarcodeFormat["BF_UPC_A"] = 0x80;
    EnumBarcodeFormat["BF_UPC_E"] = 0x100;
    EnumBarcodeFormat["BF_INDUSTRIAL_25"] = 0x200;
    EnumBarcodeFormat["BF_CODE_39_EXTENDED"] = 0x400;
    EnumBarcodeFormat["BF_GS1_DATABAR_OMNIDIRECTIONAL"] = 0x800;
    EnumBarcodeFormat["BF_GS1_DATABAR_TRUNCATED"] = 0x1000;
    EnumBarcodeFormat["BF_GS1_DATABAR_STACKED"] = 0x2000;
    EnumBarcodeFormat["BF_GS1_DATABAR_STACKED_OMNIDIRECTIONAL"] = 0x4000;
    EnumBarcodeFormat["BF_GS1_DATABAR_EXPANDED"] = 0x8000;
    EnumBarcodeFormat["BF_GS1_DATABAR_EXPANDED_STACKED"] = 0x10000;
    EnumBarcodeFormat["BF_GS1_DATABAR_LIMITED"] = 0x20000;
    EnumBarcodeFormat["BF_PATCHCODE"] = 0x40000;
    EnumBarcodeFormat["BF_PDF417"] = 0x2000000;
    EnumBarcodeFormat["BF_QR_CODE"] = 0x4000000;
    EnumBarcodeFormat["BF_DATAMATRIX"] = 0x8000000;
    EnumBarcodeFormat["BF_AZTEC"] = 0x10000000;
    EnumBarcodeFormat["BF_MAXICODE"] = 0x20000000;
    EnumBarcodeFormat["BF_MICRO_QR"] = 0x40000000;
    EnumBarcodeFormat["BF_MICRO_PDF417"] = 0x80000;
    EnumBarcodeFormat["BF_GS1_COMPOSITE"] = 0x80000000;
    EnumBarcodeFormat["BF_MSI_CODE"] = 0x100000;
    EnumBarcodeFormat["BF_NULL"] = 0x00;
})(EnumBarcodeFormat = exports.EnumBarcodeFormat || (exports.EnumBarcodeFormat = {}));

var EnumBarcodeFormat_2;
(function (EnumBarcodeFormat_2) {
    EnumBarcodeFormat_2["BF2_AUSTRALIANPOST"] = 0x00800000;
    EnumBarcodeFormat_2["BF2_DOTCODE"] = 0x02;
    EnumBarcodeFormat_2["BF2_NONSTANDARD_BARCODE"] = 0x01;
    EnumBarcodeFormat_2["BF2_NULL"] = 0x00;
    EnumBarcodeFormat_2["BF2_PHARMACODE"] = 0x0c;
    EnumBarcodeFormat_2["BF2_PHARMACODE_ONE_TRACK"] = 0x04;
    EnumBarcodeFormat_2["BF2_PHARMACODE_TWO_TRACK"] = 0x08;
    EnumBarcodeFormat_2["BF2_PLANET"] = 0x00400000;
    EnumBarcodeFormat_2["BF2_POSTALCODE"] = 0x01F00000;
    EnumBarcodeFormat_2["BF2_POSTNET"] = 0x00200000;
    EnumBarcodeFormat_2["BF2_RM4SCC"] = 0x01000000;
    EnumBarcodeFormat_2["BF2_USPSINTELLIGENTMAIL"] = 0x00100000;
})(EnumBarcodeFormat_2 = exports.EnumBarcodeFormat_2 || (exports.EnumBarcodeFormat_2 = {}));