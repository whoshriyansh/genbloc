import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'logo';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * @component GlobalButton
 *
 * @description A reusable button with support for size, variant, and optional icons.
 *
 * @props
 * @prop {string} [title] - Text to display inside the button.
 * @prop {() => void} onPress - Function to execute when button is pressed.
 * @prop {'primary' | 'secondary' | 'logo'} [variant='primary'] - Button style.
 * @prop {'sm' | 'md' | 'lg'} [size='md'] - Button size (padding and radius).
 * @prop {boolean} [disabled=false] - Whether the button is disabled.
 * @prop {React.ReactNode} [children] - Optional icon or custom content.
 *
 * @example
 * <GlobalButton
 *   title="Login"
 *   onPress={handleLogin}
 *   variant="primary"
 *   size="lg"
 * />
 *
 * <GlobalButton
 *   onPress={handleGoogle}
 *   variant="logo"
 *   size="sm"
 * >
 *   <GoogleIcon />
 * </GlobalButton>
 */
const GlobalButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  children,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        disabled && styles.disabled,
      ]}
      disabled={disabled}
    >
      {children}
      {title && <Text style={[styles.text, textStyles[variant]]}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default GlobalButton;

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '600', fontSize: 14 },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.foreground },
  logo: {
    backgroundColor: colors.primary,
  },
});

const textStyles = StyleSheet.create({
  primary: { color: colors.primaryForeground },
  secondary: { color: colors.secondaryForeground },
  logo: { color: colors.primaryForeground },
});
