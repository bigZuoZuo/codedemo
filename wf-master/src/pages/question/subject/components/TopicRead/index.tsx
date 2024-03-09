import { Tabs } from 'antd';
import React, { useRef, useState } from 'react';

import ContentComponents from './Content';

const { TabPane } = Tabs;


const initialPanes = [
  {
    title: '小题1',
    content:<ContentComponents />,
    key: '1',
    closable: false,
  },
];

const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState(initialPanes[0].key);
  const [panes, setPanes] = useState(initialPanes);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...panes];
    newPanes.push({ title: `小题${panes.length+1}`,content:<ContentComponents />,key: newActiveKey });
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={onEdit}>
      {panes.map(pane => (
        <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
          {panes.content}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default App;
