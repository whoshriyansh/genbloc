import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../constants/colors';

const TaskTimerScreen = () => {
  return (
    <View>
      <Text style={styles.headerTitle}>TaskTimerScreen</Text>
    </View>
  );
};

export default TaskTimerScreen;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.cardForeground,
  },
});
