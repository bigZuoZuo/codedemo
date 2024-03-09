import Taro from '@tarojs/taro'

// 根区域Id：默认
export const rootDivisionCode: string = '000000000000000'


export interface Department {
    id?: number;
    code?: string;
    name: string;
    divisionCode?: string;
    divisionName?: string;
    parentCode?: string;
}

/**
 * 获取行政区部门
 * @param divisionCode 行政区编码
 */
export async function listDepartmentByDivision(divisionCode: string) {
    return Taro.request({
        url: `/meijing-division-server/api/v1/divisions/open/departments/list-by-division/${divisionCode}`,
    });
}

/**
 * 获取行政区部门-多级
 * @param divisionCode 行政区编码 tenantCode
 */
export async function hierarchyList(tenantCode:string,hasRelatedArea?: boolean) {
    let url = `/simple-user-server/api/v3/departments/department-tree-by-tenant?tenantCode=${tenantCode}`;
    if(hasRelatedArea === true || hasRelatedArea === false){
      url = `/simple-user-server/api/v3/departments/department-tree-by-tenant?tenantCode=${tenantCode}&hasRelatedArea=${hasRelatedArea}`;
    }
    return Taro.request({
      url
    });
}

/**
 * 新增一个部门
 * @param department 部门详细信息
 */
export async function add(department: Department) {
    return Taro.request({
        url: `/meijing-division-server/api/v1/departments/add-by-division`,
        data: department,
        method: 'POST',
    });
}


/**
 * 删除一个部门
 * @param department 部门详细信息
 */
export async function deleteByDivision(id: string) {
    return Taro.request({
        url: `/meijing-division-server/api/v1/departments/delete-by-division/${id}`,
        method: 'DELETE',
    });
}

/**
 * 修改部门
 * @param id 部门id
 * @param name 部门名称
 */
export async function update(id: number | string, name: string) {
    return Taro.request({
        url: `/meijing-division-server/api/v1/departments/update-by-division/${id}`,
        data: { name: name },
        method: 'POST',
    });
}
/**
 * 修改部门
 * @param id 部门id
 * @param data 部门数据
 */
export async function newUpdate(id: number | string, data: any) {
  return Taro.request({
    url: `/simple-user-server/api/v3/departments/update/${id}`,
    data,
    method: 'POST',
  });
}

/**
 * 切换行政区
 * @param id 部门id
 * @param name 部门名称
 */
export async function switchDivision(params: any) {
    return Taro.request({
        url: `/meijing-division-server/api/v1/users/switch-division`,
        data: params,
        method: 'POST'
    });
}

/**
 * 获取工地扬尘权限
 */
export async function getTypeDetail() {
    return Taro.request({
        url: `/meijing-control-server/api/v1/division-config/type-detail?type=CONSTRUCTION_SITE_SPECIAL_PATROL`,
        method: 'GET'
    });
}

/**
 *
 * @param id 要查询的节点id
 * @param node 从该节点开始
 */
export function getNodeById(id, node) {
    let result = null;
    if (node.id === id || node.code === id) {
        result = node;
    }
    else {
        for (let child of node.children) {
            let newResult = getNodeById(id, child);
            if (newResult) {
                result = newResult;
                break;
            }
        }
    }
    return result;
}



/**
 * 查询部门和联系人
 */
export async function getDepartmentDetail(id:string|number) {
  return Taro.request({
    url: `/simple-user-server/api/v3/departments/detail/${id}`,
    method: 'GET'
  });
}


/**
 * 根据部门编码查询所属部门和人员
 * @param departmentCode 行政区编码
 * @returns DepartmentUser[]
 */
export async function getDepartmenAndUser(departmentCode: string|number,hasRelatedArea?:boolean) {
  let url = `/simple-user-server/api/v3/tenant-user/child-department-users?departmentCode=${departmentCode}`;
  if(hasRelatedArea!==undefined){
    url = `/simple-user-server/api/v3/tenant-user/child-department-users?departmentCode=${departmentCode}&hasRelatedArea=${hasRelatedArea}`;
  }
  return Taro.request({
    url
  });
}

/**
 * 获取行政区监管部门
 */
export async function departmentList() {
    return Taro.request({
        url: `/meijing-inspect-server/api/v1/construction-sites/department-list`,
    });
}