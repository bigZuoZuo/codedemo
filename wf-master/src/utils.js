import { BankOutlined, BookOutlined, DatabaseOutlined, SettingOutlined, HolderOutlined } from '@ant-design/icons';
//javascript  树形结构
export function makeTree(data) {
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
        delete item.children;
    });

    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function (item) {
        // 在该方法中可以给每个元素增加其他属性
        item.title = item.name;
        item.key = item.id;
        item.isEdit = false;
        item.checked = false;
        map[item.id] = item;
    });
    //  console.log(map);

    var val = [];
    data.forEach(function (item) {

        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.pId];

        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
            //  添加到父节点的子节点属性中
            (parent.children || (parent.children = [])).push(item);

        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
        }
    });
    return val;
}

export function menuDataHandle(data) {
    data.map(item => {
        if (item.children) {
            menuDataHandle(item.children);
        }
        item.name = item.meta.title;
        if (item.meta.icon) {
            switch (item.meta.icon) {
                case 'SettingOutlined':
                    item.icon = <SettingOutlined />
                    break;
                case 'BankOutlined':
                    item.icon = <BankOutlined />
                    break;
                case 'BookOutlined':
                    item.icon = <BookOutlined />
                    break;
                case 'DatabaseOutlined':
                    item.icon = <DatabaseOutlined />
                    break;
                case 'HolderOutlined':
                    item.icon = <HolderOutlined />
                    break;
                default:
                    break;
            }
        }
    })
    return data;
}