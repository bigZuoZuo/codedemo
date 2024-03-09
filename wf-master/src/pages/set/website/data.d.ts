// @ts-ignore
/* eslint-disable */

export type DictDataList = {
  id: string;
  version: number;
  userImage?: string;
};

export type DictDataListItem = {
  userImage?: { url: string }[];
  name?: string;
  site?: string;
  phone?: string;
  mail?: string;
  license?: string;
  userAgreement?: string;
};
export type DictDataLists = {
  total: number;
  list: DictDataList[];
};
export type DictData = {
  data: DictDataLists;
  code: number;
  msg: string;
};
