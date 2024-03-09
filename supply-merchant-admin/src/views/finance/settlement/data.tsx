import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getStoreListApi, getSupplierListApi } from "../../../api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '制单日期',
      dataIndex: 'zdRiQi',
    },
    {
      title: '单号',
      dataIndex: 'jieSuanNo',
    },
    {
      title: '供应商',
      dataIndex: 'cShopNo',
    },
    {
      title: '门店',
      dataIndex: 'cStoreNo',
    },
    {
      title: '审核人',
      dataIndex: 'shenHeRen',
    },
    {
      title: '销售金额',
      dataIndex: 'fSaleMoney',
    },
    {
      title: '特价金额',
      dataIndex: 'fSaleMoneyTj',
    },
    {
      title: '正价金额',
      dataIndex: 'fSaleMoneyZj',
    },
    {
      title: '入库金额',
      dataIndex: 'fInMoney',
    },
    {
      title: '结算金额',
      dataIndex: 'fJsMoney',
    },
    {
      title: '费用金额',
      dataIndex: 'fFeiYongJinE',
    },
    {
      title: '返厂金额',
      dataIndex: 'fRbdMoney',
    },
    {
      title: '支出金额',
      dataIndex: 'fPayOutMoney',
    },
    {
      title: '扣点金额',
      dataIndex: 'fKouDian',
    },
    {
      title: '正价扣点',
      dataIndex: 'fKouDianZj',
    },
    {
      title: '特价扣点',
      dataIndex: 'fKouDianTj',
    },
    {
      title: '开始日期',
      dataIndex: 'riQi1',
    },
    {
      title: '结束日期',
      dataIndex: 'riQi2',
    },
    {
      title: '是否付款',
      dataIndex: 'iFukuan',
      customRender: ({ record }) => record.iFukuan ? '是' : '否'
    },
    {
      title: '付款日期',
      dataIndex: 'fuKuanRiQi',
    },
    {
      title: '发票金额',
      dataIndex: 'fFaPiaoMoney',
    },
    {
      title: '操作人编号',
      dataIndex: 'cOperNo',
    },
    // {
    //   title: '操作人名称',
    //   dataIndex: 'cOperName',
    // },
    {
      title: '创建日期',
      dataIndex: 'dCreateDate',
    },
    {
      title: '备注',
      dataIndex: 'cBeiZhu',
    },
    {
      title: '审核状态',
      dataIndex: 'cBillState',
    },
    {
      title: '结算类型',
      dataIndex: 'cBalanceType',
    },
    {
      title: '剩余结算金额',
      dataIndex: 'fLastJieSuanMoney',
    },
    {
      title: '差价金额',
      dataIndex: 'fMoneyDiff',
    },
    {
      title: '供应链是否确认',
      dataIndex: 'iGylShenHe',
      customRender: ({ record }) => record.iFukuan ? '是' : '否'
    },
    {
      title: '毛利',
      dataIndex: 'fMl',
    },
    {
      title: '毛利率',
      dataIndex: 'fMlRatio',
    },
    {
      title: '库存金额',
      dataIndex: 'fKuCunMoney',
    },
    {
      title: '合作方式',
      dataIndex: 'cHeZuoFangShi',
    },
    {
      title: '供应商联系人',
      dataIndex: 'cSupPerson',
    },
    {
      title: '银行',
      dataIndex: 'cBank',
    },
    {
      title: '账户',
      dataIndex: 'cAccount',
    },
    {
      title: 'VIP价格',
      dataIndex: 'fMoneySaleVip',
    },
    // {
    //   title: '小组',
    //   dataIndex: 'cGroupNo',
    // },
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 60,
    schemas: [
      {
        field: 'sheetNo',
        label: '单号',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: 'storeDetail',
        label: '门店',
        component: 'ApiSelect',
        componentProps: {
          api: getStoreListApi,
          labelField: 'cStoreName',
          valueField: 'cStoreNo',
          mode: 'multiple',
          maxTagCount: 1
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'supNoDetail',
        label: '供应商',
        component: 'ApiSelect',
        componentProps: {
          api: getSupplierListApi,
          labelField: 'cSupName',
          valueField: 'cSupNo',
          mode: 'multiple',
          maxTagCount: 1
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'fieldTime',
        component: 'RangePicker',
        label: '时间段',
        defaultValue: [dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'), dayjs()],
        componentProps: {
          showTime: {
            defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
          },
          // disabledDate: (current: Dayjs) => current && current < dayjs().month(1)
        },
        colProps: {
          span: 6,
        },
      },
    ],
    fieldMapToTime: [['fieldTime', ['dtb', 'dte'], 'YYYY-MM-DD HH:mm:ss']],
  };
}

export function getDetailTableColumns() {

  const settleAccInStockDtos: BasicColumn[] = [
    {
      title: '门店',
      dataIndex: 'cStoreAbbName',
    },
    {
      title: '入库单号',
      dataIndex: 'cSheetNo',
    },
    {
      title: '操作人编号',
      dataIndex: 'cOperatorNo',
    },
    {
      title: '操作人',
      dataIndex: 'cOperator',
    },
    {
      title: '审核人编号',
      dataIndex: 'cExaminerNo',
    },
    {
      title: '审核人',
      dataIndex: 'cExaminer',
    },
    {
      title: '日期',
      dataIndex: 'dDate',
    },
    {
      title: '金额',
      dataIndex: 'fMoney',
    },
    {
      title: '结算单编号',
      dataIndex: 'jieSuanNo',
    },
    {
      title: '结算金额',
      dataIndex: 'fMoneyJs',
    },
    {
      title: '备注',
      dataIndex: 'cBeiZhu',
    },
    {
      title: '剩余金额',
      dataIndex: 'fMoneyLeft',
    },
  ]
  const settleAccBackFactoryDtos: BasicColumn[] = [
    {
      title: '门店',
      dataIndex: 'cStoreAbbName',
    },
    {
      title: '入库单号',
      dataIndex: 'cSheetNo',
    },
    {
      title: '操作人编号',
      dataIndex: 'cOperatorNo',
    },
    {
      title: '操作人',
      dataIndex: 'cOperator',
    },
    {
      title: '审核人编号',
      dataIndex: 'cExaminerNo',
    },
    {
      title: '审核人',
      dataIndex: 'cExaminer',
    },
    {
      title: '日期',
      dataIndex: 'dDate',
    },
    {
      title: '金额',
      dataIndex: 'fMoney',
    },
    {
      title: '结算单编号',
      dataIndex: 'jieSuanNo',
    },
    {
      title: '结算金额',
      dataIndex: 'fMoneyJs',
    },
    {
      title: '备注',
      dataIndex: 'cBeiZhu',
    },
  ]
  const settleAccSaleDtos: BasicColumn[] = [
    {
      title: '门店',
      dataIndex: 'cStoreAbbName',
    },
    {
      title: '结算单编号',
      dataIndex: 'jieSuanNo',
    },
    {
      title: '操作人编号',
      dataIndex: 'cOperatorNo',
    },
    {
      title: '销售成本',
      dataIndex: 'fMoneyCost',
    },
    {
      title: '毛利',
      dataIndex: 'fMoneyProfitSum',
    },
    {
      title: '扣点金额',
      dataIndex: 'fProfitRatioKouDian',
    },
    {
      title: '会员价格',
      dataIndex: 'fMoneySaleVip',
    },
    {
      title: '会员扣点',
      dataIndex: 'fMoneyVipRatio',
    },
    {
      title: '库存金额',
      dataIndex: 'fKuCunMoney',
    },
    {
      title: '利率比率',
      dataIndex: 'fProfitRatio',
    },
    {
      title: '门店名称',
      dataIndex: 'cStoreName',
    },
  ]
  const settleAccChargeDtos: BasicColumn[] = [
    {
      title: '门店',
      dataIndex: 'cStoreAbbName',
    },
    {
      title: '费用名称',
      dataIndex: 'feiYong',
    },
    {
      title: '费用金额',
      dataIndex: 'feiYongJinE',
    },
    {
      title: '制单日期',
      dataIndex: 'zdRiQi',
    },
    {
      title: '开始日期',
      dataIndex: 'riQi1',
    },
    {
      title: '结束日期',
      dataIndex: 'riQi2',
    },
    {
      title: '收取类型',
      dataIndex: 'iShouQuType',
    },
    {
      title: '收取类型名称',
      dataIndex: 'cShouQuType',
    }
  ]
  const settleAccPayDtos: BasicColumn[] = [
    {
      title: '门店',
      dataIndex: 'cStoreAbbName',
    },
    {
      title: '支出费用项目',
      dataIndex: 'feiYong',
    },
    {
      title: '支出费用金额',
      dataIndex: 'feiYongJinE',
    },
    {
      title: '制单日期',
      dataIndex: 'zdRiQi',
    },
    {
      title: '开始日期',
      dataIndex: 'riQi1',
    },
    {
      title: '结束日期',
      dataIndex: 'riQi2',
    },
  ]
  return {
    settleAccInStockDtos: {
      data: settleAccInStockDtos,
      title: '入库单明细'
    },
    settleAccBackFactoryDtos: {
      data: settleAccBackFactoryDtos,
      title: '返厂差价单明细'
    },
    settleAccSaleDtos: {
      data: settleAccSaleDtos,
      title: '销售明细'
    },
    settleAccChargeDtos: {
      data: settleAccChargeDtos,
      title: '费用收取明细'
    },
    settleAccPayDtos: {
      data: settleAccPayDtos,
      title: '费用支出明细'
    }
  }
}