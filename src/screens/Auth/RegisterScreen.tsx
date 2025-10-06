// screens/Auth/RegisterScreen.tsx
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
import { registerUser } from '../../redux/slice/user/AuthSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import GlobalInput from '../../components/ui/GlobalInput';
import GlobalButton from '../../components/ui/GlobalButton';

type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});
  const dispatch = useAppDispatch();

  const handleRegister = () => {
    // TODO: Replace with proper validation schema
    const newErrors: typeof errors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch(registerUser({ username, email, password }));
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
            <Text style={styles.text}>Create Account</Text>
            <Text style={styles.headingText}>
              Please fill in the details to register
            </Text>

            {/* Username Input */}
            <GlobalInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              error={errors.username}
            />

            {/* Email Input */}
            <GlobalInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              error={errors.email}
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

            {/* Register Button */}
            <GlobalButton
              title="Register"
              onPress={handleRegister}
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

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Login
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
    height: 80,
    width: 80,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: colors.foregroundMuted,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
