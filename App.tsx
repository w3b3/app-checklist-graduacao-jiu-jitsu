import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { HomeScreen } from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ListSelectorScreen from './src/screens/ListSelectorScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  ListSelector: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                headerTitle: 'Entrar',
              }}
            />
            <Stack.Screen
              name="ListSelector"
              component={ListSelectorScreen}
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
