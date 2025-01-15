import {EnumValidationStatus, ParsedResultItem} from 'dynamsoft-capture-vision-react-native';

export interface MRZResult {
  documentType?: string;
  name?: string;
  sex?: string;
  age?: number;
  documentNumber?: string;
  issuingState?: string;
  nationality?: string;
  dateOfBirth?: string;
  dateOfExpiry?: string;
  personalNumber?: string;
}

export function parsedItemToMRZResult(parsedItem: ParsedResultItem): MRZResult | undefined {
  let mrzResult: MRZResult = {};
  const codeType = parsedItem.codeType;
  if (codeType === 'MRTD_TD1_ID' || codeType === 'MRTD_TD2_ID' || codeType === 'MRTD_TD2_FRENCH_ID') {
    mrzResult.documentType = 'ID';
  } else if (codeType === 'MRTD_TD3_PASSPORT') {
    mrzResult.documentType = 'PASSPORT';
  } else {
    return undefined;
  }

  if (!parsedItem.parsedFields) {
    return undefined;
  }

  mrzResult.documentNumber = parsedItem.parsedFields.passportNumber?.value ||
    parsedItem.parsedFields.documentNumber?.value ||
    parsedItem.parsedFields.longDocumentNumber?.value;
  if (!mrzResult.documentNumber) {
    return undefined;
  }

  const firstName = parsedItem.parsedFields.secondaryIdentifier?.value || '';
  const lastName = parsedItem.parsedFields.primaryIdentifier?.value || '';
  mrzResult.name = `${firstName} ${lastName}`;
  if (mrzResult.name.trim().length === 0) {
    return undefined;
  }

  mrzResult.sex = parsedItem.parsedFields.sex?.value;
  if (!mrzResult.sex) {
    return undefined;
  }

  if (!parsedItem.parsedFields.dateOfBirth?.value || !parsedItem.parsedFields.dateOfExpiry?.value) {
    return undefined;
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  let birthYear = parseInt(parsedItem.parsedFields.birthYear!!.value!!, 10);
  if (birthYear < 100) {
    birthYear = 2000 + birthYear;
    if (birthYear > currentYear) {
      birthYear = birthYear - 100;
    }
  }
  const birthMonthField = parsedItem.parsedFields.birthMonth;
  let birthMonth = NaN;
  let birthMonthStr = 'XX';
  if (birthMonthField && birthMonthField.value && birthMonthField.validationStatus === EnumValidationStatus.VS_SUCCEEDED) {
    birthMonth = parseInt(birthMonthField.value, 10);
    if(Number.isInteger(birthMonth)) {
      birthMonthStr = `${birthMonth && birthMonth < 10 ? '0' : ''}${birthMonth}`;
    }
  }
  const birthDayField = parsedItem.parsedFields.birthDay;
  let birthDay = NaN;
  let birthDayStr = 'XX';
  if (birthDayField && birthDayField.value && birthDayField.validationStatus === EnumValidationStatus.VS_SUCCEEDED) {
    birthDay = parseInt(birthDayField.value, 10);
    if(Number.isInteger(birthDay)) {
      birthDayStr = `${birthDay && birthDay < 10 ? '0' : ''}${birthDay}`;
    }
  }

  mrzResult.dateOfBirth = `${birthYear}-${birthMonthStr}-${birthDayStr}`;

  //Calculate age
  birthMonth = birthMonth || 0;
  birthDay = birthDay || 0;
  mrzResult.age = (currentYear * 10000 + currentMonth * 100 + currentDay - birthYear * 10000 - birthMonth * 100 - birthDay) / 10000;
  mrzResult.age = Math.floor(mrzResult.age);

  let expiryYear = parseInt(parsedItem.parsedFields.expiryYear!!.value!!, 10);
  if (expiryYear < 100) {
    expiryYear = 2000 + expiryYear;
  }
  mrzResult.dateOfExpiry = `${expiryYear}-${parsedItem.parsedFields.expiryMonth!!.value!!}-${parsedItem.parsedFields.expiryDay!!.value!!}`;

  mrzResult.issuingState = parsedItem.parsedFields.issuingState?.value;
  mrzResult.nationality = parsedItem.parsedFields.nationality?.value;
  mrzResult.personalNumber = parsedItem.parsedFields.personalNumber?.value;

  return mrzResult;
}
