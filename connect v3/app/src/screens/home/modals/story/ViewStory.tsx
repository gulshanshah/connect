import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  StatusBar
} from 'react-native';
import Progress from './components/Progress';
import Head from './components/Head';
import Content from './components/Content';
import Foot from './components/Foot';

const { width, height } = Dimensions.get('window');

type User = {
  id: string;
  name: string;
  avatar: string;
  fullName?: string;
};

type Story = {
  id: string;
  image: string;
  caption: string;
  createdAt: string;
  viewed?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  stories: Story[];
  user: User;
  currentStoryIndex: number;
  onNextStory: () => void;
  onPrevStory: () => void;
  onNextUser: () => void;
  onPrevUser: () => void;
};

const ViewStoryModal: React.FC<Props> = ({
  visible,
  onClose,
  stories,
  user,
  currentStoryIndex,
  onNextStory,
  onPrevStory,
  onNextUser,
  onPrevUser
}) => {
  const [storyIndex, setStoryIndex] = useState(currentStoryIndex);
  const progress = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const lastUserIdRef = useRef(user.id);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setStoryIndex(currentStoryIndex);
  }, [currentStoryIndex]);

  useEffect(() => {
    if (!visible || !stories || stories.length === 0) return;
    
    progress.setValue(0);
    
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    });

    anim.start(({ finished }) => {
      if (finished) {
        if (storyIndex < stories.length - 1) {
          onNextStory();
        } else {
          onNextUser();
        }
      }
    });

    return () => anim.stop();
  }, [storyIndex, visible]);

  useEffect(() => {
    if (!visible) return;
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if (lastUserIdRef.current !== user.id) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      
      lastUserIdRef.current = user.id;
    }
  }, [user.id, visible]);

  const handlePrev = () => {
    if (storyIndex > 0) {
      onPrevStory();
    } else {
      onPrevUser();
    }
  };

  const handleNext = () => {
    if (storyIndex < stories.length - 1) {
      onNextStory();
    } else {
      onNextUser();
    }
  };

  useEffect(() => {
    if (!visible) {
      isFirstRender.current = true;
      lastUserIdRef.current = user.id;
    }
  }, [visible]);

  if (!visible || 
      !stories || 
      stories.length === 0 || 
      storyIndex >= stories.length || 
      !stories[storyIndex]) {
    return null;
  }

  const currentStory = stories[storyIndex];

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor={"#000"}
        barStyle="light-content"
        hidden={false} 
        />
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Progress 
            progress={progress} 
            storiesCount={stories.length} 
            currentIndex={storyIndex}
          />
          <Head 
            user={user} 
            timestamp={currentStory.createdAt} 
            onClose={onClose} 
          />
          <Content 
            story={currentStory} 
            onPrev={handlePrev} 
            onNext={handleNext} 
          />
          <Foot caption={currentStory.caption} />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default ViewStoryModal;