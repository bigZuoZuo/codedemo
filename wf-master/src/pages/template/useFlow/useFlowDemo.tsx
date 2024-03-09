
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {  Card } from 'antd';
import UseFlow from './index';

interface UseFlowDemoProps {

}
interface stateObject {
  leftModules?: any;
  moveItems?: any;
  isShowForm?: any;
  keyNum?: any;//现在所在的模组设置的位置数字
}
const UseFlowDemo: FC<UseFlowDemoProps> = ( props: UseFlowDemoProps) => {

  const [state, set_state] = useState<stateObject>({
    leftModules:[
      {
        "moduleGroupTypeCode": "MODULE_GROUP_TYPE_CREDIT",
        "moduleGroupTypeName": "信用风控模组类型",
        "moduleGroupTypeList": [
          {
            "lrmModuleGroupCode": "LRM_MODULE_GROUP_DUE_CHECK",
            "lrmModuleGroupName": "尽职调查",
            "lrmModuleGroupList": [
              {
                "lrmModuleTypeCode": "MODULE_CERTIFICATION",
                "lrmModuleTypeName": "实名认证",
                "nodeType": 1,
                "active": false
              },
              {
                "lrmModuleTypeCode": "MODULE_PRODUCT_ADMIT",
                "lrmModuleTypeName": "产品准入",
                "nodeType": 1,
                "active": false
              },
              {
                "lrmModuleTypeCode": "MODULE_CUST_ADMIT",
                "lrmModuleTypeName": "客户准入",
                "nodeType": 1,
                "active": false
              },
              {
                "lrmModuleTypeCode": "MODULE_ANTI_FRAUD",
                "lrmModuleTypeName": "反欺诈",
                "nodeType": 1,
                "active": false
              }
            ]
          },
          {
            "lrmModuleGroupCode": "LRM_MODULE_GROUP_CHECK",
            "lrmModuleGroupName": "审查",
            "lrmModuleGroupList": [
              {
                "lrmModuleTypeCode": "MODULE_PARALLEL_OPERATION",
                "lrmModuleTypeName": "平行作业",
                "nodeType": 1,
                "active": false
              },
              {
                "lrmModuleTypeCode": "MODULE_RATE",
                "lrmModuleTypeName": "评级",
                "nodeType": 1,
                "active": false
              },
              {
                "lrmModuleTypeCode": "MODULE_SCORE",
                "lrmModuleTypeName": "评分",
                "nodeType": 1,
                "active": false
              },
              {
                "lrmModuleTypeCode": "MODULE_QUOTA",
                "lrmModuleTypeName": "额度测算",
                "nodeType": 1,
                "active": false
              }
            ]
          },
          {
            "lrmModuleGroupCode": "LRM_MODULE_GROUP_CREDIT_APPROVE",
            "lrmModuleGroupName": "审批",
            "lrmModuleGroupList": [
              {
                "lrmModuleTypeCode": "MODULE_CREDIT_APPROVE",
                "lrmModuleTypeName": "授信审批",
                "nodeType": 2,
                "active": false
              }
            ]
          }
        ],
        "lrmModelTypeList": [
          "MODULE_CERTIFICATION",
          "MODULE_PRODUCT_ADMIT",
          "MODULE_CUST_ADMIT",
          "MODULE_ANTI_FRAUD",
          "MODULE_PARALLEL_OPERATION",
          "MODULE_RATE",
          "MODULE_SCORE",
          "MODULE_QUOTA",
          "MODULE_CREDIT_APPROVE"
        ]
      },
      {
        "moduleGroupTypeCode": "MODULE_GROUP_TYPE_OPERATE",
        "moduleGroupTypeName": "操作风控模组类型",
        "moduleGroupTypeList": [
          {
            "lrmModuleGroupCode": "LRM_MODULE_GROUP_OPERATE_APPROVE",
            "lrmModuleGroupName": "审批",
            "lrmModuleGroupList": [
              {
                "lrmModuleTypeCode": "MODULE_PROCESS_APPROVE",
                "lrmModuleTypeName": "流程审批",
                "nodeType": 2,
                "active": false
              }
            ]
          }
        ],
        "lrmModelTypeList": [
          "MODULE_PROCESS_APPROVE"
        ]
      },
      {
        "moduleGroupTypeCode": "MODULE_GROUP_TYPE_MARKET",
        "moduleGroupTypeName": "市场风控模组类型",
        "moduleGroupTypeList": [
          {
            "lrmModuleGroupCode": "LRM_MODULE_GROUP_MARKET",
            "lrmModuleGroupName": "市场",
            "lrmModuleGroupList": [
              {
                "lrmModuleTypeCode": "MODULE_PRICE_CONTROL",
                "lrmModuleTypeName": "价格监控",
                "nodeType": 1,
                "active": false
              }
            ]
          }
        ],
        "lrmModelTypeList": [
          "MODULE_PRICE_CONTROL"
        ]
      }
    ],
    moveItems:[],
    isShowForm:false,
    keyNum:undefined,
  });
  const [saveData, set_saveData] = useState<any>([]);//风控流程上传数据

  useEffect(() => {
    console.log(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return(
    <PageContainer>
      <Card>
        <UseFlow
          state = {state}
          set_state = {set_state}
          saveData = {saveData}
          set_saveData = {set_saveData}
        ></UseFlow>
      </Card>
    </PageContainer>
  )
};
export default UseFlowDemo;