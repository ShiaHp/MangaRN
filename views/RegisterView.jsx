import { Text, View } from "react-native";
import React, { useState } from "react";
import { withTheme, TextInput, Button } from "react-native-paper";
import Style from "./Style";
import axios from "axios";
import { register } from "../redux/reducer/user";
import { useDispatch } from "react-redux";
// FIX TODO: STORE INFORMATION USER TO REDUX

function RegisterView({ navigation }) {
    const dispatch = useDispatch()
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [repPassword, setRepPassword] = useState(null)
    const style = Style()

    const onRegisterPressed = ()=>{
        console.log({username,password,repPassword});
        if(password === repPassword) dispatch(register({email : username, password : password}))
    }

    return (
        <View style={style.flexContainer}>
            <Text style={style.logoText}>KomicBook</Text>
            <View>
                <Text style={style.headerText}>Register</Text>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    placeholder='Your username'
                    value={username}
                    left={<TextInput.Icon icon='account' />}
                    onChangeText={text => setUsername(text)}
                ></TextInput>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    secureTextEntry={true}
                    value={password}
                    placeholder='Your password'
                    left={<TextInput.Icon icon='lock' />}
                    onChangeText={text => setPassword(text)}
                ></TextInput>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    secureTextEntry={true}
                    placeholder='Retype your password'
                    value={repPassword}
                    left={<TextInput.Icon icon='lock' />}
                    onChangeText={text => setRepPassword(text)}
                ></TextInput>
                {/* <Text style={style.forgotText} >Forgot your password?</Text> */}
                <Button mode='contained' style={style.button} onPress={onRegisterPressed}>
                    Register
                </Button>
                <Button
                    mode='outlined'
                    style={style.button}
                    onPress={() => navigation.goBack()}
                >
                    Back to login
                </Button>
                {/* <Text style={style.guestText}>Join As Guest</Text> */}
            </View>
        </View>
    );
}
export default withTheme(RegisterView);
