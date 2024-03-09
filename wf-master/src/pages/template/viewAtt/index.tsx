import { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button } from 'antd';
import useAttahcModal from '@/components/AttachModal/index';

const ViewAtt: FC = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modal, showModal] = useAttahcModal();

  const list = [
    // {
    //   name: '附件一',
    //   url: 'http://scf.ap88.com/group1/M00/00/00/CmRkfGCd38CAA0mKAADSQzZ9dCQ372.jpg',
    // },
    // {
    //   name: '附件二',
    //   url: 'http://scf.ap88.com/group1/M00/00/00/CmRkfGCd38CAA0mKAADSQzZ9dCQ372.jpg',
    // },
  ];

  const onClick = () => {
    showModal(list);
  };
  return (
    <PageContainer>
      <Card>
        <Button type="primary" onClick={onClick}>
          查看附件
        </Button>
        {modal}
      </Card>
    </PageContainer>
  );
};
export default ViewAtt;
