import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Animated 
} from 'react-native';
import ChatIndexScreen from '../Chat/ChatIndex';
import GroupIndexScreen from '../Chat/GroupIndex';

const { width } = Dimensions.get('window');

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const indicatorPosition = useRef(new Animated.Value(0)).current;

  const onTabPress = (index: number) => {
    setSelectedTab(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    Animated.spring(indicatorPosition, {
      toValue: index * (width / 2),
      useNativeDriver: false,
    }).start();
  };

  const onMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setSelectedTab(index);
    Animated.spring(indicatorPosition, {
      toValue: index * (width / 2),
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => onTabPress(0)} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>
            Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPress(1)} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}>
            Groups
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.indicator, { left: indicatorPosition }]} />
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ width }}>
          <ChatIndexScreen />
        </View>
        <View style={{ width }}>
          <GroupIndexScreen />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 18,
    color: '#888',
  },
  activeTabText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: width / 2,
    height: 3,
    backgroundColor: '#007aff',
  },
});

export default App;
