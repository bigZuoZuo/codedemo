export type GithubIssueItem = {
  tempType?: number;
  id?: string;
  tempName?: string;
  testTotalTime?: number;
  paperType?: string;
  totalScore?: number;
  createTime?: string;
};
export type TableListData = {
  code?: number;
  msg?: string;
  data?: {
    total?: number;
    list?: GithubIssueItem[];
  };
};

export type CategorSelectyMajor = {
  id: string;
  name: string;
  majorLists?: { id: string; name: string }[];
};
export type TreeData = {
  title: string;
  key: string;
  id: string;
  name?: string;
  majorLists?: { id: string; name: string }[];
  children?: TreeData[];
};