import { StyleSheet, Text, View } from "react-native";
import { withTheme, TextInput, Button } from "react-native-paper";

function RegisterView({ theme, navigation }) {
    const style = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            alignItems: "center",
            justifyContent: "center",
        },
        input: {
            borderRadius: 5,
            width: 300,
            backgroundColor: theme.colors.neuralVariant,
            color: theme.colors.onSurfaceVariant,
            marginTop: 10,
        },
        button: {
            marginTop: 10,
        },
        headerText: {
            color: "#fff",
            fontWeight: 700,
            fontSize: 26,
            marginTop: 30,
        },
        logoText: {
            color: theme.colors.primary,
            fontWeight: 900,
            fontSize: 40,
            marginBottom: 40,
        },
        forgotText: {
            color: theme.colors.secondary,
            marginVertical: 10,
        },
        guestText: {
            textDecorationLine: "underline",
            color: theme.colors.secondary,
            textAlign: "center",
            marginTop: 20,
        },
    });
    return (
        <View style={style.container}>
            <Text style={style.logoText}>KomicBook</Text>
            <View>
                <Text style={style.headerText}>Register</Text>
                <TextInput
                    style={style.input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Your username"
                    left={<TextInput.Icon icon="account" />}
                ></TextInput>
                <TextInput
                    style={style.input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Your password"
                    left={<TextInput.Icon icon="lock" />}
                ></TextInput>
                <TextInput
                    style={style.input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Retype your password"
                    left={<TextInput.Icon icon="lock" />}
                ></TextInput>
                {/* <Text style={style.forgotText} >Forgot your password?</Text> */}
                <Button mode="contained" style={style.button}>
                    Register
                </Button>
                <Button
                    mode="outlined"
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
