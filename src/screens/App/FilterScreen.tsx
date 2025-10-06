import { StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoriesSection from '../../components/screens/FilterScreen/CategoriesSection';
import PrioritiesSection from '../../components/screens/FilterScreen/PrioritiesSection';

const FilterScreen = () => {
  return (
    <SafeAreaView style={styles.box}>
      <CategoriesSection />
      <PrioritiesSection />
    </SafeAreaView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 5,
    gap: 10,
  },
});
