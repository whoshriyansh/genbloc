import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  logout,
  updateUser,
  deleteUser,
} from '../../redux/slice/user/AuthSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../types/navigation';
import GlobalModal from '../../components/ui/GlobalModal';
import GlobalInput from '../../components/ui/GlobalInput';
import Toast from 'react-native-toast-message';
import GlobalButton from '../../components/ui/GlobalButton';

type ProfileScreenProps = NativeStackScreenProps<AppStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(state => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });

  const handlePress = (action: string) => {
    if (action === 'Logout') {
      dispatch(logout());
      navigation.navigate('Login');
      return;
    } else if (action === 'Edit Profile') {
      setModalVisible(true);
    } else if (action === 'Delete Account') {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => dispatch(deleteUser()),
          },
        ],
      );
    }
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        username:
          userData.username !== user?.username ? userData.username : undefined,
        email: userData.email !== user?.email ? userData.email : undefined,
        password: userData.password || undefined,
      };
      if (Object.values(payload).every(val => val === undefined)) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Please change at least one field',
        });
        return;
      }
      await dispatch(updateUser(payload)).unwrap();
      setModalVisible(false);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'An error occurred while updating your profile',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: user?.avatar || 'https://i.pravatar.cc/150?img=12',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.username || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'No email'}</Text>
      </View>

      {/* Options List */}
      <View style={styles.list}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => handlePress('Edit Profile')}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={colors.foreground}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.description}>Update your personal details</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => handlePress('Logout')}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.foreground}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Logout</Text>
            <Text style={styles.description}>Click to Logout</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.listItem, styles.deleteItem]}
          onPress={() => handlePress('Delete Account')}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={colors.error}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: colors.error }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <GlobalModal
        header="Edit Profile"
        description="Update your personal details"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <GlobalInput
          label="Username"
          placeholder="Enter username"
          value={userData.username}
          onChangeText={text =>
            setUserData(prev => ({ ...prev, username: text }))
          }
        />
        <GlobalInput
          label="Email"
          placeholder="Enter email"
          value={userData.email}
          onChangeText={text => setUserData(prev => ({ ...prev, email: text }))}
        />
        <GlobalInput
          label="Password (optional)"
          placeholder="Enter new password"
          value={userData.password}
          onChangeText={text =>
            setUserData(prev => ({ ...prev, password: text }))
          }
          secureTextEntry
        />
        <View style={styles.footer}>
          <GlobalButton
            title="Cancel"
            onPress={() => setModalVisible(false)}
            variant="secondary"
            size="sm"
          />
          <GlobalButton
            title={loading ? 'Saving...' : 'Save'}
            onPress={handleSaveProfile}
            variant="primary"
            size="sm"
          />
        </View>
      </GlobalModal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.card,
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.foreground,
  },
  email: {
    fontSize: 14,
    color: colors.foregroundMuted,
    marginTop: 2,
  },
  list: {
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  textContainer: {
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
  },
  description: {
    fontSize: 13,
    color: colors.foregroundMuted,
  },
  deleteItem: {
    borderBottomWidth: 0,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
});
