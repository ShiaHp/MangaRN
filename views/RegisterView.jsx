import { Text, View } from "react-native";
import { withTheme, TextInput, Button } from "react-native-paper";
import { loginStyle } from "./Style";

function RegisterView({ navigation }) {
    return (
        <View style={loginStyle().container}>
            <Text style={loginStyle().logoText}>KomicBook</Text>
            <View>
                <Text style={loginStyle().headerText}>Register</Text>
                <TextInput
                    style={loginStyle().input}
                    mode='flat'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    placeholder='Your username'
                    left={<TextInput.Icon icon='account' />}
                ></TextInput>
                <TextInput
                    style={loginStyle().input}
                    mode='flat'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    placeholder='Your password'
                    left={<TextInput.Icon icon='lock' />}
                ></TextInput>
                <TextInput
                    style={loginStyle().input}
                    mode='flat'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    placeholder='Retype your password'
                    left={<TextInput.Icon icon='lock' />}
                ></TextInput>
                {/* <Text style={loginStyle().forgotText} >Forgot your password?</Text> */}
                <Button mode='contained' style={loginStyle().button}>
                    Register
                </Button>
                <Button
                    mode='outlined'
                    style={loginStyle().button}
                    onPress={() => navigation.goBack()}
                >
                    Back to login
                </Button>
                {/* <Text style={loginStyle().guestText}>Join As Guest</Text> */}
            </View>
        </View>
    );
}
export default withTheme(RegisterView);
