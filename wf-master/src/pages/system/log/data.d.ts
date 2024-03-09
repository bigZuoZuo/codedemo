export type GithubIssueItem = {
  id?: string | undefined;
  userName?: string;
  msg?: string;
  loginLocation?: string;
  loginTime?: string;
};
export type OperlogList = {
  data: {
    list: GithubIssueItem[];
    total: number;
  };
  code: number;
  msg: string;
};
