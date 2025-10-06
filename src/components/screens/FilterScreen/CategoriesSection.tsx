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
  fetchCategories,
  createCategory,
  deleteCategory,
} from '../../../redux/slice/task/CategorySlice';
import GlobalButton from '../../ui/GlobalButton';
import GlobalModal from '../../ui/GlobalModal';
import GlobalInput from '../../ui/GlobalInput';
import Feather from '@react-native-vector-icons/feather';
import Toast from 'react-native-toast-message';
import { Category } from '../../../types/task';

const CategoriesSection = () => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector(state => state.category);
  const [categoryData, setCategoryData] = useState({
    name: '',
    emoji: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const modalToggle = () => {
    setModalVisible(prev => !prev);
    if (modalVisible) {
      setCategoryData({
        name: '',
        emoji: '',
      });
    }
  };

  const deleteModalToggle = () => {
    setDeleteModalVisible(prev => !prev);
    if (!deleteModalVisible) {
      setSelectedCategoryId(null);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSaveCategory = async () => {
    if (!categoryData.name) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Category name is required',
      });
      return;
    }

    try {
      await dispatch(createCategory(categoryData)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Category Created',
        text2: `${categoryData.name} has been added`,
      });
      modalToggle();
    } catch (err) {
      console.error('Failed to create category', err);
      Toast.show({
        type: 'error',
        text1: 'Creating Category Failed',
        text2: 'An error occurred while creating the category',
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;

    try {
      await dispatch(deleteCategory(selectedCategoryId)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Category Deleted',
        text2: 'The category has been deleted',
      });
      deleteModalToggle();
    } catch (err) {
      console.error('Failed to delete category', err);
      Toast.show({
        type: 'error',
        text1: 'Deleting Category Failed',
        text2: 'An error occurred while deleting the category',
      });
      deleteModalToggle();
    }
  };

  const handleLongPress = (item: Category) => {
    setSelectedCategoryId(item._id);
    deleteModalToggle();
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => handleLongPress(item)}
    >
      <Text style={styles.flag}>{item.emoji || '🏷️'}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.box}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <GlobalButton variant="primary" size="sm" onPress={modalToggle}>
          <Feather name="plus" size={22} />
        </GlobalButton>
      </View>
      <FlatList // Changed to FlatList for internal scrolling
        data={categories}
        keyExtractor={item => item._id || ''}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.wrapContainer}
        style={styles.container}
      />

      <GlobalModal
        header="Add New Category"
        description="Fill out the category details below"
        visible={modalVisible}
        onClose={modalToggle}
      >
        {/* Category Name */}
        <GlobalInput
          label="Category Name"
          placeholder="Work"
          value={categoryData.name}
          onChangeText={text =>
            setCategoryData(prev => ({ ...prev, name: text }))
          }
        />

        {/* Emoji (optional) */}
        <GlobalInput
          label="Emoji (optional)"
          placeholder="💼"
          value={categoryData.emoji}
          onChangeText={text =>
            setCategoryData(prev => ({ ...prev, emoji: text }))
          }
        />

        <View style={styles.footer}>
          <GlobalButton
            title="Cancel"
            onPress={modalToggle}
            variant="secondary"
            size="sm"
          />
          <GlobalButton
            title={loading ? 'Saving...' : 'Save Category'}
            onPress={handleSaveCategory}
            variant="primary"
            size="sm"
          />
        </View>
      </GlobalModal>

      <GlobalModal
        header="Delete Category"
        description="Are you sure you want to delete this category?"
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
            onPress={handleDeleteCategory}
            variant="primary"
            size="sm"
          />
        </View>
      </GlobalModal>
    </View>
  );
};

export default CategoriesSection;

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
  flag: {
    fontSize: 30,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cardForeground,
    marginTop: 5,
    textAlign: 'center',
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
});
