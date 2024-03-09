export type GithubIssueItem = {
  dictLabel?: string;
  name?: string;
  id?: string;
  code?: string;
  remark?: string;
  order?: number;
  createTime?: string;
  dictLabel?: string;
  parentId?: string;
  dictName?: string;
};

export type FormData = {
  id?: string;
  version?: number;
  dictType?: string;
  status?: string;
};

export type DictDataLists = {
  total: number;
  list: GithubIssueItem[];
};
export type DictData = {
  data: DictDataLists;
  code: number;
  msg: string;
};
