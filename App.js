import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider } from 'react-redux';
import {
  Files,
  Home,
  Login,
  PasswordRecoveryOne,
  PasswordRecoveryTwo,
  Profile,
  RegistrationOne,
  RegistrationTwo,
  Subcategories,
  Types,
} from './screens';
import { store } from './store';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Home'}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Subcategories" component={Subcategories} />
          <Stack.Screen name="Types" component={Types} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="RegistrationOne" component={RegistrationOne} />
          <Stack.Screen name="RegistrationTwo" component={RegistrationTwo} />
          <Stack.Screen name="Files" component={Files} />
          <Stack.Screen
            name="PasswordRecoveryOne"
            component={PasswordRecoveryOne}
          />
          <Stack.Screen
            name="PasswordRecoveryTwo"
            component={PasswordRecoveryTwo}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
