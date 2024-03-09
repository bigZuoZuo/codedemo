// @ts-ignore
/* eslint-disable */

export type GithubIssueItem = {
  id?: string;
  jobList?: any[];
  jobListVo?: { teacherClassList?: { className: string }[]; jobId: string; jobName: string }[];
  name?: string;
  schoolName?: string;
  account?: string;
  order?: string | number;
  createName?: string;
  createTime?: string;
  schoolId?: string;
  classId?: string;
  majorId?: string;
  gradeId?: string;
  jobName?: string;
  pageNum?: number;
  pageSize?: number;
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

export type CategorSelectyMajor = {
  categoryId: string;
  name: string;
  id: string;
};

export type SubjectLists = {
  id: Key | null | undefined;
  name: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
};

export type DataSourceType = {
  id: any;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
  classLists?: any;
  jobId?: string;
  subjectLists?: SubjectLists[];
};

export type SchoolTeacher = {
  id?: string;
  version?: string;
};

export type DataList = {
  code: number;
  data: {
    list: { name: string; id: string; }[];
  };
};
