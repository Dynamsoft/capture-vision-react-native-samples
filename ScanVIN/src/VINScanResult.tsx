import {ParsedResultItem} from 'dynamsoft-capture-vision-react-native';

export interface VINScanResult {
  resultStatus: EnumResultStatus;
  errorCode?: number;
  errorString?: string;
  data?: VINData;
}

export interface VINData {
  vinString?: string;
  WMI?: string;
  region?: string;
  VDS?: string;
  checkDigit?: string;
  modelYear?: string;
  plantCode?: string;
  serialNumber?: string;
}

export enum EnumResultStatus {
  RS_FINISHED,
  RS_CANCELED,
  RS_ERROR,
}

export function parsedItemToVINData({parsedFields}: ParsedResultItem): VINData | undefined {
  if(!parsedFields) {
    return undefined;
  }
  return {
    vinString: parsedFields.vinString?.value,
    WMI: parsedFields.WMI?.value,
    region: parsedFields.region?.value,
    VDS: parsedFields.VDS?.value,
    checkDigit: parsedFields.checkDigit?.value,
    modelYear: parsedFields.modelYear?.value,
    plantCode: parsedFields.plantCode?.value,
    serialNumber: parsedFields.serialNumber?.value,
  };
}
