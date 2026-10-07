import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AssistantBoxProps {
  visible: boolean;
  onClose: () => void;
}

const AssistantBox: React.FC<AssistantBoxProps> = ({ visible, onClose }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toggleMic = () => {
    setIsListening(!isListening);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.3}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View style={styles.container}>
        {}
        <View style={styles.header}>
  <Text style={styles.assistantName}>✨ Nova</Text>

  <View style={styles.headerRight}>
    <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={styles.menuButton}>
      <Icon name="more-vert" size={26} color="#666" />
    </TouchableOpacity>
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Icon name="close" size={26} color="#666" />
    </TouchableOpacity>
  </View>

  {showOptions && (
    <View style={styles.optionsPanel}>
      <TouchableOpacity style={styles.option}>
        <Icon name="history" size={18} color="#444" />
        <Text style={styles.optionText}>Previous Chats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Icon name="settings" size={18} color="#444" />
        <Text style={styles.optionText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Icon name="help-outline" size={18} color="#444" />
        <Text style={styles.optionText}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Icon name="report-problem" size={18} color="#444" />
        <Text style={styles.optionText}>Report Issue</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

        {}
        <View style={styles.content}>
          {}
          <Text style={styles.promptText}>
            {isListening ? "Listening..." : "Tap the mic to start speaking"}
          </Text>
        </View>

        {}
        <View style={styles.micWrapper}>
          <TouchableOpacity style={[styles.micButton, isListening && styles.micActive]} onPress={toggleMic}>
            <Icon name={isListening ? 'stop' : 'mic'} size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 420,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
closeButton: {
  padding: 6,
  marginLeft: 4,
},
  assistantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f46e5',
    textShadowColor: '#c7d2fe',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  menuButton: {
    padding: 6,
  },
  optionsPanel: {
    position: 'absolute',
    top: 36,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 999,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 180,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#444',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assistantIcon: {
    marginBottom: 12,
    opacity: 0.9,
  },
  promptText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  micWrapper: {
    alignItems: 'center',
    marginTop: 24,
  },
  micButton: {
    backgroundColor: '#6366f1',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  micActive: {
    backgroundColor: '#ef4444',
  },
});

export default AssistantBox;
