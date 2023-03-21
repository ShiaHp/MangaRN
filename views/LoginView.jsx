import { Pressable, Text, View } from "react-native";
import { useState } from 'react';
import { withTheme, TextInput, Button } from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
import { login,getUser } from '../redux/reducer/user';
import style from "./Style"

function LoginView({ navigation }) {
    const [email,setEmail] = useState('test@123.com')
    const [password, setPassword] = useState('123456')
    const dispatch = useDispatch()
    const onLoginPressed = ()=>{
        dispatch(login({email,password}))

    }
    return (
        <View style={style(style).container}>
            <Text style={style(style).logoText}>KomicBook</Text>
            <View>
                <Text style={style(style).headerText}>Login</Text>
                <TextInput
                    style={style(style).input}
                    value={email}
                    onChangeText={setEmail}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Email"
                    left={<TextInput.Icon icon="account" />}
                ></TextInput>
                <TextInput
                    style={style(style).input}
                    value={password}
                    onChangeText={setPassword}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Password"
                    left={<TextInput.Icon icon="lock" />}
                ></TextInput>
                <Text style={style(style).forgotText}>Forgot your password?</Text>
                <Button mode="contained" onPress={()=>onLoginPressed()}>Login</Button>
                <Button
                    mode="outlined"
                    style={style(style).button}
                    onPress={() => navigation.navigate("Register")}
                >
                    Register
                </Button>
                <Pressable>
                    <Text style={style(style).guestText} onPress={() => navigation.navigate("Home")}>Join As Guest</Text>
                </Pressable>
            </View>
        </View>
    );
}
export default withTheme(LoginView);


