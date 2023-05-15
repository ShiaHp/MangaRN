import { Text, View } from "react-native";
import React, { useState } from "react";
import { withTheme, TextInput, Button } from "react-native-paper";
import Style from "./Style";
import axios from "axios";
const register = async (username, password) => {
    await axios.post("http://localhost:3033/api/v1/users/register", {
        email: username,
        password: password,
    });
};
// FIX TODO: STORE INFORMATION USER TO REDUX

function RegisterView({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const style = Style()
    return (
        <View style={style.flexContainer}>
            <Text style={style.logoText}>KomicBook</Text>
            <View>
                <Text style={style.headerText}>Register</Text>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    placeholder='Your username'
                    left={<TextInput.Icon icon='account' />}
                    onChangeText={text => setUsername(text)}
                ></TextInput>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    secureTextEntry={true}
                    placeholder='Your password'
                    left={<TextInput.Icon icon='lock' />}
                    onChangeText={text => setPassword(text)}
                ></TextInput>
                <TextInput
                    style={style.input}
                    mode='outlined'
                    secureTextEntry={true}
                    placeholder='Retype your password'
                    left={<TextInput.Icon icon='lock' />}
                ></TextInput>
                {/* <Text style={style.forgotText} >Forgot your password?</Text> */}
                <Button mode='contained' style={style.button} onPress={() => register(username, password)}>
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
