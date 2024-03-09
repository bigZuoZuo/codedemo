
import './index.less';
import type { FC } from 'react';
import { useEffect, useState,useRef } from 'react';
import { Button, Card } from 'antd';
import ModuleLeft from '../compans/moduleLeft';
import ModuleTitle from '../compans/moduleTitle';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {  
  ProFormSwitch,
  ProFormText,
  ProFormRadio,
  ProFormCheckbox,
  ProFormRate,
  ProFormSelect,
  ProFormDigit,
  ProFormSlider,
  ProFormGroup, 
} from '@ant-design/pro-form';

interface UseFlowProps {
  state?: any;
  set_state?: any;
  saveData?: any;
  set_saveData?: any;
}
interface stateObject {
  leftModules?: any;
  moveItems?: any;
  isShowForm?: any;
  keyNum?: any;//现在所在的模组设置的位置数字
}
interface resizeStyleObject {
  scaleStyle?: any;
  scaleStyle2?: any;
}
const UseFlow: FC<UseFlowProps> = ( props: UseFlowProps) => {

  
  const [resizeStyle, set_resizeStyle] = useState<resizeStyleObject>({});
  const setState: any = ( newState: stateObject ) => {
    props.set_state((oldState: stateObject)=>{
      return {
        ...oldState,
        ...newState,
      }
    })
  }
  const formRef = useRef<ProFormInstance>();

  const getResize = () => {
    const scaleNum = document.getElementsByClassName('ant-layout-content')[0].clientWidth / 1712;
    const scaleTopNum = 986 * (1 - scaleNum);
    set_resizeStyle({
      scaleStyle: {
        transform: `scale(${scaleNum})`,
        transformOrigin: '0 0',
        overflow: 'visible',
      },
      scaleStyle2: {
        marginTop: `-${scaleTopNum}px`,
      },
    });
    document.documentElement.addEventListener('click', () => {
      // const scaleNum = document.getElementsByClassName('ant-layout-content')[0].clientWidth / 1712;
      setTimeout(() => {
        if (document.getElementsByClassName('flowDetail').length > 0) {
          const antBottomLeftDom = document.getElementsByClassName('flowDetail')[0].getElementsByClassName('ant-select-dropdown-placement-bottomLeft');
          const antSelTopLeftDom = document.getElementsByClassName('flowDetail')[0].getElementsByClassName('ant-select-dropdown-placement-topLeft');
          
          for (let i = 0; i < antBottomLeftDom.length; i++) {
            antBottomLeftDom[i].style.left = '0';
            antBottomLeftDom[i].style.top = '40px';
            antBottomLeftDom[i].firstChild.style.transform = 'none';
          }
          //ant-select-dropdown-placement-topLeft
          for (let i = 0; i < antSelTopLeftDom.length; i++) {
            antSelTopLeftDom[i].style.left = '0';
            antSelTopLeftDom[i].style.top = '-' + (antSelTopLeftDom[i].offsetHeight + 5) + 'px';
          }
        }
      }, 16);
    });
    window.addEventListener('resize', (e) => {
      const scaleNum = document.getElementsByClassName('ant-layout-content')[0].clientWidth / 1712;
      const scaleTopNum = 986 * (1 - scaleNum);
      set_resizeStyle({
        scaleStyle: {
          transform: `scale(${scaleNum})`,
          transformOrigin: '0 0',
          overflow: 'visible',
        },
        scaleStyle2: {
          marginTop: `-${scaleTopNum}px`,
        },
      });
    });
  }

  // 获取移动的item
  const getLeftItemCallBack = (item: any) => {
    const { moveItems } = props.state;
    item.active = false;
    item.index = moveItems.length;
    moveItems.push({
      ...item,
    });
    setState({
      moveItems,
    });
  }

  //模组设置校验成功存储数据到saveData中
  const setSaveData = (val: any,keyNum: any) => {
    props.set_saveData((oldData: any)=>{
      const newData: any[]= [...oldData];
      newData[keyNum] = {...val};
      return newData;
    })
  }

  //从模组中获取值
  const getSaveData = (index: any) => {
    const nowData: any[]= {...props.saveData[index]};
    console.log(props.saveData)
    formRef.current?.setFieldsValue(nowData);
  }

  // 展开和隐藏点击事件
  const rightBtnClick = (index: any) => {
    console.log(formRef.current?.validateFieldsReturnFormatValue?.())
    formRef.current?.validateFieldsReturnFormatValue?.().then((val) => {
      // 以下为格式化之后的表单值
      console.log(val);  
      console.log('props.state.isShowForm= ',props.state.isShowForm);  
      console.log('props.state.keyNum= ',props.state.keyNum)
      console.log('index= ',index)
      if (props.state.isShowForm === false && props.state.keyNum === undefined) { //模组设置展开
        console.log('模组设置展开')
        setState({ keyNum: index });
      } else if (props.state.isShowForm === true && props.state.keyNum === index) { //隐藏现在展开的模组
        console.log('隐藏现在展开的模组')
        setSaveData(val, index);
        setState({ keyNum: undefined });
      } else if (props.state.isShowForm === true && props.state.keyNum !== index) { //模组直接打开别的模组
        console.log('模组直接打开别的模组')
        setSaveData(val, props.state.keyNum);
        setState({ keyNum: index });
      } 
      const temp_list = [...props.state.moveItems];
      
      for (let i = 0; i < temp_list.length; i++) {
        if (i !== index) {
          temp_list[i].active = false;
        }
        if (i === index) {
          temp_list[i].active = !temp_list[i].active;
        }
      }

      setState({
        moveItems: temp_list,
      })
      formRef.current?.resetFields();

      let num = 0;
      for (let i = 0; i < temp_list.length; i++) {
        const element = temp_list[i];
        if (element.active && i === index) {
          num++;
          setState({
            isShowForm: true,
          });
          if (props.saveData[index] !== undefined) {
            getSaveData(index);
          }
        }
      }
      if (num === 0) {
        setState({
          isShowForm: false,
        });
      }

    });
    
  }


  // 删除按钮点击事件
  const deleteBtnClick = (index: any) => {
    const { moveItems } = props.state;
    const newSaveData: any[] = [...props.saveData];
    if (newSaveData.length !== 0) {
      newSaveData.splice(index, 1);
    }
    props.set_saveData(newSaveData);
    if (moveItems.length !== 0) {
      moveItems.splice(index, 1);
      setState({
        isShowForm: false,
        moveItems,
        keyNum: undefined,
      });
      formRef.current?.resetFields();
    }
  }
  
  /**
   * 模组设置确认按钮
   */
  const checkData = (index: any) => {
    formRef.current?.validateFieldsReturnFormatValue?.().then((val) => {
      // 以下为格式化之后的表单值
      console.log(val.date);
      rightBtnClick(index);
    });
  }

  useEffect(() => {
    console.log(props);
    getResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return(
      <div>
        <div className="flowDetail" style={resizeStyle.scaleStyle}>
          <ModuleLeft leftModules={props.state.leftModules} getLeftItemCallBack={getLeftItemCallBack} />
          <div className="middle" />
          <div className="moduleRight_kuang">
            {/* 标题 */}
            <ModuleTitle moduleTitle="流程编辑" />
            <div className="moduleRight">
              {/* 拖拽目的区 */}
              <div className="dragArea">
                <div className="moduleArrow">
                  {
                    props.state.moveItems.map((item: any, index: any) => (
                      <div className="item" key={JSON.stringify(item)}>
                        <div className={item.active ? 'title title_active' : 'title title_normal'}>{item.lrmModuleTypeName}</div>
                        <div onClick={()=>rightBtnClick(index)} className={item.active ? 'rightIcon show' : 'rightIcon hide'} />
                        {index !== (props.state.moveItems.length - 1)
                          && <div className="arrow" />
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
              {/* 表单区 */}
              <ProForm
                title="新建表单"
                formRef={formRef}
                submitter={{
                  render: ( ) => {
                    return [
                      // ...doms,
                    ];
                  },
                }}
              >
                {props.state.isShowForm
                  && (
                    <div className="formArea">
                      {
                        props.state.moveItems.map((item: any, index: any) => (
                          item.active ? 
                            (
                              <div key={index} className={item.active ? 'moduleForm' : 'dispNone'}>
                                <div className="title">模组设置</div>

                                {/* 表单自定义 */}
                                <Card>
                                <ProFormGroup label="文本类">
                                  <ProFormText width="xl" name="name" label="name" />
                                  <ProFormText.Password width="xl" name="password" label="password" />
                                </ProFormGroup>
                                <ProFormGroup
                                  label="选择类"
                                  style={{
                                    gap: '0 32px',
                                  }}
                                >
                                  <ProFormSelect
                                    width="xl"
                                    name="select"
                                    label="Select"
                                    valueEnum={{
                                      china: 'China',
                                      usa: 'U.S.A',
                                    }}
                                    placeholder="Please select a country"
                                    rules={[{ required: true, message: 'Please select your country!' }]}
                                  />
                                  <ProFormSelect
                                    width="xl"
                                    fieldProps={{
                                      labelInValue: true,
                                    }}
                                    request={async () => [
                                      { label: '全部', value: 'all' },
                                      { label: '未解决', value: 'open' },
                                      { label: '已解决', value: 'closed' },
                                      { label: '解决中', value: 'processing' },
                                    ]}
                                    name="useMode"
                                    label="合同约定生效方式"
                                  />
                                  <ProFormSelect
                                    width="xl"
                                    name="select-multiple"
                                    label="Select[multiple]"
                                    valueEnum={{
                                      red: 'Red',
                                      green: 'Green',
                                      blue: 'Blue',
                                    }}
                                    fieldProps={{
                                      mode: 'multiple',
                                    }}
                                    placeholder="Please select favorite colors"
                                    rules={[
                                      { required: true, message: 'Please select your favorite colors!', type: 'array' },
                                    ]}
                                  />

                                  <ProFormRadio.Group
                                    width="xl"
                                    name="radio"
                                    label="Radio.Group"
                                    options={[
                                      {
                                        label: 'item 1',
                                        value: 'a',
                                      },
                                      {
                                        label: 'item 2',
                                        value: 'b',
                                      },
                                      {
                                        label: 'item 3',
                                        value: 'c',
                                      },
                                    ]}
                                  />
                                  <ProFormRadio.Group
                                    width="xl"
                                    name="radio-vertical"
                                    layout="vertical"
                                    label="Radio.Group"
                                    options={[
                                      {
                                        label: 'item 1',
                                        value: 'a',
                                      },
                                      {
                                        label: 'item 2',
                                        value: 'b',
                                      },
                                      {
                                        label: 'item 3',
                                        value: 'c',
                                      },
                                    ]}
                                  />
                                  <ProFormRadio.Group
                                    width="xl"
                                    name="radio-button"
                                    label="Radio.Button"
                                    radioType="button"
                                    options={[
                                      {
                                        label: 'item 1',
                                        value: 'a',
                                      },
                                      {
                                        label: 'item 2',
                                        value: 'b',
                                      },
                                      {
                                        label: 'item 3',
                                        value: 'c',
                                      },
                                    ]}
                                  />
                                  <ProFormCheckbox.Group
                                    width="xl"
                                    name="checkbox-group"
                                    label="Checkbox.Group"
                                    options={['A', 'B', 'C', 'D', 'E', 'F']}
                                  />
                                </ProFormGroup>
                                <ProFormGroup label="数字类">
                                  <ProFormDigit label="InputNumber" name="input-number" width="xl" min={1} max={10} />
                                  <ProFormSwitch name="switch" label="Switch" width="xl"/>
                                  <ProFormSlider
                                    name="slider"
                                    label="Slider"
                                    width="xl"
                                    marks={{
                                      0: 'A',
                                      20: 'B',
                                      40: 'C',
                                      60: 'D',
                                      80: 'E',
                                      100: 'F',
                                    }}
                                  />
                                  <ProFormRate name="rate" label="Rate" width="xl"/>
                                </ProFormGroup>
                                </Card>
                                {/* 表单自定义 */}
                                
                                <div className="bottomBtns">
                                  <Button type="danger" onClick={()=>deleteBtnClick(index)}>删除</Button>
                                  <Button type="primary" onClick={()=>checkData(index)}>确认</Button>
                                </div>
                              </div>
                            ) 
                            : null
                          )
                        )
                      }
                    </div>
                  )
                }
              </ProForm>
            </div>
          </div>
        </div>
        <div className="baseInfo" style={resizeStyle.scaleStyle2}>
          <div className="riskProductManageAddBaseInfo" style={{ paddingTop: '0', paddingBottom: '0', marginTop: '30px', marginBottom: '0' }} />
        </div>
      </div>
  )
};
export default UseFlow;