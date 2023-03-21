import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { LoginView, RegisterView } from "./views";  
import { getUserFromAsyncStore } from "./redux/reducer/user";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
const RedirectScreen = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserFromAsyncStore());
  }, []); 
  return ( 
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="register" component={RegisterView} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginView} />
              {/* <Stack.Screen name="Register" component={RegisterView} /> */}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RedirectScreen;
