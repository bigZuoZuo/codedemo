// @ts-ignore
/* eslint-disable */

declare namespace API {
  type GetDataList = {
    pageNum: number;
    pageSize: number;
    name?: string;
    status?: string;
    phonenumber?: string;
  };

  type GithubIssueItem = {
    id: string;
    roleId?: string;
    index?: number;
    name?: string;
    roleName?: string;
    phonenumber?: string;
    userName?: string;
    loginDate?: string;
    status?: string;
    createTime?: string;
    sex?: string;
    password?: string;
    roleIds?: string[];
    deptId?: string;
    email?: string;
    remark?: string;
    version?: any
  };
  type DataLists = {
    total: number;
    list: GithubIssueItem[];
  };
  type RuleList = {
    data: DataLists;
    code: number;
    msg: string;
  };

  type RoleList = {
    data: {
      list: {
        roleName?: string;
        id: string;
      }[];
      total: number;
    };
    code: number;
    msg: string;
  };

  type SchoolDetailsList = {
    data: {
      list: {
        id: string;
        schoolName?: string
      }[];
      total: number;
    };
    code: number;
    msg: string;
  };

  type GeneralInterface = {
    code?: number;
    msg?: string;
  };

  type ProFormSelectType = {
    label: string;
    value: string
  }
}
