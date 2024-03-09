import Taro, { Component } from '@tarojs/taro';
import { View, Block, Text, Image } from '@tarojs/components'
import { inspectDetails, QuestionImg } from '../../service/patrolReport'
import './inspectList.scss'
import { rootConstructionSourceBaseUrl } from '@common/utils/requests'
import { get, chunk } from 'lodash';

const brg_img = `${rootConstructionSourceBaseUrl}/assets/pages/work/brg.png`
const success = `${rootConstructionSourceBaseUrl}/assets/pages/work/success.png`
const warning = `${rootConstructionSourceBaseUrl}/assets/pages/work/warning.png`

interface MyProps {

}

interface MyState {
    data1: any
    data2: any
    inspectListData: any
}

class Index extends Component<MyProps, MyState> {

    constructor(props) {
        super(props)
        this.state = {
            data1: [],
            data2: [],
            inspectListData: {}

        }
    }

    componentDidMount() {
        this.getInitData()
    }

    getInitData = async () => {
        const { data1, data2 } = this.state
        const id = Number(this.$router.params.inspectId)
        const resp = await inspectDetails(id)

        this.setState({
            inspectListData: resp.data
        })

        resp.data.patrolItems.forEach(element => {
            if (element.status === 'NORMAL') {
                data1.push(element)
            } else {
                data2.push(element)
            }
        });

        this.setState({
            data1,
            data2
        })
    }

    config = {
        navigationBarTitleText: '巡查清单详情'
    };


    showBigImage(urls: string[]) {
        Taro.previewImage({
            urls: urls
        })
    }

    render() {
        const { data1, data2, inspectListData } = this.state
        const appendData =  get(inspectListData,'appendData',[])
        return (
            <View className="page">
                <View className="brg_image">
                    <Image src={brg_img} className="img1"></Image>
                </View>
                <View className="page_container">
                    <View className="page_header">
                        <Text className="txt1">{inspectListData.pollutionSourceName}</Text>
                        {
                            chunk(appendData, 2).map((itemGroup, groupIndex) => (
                                <View key={groupIndex} className='group-list'>
                                    {
                                        itemGroup.map((itemList: any, index) => (
                                            <View className='list-item' key={index}>
                                                <Text className="label">{itemList.targetName}：{itemList.valueName}</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                            ))
                        }
                    </View>
           
                    {
                        data2.map((item, index) => {
                            //@ts-ignore
                            const currentItem = get(item, 'options', []).find(it => it.optionCode === item.optionLevel)
                            return (
                                <View className="inspect_problem">

                                    <View className={`inspect_box ${index !== data1.length - 1 ? "item_border" : ""}`} key={item.id}>
                                        <View>
                                            <Image src={QuestionImg[currentItem.icon] || currentItem.customIcon} className="img2"></Image>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text className="txt3">{item.labelDetails || ''}</Text>
                                            <View className="image_list">
                                                {
                                                    item.pictureLinks.map((element, i) => {
                                                        return (
                                                            <Image src={element} className="img3" key={i} onClick={this.showBigImage.bind(this, item.pictureLinks)} />
                                                        )
                                                    })
                                                }
                                            </View>
                                            <Text className='txt4'>描述：{item.checkItemContent || '--'}</Text>
                                        </View>
                                    </View>
                                </View>

                            )
                        })

                    }
                             {
                        <View className="problem_resovle">
                            {
                                data1.map((item, index) => {
                                    //@ts-ignore
                                    const currentItem = get(item, 'options', []).find(it => it.optionCode === item.optionLevel)
                                    return (
                                        <View className={`resovle_box ${index !== data2.length - 1 ? "item_border" : ""}`} key={item.id}>
                                            <View>
                                                <Image src={QuestionImg[currentItem.icon] || currentItem.customIcon} className="img2"></Image>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text className="txt3">{item.labelDetails || ''}</Text>
                                                <View className="image_list">
                                                    {
                                                        item.pictureLinks.map((element, i) => {
                                                            return (
                                                                <Image src={element} className="img3" key={i} onClick={this.showBigImage.bind(this, item.pictureLinks)} />
                                                            )
                                                        })
                                                    }
                                                </View>
                                                <Text className='txt4'>描述：{item.checkItemContent || '--'}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }

                        </View>



                    }

                </View>
            </View>
        );
    }
}
export default Index