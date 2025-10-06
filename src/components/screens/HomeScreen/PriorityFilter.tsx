import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../../constants/colors';

const priorities = [
  { label: 'High', emoji: '🔥' },
  { label: 'Medium', emoji: '⚡' },
  { label: 'Low', emoji: '🌱' },
];

const PriorityFilter = ({
  onSelect,
}: {
  onSelect?: (priority: string) => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePress = (priority: string) => {
    const newValue = selected === priority ? null : priority;
    setSelected(newValue);
    if (onSelect) onSelect(newValue || '');
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {priorities.map((item, index) => (
          <Pressable
            key={index}
            style={[
              styles.bubble,
              selected === item.label && styles.bubbleSelected,
            ]}
            onPress={() => handlePress(item.label)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.label,
                selected === item.label && styles.labelSelected,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default PriorityFilter;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    marginHorizontal: 6,
    borderColor: colors.border,
    borderWidth: 0.5,
  },
  bubbleSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    borderWidth: 0.5,
  },
  emoji: {
    fontSize: 10,
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  labelSelected: {
    color: colors.secondaryForeground,
    fontWeight: 'bold',
  },
});
