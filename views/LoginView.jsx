import { Pressable, Text, View } from "react-native";
import { useState } from 'react';
import { withTheme, TextInput, Button } from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
import { login, getUser } from '../redux/reducer/user';
import Style from "./Style"

function LoginView({ navigation }) {
    const [email,setEmail] = useState('test@123.com')
    const [password, setPassword] = useState('123456')
    const dispatch = useDispatch()
    const style = Style()
    const onLoginPressed = ()=>{
        dispatch(login({email,password}))

    }
    return (
        <View style={style.flexContainer}>
            <Text style={style.logoText}>KomicBook</Text>
            <View>
                <Text style={loginStyle().headerText}>Login</Text>
                <TextInput
                    style={loginStyle().input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Email"
                    left={<TextInput.Icon icon="account" />}
                ></TextInput>
                <TextInput
                    style={loginStyle().input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Password"
                    left={<TextInput.Icon icon="lock" />}
                ></TextInput>
                <Text style={loginStyle().forgotText}>Forgot your password?</Text>
                <Button mode="contained">Login</Button>
                <Button
                    mode="outlined"
                    style={loginStyle().button}
                    onPress={() => navigation.navigate("Register")}
                >
                    Register
                </Button>
                <Pressable>
                    <Text style={loginStyle().guestText} onPress={() => navigation.navigate("Home")}>Join As Guest</Text>
                </Pressable>
            </View>
        </View>
    );
}
export default LoginView;
