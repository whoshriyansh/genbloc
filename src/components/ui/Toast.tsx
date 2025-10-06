// components/common/CustomToast.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';

interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  text1?: string;
  text2?: string;
}

const colorMap: Record<string, string> = {
  success: colors.success,
  error: colors.error,
  info: colors.info,
  warning: colors.warning,
};

const CustomToast: React.FC<ToastProps> = ({ type = 'info', text1, text2 }) => {
  return (
    <View style={[styles.container, { borderLeftColor: colorMap[type] }]}>
      <View style={styles.textContainer}>
        {text1 && (
          <Text style={[styles.text1, { color: colorMap[type] }]}>{text1}</Text>
        )}
        {text2 && (
          <Text style={[styles.text2, { color: colors.foregroundMuted }]}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CustomToast;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.card,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  text2: {
    fontSize: 12,
    marginTop: 2,
  },
});

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <CustomToast type="success" text1={text1} text2={text2} />
  ),
  error: ({ text1, text2 }: any) => (
    <CustomToast type="error" text1={text1} text2={text2} />
  ),
  info: ({ text1, text2 }: any) => (
    <CustomToast type="info" text1={text1} text2={text2} />
  ),
  warning: ({ text1, text2 }: any) => (
    <CustomToast type="warning" text1={text1} text2={text2} />
  ),
};
