import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../../constants/colors';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export const renderTask = ({ item }: any) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => {
      console.log('This is teh ID: ', item._id);
    }}
  >
    <TouchableOpacity style={styles.checkbox}>
      {item.completed ? (
        <MaterialIcons name="radio-button-checked" size={25} color="#d3f809" />
      ) : (
        <MaterialIcons
          name="radio-button-unchecked"
          size={25}
          color="#d3f809"
        />
      )}
    </TouchableOpacity>

    <View style={styles.info}>
      <Text
        style={[
          styles.name,
          item.completed && {
            textDecorationLine: 'line-through',
            color: colors.foregroundMuted,
          },
        ]}
      >
        {item.name}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.cardForeground,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 50,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cardForeground,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    marginLeft: 4,
    color: colors.foregroundSecondary,
  },
});
