import HomeScreen from '../screens/App/HomeScreen';
import TaskTimerScreen from '../screens/App/TaskTimerScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { colors } from '../constants/colors';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="TaskTimer" component={TaskTimerScreen} />
    </HomeStack.Navigator>
  );
};
