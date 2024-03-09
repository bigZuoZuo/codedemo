// @ts-ignore
/* eslint-disable */

export type GithubIssueItem = {
  id?: string;
  categoryId?: string;
  majorId?: string;
  gradeId?: string;
  schoolId?: string;
  number?: string;
  name?: string;
  order?: number;
  version?: number;
  pageNum?: number;
  pageSize?: number;
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
