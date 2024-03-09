// @ts-ignore
/* eslint-disable */

export type GithubIssueItem = {
  city?: string;
  district?: string;
  province?: string;
  contacts?: string;
  schoolName?: string;
  schoolCode?: string;
  fixedPhone?: string;
  telephone?: string;
  schoolSite?: string;
  totalTeacher?: number | string;
  totalStudent?: number | string;
  createName?: string;
  createTime?: string;
  id?: string;
};

export type DictDataLists = {
  total: number;
  list: GithubIssueItem[];
};
export type DictData = {
  data: DictDataLists;
  code: number;
  msg: string;
};

export type FormDataTy = {
  version?: number;
  id?: string;
  name?: string;
  order?: number;
};

export type DataSourceType = {
  id?: string | number;
  year?: string;
  examinationCount?: string | number;
  fraction?: string | number;
  machinery?: number | string;
  business?: number | string;
  computer?: number | string;
  tourist?: number | string;
  agronomy?: number | string;
  nursingProfession?: number | string;
  electrical?: number | string;
  constructionTechnology?: number | string;
  autoMaintenance?: number | string;
  preschoolEducation?: number | string;
  machinery?: number | string;
};

export type NameCode = {
  code?: string;
  name?: string;
};

