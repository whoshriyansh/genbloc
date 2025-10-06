import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { colors } from '../../../constants/colors';

const CategoryFilterBard = () => {
  return (
    <View>
      <ScrollView horizontal={true} style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.CardSymbol]}>😇</Text>
          <Text style={[styles.cardText]}>Shopping</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.CardSymbol]}>😇</Text>
          <Text style={[styles.cardText]}>Shopping</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.CardSymbol]}>😇</Text>
          <Text style={[styles.cardText]}>Shopping</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.CardSymbol]}>😇</Text>
          <Text style={[styles.cardText]}>Shopping</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.CardSymbol]}>😇</Text>
          <Text style={[styles.cardText]}>Shopping</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.CardSymbol]}>😇</Text>
          <Text style={[styles.cardText]}>Shopping</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryFilterBard;

const styles = StyleSheet.create({
  container: {},
  card: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    borderRadius: 8,
  },
  CardSymbol: {
    fontSize: 30,
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryForeground,
  },
});
