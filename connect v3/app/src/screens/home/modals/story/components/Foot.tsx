import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function StoryFooter() {
  const [text, setText] = useState('');
  const [liked, setLiked] = useState(false);

  const handleSend = () => {
    console.log('Send:', text);
    setText('');
  };

  const handleMic = () => {
    console.log('Mic pressed');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.containerWrapper}
    >
      <View style={styles.footer}>
        {}
        {liked ? (
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => setLiked(!liked)}>
          <FontAwesome name="heart" size={28} color='#e0245e' />
        </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => setLiked(!liked)}>
          <Feather name="heart" size={26} color='#f1f2f6' />
        </TouchableOpacity>
        )}

        {}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Send a message"
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
          />
        </View>

        {}
        {}

          <TouchableOpacity style={styles.sendButton} activeOpacity={0.7} onPress={handleSend}>
            <Feather name="arrow-up" size={24} color="#f1f2f6" />
          </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  iconButton: {
    marginRight: 12,
    padding: 6,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#fff',
  },
  sendButton: {
    borderRadius: 20,
    marginLeft: 12,
    padding: 8,
  },
});
