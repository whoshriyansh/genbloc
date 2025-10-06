// components/common/GlobalModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import Ionicons from '@react-native-vector-icons/ionicons';

interface GlobalModalProps {
  visible: boolean;
  onClose: () => void;
  header?: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * @component GlobalModal
 *
 * @props
 * @prop {boolean} visible - Controls the visibility of the modal.
 * @prop {() => void} onClose - Callback to close the modal.
 * @prop {string} [header] - Optional title for the modal.
 * @prop {string} [description] - Optional description/content for the modal.
 * @prop {React.ReactNode} [children] - Custom components rendered inside the modal.
 *
 * @example
 * <GlobalModal
 *   visible={modalVisible}
 *   onClose={() => setModalVisible(false)}
 *   header="Edit Task"
 *   description="Modify the details of your task below"
 * >
 *   <TaskForm task={task} />
 * </GlobalModal>
 */
const GlobalModal: React.FC<GlobalModalProps> = ({
  visible,
  onClose,
  header,
  description,
  children,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Cross Icon at Top-Right */}
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close-circle" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.content}>
            {header && <Text style={styles.header}>{header}</Text>}
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GlobalModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: colors.card,
    borderRadius: 15,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'flex-start',
    gap: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.foreground,
  },
  description: {
    fontSize: 12,
    color: colors.foregroundMuted,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
