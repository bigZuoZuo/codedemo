import Taro, { useState, useEffect, FC } from '@tarojs/taro';
import { rootConstructionSourceBaseUrl } from '@common/utils/requests'
import { View, Text, Image, Picker, Input } from '@tarojs/components'
import { get } from 'lodash'
import cn from 'classnames'
import './index.scss'


const arrow = `${rootConstructionSourceBaseUrl}/assets/pages/work/arrow_right.png`


export const formatStandardEmun = (values: string) => {
    try {
        const jsonObj = JSON.parse(values)
        return Object.entries(jsonObj).map(([value, label]) => { return { label: label, value: value } })
    }
    catch (err) {
        return []
    }
}

export const getEmunLabel = (arr, key) => {
    const findItem = arr.find(item => item.value === key)
    return get(findItem, 'label', '')
}

interface FpiSourceItemProps {
    config: any,
    data: any,
    smallStyle: boolean,
    onChange: (newData) => void,
}

const FpiSourceItem: FC<FpiSourceItemProps> = (props: FpiSourceItemProps) => {
    const { config: { sourceItemName = '', dataSourceType = 'TEXT', sourceItemDataSource } = {}, data = {}, onChange, smallStyle = false } = props
    const [interfaceList, setInterfaceList] = useState([])

    useEffect(() => {
        const fetchApi = async () => {
            if (dataSourceType == 'INTERFACE') {
                try {
                    const jsonObj = JSON.parse(sourceItemDataSource)
                    const res = await Taro.request({ url: jsonObj.api })
                    setInterfaceList(get(res, 'data', []).map(item => {
                        return { label: item[jsonObj.value], value: item[jsonObj.key] }
                    }))
                }
                catch (err) { }
            }
        }
        fetchApi()
    }, [])

    const onPickerChange = (res) => {
        const ranges = formatStandardEmun(sourceItemDataSource)
        const index = res.detail.value
        const newData = {
            ...data,
            value: ranges[index].value,
            valueName: ranges[index].label
        }
        onChange && onChange(newData)
    }

    const onIPickerChange = (res) => {
        const ranges = interfaceList
        const index = res.detail.value
        const newData = {
            ...data,
            value: get(ranges, `[${index}].value`, ''),
            valueName: get(ranges, `[${index}].label`, '')
        }
        onChange && onChange(newData)
    }

    const onInputChange = (res) => {
        const newData = {
            ...data,
            value: res.detail.value,
            valueName: res.detail.value
        }
        onChange && onChange(newData)
    }

    return (
        <View className={cn('source-row', { 'source-row__small': smallStyle })}>
            <Text className='row-left'>{sourceItemName}</Text>
            {dataSourceType == 'TEXT' && (
                <View className='row-right'>
                    <Input className='right-text' type='text' maxLength={32} value={data.value} placeholderClass='right-text' placeholder={`请输入${sourceItemName}`} onInput={onInputChange}></Input>
                    <Image src={arrow} className='right-arrow'></Image>
                </View>
            )}

            {dataSourceType == 'ENUM' && (
                <Picker onChange={onPickerChange} mode='selector' value={0} range={formatStandardEmun(sourceItemDataSource)} range-key='label'>
                    <View className='row-right'>
                        <Text className='right-text'>{data.value ? getEmunLabel(formatStandardEmun(sourceItemDataSource), data.value) : `请选择${sourceItemName}`}</Text>
                        <Image src={arrow} className='right-arrow'></Image>
                    </View>
                </Picker>
            )}

            {dataSourceType == 'NUMBER' && (
                <View className='row-right'>
                    <Input className='right-text' type='number' value={data.value} placeholderClass='right-text' placeholder='请输入' onInput={onInputChange}></Input>
                    <Image src={arrow} className='right-arrow'></Image>
                </View>
            )}

            {dataSourceType == 'INTERFACE' && (
                <Picker onChange={onIPickerChange} mode='selector' value={0} range={interfaceList} range-key='label'>
                    <View className='row-right'>
                        <Text className='right-text'>{data.value ? getEmunLabel(interfaceList, data.value) : `请选择${sourceItemName}`}</Text>
                        <Image src={arrow} className='right-arrow'></Image>
                    </View>
                </Picker>
            )}
        </View>
    )
}

export default FpiSourceItem