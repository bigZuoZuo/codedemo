export type GithubIssueItem = {
  id: string;
  status?: any;
  title: any;
  menuName?: string;
  children?: GithubIssueItem[];
  menuCode?: string;
  path?: string;
  menuType?: string;
  treeSort?: number;
  parentId?: string;
  version?: any;
};

export type FormData = {
  id?: string | undefined;
  parentId?: string;
  version?: string;
};
export type MenuList = {
  code: number;
  data: GithubIssueItem[];
  msg?: string | undefined;
};

export type CheckMenuCodeUnique = {
  code: number;
  data: {
    code: string;
  };
  msg?: string | undefined;
};
