export type GithubIssueItem = {
  majorName?: string;
  id?: string;
  name?: string;
  subjectName?: string;
  createName?: string;
  createTime?: string;
  answerMode?: number;
  multipleModel?: number;
  multipleScore?: number;
  version?:any;
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
  id?: any;
}

type GithubIssueItem1 = {
  id?: string | number;
  name?: string;
  alias?: string;
};