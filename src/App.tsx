import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { store } from './redux/store';
import Toast from 'react-native-toast-message';
import { loadUserFromStorage } from './redux/slice/user/AuthSlice';
import { toastConfig } from './components/ui/Toast';

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.user);

  const [checkingStorage, setCheckingStorage] = useState(true);

  useEffect(() => {
    const init = async () => {
      await dispatch(loadUserFromStorage());
      setCheckingStorage(false);
    };
    init();
  }, [dispatch]);

  if (checkingStorage) {
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => (
  <Provider store={store}>
    <RootNavigator />
    <Toast config={toastConfig} />
  </Provider>
);

export default App;
