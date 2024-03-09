import { FC } from 'react';
import { Image } from 'antd';

import styles from '../styles.less';

const Tab3: FC = () => {
  return (
    <div>
      <div className={styles.titles}>流程图信息</div>
      <div className={styles.images}>
        <Image preview={false} src="http://zeus.credit-zma-sst.com/api/wkf/view/flowchart/46209256/1638235276902" />
      </div>
    </div>
  );
};

export default Tab3;
