import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AssistantScreen = () => {
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      text: 'Hello! I\'m your AI assistant. How can I help you today?', 
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    if (isTyping) {
      startTypingAnimation();
    } else {
      stopTypingAnimation();
    }
    
    return () => stopTypingAnimation();
  }, [isTyping]);

  const startTypingAnimation = () => {
    stopTypingAnimation();
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(typingAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ])
    );
    animationRef.current.start();
  };

  const stopTypingAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    typingAnim.setValue(0);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newUserMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    Keyboard.dismiss();

    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };

  const getAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hi there! What can I do for you?";
    } else if (lowerInput.includes('thank')) {
      return "You're welcome! Is there anything else I can help with?";
    } else if (lowerInput.includes('weather')) {
      return "I can check weather forecasts. Which city are you interested in?";
    } else if (lowerInput.includes('name')) {
      return "I'm your AI assistant. You can call me whatever you like!";
    } else if (lowerInput.includes('help')) {
      return "I can help with information, calculations, reminders, and more. What do you need assistance with?";
    } else {
      const responses = [
        "Interesting! Tell me more about that.",
        "I understand. How else can I assist you?",
        "I've noted your request. Is there anything specific you'd like me to do?",
        "Thanks for sharing! What would you like to do next?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'ai' ? styles.aiMessage : styles.userMessage
    ]}>
      {item.sender === 'ai' && (
        <View style={styles.avatar}>
          <Icon name="robot" size={24} color="#3b82f6" />
        </View>
      )}
      <View style={[
        styles.bubble,
        item.sender === 'ai' ? styles.aiBubble : styles.userBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessage]}>
      <View style={styles.avatar}>
        <Icon name="robot" size={24} color="#3b82f6" />
      </View>
      <View style={[styles.bubble, styles.aiBubble]}>
        <View style={styles.typingContainer}>
          <Animated.View 
            style={[
              styles.typingDot, 
              { 
                opacity: typingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1]
                }) 
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.typingDot, 
              { 
                opacity: typingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1]
                }) 
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.typingDot, 
              { 
                opacity: typingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1]
                }) 
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {}
      <View style={styles.header}>
        <View style={styles.statusIndicator}>
          <Icon name="circle" size={12} color="#4ade80" />
        </View>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <TouchableOpacity>
          <Icon name="cog" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          <>
            {isTyping && renderTypingIndicator()}
            <View style={{ height: 20 }} />
          </>
        }
      />

      {}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Icon name="attachment" size={24} color="#94a3b8" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            placeholderTextColor="#94a3b8"
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Icon 
              name={inputText.trim() ? "send" : "microphone"} 
              size={24} 
              color={inputText.trim() ? "#3b82f6" : "#94a3b8"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  statusIndicator: {
    marginRight: 10
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end'
  },
  aiMessage: {
    alignSelf: 'flex-start'
  },
  userMessage: {
    alignSelf: 'flex-end'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  bubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 4
  },
  aiBubble: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#0f172a',
    alignItems: 'center'
  },
  attachmentButton: {
    padding: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    color: 'white',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    maxHeight: 120,
    fontSize: 16,
    marginHorizontal: 8
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center'
  },
  typingContainer: {
    flexDirection: 'row',
    padding: 8
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94a3b8',
    marginHorizontal: 2
  }
});

export default AssistantScreen;