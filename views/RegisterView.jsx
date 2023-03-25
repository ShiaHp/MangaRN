import { Text, View } from "react-native";
import { withTheme, TextInput, Button } from "react-native-paper";
import Style from "./Style";

function RegisterView({ navigation }) {
    const style = Style()
    return (
        <View style={style.flexContainer}>
            <Text style={style.logoText}>KomicBook</Text>
            <View>
                <Text style={style.headerText}>Register</Text>
                <TextInput
                    style={style.input}
                    mode='flat'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    placeholder='Your username'
                    left={<TextInput.Icon icon='account' />}
                ></TextInput>
                <TextInput
                    style={style.input}
                    mode='flat'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    placeholder='Your password'
                    left={<TextInput.Icon icon='lock' />}
                ></TextInput>
                <TextInput
                    style={style.input}
                    mode='flat'
                    underlineColor='transparent'
                    activeUnderlineColor='transparent'
                    placeholder='Retype your password'
                    left={<TextInput.Icon icon='lock' />}
                ></TextInput>
                {/* <Text style={style.forgotText} >Forgot your password?</Text> */}
                <Button mode='contained' style={style.button}>
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
