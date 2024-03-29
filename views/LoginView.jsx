import { Pressable, Text, View } from "react-native";
import { useState } from 'react';
import { withTheme, TextInput, Button } from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/reducer/user';
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
                <Text style={style.headerText}>Login</Text>
                <TextInput
                    style={style.input}
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    placeholder="Email"
                    left={<TextInput.Icon icon="account" />}
                ></TextInput>
                <TextInput
                    style={style.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    mode="outlined"
                    placeholder="Password"
                    left={<TextInput.Icon icon="lock" />}
                ></TextInput>
               
               <Button style={{ marginTop: 10 }} mode="contained" onPress={() => onLoginPressed()}>Login</Button>
                <Button
                    mode="outlined"
                    style={style.button}
                    onPress={() => navigation.navigate("Register")}
                >
                    Register
                </Button>
                <Pressable>
                    <Text style={style.guestText} onPress={() => navigation.navigate("")}>Join As Guest</Text>
                </Pressable>
            </View>
        </View>
    );
}
export default withTheme(LoginView);


