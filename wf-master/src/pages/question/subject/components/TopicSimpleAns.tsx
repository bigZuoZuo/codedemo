import React, { useEffect, useRef, useState } from 'react';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

const BraftEditorControls = ['font-size','line-height','letter-spacing','text-color','bold','italic','underline','strike-through','hr','list-ul','list-ol','media']

export default ()=>{

  // 大题题干
  const [bigTopicTitle ,setBigTopicTitle] = useState("");
  const bigTopicTitleChange = (editorState) => {
    setBigTopicTitle({ editorState })
  }
  const bigTopicTitleSave=()=>{
    console.log(editorState)
  }

  return (
    <BraftEditor
      value={bigTopicTitle}
      onChange={bigTopicTitleChange}
      onSave={bigTopicTitleSave}
      controls={BraftEditorControls}
      className='braftEditor'
    />
  )
}
