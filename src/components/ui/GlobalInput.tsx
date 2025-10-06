// components/common/GlobalInput.tsx
import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../constants/colors';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  secureTextEntry?: boolean;
  autoCorrect?: boolean;
  error?: string;
}

/**
 * @component GlobalInput
 * @description A reusable input component with consistent styling across the app.
 * Displays a label, optional error message, and highlights the border in case of error.
 *
 * @props
 * @prop {string} label - Label text above the input.
 * @prop {string} value - The current value of the input field (controlled).
 * @prop {(text: string) => void} onChangeText - Callback executed when the text changes.
 * @prop {string} [placeholder] - Optional placeholder text to display when input is empty.
 * @prop {boolean} [secureTextEntry=false] - If true, masks the input (for passwords).
 * @prop {boolean} [autoCorrect=false] - Enable/disable autocorrect.
 * @prop {string} [error] - Error message to display below the input.
 *
 * @example
 * <GlobalInput
 *   label="Email"
 *   value={email}
 *   onChangeText={setEmail}
 *   placeholder="Enter your email"
 *   error={emailError}
 * />
 */
const GlobalInput: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  secureTextEntry = false,
  autoCorrect = false,
  error,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={colors.foregroundMuted}
        style={[styles.input, error && { borderColor: colors.error }]}
        autoCapitalize="none"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default GlobalInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: colors.foregroundMuted,
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.input,
    color: colors.foreground,
    width: '100%',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 3,
  },
});
