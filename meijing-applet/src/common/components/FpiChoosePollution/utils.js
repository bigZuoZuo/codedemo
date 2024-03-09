import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'

/**
 * 将数组变换为指定格式输出
 * @param {*} dataList 数组
 */
 export function transformTreeDatas(dataList = [],type=2) {
    dataList.forEach(department => {
        if(department.code && !isEmpty(department.code)){
            department.checked = false;
        }
        if(department.sourceList && !isEmpty(department.sourceList)) {
            department.sourceList.map(item=>{
                if(item.code && !isEmpty(item.code)){
                    return {
                        id : item.id,
                        name : item.name,
                        checked : false,
                        code : item.code,
                    }
                }
            })
        }
        if (department.industrySourceList && !isEmpty(department.industrySourceList)) {
            transformTreeDatas(department.industrySourceList)
        }
    })
    // console.log('dataList',dataList);
}

/**
 * 通过id获取node节点
 * @param {*} id
 * @param {*} node
 */
 export function getPollutionNodeById(id,node) {
    let result = null;
    if (node.id === id) {  // 取出data的数据
        result = node;
    }
    else {
        if (!isEmpty(node.sourceList)) {
            for (let child in node.sourceList) {
                let newResult = getPollutionNodeById(id, node.sourceList[child]);
                if (newResult) {
                    result = newResult;
                    break;
                }
            }
        }
        for (let child in node.departmentList) {
            let newResult = getPollutionNodeById(id, node.departmentList[child]);
            if (newResult) {
                result = newResult;
                break;
            }
        }
    }
    return result;
}

/**
 * 通过类型获取node节点
 * @param {*} type
 * @param {*} node
 * @param {*} list
 */
 export function getPollutionNodeByType(node, list) {
    if (node.checked) {
        list.push(node);
    }
    else {
        if (!isEmpty(node.sourceList)) {
            for (let child in node.sourceList) {
                list.concat(getPollutionNodeByType( node.sourceList[child], list));
            }
        }
        for (let child in node.departmentList) {
            list.concat(getPollutionNodeByType( node.departmentList[child], list));
        }
    }
}