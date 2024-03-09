import printJS from 'print-js';


export function usePrint(columns, dataSource,documentTitle) {

    const properties = columns.map(column => column.dataIndex).filter(item => item && item !== 'action');
    const header = columns.filter(item => properties.includes(item.dataIndex)).map(column => column.title)

    const fields = {

    }
    properties.map((dataIndex, i) => {
        header.map((title, j) => {
            if (i === j) {
                fields[dataIndex as string] = title
            }

        })
    })

    dataSource.map(item => {

        for (const key in fields) {
            item[fields[key]] = item[key]
        }
    })

    printJS({
        printable: dataSource,
        properties: header,
        type: 'json',
        documentTitle
    });

}
