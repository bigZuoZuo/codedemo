export type GithubIssueItem = {
  teachRelList?: any[];
  id?: string;
  name?: string;
  createTime?: string;
  sort?: number;
  version?: number;
  subjectId?: string;
  remark?: string;
};
export type TableListData = {
  code?: number;
  msg?: string;
  data?: {
    total?: number;
    list?: GithubIssueItem[];
  };
};

export type DataNode = {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
  id?: string;
  name?: string;
};

export type GithubIssueItem1 = {
  id?: string;
  name?: string;
  alias?: string;
  sort?: number;
  version?: number;
  updateTime?: string;
  remark?: string;
  parentId?: string;
};
