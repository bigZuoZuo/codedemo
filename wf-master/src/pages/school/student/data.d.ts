export type GithubIssueItem = {
  id?: string;
  name?: string;
  phone?: string;
  className?: string;
  gradeName?: string;
  enterTime?: string;
  admissionNumber?: string;
  studentNumber?: string;
  type?: string;
  graduationType?: string;
  createName?: string;
  createTime?: string;
  schoolId?: string;
  gradeId?: string;
  majorId?: string;
  classId?: string;
  version?: number;
  picker?: string;
};

export type TableListData = {
  code?: number;
  msg?: string;
  data?: {
    total?: number;
    list?: GithubIssueItem[];
  };
};
