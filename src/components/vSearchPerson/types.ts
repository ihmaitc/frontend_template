export interface ISetPassportData {
  documentTypeId: number | null | undefined;
  seria: string | null | undefined;
  number: string | null | undefined;
  dateOfBirth: string | null | undefined;
  pinfl: string | null;
}
export interface IPassportIncludes {
  includePhoto?: boolean;
  includePension?: boolean;
  includeDisabilityGroup?: boolean;
  includeAddress?: boolean;
  includePositionInfo?: boolean;
}

export interface INotHasDoc {
  firstName: string | null;
  genderId: number | null;
  documentTypeId: number | null;
  genderName: string | null;
  lastName: string | null;
  middleName: string | null;
  birthOn?: string;
}
