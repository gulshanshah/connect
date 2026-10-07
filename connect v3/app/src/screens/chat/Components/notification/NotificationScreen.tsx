import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../../constants/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const initialNotifications = [
  {
    id: '1',
    type: 'info',
    userName: 'John Doe',
    userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    message: 'liked your photo',
    time: '2h ago',
  },
  {
    id: '2',
    type: 'request',
    userName: 'Jane Smith',
    userImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    message: 'sent you a connection request',
    time: '3h ago',
    status: 'pending',
  },
  {
    id: '3',
    type: 'info',
    userName: 'Mark Johnson',
    userImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    message: 'started following you',
    time: '5h ago',
  },
];

const NotificationItem = React.memo(({ item, onAction }) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const handlePressMore = useCallback(() => {
    console.log('More options pressed for:', item.id);
  }, [item.id]);

  return (
    <View style={[styles.notificationCard, { backgroundColor: theme.card }]}>
      {imageError ? (
        <View style={styles.avatarFallback}>
          <Icon name="person" size={24} color="#666" />
        </View>
      ) : (
        <Image
          source={{ uri: item.userImage }}
          style={styles.avatar}
          onError={() => setImageError(true)}
          accessibilityLabel={`${item.userName}'s profile picture`}
        />
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.messageText}>
          <Text style={[styles.userNameText, { color: theme.text }]}>{item.userName} </Text>
          {item.message}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>

        {item.type === 'request' && (
          <View style={styles.actionContainer}>
            {item.status === 'pending' ? (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => onAction(item.id, 'accept')}
                  activeOpacity={0.7}
                  accessibilityLabel="Accept request"
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => onAction(item.id, 'reject')}
                  activeOpacity={0.7}
                  accessibilityLabel="Reject request"
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text
                style={[
                  styles.statusText,
                  item.status === 'accepted' ? styles.acceptedText : styles.rejectedText,
                ]}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            )}
          </View>
        )}
      </View>

      {item.type === 'info' && (
        <TouchableOpacity
          onPress={handlePressMore}
          activeOpacity={0.7}
          accessibilityLabel="More options"
          accessibilityRole="button"
        >
          <Icon name="ellipsis-vertical" size={24} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
});

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleAction = useCallback((id, action) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, status: action === 'accept' ? 'accepted' : 'rejected' }
          : notification
      )
    );
  }, []);

  const renderItem = useCallback(
    ({ item }) => <NotificationItem item={item} onAction={handleAction} />,
    [handleAction]
  );
  
   const navigation = useNavigation();

const onBack = () => {
    navigation.goBack();
  };

  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onBack} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        </View>

        <TouchableOpacity style={styles.clearAllButton} accessibilityRole="button">
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  clearAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearAllText: {
    color: '#2196F3',
    fontWeight: '500',
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 1,
    marginVertical: 6,
    padding: 16,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
    }),
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  userNameText: {
    fontWeight: '600',
    fontSize: 16,
  },
  messageText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#888',
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  acceptedText: {
    color: '#4CAF50',
  },
  rejectedText: {
    color: '#F44336',
  },
});

export default NotificationScreen;