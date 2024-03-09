import {useEffect, useState} from 'react'
//Input
import {View} from '@tarojs/components'
import './stepper.scss'

interface Props {
  value: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean

  onChange?: (newValue: number) => void
}

function Stepper(props: Props) {
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  function reduce() {
    if (props.disabled) {
      return
    }
    const newValue = value - (props.step ?? 1)
    if (newValue < (props.min ?? -Infinity)) {
      return
    }
    setValue(newValue)
    props.onChange?.(newValue)
  }

  function plus() {
    if (props.disabled) {
      return
    }
    const newValue = value + (props.step ?? 1)
    if (newValue > (props.max ?? Infinity)) {
      return
    }
    setValue(newValue)
    props.onChange?.(newValue)
  }

  return (
    <View className="cl-stepper stepper-container">
      <View
        className="cl-stepper__minus  {{disabled || min>=value?'cl-stepper__minus--disabled':''}}"
        onClick={reduce}
      ></View>
      <View className="cl-stepper__input">{value}</View>
      {/* <Input
        type="number"
        key={Date.now()}
        disabled={props.disabled}
        className="cl-stepper__input"
        value={value + ''}
        onBlur={(e: any) => {
          if(e.target.value <= (props.max || 1)){
            props.onChange?.(e.target.value)
          }else{
            props.onChange?.(props.max || 1)
          }
        }}
      /> */}
      <View
        className="cl-stepper__plus {{disabled || value>=max?'cl-stepper__minus--disabled':''}}"
        onClick={plus}
      ></View>
    </View>
  )
}

export default Stepper
