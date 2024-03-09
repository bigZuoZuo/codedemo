import type { FC } from 'react';
import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card,Select } from 'antd';
import {
  CaretDownOutlined
} from '@ant-design/icons';
import './index.less';


const { Option } = Select;

const ZuesTree: FC = (params: any) => {
  useEffect(() => {
    console.log(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(value: any) {
    console.log(`selected ${value}`);
  }
  
  return (
    <PageContainer>
      <Card>
      <Select 
        showArrow={true}
        allowClear
        suffixIcon={<CaretDownOutlined />}
        defaultValue="1" 
        // open 
        style={{ width: 240 }} 
        onChange={handleChange}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
        <Option value="4">4</Option>
        <Option value="5">5</Option>
        <Option value="6">6</Option>
        <Option value="7">7</Option>
        <Option value="8">8</Option>
        <Option value="9">9</Option>
        <Option value="10">10</Option>
        <Option value="11">11</Option>
      </Select>
      <p></p>
      <Select 
        mode="multiple"
        maxTagCount={4}
        showArrow={true}
        allowClear
        suffixIcon={<CaretDownOutlined />}
        defaultValue="1" 
        // open 
        style={{ width: 240 }} 
        onChange={handleChange}>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
        <Option value="4">4</Option>
        <Option value="5">5</Option>
        <Option value="6">6</Option>
        <Option value="7">7</Option>
        <Option value="8">8</Option>
        <Option value="9">9</Option>
        <Option value="10">10</Option>
        <Option value="11">11</Option>
      </Select>
      </Card>
    </PageContainer>
  );
};

export default ZuesTree;
