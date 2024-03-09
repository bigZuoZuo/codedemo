
import type { FC } from 'react';
import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import CustomerBtn from './index';

const CustomerBtnDemo: FC = () => {

  return(
    <PageContainer>
      <Card>
        <CustomerBtn></CustomerBtn>
      </Card>
    </PageContainer>
  )
};
export default CustomerBtnDemo;