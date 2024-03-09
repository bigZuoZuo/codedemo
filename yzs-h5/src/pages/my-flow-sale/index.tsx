import { api } from "@/api";
import Tabs from "@/components/custom-tabs";
import ListState from "@/components/list-state/list-state";
import NavigationBar from "@/components/navigation-bar/navigation-bar";
import { ListData } from "@/typings";
import { View } from "@tarojs/components";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { List } from "react-vant";
import { AtTabsPane } from "taro-ui";
import styles from "./index.module.scss";

const tabs = [
  { title: "审核中", value: "submit" },
  { title: "审核失败", value: "reject" },
  { title: "售卖中", value: "passed" },
  // { title: "已售卖", value: "sale" },
];


interface Props {
  state: any
}

function ListComponent(props: Props) {

  const [data, setData] = useState<ListData>({ list: [], total: 0 });
  const pageRef = useRef(1);
  const [loading, setLoading] = useState(true);
  const [infiniteLoading, setInfiniteLoading] = useState(true);



  useEffect(()=>{
    queryMySale()
  },[])




  const queryMySale = () => {
    api.flow.myShare({
            audit_status: props.state,
            page: pageRef.current,
            size: 10,
            sort: {
              updated_at: 0
            }
        }).then((res: any) => {
            // if (res?.status === 200 && res?.data?.code === 200) {
            //     const { data } = res.data
            //     setDiscover(state => ({
            //         list: [...state.list, ...data.items],
            //         total: data.count
            //     }))
            //     pageRef.current++

            // }
        })
        .finally(() => {
            setInfiniteLoading(false)
            setLoading(false)
        })

}



  const onScrollToLower = () => {};

  return (
    <>
      <List
        finished={data.list.length >= data.total}
        autoCheck={false}
        loading={loading}
        onLoad={onScrollToLower}
      ></List>
      <ListState
        isEmpty={!data.total}
        hasNextPage={loading}
        infiniteLoading={infiniteLoading}
        emptyLabel={"还没有此类售卖数据"}
      />
    </>
  );
}

function FlowSale() {
  const [currentStateInfo, setCurrentStateInfo] = useState({
    current: 0,
    currentState: tabs[0].value,
  });

  return (
    <View className={styles.flow_sale}>
      <NavigationBar back color="#fff" title="售卖管理" background="#1C1134" />
      <Tabs
        tabList={tabs}
        currentStateInfo={currentStateInfo}
        setCurrentStateInfo={setCurrentStateInfo}
      >
        {tabs.map((item, index) => (
          <AtTabsPane key={index} current={currentStateInfo.current} index={index}>
            <ListComponent state={item.value} />
          </AtTabsPane>
        ))}
      </Tabs>
    </View>
  );
}

export default FlowSale;
