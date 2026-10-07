import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../constants/ThemeContext';

interface OptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({ isVisible, onClose, onSelectOption }) => {
  const theme = useTheme();
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => onSelectOption('Delete Post')} style={styles.option}>
          <Icon name="trash-bin" size={24} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>Delete Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSelectOption('Report')} style={styles.option}>
          <Icon name="warning" size={24} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSelectOption('Disconnect')} style={styles.option}>
          <Icon name="person-remove" size={24} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>Disconnect</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSelectOption('Message')} style={styles.option}>
          <Icon name="chatbubble-ellipses" size={24} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSelectOption('Close')} style={styles.option}>
          <Icon name="close" size={24} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default OptionsModal;
