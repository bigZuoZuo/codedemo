export type GithubIssueItem = {
  relMajorList?: any[];
  majorUuids?: string;
  id?: string | undefined;
  version?: string;
  name?: string;
  type?: string;
  remark?: string;
  majorName?: string;
  createTime?: string;
  category?: string
};

export type TableListData = {
  code?: number;
  msg?: string;
  data?: {
    total?: number;
    list?: GithubIssueItem[];
  };
};

export type SpecialtyTree = {
  majorLists?: { id?: string; name?: string }[];
  id?: string;
  name?: string;
  categoryId?: string;
};
