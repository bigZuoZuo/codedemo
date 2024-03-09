export type GithubIssueItem = {
  majorId?: string;
  id?: string;
  name?: string;
  date?: string;
  status?: string;
};
export type GithubIssueItem1 = {
  imgUrl: { url?: string }[];
  id?: string;
  parentId?: string;
  subjectId?: string;
  name?: string;
  alias?: string;
  remark?: string;
  multipartFile?: any;
  multipartFile1?: any;
  multipartFiles?: any;
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

export type Major = {
  name: string;
  id: string;
  categoryId: string;
};
