// @ts-ignore
/* eslint-disable */

export type TableListItem = {
  order?: number;
  name?: string;
  createNameName?: string;
  createTime?: string;
  memo?: string;
  id?: string;
  version?: number;
};

export type DictDataLists = {
  total: number;
  list: TableListItem[];
};
export type DictData = {
  data: DictDataLists;
  code: number;
  msg: string;
};

export type FormDataTy = {
  version?: number;
  id?: string;
  name?: string;
  order?: number;
};
