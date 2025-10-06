import React from 'react';
import { Button, Modal, Text, View, StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

interface EditModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Hello World!</Text>
          <Button title="Hide Modal" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
  },
  modalView: {
    width: '80%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    color: colors.foreground,
  },
});
