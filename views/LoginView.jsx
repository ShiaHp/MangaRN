import { Pressable, Text, View } from "react-native";
import { withTheme, TextInput, Button } from "react-native-paper";
import { loginStyle } from "./Style"

function LoginView({ navigation }) {
    return (
        <View style={loginStyle().container}>
            <Text style={loginStyle().logoText}>KomicBook</Text>
            <View>
                <Text style={loginStyle().headerText}>Login</Text>
                <TextInput
                    style={loginStyle().input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Username"
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
