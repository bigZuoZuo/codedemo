// @ts-ignore
/* eslint-disable */

export type DictDataList = {
  id: string;
  version: number;
};

export type DictDataListItem = {
  object: number;
  critical: number;
  dine: number;
  stable: number;
  fluctuations: number;
  highWrong: number;
  stubbornWrong: number;
  lawGrade: number;
  passStart: number;
  goodStart: number;
  excellent: number;
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
