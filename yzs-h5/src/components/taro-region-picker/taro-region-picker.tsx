import {View, Picker, BaseEventOrig, PickerMultiSelectorProps} from '@tarojs/components'
import './taro-region-picker.scss'
import regionData from './region'
import {AtList, AtListItem} from 'taro-ui'
import {useEffect, useState} from 'react'

export default function TaroRegionPicker(props: {
  onChange?: (areaNames: [string, string, string]) => void
  value?: [string, string, string]
}) {
  function getProvinceNames() {
    return regionData.map((item) => item.name)
  }

  function getCityNames(province: typeof regionData[number]) {
    return province.city.map((item) => item.name)
  }

  function getDistrictNames(city: typeof regionData[number]['city'][number]) {
    return city.districtAndCounty.map((item) => item)
  }

  const [columnPosition, setColumnPosition] = useState([0, 0, 0])

  /**
   * 每一列所的数据
   */
  const [range, setRange] = useState(() => {
    const provinceNames = getProvinceNames()
    const cityNames = getCityNames(regionData[0])
    const districtNames = getDistrictNames(regionData[0].city[0])
    return [provinceNames, cityNames, districtNames]
  })

  useEffect(() => {
    if (!props.value || props.value.every((item) => typeof item === 'undefined')) {
      return
    }
    const provinceIndex = regionData.findIndex((item) => item.name === props.value?.[0])
    if (provinceIndex === -1) {
      return
    }

    const province = regionData[provinceIndex]
    let cityIndex = 0
    if (!props.value?.[1]) {
      setColumnPosition([provinceIndex, cityIndex, 0])
      return
    }

    cityIndex = province.city.findIndex((item) => item.name === props.value?.[1])
    if (cityIndex === -1) {
      setColumnPosition([provinceIndex, cityIndex, 0])
      return
    }

    const districtIndex = province.city[cityIndex].districtAndCounty.findIndex((item) => item === props.value?.[2])

    setColumnPosition([provinceIndex, cityIndex, districtIndex === -1 ? 0 : districtIndex])
  }, [props.value?.[0], props.value?.[1], props.value?.[2]])

  function onChange() {
    const province = regionData[columnPosition[0]]
    const city = province.city[columnPosition[1]]
    const districtName = city.districtAndCounty[columnPosition[2]]

    props.onChange?.([province.name, city.name, districtName])
  }

  function onColumnChange(event: BaseEventOrig<PickerMultiSelectorProps.ColumnChangeEventDetail>) {
    columnPosition[event.detail.column] = event.detail.value
    const totalEffectColumnPosition = 2 - event.detail.column

    let currentEffectColumnPosition = event.detail.column + 1
    while (currentEffectColumnPosition <= totalEffectColumnPosition) {
      columnPosition[currentEffectColumnPosition] = 0
      currentEffectColumnPosition++
    }

    const province = regionData[columnPosition[0]]
    const cityNames = getCityNames(province)
    const district = getDistrictNames(province.city[columnPosition[1]])

    setRange([range[0], cityNames, district])
    setColumnPosition([...columnPosition])
  }

  return (
    <View>
      <Picker
        mode="multiSelector"
        onColumnChange={onColumnChange}
        onChange={onChange}
        value={columnPosition}
        range={range}
      >
        <AtList className={props.value?.join('/') ? 'picker-value' : 'picker-no-value'}>
          <AtListItem title="地区信息" note={props.value?.join('/') ?? '请选择地区'}></AtListItem>
        </AtList>
      </Picker>
    </View>
  )
}
