//@ts-nocheck
import {View, Video, Audio, Image, Block} from '@tarojs/components'
import {eventCenter} from '@tarojs/taro'
// import Taro from '@tarojs/taro';
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {AtModal, AtModalContent} from 'taro-ui'
// import ReactThreeFbxViewer from 'react-three-fbx-for-pyt'

// import hudClose from '@/assets/v2/hud-close.png'
import './index.scss'

const CommonDialog = ({url, onClose, oUrl, type}) => {
  const [show, setShow] = useState(false)
  const [percent, setPercent] = useState(0)

  const handleCancel = useCallback(() => {
    if (type === '3D') {
      customElements.get('model-viewer').modelCacheSize = 0
      window.location.reload()
    }
    setShow(false)
    setPercent(0)
    onClose?.(false)
  }, [onClose])
  useEffect(() => {
    if (url) {
      setShow(true)
    }
  }, [url])

  useEffect(() => {
    // if (type === 'video' && show) {
    //   const webcamVideo = document.getElementById('webcamVideo');
    //   function getmetadata(){
    //     // webcamVideo.play();
    //     // setTimeout(()=>{
    //       webcamVideo.muted = false;
    //       webcamVideo.play();
    //     // }, 1000)
    //   }
    //   webcamVideo.addEventListener('play',getmetadata)
    // }
    if (type === '3D' && show) {
      const modelViewer = document.querySelector('#get-modal-view')
      const play = (e) => {
        const p = (e?.detail.totalProgress * 100).toFixed(0)
        if (p == 100) {
          setPercent(100)
          modelViewer.removeEventListener('progress', play)
        } else {
          setPercent(p)
        }
      }
      modelViewer.addEventListener('progress', play)
      // modelViewer.addEventListener('error', (err)=>{
      //   console.log(err)
      // })
      return () => {
        modelViewer.removeEventListener('progress', play)
        // modelViewer.removeEventListener('error', play)
      }
    }
  }, [show, type])

  useEffect(() => {
    eventCenter.on('__taroRouterChange', () => {
      if (type === '3D') {
        customElements.get('model-viewer').modelCacheSize = 0
        window.location.reload()
      }
      setShow(false)
      setPercent(0)
      onClose?.(false)
    })
  }, [])

  const showHtml = useCallback(() => {
    if (show) {
      if (type === 'music') {
        return (
          <Audio
            src={oUrl}
            style={{
              margin: '0vh 0 0 12vw',
              height: '20vh',
            }}
          />
        )
      } else if (type === '3D') {
        return (
          <View
            style={{
              minHeight: '90vh',
              minWidth: '100vw',
              background: '#141414',
            }}
            key={percent}
          >
            <View className={'modal-close-icon'} onClick={() => handleCancel()}>
              ＋
            </View>
            <model-viewer
              id="get-modal-view"
              src={oUrl}
              alt="3D模型"
              shadow-intensity="1"
              camera-controls
              auto-rotate
              style={{
                minHeight: '90vh',
                minWidth: '100vw',
              }}
            ></model-viewer>
          </View>
        )
      } else if (type === 'video') {
        return (
          <Video
            src={oUrl}
            poster={oUrl + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast'}
            controls
            playInline
            style={{
              height: '30vh',
              // zIndex: 9999,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        )
      } else {
        return (
          <Image
            src={url}
            poster={url}
            style={{
              maxWidth: '90vw',
              width: '90vw',
              padding: '5vw',
            }}
          />
        )
      }
    } else {
      return <></>
    }
  }, [show])

  return (
    <AtModal className="common-dialog-with-preview" isOpened={show} onClose={handleCancel}>
      <AtModalContent>
        {showHtml()}
        <Block wx-if={show && type !== '3D'}>
          <View className={'modal-close-icon'} onClick={() => handleCancel()}>
            ＋
          </View>
        </Block>
        <Block wx-if={show && type === '3D' && percent < 100}>
          <View className="button-load"></View>
          <View className="right-circle"></View>
          <View key={percent} className="button-text">
            {percent}
          </View>
        </Block>
      </AtModalContent>
    </AtModal>
  )
}

const CommonDialogContext = createContext({
  form: undefined,
  //@ts-ignore
  show: (props) => {},
})

export const CommonDialogWrapper = ({children}) => {
  const [form, setForm] = useState()
  const show = useCallback((props) => {
    return new Promise((resolve) => {
      setForm(
        <CommonDialog
          {...props}
          onClose={(bided) => {
            //@ts-ignore
            setForm(null)
            resolve(bided)
          }}
        />
      )
    })
  }, [])

  return (
    <CommonDialogContext.Provider value={{form, show}}>
      {form}
      {children}
    </CommonDialogContext.Provider>
  )
}

export const useCommonDialog = () => useContext(CommonDialogContext)
