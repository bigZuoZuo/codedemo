import {View, Image, Text} from '@tarojs/components'
import {FC} from '@tarojs/taro'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {useObserver} from 'mobx-react'
import copyIcon from "@/assets/copy-wallet.jpg"
import ArrowIcon from "@/assets/right-arrow.png"
import styles from './index.module.scss'
import {useStore} from '@/store'
import Taro from '@tarojs/taro'

const WalletPage: FC = () => {
  const store = useStore()

  return useObserver(() => {

    const handleZswAccount = () => {
        if(!store.state.zswAccount){
            Taro.navigateTo({url:"pages/third-auth/index"})
        }
    }

    const copy = (content:string) => {
        if(!content) {
            Taro.showToast({title:"暂无内容复制"})
        } else {
            Taro.setClipboardData({
                data: content || '',
                success: function () {
                  Taro.showToast({
                    title: '复制成功',
                    icon: 'success',
                    duration: 2000,
                  })
                },
              })
        }
        
    }

    return (
        <View className={styles.wallet_page} >
        <NavigationBar back title="钱包地址" />
        <View className={styles.address_box} >
            <View className={styles.item} >
                <Text>区块链</Text>
                <View>
                    <Text className={styles.address} >{store.state.account}</Text>
                    <Image onClick={()=>copy(store.state.account)} src={copyIcon} className={styles.icon} />
                </View>
            </View>
            <View className={styles.item} >
                <Text>国版链</Text>
                <View onClick={handleZswAccount}>
                    <Text className={styles.address} >
                        {
                            store.state.zswAccount || "去授权"
                        }
                    </Text>
                    <Image 
                        onClick={(e)=>{
                            e.stopPropagation();
                            if(store.state.zswAccount){
                                copy(store.state.zswAccount);
                            } else {
                                handleZswAccount()
                            }
                        }}  
                        src={!store.state.zswAccount? ArrowIcon : copyIcon} 
                        className={styles.icon} />
                </View>
            </View>
        </View>
    </View>
    )
  })
}

export default WalletPage
