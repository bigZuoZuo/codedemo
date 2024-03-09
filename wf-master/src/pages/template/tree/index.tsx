import type { FC } from 'react';
import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tree } from 'antd';
import data from './data';
import './index.less';
import { makeTree } from '../../../utils';



const ZuesTree: FC = (params: any) => {

  useEffect(() => {
    console.log(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Card>
        <div className="leftTree">
          <div className="treeArea">
            <Tree
              showLine
              treeData={makeTree(data.data.rows)}
              >
            </Tree>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ZuesTree;
