export interface ISelectList {
  orderCode?: string;
  text: string;
  value: any;
}

export interface IFilter {
  search: string;
  sortBy?: string;
  orderType: "asc" | "desc";
  page: number;
  pageSize: number;
  totalRows?: number;
}

export interface IFields {
  key: string;
  label: string;
  sort?: boolean;
  isAmount?: boolean;
  tableList?: any[];
  type?: "input" | "selector" | "checkbox";
  itemNameValue?: string | "value";
  itemName?: string | "text";

  tdRowSpan?: number | string;
  tdColSpan?: number | string;
  thRowSpan?: number | string;
  thColSpan?: number | string;

  thClass?: number | string;
  tdClass?: number | string;

  children?: IFields[];
  isRow?: boolean;
  visible?: boolean;
  removeChildParent?: boolean;
}

export interface IBreadCrumbs {
  text: string;
  disabled?: boolean;
  href: string;
}

export interface IBasicRequest {
  page: number;
  pageSize: number;
  total: number;
}

export interface IPagination {
  title: string;
  totalRows: number;
  firstNumber: number;
  lastNumber: number;
}

export interface ILanguageList {
  code: string;
  shortName: string;
  fullName: string;
  value: number;
  text: string;
  orderCode: string | null | number;
}

export interface ITableActions {
  isView?: boolean;
  isEdit?: boolean;
  isClone?: boolean;
  isDelete?: boolean;
  isHistory?: boolean;
  canAccept?: boolean;
  canCancel?: boolean;
  canDelete?: boolean;
  canApprove?: boolean;
  canSent?: boolean;
  canReject?: boolean;
  canRevoke?: boolean;
}

export interface IPerson {
  id: number;
  photo?: string | null;
  state?: string | null;
  genderName?: string | null;
  nationalityName?: string | null;
  citizenshipName?: string | null;
  documentType?: string | null;
  birthDateAsString?: string | null;
  disabilityGroup?: number | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  shortName?: string | null;
  fullName?: string | null;
  nationalityId?: number | null;
  citizenshipId?: number | null;
  documentTypeId: number;
  pinfl?: string | null;
  docSeria?: string | null;
  docNumber?: string | null;
  birthOn?: string | null;
  docIssueOn?: string | null;
  docExpireOn?: string;
  docIssueOrganization?: string | null;
  genderId?: number | null;
  stateId?: number | null;
  nameOrder?: number | null;
  isDeath?: boolean | null;
  deathOn?: string | null;
  livingAddress?: IPersonLivingAddress | null;
  positionInfo?: IPersonPositionInfo;
  pension?: IPersonPension;
  pnsTypeId: number | null;
  pnsType: string | null;
}

export interface IPersonPositionInfo {
  organization?: string | null;
  position?: string | null;
}

export interface IPersonPension {
  amount?: number | null;
  experience?: string | null;
  pensionTypeId?: number | null;
  pensionType?: string | null;
  ownerId?: number | null;
  createdAt?: string | null;
  modifiedAt?: string | null;
  rows?: IPersonRow[] | null;
}

export interface IPersonRow {
  period?: string | null;
  monthIn?: string | null;
  amount?: number | null;
}

export interface IPersonLivingAddress {
  regionId?: number | null;
  region?: string | null;
  districtId?: number | null;
  district?: string | null;
  mfyId?: number | null;
  mfy?: string | null;
  address?: string | null;
}

export interface IGetPassportData {
  districtId: number | null;
  email: string | null;
  id: number | null;
  languageId: number | null;
  organizationId: number | null;
  password: string | null;
  personId: number | null;
  phoneNumber: null;
  regionId: null;
  roles: number[];
  stateId: number | null;
  userName: string | null;
  person: IPerson | null;
}

export interface IGetAuthInfo {
  fullName: string | null;
  organizationName: string | null;
  permissions: string[];
  shortName: string | null;
  userName: string | null;
}

export interface ITranslates {
  language?: string;
  columnName: string;
  languageId: number;
  translateText: string;
}

export interface ILogList {
  id: 0;
  dateAt: string;
  userInfo: string;
  tableId: number | null;
  userId: number | null;
  statusId: number | null;
  table: string;
  status: string;
  ipAddress: string;
  userAgent: string;
  message: string;
}

export interface IModalProps {
  title: string;
  id: number | null;
  cb: string;
}

export interface DefaultGetData extends ITableActions {
  id: number;
}

export interface IFileConfigBody {
  tableId: number;
  docOn: string;
  code?: string;
}

export interface IFileConfig {
  id: number | null;
  columnName: string;
  shortName: string;
  fullName: string;
  maxSize: number;
  isRequired: boolean;
  isMultiple: boolean;
  tables: IFileConfigTables[];
}

export interface IFileConfigTables {
  id: number | null;
  fileTypeId: number;
  fileType: string;
  extension: string;
}
