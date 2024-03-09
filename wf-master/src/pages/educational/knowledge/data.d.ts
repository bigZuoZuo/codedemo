export type GithubIssueItem = {
  majorId?: string;
  id?: string;
  name?: string;
  alias?: string;
  remark?: string;
  updateTime?: string;
  version?:number;
};
export type GithubIssueItem1 = {
  majorId: string[];
  id?: string;
  parentId?: string;
  subjectId?: string;
  name?: string;
  alias?: string;
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
