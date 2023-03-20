import { Pressable, Text, View } from "react-native";
import { withTheme, TextInput, Button } from "react-native-paper";
import style from "./Style"

function LoginView({ navigation }) {
    return (
        <View style={style(style).container}>
            <Text style={style(style).logoText}>KomicBook</Text>
            <View>
                <Text style={style(style).headerText}>Login</Text>
                <TextInput
                    style={style(style).input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Username"
                    left={<TextInput.Icon icon="account" />}
                ></TextInput>
                <TextInput
                    style={style(style).input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Password"
                    left={<TextInput.Icon icon="lock" />}
                ></TextInput>
                <Text style={style(style).forgotText}>Forgot your password?</Text>
                <Button mode="contained">Login</Button>
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
