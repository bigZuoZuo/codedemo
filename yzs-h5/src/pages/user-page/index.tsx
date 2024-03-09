import { api } from "@/api";
import NavigationBar from "@/components/navigation-bar/navigation-bar";
import { Image, Text, View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { useEffect, useState } from "react";
import UserList from "./components/UserList";
import styles from "./index.module.scss"

function UserPage(){

    const userId = useRouter().params?.userId

    const [userInfo,serUserInfo] = useState<any>(null)


    useEffect(()=>{
        getUserInfo()
    },[])

    const getUserInfo = () => {
        api.user.getUserInfo(userId!)
        .then(res=>{
            serUserInfo(res.data.data)
        })
    }

    return <View className={styles.user_page} >
            <NavigationBar  back isNoHome color="#fff" background="#1B1537" />
            <View className={styles.user_info} >
                <Image className={styles.avatar} src={userInfo?.avatar} />
                <View className={styles.info} >
                    <Text className={styles.nickname} >{userInfo?.nick_name}</Text>
                    <Text className={styles.phone} >{userInfo?.mobile}</Text>
                </View>
            </View>
            <UserList/>
    </View>
}

export default UserPage