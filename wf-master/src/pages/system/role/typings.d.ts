// @ts-ignore
/* eslint-disable */

declare namespace API {
  type GithubIssueItems = {
    id: string;
    roleKey?: string;
    userNum?: number;
    remark?: string;
    createTime?: string;
    menuIds?: string[];
    roleName?: string;
  };
  type DataLists = {
    total: number;
    list: GithubIssueItem[];
  };
  type RuleLists = {
    data: DataLists;
    code: number;
    msg: string;
  };
  type TrrTypes = {
    id: string;
    children?: any[];
  };
}
