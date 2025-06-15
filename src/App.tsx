import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DivinationScreen from './screens/DivinationScreen';
import WaruikoScreen from './screens/WaruikoScreen';
import WriteNoteScreen from './screens/WriteNoteScreen';
import NotesHistoryScreen from './screens/NotesHistoryScreen';
import PurificationScreen from './screens/PurificationScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import StarSanctuary from './screens/StarSanctuary';

const Stack = createStackNavigator();

// メインアプリコンポーネント
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Home" component={OnboardingScreen} />
        <Stack.Screen name="StarSanctuary" component={StarSanctuary} />
        <Stack.Screen name="Divination" component={DivinationScreen} />
        <Stack.Screen name="Waruiko" component={WaruikoScreen} />
        <Stack.Screen name="WriteNote" component={WriteNoteScreen} />
        <Stack.Screen name="NotesHistory" component={NotesHistoryScreen} />
        <Stack.Screen name="Purification" component={PurificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


