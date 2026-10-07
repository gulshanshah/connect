import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/AllChatIndex';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExploreScreen from '../screens/ExploreScreen';

import SettingsScreen from '../screens/SettingsScreen';
import ChatingScreen from '../Chat/ChatScreen';
import GroupingScreen from '../screens/GroupScreen';
import ProfileSetup from '../screens/ProfileSetup';
import SearchScreen from '../screens/SeachScreen';
import NotificationScreen from '../screens/NotificationScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import CreateGroup from '../Chat/CreateGroup';
import AddUser from '../Chat/AddUser';
import GroupSettings from '../Chat/GroupSettings';

import BuySellScreen from '../assets/BuySell';
import PaymentScreen from '../Explore/PaymentScreen';

import SplitPaymentScreen from '../Payment/SplitPaymentScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Connecto</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <Icon name="search-outline" size={24} color="#1E90FF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
          <Icon
            name="notifications-outline"
            size={24}
            color="#1E90FF"
            style={styles.headerIconSpacing}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChatHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Connecto</Text>
      <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
        <Icon name="chatbubble-ellipses-outline" size={24} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );
};

const ExploreHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Connecto</Text>
      <TouchableOpacity onPress={() => alert('Drafts Opened, Coming soon in next updates')}>
        <Icon name="document-text-outline" size={24} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );
};

const PostHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Connecto</Text>
      <TouchableOpacity onPress={() => alert('Drafts Opened, Coming soon in next updates')}>
        <Icon name="document-text-outline" size={24} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );
};

const ProfileHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Connecto</Text>
      <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
        <Icon name="settings-outline" size={24} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Chat':
              iconName = 'chatbubble-outline';
              break;
            case 'Explore':
              iconName = 'compass-outline';
              break;
            case 'Post':
              iconName = 'add-circle-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E90FF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#fff', height: 50 },
        headerTitle: () => {
          switch (route.name) {
            case 'Home':
              return <HomeHeader />;
            case 'Chat':
              return <ChatHeader />;
            case 'Explore':
              return <ExploreHeader />;
            case 'Post':
              return <PostHeader />;
            case 'Profile':
              return <ProfileHeader />;
            default:
              return <Text>Connecto</Text>;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

    

const ExtraStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ChattingScreen" component={ChatingScreen} />
      <Stack.Screen name="GroupingScreen" component={GroupingScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroup} />
      <Stack.Screen name="AddUser" component={AddUser} />
      <Stack.Screen name="GroupSettings" component={GroupSettings} />
      <Stack.Screen name="BuySellScreen" component={BuySellScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="SplitPaymentScreen" component={SplitPaymentScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconSpacing: {
    marginLeft: 15,
  },
});

export default ExtraStack;
