export type GithubIssueItem = {
  id?: string;
  operName?: string;
  title?: string;
  operLocation?: string;
  operTime?: string;
};
export type OperlogList = {
  data: {
    list: GithubIssueItem[];
    total: number;
  };
  code: number;
  msg: string;
};
