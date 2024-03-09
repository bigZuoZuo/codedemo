import {useState, useCallback, createContext, useContext} from 'react'
import {View} from '@tarojs/components'
import {Popup, NumberKeyboard, PasswordInput} from 'react-vant'

import './pin.scss'

export const PinInputPopupView = ({onSubmit, onClose, title = '操作密码'}) => {
  const [pin, setPin] = useState('')

  const handleSubmit = useCallback(async () => {
    await onSubmit?.(pin)
  }, [pin])

  const handleClose = useCallback(() => {
    onClose?.()
  }, [])

  return (
    <Popup
      position="bottom"
      className="c-pin-input-popup-view-popup-pin"
      round
      closeable
      closeIconPosition="top-left"
      visible
      onClose={handleClose}
    >
      <View className="pin-box">
        <View className="title">{title}</View>
        <PasswordInput
          onFocus={() => {
            // @ts-ignore
            document.activeElement.blur()
          }}
          value={pin}
          length={6}
          autoFocus
          className="pin"
          onSubmit={handleSubmit}
        />
      </View>
      <NumberKeyboard
        visible
        value={pin}
        extraKeyRender={() => null}
        onChange={(v) => {
          setPin(v)
        }}
      />
    </Popup>
  )
}

export const PinInputPopupViewContext = createContext({
  view: undefined,
  show: () => {},
})

export const PinInputPopupViewWrapper = (props) => {
  const [view, setView] = useState()
  const show = useCallback((props) => {
    return new Promise((resolve) => {
      setView(
        // @ts-ignore
        <PinInputPopupView
          onSubmit={(pin) => {
            // @ts-ignore
            setView(null)
            resolve(pin)
          }}
          onClose={async () => {
            // @ts-ignore
            setView(null)
            // @ts-ignore
            resolve()
          }}
          {...props}
        />
      )
    })
  }, [])
  return (
    <PinInputPopupViewContext.Provider {...props} value={{view, show}}>
      {view}
      {props?.children}
    </PinInputPopupViewContext.Provider>
  )
}

export const usePin = () => useContext(PinInputPopupViewContext)
