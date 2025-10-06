// screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/slice/user/AuthSlice';
import { loginSchema } from '../../validation/AuthValidation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import GlobalInput from '../../components/ui/GlobalInput';
import GlobalButton from '../../components/ui/GlobalButton';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach(err => {
        if (err.path[0])
          fieldErrors[err.path[0] as 'email' | 'password'] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    dispatch(loginUser({ email, password }));
  };

  return (
    <SafeAreaView style={styles.box}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/genbloc.png')}
              style={styles.image}
            />
            <Text style={styles.headerText}>base 57</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.text}>Welcome!</Text>
            <Text style={styles.headingText}>
              Please choose the preferred way to login
            </Text>

            {/* Email Input */}
            <GlobalInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              error={errors.email}
              autoCorrect={false}
            />

            {/* Password Input */}
            <GlobalInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />

            {/* Login Button */}
            <GlobalButton
              title="Login"
              onPress={handleLogin}
              variant="primary"
            />

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Button */}
            <GlobalButton
              title="Continue with Google"
              onPress={() => {}}
              variant="secondary"
            />

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don’t have an account? </Text>
              <Text
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
              >
                Register
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
  headerText: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  form: {
    flex: 1,
    backgroundColor: colors.card,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'flex-start',
    gap: 10,
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  text: {
    color: colors.foreground,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headingText: {
    color: colors.foregroundMuted,
    fontSize: 14,
    fontWeight: 'normal',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.foregroundMuted,
    fontSize: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  registerText: {
    color: colors.foregroundMuted,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
