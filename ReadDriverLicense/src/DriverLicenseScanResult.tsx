import {ParsedResultItem} from 'dynamsoft-capture-vision-react-native';

export enum EnumResultStatus {
  RS_FINISHED,
  RS_CANCELED,
  RS_ERROR,
}

export interface DriverLicenseScanResult {
  resultStatus: EnumResultStatus;
  errorCode?: number;
  errorString?: string;
  data?: DriverLicenseData;
}

export interface DriverLicenseData {
  documentType: string;
  name?: string;
  state?: string;//For AAMVA_DL_ID
  stateOrProvince?: string;//For AAMVA_DL_ID_WITH_MAG_STRIPE
  initials?: string;//For SOUTH_AFRICA_DL
  city?: string;//For AAMVA_DL_ID, AAMVA_DL_ID_WITH_MAG_STRIPE
  address?: string;//For AAMVA_DL_ID, AAMVA_DL_ID_WITH_MAG_STRIPE
  idNumber?: string;//For SOUTH_AFRICA_DL
  idNumberType?: string;//For SOUTH_AFRICA_DL
  licenseNumber?: string;
  licenseIssueNumber?: string;//For SOUTH_AFRICA_DL
  issuedDate?: string;
  expirationDate?: string;
  birthDate?: string;
  sex?: string;
  height?: string;//For AAMVA_DL_ID, SOUTH_AFRICA_DL
  issuedCountry?: string;//For AAMVA_DL_ID, SOUTH_AFRICA_DL
  vehicleClass?: string; //For AAMVA_DL_ID
  driverRestrictionCodes?: string; //For SOUTH_AFRICA_DL
}

export function parsedItemToDriverLicenseData({codeType, parsedFields}: ParsedResultItem): DriverLicenseData | undefined {
  if(!parsedFields) {
    return undefined;
  }
  let data:DriverLicenseData = {
    documentType: codeType,
  };
  if(codeType === 'AAMVA_DL_ID') {
    data.name = parsedFields.fullName?.value ||
      `${parsedFields.givenName?.value || parsedFields.firstName?.value || ''} ${parsedFields.lastName?.value || ''}`;
    data.city = parsedFields.city?.value;
    data.state = parsedFields.jurisdictionCode?.value;
    data.address = `${parsedFields.street_1?.value || ''} ${parsedFields.street_2?.value || ''}`;
    data.licenseNumber = parsedFields.licenseNumber?.value;
    data.issuedDate = parsedFields.issuedDate?.value;
    data.expirationDate = parsedFields.expirationDate?.value;
    data.birthDate = parsedFields.birthDate?.value;
    data.height = parsedFields.height?.value;
    data.sex = parsedFields.sex?.value;
    data.issuedCountry = parsedFields.issuedCountry?.value;
    data.vehicleClass = parsedFields.vehicleClass?.value;
  } else if(codeType === 'AAMVA_DL_ID_WITH_MAG_STRIPE') {
    data.name = parsedFields.name?.value;
    data.city = parsedFields.city?.value;
    data.stateOrProvince = parsedFields.stateOrProvince?.value;
    data.address = parsedFields.address?.value;
    data.licenseNumber = parsedFields.DLorID_Number?.value;
    data.expirationDate = parsedFields.expirationDate?.value;
    data.birthDate = parsedFields.birthDate?.value;
    data.height = parsedFields.height?.value;
    data.sex = parsedFields.sex?.value;
  } else if(codeType === 'SOUTH_AFRICA_DL') {
    data.name = parsedFields.surname?.value;
    data.idNumber = parsedFields.idNumber?.value;
    data.idNumberType = parsedFields.idNumberType?.value;
    data.licenseNumber = parsedFields.idNumber?.value || parsedFields.licenseNumber?.value;
    data.licenseIssueNumber = parsedFields.licenseIssueNumber?.value;
    data.initials = parsedFields.initials?.value;
    data.issuedDate = parsedFields.licenseValidityFrom?.value;
    data.expirationDate = parsedFields.licenseValidityTo?.value;
    data.birthDate = parsedFields.birthDate?.value;
    data.sex = parsedFields.gender?.value;
    data.issuedCountry = parsedFields.idIssuingCountry?.value;
    data.driverRestrictionCodes = parsedFields.driverRestrictionCodes?.value;
  }
  let hasName = data.name && data.name.trim().length > 0;
  let hasLicenseNumber = !!data.licenseNumber;
  if(!hasName || !hasLicenseNumber) {
    return undefined;
  }
  return data;
}
