


import React from 'react';
import { Text, StyleSheet } from 'react-native';

const isOnlyEmoji = (text: string) => {
  const stripped = text.trim();
  const emojiRegex =
    /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u;
  return emojiRegex.test(stripped);
};

const TextMessage = ({ message }: { message: any }) => {
  const isEmoji = isOnlyEmoji(message.content);
  return (
    <Text
      style={[
        styles.text,
        message.isUser && styles.userText,
        isEmoji && styles.emojiText,
      ]}
    >
      {message.content}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#fff',
    alignSelf: 'flex-end',
  },
  emojiText: {
    fontSize: 26,
    lineHeight: 32,
  },
});

export default TextMessage;
