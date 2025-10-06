// HomeScreen.tsx
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../redux/slice/task/TaskSlice';
import GlobalButton from '../../components/ui/GlobalButton';
import GlobalModal from '../../components/ui/GlobalModal';
import GlobalInput from '../../components/ui/GlobalInput';
import Feather from '@react-native-vector-icons/feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { Category, Priority, Task } from '../../types/task';
import { fetchCategories } from '../../redux/slice/task/CategorySlice';
import { fetchPriorities } from '../../redux/slice/task/PrioritySlice';
import Ionicons from '@react-native-vector-icons/ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';

const ItemSeparator = () => <View style={styles.separator} />;

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector(state => state.task);
  const { categories } = useAppSelector(state => state.category);
  const { priorities } = useAppSelector(state => state.priority);
  const [taskData, setTaskData] = useState({
    name: '',
    dateTime: '',
    deadline: '',
    completed: false,
  });
  const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(
    null,
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [pickerType, setPickerType] = useState<
    'dateTime' | 'deadline' | 'dueDate' | null
  >(null);
  const [selectedFilterCategoryId, setSelectedFilterCategoryId] = useState<
    string | null
  >(null);
  const [selectedFilterPriorityId, setSelectedFilterPriorityId] = useState<
    string | null
  >(null);
  const [selectedDueDate, setSelectedDueDate] = useState<string | null>(null);
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchCategories());
    dispatch(fetchPriorities());
  }, [dispatch]);

  const applyFilters = () => {
    setFiltersApplied(
      !!selectedFilterCategoryId ||
        !!selectedFilterPriorityId ||
        !!selectedDueDate,
    );
    dispatch(
      fetchTasks({
        category: selectedFilterCategoryId || undefined,
        priority: selectedFilterPriorityId || undefined,
      }),
    );
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedFilterCategoryId(null);
    setSelectedFilterPriorityId(null);
    setSelectedDueDate(null);
    setFiltersApplied(false);
    dispatch(fetchTasks());
  };

  const modalToggle = () => {
    setModalVisible(prev => !prev);
    if (modalVisible) {
      setTaskData({
        name: '',
        dateTime: '',
        deadline: '',
        completed: false,
      });
      setSelectedPriorityId(null);
      setSelectedCategoryIds([]);
      setIsEditing(false);
      setSelectedTaskId(null);
    }
  };

  const showDatePicker = (type: 'dateTime' | 'deadline' | 'dueDate') => {
    setPickerType(type);
  };

  const hideDatePicker = () => {
    setPickerType(null);
  };

  const handleConfirm = (date: Date) => {
    if (pickerType === 'dateTime') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setTaskData(prev => ({ ...prev, dateTime: formattedDate }));
    } else if (pickerType === 'deadline') {
      const formattedDateTime = format(date, 'yyyy-MM-dd HH:mm');
      setTaskData(prev => ({ ...prev, deadline: formattedDateTime }));
    } else if (pickerType === 'dueDate') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setSelectedDueDate(formattedDate);
    }
    hideDatePicker();
  };

  const handleSaveTask = async () => {
    if (!taskData.name) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Task name is required',
      });
      return;
    }

    const payload = {
      ...taskData,
      priority: selectedPriorityId,
      category: selectedCategoryIds,
    };

    try {
      await dispatch(createTask(payload)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Task Created',
        text2: `${taskData.name} has been added`,
      });
      modalToggle();
    } catch (err) {
      console.error('Failed to create task', err);
      Toast.show({
        type: 'error',
        text1: 'Creating Task Failed',
        text2: 'An error occurred while creating the task',
      });
    }
  };

  const handleUpdateTask = async () => {
    if (!taskData.name) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Task name is required',
      });
      return;
    }

    if (!selectedTaskId) return;

    const updatedTask = {
      ...taskData,
      priority: selectedPriorityId,
      category: selectedCategoryIds,
    };

    try {
      await dispatch(updateTask({ id: selectedTaskId, updatedTask })).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Task Updated',
        text2: `${taskData.name} has been updated`,
      });
      modalToggle();
    } catch (err) {
      console.error('Failed to update task', err);
      Toast.show({
        type: 'error',
        text1: 'Updating Task Failed',
        text2: 'An error occurred while updating the task',
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;

    try {
      await dispatch(deleteTask(selectedTaskId)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Task Deleted',
        text2: 'The task has been deleted',
      });
      modalToggle();
    } catch (err) {
      console.error('Failed to delete task', err);
      Toast.show({
        type: 'error',
        text1: 'Deleting Task Failed',
        text2: 'An error occurred while deleting the task',
      });
    }
  };

  const handleEditTask = (item: Task) => {
    setIsEditing(true);
    setSelectedTaskId(item._id);
    setTaskData({
      name: item.name,
      dateTime: item.dateTime || '',
      deadline: item.deadline || '',
      completed: item.completed,
    });
    setSelectedPriorityId(item.priority?._id || null);
    setSelectedCategoryIds(
      item.category?.map(c => c._id).filter((id): id is string => !!id) || [],
    );
    setModalVisible(true);
  };

  const handleToggleComplete = (item: Task) => {
    dispatch(
      updateTask({ id: item._id, updatedTask: { completed: !item.completed } }),
    );
  };

  const toggleCategorySelection = (id: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id],
    );
  };

  const selectPriority = (id: string) => {
    setSelectedPriorityId(prev => (prev === id ? null : id));
  };

  const selectFilterCategory = (id: string) => {
    setSelectedFilterCategoryId(prev => (prev === id ? null : id));
  };

  const selectFilterPriority = (id: string) => {
    setSelectedFilterPriorityId(prev => (prev === id ? null : id));
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => handleEditTask(item)}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => handleToggleComplete(item)}
      >
        {item.completed ? (
          <MaterialIcons
            name="radio-button-checked"
            size={25}
            color="#d3f809"
          />
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
        <View style={styles.metaRow}>
          {item.priority && (
            <View style={styles.badge}>
              <Ionicons
                name="flag-sharp"
                size={16}
                color={item.priority.color}
              />
              <Text style={styles.badgeText}>{item.priority.name}</Text>
            </View>
          )}
          {item.category?.map(cat => (
            <View key={cat._id} style={styles.badge}>
              <Text style={styles.badgeText}>
                {cat.emoji || '🏷️'} {cat.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPriorityItem = ({ item }: { item: Priority }) => (
    <TouchableOpacity
      style={[
        modalStyles.priorityItem,
        selectedPriorityId === item._id && modalStyles.selectedItem,
      ]}
      onPress={() => selectPriority(item._id)}
    >
      <Ionicons name="flag-sharp" size={20} color={item.color} />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        modalStyles.categoryItem,
        selectedCategoryIds.includes(item._id) && modalStyles.selectedItem,
      ]}
      onPress={() => toggleCategorySelection(item._id)}
    >
      <Text style={modalStyles.itemEmoji}>{item.emoji || '🏷️'}</Text>
    </TouchableOpacity>
  );

  const renderFilterCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        modalStyles.categoryItem,
        selectedFilterCategoryId === item._id && modalStyles.selectedItem,
      ]}
      onPress={() => selectFilterCategory(item._id)}
    >
      <Text style={modalStyles.itemEmoji}>{item.emoji || '🏷️'}</Text>
      <Text style={modalStyles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFilterPriorityItem = ({ item }: { item: Priority }) => (
    <TouchableOpacity
      style={[
        modalStyles.priorityItem,
        selectedFilterPriorityId === item._id && modalStyles.selectedItem,
      ]}
      onPress={() => selectFilterPriority(item._id)}
    >
      <Ionicons name="flag-sharp" size={20} color={item.color} />
      <Text style={modalStyles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.box}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Inbox</Text>
        <GlobalButton
          variant="primary"
          size="sm"
          onPress={() => setFilterModalVisible(true)}
        >
          <Feather name="filter" size={22} />
        </GlobalButton>
      </View>
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.noTasksText}>Loading tasks...</Text>
        ) : tasks.length === 0 ? (
          <Text style={styles.noTasksText}>
            {filtersApplied
              ? 'No tasks available for these filters'
              : 'No tasks available'}
          </Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={item => item._id}
            renderItem={renderTaskItem}
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </View>
      <TouchableOpacity style={styles.fab} onPress={modalToggle}>
        <Feather name="plus" size={30} color={colors.background} />
      </TouchableOpacity>
      <GlobalModal
        header={isEditing ? 'Edit Task' : 'Add New Task'}
        description="Fill out the task details below"
        visible={modalVisible}
        onClose={modalToggle}
      >
        {/* Task Name */}
        <GlobalInput
          label="Task Name"
          placeholder="Finish Dishing"
          value={taskData.name}
          onChangeText={text => setTaskData(prev => ({ ...prev, name: text }))}
        />

        {/* Due Date (date only) */}
        <TouchableOpacity onPress={() => showDatePicker('dateTime')}>
          <GlobalInput
            label="Due Date"
            placeholder="Select a date"
            value={taskData.dateTime}
            editable={false}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

        {/* Deadline (date + time) */}
        <TouchableOpacity onPress={() => showDatePicker('deadline')}>
          <GlobalInput
            label="Deadline"
            placeholder="Select date & time"
            value={taskData.deadline}
            editable={false}
            onChangeText={() => {}}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={pickerType !== null}
          mode={pickerType === 'deadline' ? 'datetime' : 'date'}
          date={
            pickerType === 'dateTime'
              ? taskData.dateTime
                ? new Date(taskData.dateTime)
                : new Date()
              : taskData.deadline
              ? new Date(taskData.deadline)
              : new Date()
          }
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* Priority Selection */}
        <Text style={modalStyles.label}>Select Priority</Text>
        <FlatList
          data={priorities}
          keyExtractor={item => item._id}
          renderItem={renderPriorityItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={modalStyles.list}
        />

        {/* Category Selection */}
        <Text style={modalStyles.label}>Select Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={item => item._id}
          renderItem={renderCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={modalStyles.list}
        />

        <View style={styles.footer}>
          {isEditing ? (
            <>
              <GlobalButton
                title="Delete"
                onPress={handleDeleteTask}
                variant="secondary"
                size="sm"
              />
              <GlobalButton
                title={loading ? 'Updating...' : 'Update Task'}
                onPress={handleUpdateTask}
                variant="primary"
                size="sm"
              />
            </>
          ) : (
            <>
              <GlobalButton
                title="Cancel"
                onPress={modalToggle}
                variant="secondary"
                size="sm"
              />
              <GlobalButton
                title={loading ? 'Saving...' : 'Save Task'}
                onPress={handleSaveTask}
                variant="primary"
                size="sm"
              />
            </>
          )}
        </View>
      </GlobalModal>
      <GlobalModal
        header="Filter Tasks"
        description="Select filters below"
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      >
        <Text style={modalStyles.label}>Select Priority</Text>
        <FlatList
          data={priorities}
          keyExtractor={item => item._id}
          renderItem={renderFilterPriorityItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={modalStyles.list}
        />

        <Text style={modalStyles.label}>Select Category</Text>
        <FlatList
          data={categories}
          keyExtractor={item => item._id}
          renderItem={renderFilterCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={modalStyles.list}
        />

        <View style={styles.footer}>
          <GlobalButton
            title="Clear"
            onPress={clearFilters}
            variant="secondary"
            size="sm"
          />
          <GlobalButton
            title="Apply"
            onPress={applyFilters}
            variant="primary"
            size="sm"
          />
        </View>
      </GlobalModal>
      <GlobalButton
        title="navigate"
        onPress={() => {
          navigation.navigate('TaskTimer');
        }}
        variant="primary"
        size="sm"
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  box: {
    flex: 1,
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
    flex: 1,
    backgroundColor: colors.background,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
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
  separator: {
    height: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.foregroundMuted,
    fontSize: 16,
  },
});

const modalStyles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.foregroundMuted,
    marginBottom: 5,
    marginTop: 10,
  },
  list: {
    width: '100%',
    marginBottom: 10,
  },
  priorityItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: colors.backgroundSecondary,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: colors.backgroundSecondary,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  itemText: {
    fontSize: 14,
    color: colors.foreground,
    marginLeft: 8,
  },
  itemEmoji: {
    fontSize: 18,
  },
});
