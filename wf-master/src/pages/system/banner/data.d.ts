export type GithubIssueItem = {
  id?: string | undefined;
  url?: string;
  title?: string;
  state?: string;
  imgUrl?: string;
  name?: string;
  site?: string;
  order?: string | number;
  createName?: string;
  status?: string;
  createTime?: string;
};
export type OperlogList = {
  data: {
    list: GithubIssueItem[];
    total: number;
  };
  code: number;
  msg: string;
};
export type SchoolBanner = {
  id?: string | undefined;
  name?: string;
  imgUrl: { url: string }[];
  order?: string | number;
  url?: string;
  site?: string;
};
