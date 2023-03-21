// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
const storeData = async(name,value)=>{
    try {
        const jsonValue = JSON.stringify(value)
        await SecureStore.setItemAsync(name,jsonValue)
    } catch (error) {
        console.log(error);
    }
}   

const getData = async(name)=>{
    try {
        const value = await SecureStore.getItemAsync(name)
        return (value != null)? JSON.parse(value): null
    } catch (error) {
        console.log(error);
    }
}

export {storeData, getData}