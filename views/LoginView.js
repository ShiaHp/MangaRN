import { StyleSheet, Text, View } from 'react-native';
import { withTheme, TextInput, Button } from 'react-native-paper'



function LoginView({ theme }) {
    const style = StyleSheet.create({
        input: {
            borderRadius: 5,
            width : 300,
            backgroundColor: theme.colors.neuralVariant,
            color: theme.colors.onSurfaceVariant,
            marginTop : 10,
        },
        headerText : {
            color : '#fff',
            fontWeight : 700,
            fontSize : 26,
            marginTop : 30,
        },
        logoText : {
            color : theme.colors.primary,
            fontWeight : 900,
            fontSize : 40,
            marginBottom : 40,
        },
        forgotText : {
            color : theme.colors.secondary,
            marginVertical : 10
        },
        guessText : {
            textDecorationLine : 'underline',
            color : theme.colors.secondary,
            textAlign : 'center',
            marginTop : 20
        }
    })
    return (
        <View>
            <Text style={style.logoText}>KomicBook</Text>
            <View>
                <Text style={style.headerText}>Sign In</Text>
                <TextInput style={style.input} mode='flat' underlineColor='transparent' activeUnderlineColor='transparent' placeholder='Username' left={<TextInput.Icon icon='account' />}></TextInput>
                <TextInput style={style.input} mode='flat' underlineColor='transparent' activeUnderlineColor='transparent' placeholder='Password' left={<TextInput.Icon icon='lock' />}></TextInput>
                <Text style={style.forgotText} >Forgot your password?</Text>
                <Button mode='contained'>Login</Button>
                <Button mode='outlined' style={{marginVertical : 10}}>Sign Up</Button>
                <Text style={style.guessText}>Join As Guess</Text>
            </View>
        </View>
    )
}
export default withTheme(LoginView)