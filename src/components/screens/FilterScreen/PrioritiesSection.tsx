import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../constants/colors';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  fetchPriorities,
  createPriority,
  deletePriority,
} from '../../../redux/slice/task/PrioritySlice';
import GlobalButton from '../../ui/GlobalButton';
import GlobalModal from '../../ui/GlobalModal';
import GlobalInput from '../../ui/GlobalInput';
import Feather from '@react-native-vector-icons/feather';
import Ionicons from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message';
import { Priority } from '../../../types/task';

const PrioritiesSection = () => {
  const dispatch = useAppDispatch();
  const { priorities, loading } = useAppSelector(state => state.priority);
  const [priorityData, setPriorityData] = useState({
    name: '',
    color: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(
    null,
  );

  const availableColors = [
    '#f74242',
    '#1cfbad',
    '#1a8afa',
    '#f8f8f8',
    '#d27cf7',
    '#fa9828',
    '#f7d61b',
    '#f750b7',
  ];

  const modalToggle = () => {
    setModalVisible(prev => !prev);
    if (modalVisible) {
      setPriorityData({
        name: '',
        color: '',
      });
    }
  };

  const deleteModalToggle = () => {
    setDeleteModalVisible(prev => !prev);
    if (!deleteModalVisible) {
      setSelectedPriorityId(null);
    }
  };

  useEffect(() => {
    dispatch(fetchPriorities());
  }, [dispatch]);

  const handleSavePriority = async () => {
    if (!priorityData.name) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Priority name is required',
      });
      return;
    }
    if (!priorityData.color) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Priority color is required',
      });
      return;
    }

    try {
      await dispatch(createPriority(priorityData)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Priority Created',
        text2: `${priorityData.name} has been added`,
      });
      modalToggle();
    } catch (err) {
      console.error('Failed to create priority', err);
      Toast.show({
        type: 'error',
        text1: 'Creating Priority Failed',
        text2: 'An error occurred while creating the priority',
      });
    }
  };

  const handleDeletePriority = async () => {
    if (!selectedPriorityId) return;

    try {
      await dispatch(deletePriority(selectedPriorityId)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Priority Deleted',
        text2: 'The priority has been deleted',
      });
      deleteModalToggle();
    } catch (err) {
      console.error('Failed to delete priority', err);
      Toast.show({
        type: 'error',
        text1: 'Deleting Priority Failed',
        text2: 'An error occurred while deleting the priority',
      });
    }
  };

  const handleLongPress = (item: Priority) => {
    setSelectedPriorityId(item._id);
    deleteModalToggle();
  };

  const renderPriorityItem = ({ item }: { item: Priority }) => (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => handleLongPress(item)}
    >
      <Ionicons name="flag-sharp" size={30} color={item.color[0]} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.box}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Priorities</Text>
        <GlobalButton variant="primary" size="sm" onPress={modalToggle}>
          <Feather name="plus" size={22} />
        </GlobalButton>
      </View>
      <FlatList // Changed to FlatList for internal scrolling
        data={priorities}
        keyExtractor={item => item._id || ''}
        renderItem={renderPriorityItem}
        contentContainerStyle={styles.wrapContainer}
        style={styles.container}
      />

      <GlobalModal
        header="Add New Priority"
        description="Fill out the priority details below"
        visible={modalVisible}
        onClose={modalToggle}
      >
        {/* Priority Name */}
        <GlobalInput
          label="Priority Name"
          placeholder="High"
          value={priorityData.name}
          onChangeText={text =>
            setPriorityData(prev => ({ ...prev, name: text }))
          }
        />

        {/* Color Selection */}
        <View style={{ marginVertical: 2, width: '100%' }}>
          <Text style={styles.label}>Select Color</Text>
          <View style={styles.colorGrid}>
            {availableColors.map(col => (
              <TouchableOpacity
                key={col}
                onPress={() =>
                  setPriorityData(prev => ({ ...prev, color: col }))
                }
              >
                <View
                  style={[
                    styles.colorCircle,
                    { backgroundColor: col },
                    priorityData.color === col && styles.selectedColor,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <GlobalButton
            title="Cancel"
            onPress={modalToggle}
            variant="secondary"
            size="sm"
          />
          <GlobalButton
            title={loading ? 'Saving...' : 'Save Priority'}
            onPress={handleSavePriority}
            variant="primary"
            size="sm"
          />
        </View>
      </GlobalModal>

      <GlobalModal
        header="Delete Priority"
        description="Are you sure you want to delete this priority?"
        visible={deleteModalVisible}
        onClose={deleteModalToggle}
      >
        <View style={styles.footer}>
          <GlobalButton
            title="No"
            onPress={deleteModalToggle}
            variant="secondary"
            size="sm"
          />
          <GlobalButton
            title={loading ? 'Deleting...' : 'Yes, Delete'}
            onPress={handleDeletePriority}
            variant="primary"
            size="sm"
          />
        </View>
      </GlobalModal>
    </View>
  );
};

export default PrioritiesSection;

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.background,
    padding: 5,
    gap: 10,
  },
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
  container: {
    backgroundColor: colors.background,
    height: '50%',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    width: 80,
    height: 80,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.cardForeground,
    marginTop: 5,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.foregroundMuted,
    marginBottom: 5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.input,
    width: '100%',
  },
  colorCircle: {
    width: 15,
    height: 15,
    borderRadius: 20,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
});
