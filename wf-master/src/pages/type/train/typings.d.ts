// @ts-ignore
/* eslint-disable */

declare namespace API {
  type DictDataList = {
    pageNum: number;
    pageSize: number;
    dictLabel?: string;
  };

  type DictDataListItem = {
    dictCode?: number;
    cssClass?: string;
    id?: string;
    dictLabel?: string;
    remark?: number;
    createTime?: string;
    dictSort?: number;
  };
  type DictDataLists = {
    total: number;
    list: DictDataListItem[];
  };
  type DictData = {
    data: DictDataLists;
    code: number;
    msg: string;
  };
  type NameIdType = {
    code: number;
    data?: { name: string; id: string }[];
  };
}
