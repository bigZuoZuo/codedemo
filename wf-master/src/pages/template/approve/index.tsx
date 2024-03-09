import { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import Tab1 from './components/tab1';
import Tab2 from './components/tab2';
import Tab3 from './components/tab3';
const { TabPane } = Tabs;

const ApproveCom: FC = () => {
  return (
    <PageContainer>
      <Card>
        <Tabs tabBarExtraContent={false} size="large" tabBarStyle={{ marginBottom: 24 }}>
          <TabPane tab="申请详情" key="sales">
            <Tab1 />
          </TabPane>
          <TabPane tab="流程记录" key="views">
            <Tab2 />
          </TabPane>
          <TabPane tab="流程图" key="viewsa">
            <Tab3 />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};
export default ApproveCom;
