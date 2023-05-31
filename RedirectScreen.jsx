import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import {
  HomeView,
  LoginView,
  RegisterView,
  DetailView,
  ReadView,
  SearchView,
} from "./views";
import { getUserFromAsyncStore } from "./redux/reducer/user";
import { getReadListFromStore } from "./redux/reducer/manga";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { storeData } from "./features/asyncStorage";
import { useMemo } from "react";
const Stack = createNativeStackNavigator();
const RedirectScreen = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserFromAsyncStore());
    // dispatch(getReadListFromStore());
    // storeData('readList', null);
  }, []);
  useMemo(() => {
    if (user) dispatch(getReadListFromStore());
  }, [user]);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* {user ? ( */}
            <>
              <Stack.Screen name="Home" component={HomeView} />
              <Stack.Screen name="Search" component={SearchView} />
              <Stack.Screen name="Detail" component={DetailView} />
              <Stack.Screen name="Reader" component={ReadView} />
            </>
          {/* ) : ( */}
            <>
              <Stack.Screen name="Login" component={LoginView} />
              <Stack.Screen name="Register" component={RegisterView} />
            </>
          {/* )} */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RedirectScreen;
