import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const EMOJIS = ['😀', '😁', '😂', '❤️', '😎', '🥳', '😡', '💩', '👀', '🔥', '🎉', '😭', '🙌', '🍕'];

type OverlayType = 'emoji' | 'text' | 'location';

interface OverlayData {
  id: string;
  type: OverlayType;
  text: string;
  color?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  fontSize: number;
}

export interface ImageEditorScreenProps {
  image: { uri: string; width: number; height: number };
  onDone: (result: { overlays: OverlayData[] }) => void;
  initialOverlays?: OverlayData[];
}

export const ImageEditorScreen: React.FC<ImageEditorScreenProps> = ({
  image,
  onDone,
  initialOverlays = [],
}) => {
  const [overlays, setOverlays] = useState<OverlayData[]>(initialOverlays);
  const [addMode, setAddMode] = useState<OverlayType | null>(null);
  const [inputText, setInputText] = useState('');
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#fff');

  const panRefs = useRef<{ [id: string]: { x: number; y: number } }>({});
  const scaleRefs = useRef<{ [id: string]: number }>({});

  const addOverlay = (type: OverlayType, text: string) => {
    const id = Math.random().toString(36).slice(2);
    setOverlays(olds => [
      ...olds,
      {
        id,
        type,
        text,
        color: type === 'text' ? selectedColor : undefined,
        x: SCREEN_WIDTH / 2 - 60,
        y: SCREEN_HEIGHT / 2 - 40,
        scale: 1,
        rotation: 0,
        fontSize: 40,
      },
    ]);
  };

  const onFinishAddText = () => {
    if (!inputText.trim()) {
      setAddMode(null);
      return;
    }
    addOverlay('text', inputText.trim());
    setInputText('');
    setAddMode(null);
  };

  const onSelectEmoji = (emoji: string) => {
    addOverlay('emoji', emoji);
    setShowEmojiModal(false);
  };

  function onOverlayPan(id: string, e: PanGestureHandlerGestureEvent) {
    const { translationX, translationY } = e.nativeEvent;
    setOverlays(olds =>
      olds.map(ov => ov.id !== id ? ov : ({
        ...ov,
        x: (panRefs.current[id]?.x ?? ov.x) + translationX,
        y: (panRefs.current[id]?.y ?? ov.y) + translationY,
      }))
    );
  }
  function onOverlayPanEnd(id: string, e: PanGestureHandlerGestureEvent) {
    const { translationX, translationY } = e.nativeEvent;
    const base = panRefs.current[id] ?? overlays.find(o => o.id === id)!;
    panRefs.current[id] = {
      x: base.x + translationX,
      y: base.y + translationY,
    };
    if (base.y + translationY > SCREEN_HEIGHT - 110) {
      setOverlays(olds => olds.filter(ov => ov.id !== id));
      delete panRefs.current[id];
      return;
    }
    setDraggingId(null);
  }
  function onOverlayPinch(id: string, e: PinchGestureHandlerGestureEvent) {
    const { scale } = e.nativeEvent;
    setOverlays(olds =>
      olds.map(ov => ov.id !== id ? ov : ({
        ...ov,
        scale: (scaleRefs.current[id] ?? ov.scale) * scale,
      }))
    );
  }
  function onOverlayPinchEnd(id: string, e: PinchGestureHandlerGestureEvent) {
    const { scale } = e.nativeEvent;
    scaleRefs.current[id] =
      (scaleRefs.current[id] ?? overlays.find(o => o.id === id)?.scale ?? 1) * scale;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#222" }}>
      {}
      <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 1 }}>
        <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />

        {}
        {overlays.map(o => (
          <PanGestureHandler
            key={o.id}
            onGestureEvent={e => onOverlayPan(o.id, e)}
            onHandlerStateChange={e => {
              if (e.nativeEvent.state === State.BEGAN) setDraggingId(o.id);
              if (e.nativeEvent.state === State.END) onOverlayPanEnd(o.id, e as any);
            }}
          >
            <PinchGestureHandler
              onGestureEvent={e => onOverlayPinch(o.id, e)}
              onHandlerStateChange={e => {
                if (e.nativeEvent.state === State.END) onOverlayPinchEnd(o.id, e);
              }}
            >
              <View
                style={[
                  styles.overlay,
                  {
                    left: o.x,
                    top: o.y,
                    transform: [{ scale: o.scale }],
                  }
                ]}
              >
                {o.type === 'emoji' && (
                  <Text style={{ fontSize: o.fontSize }}>{o.text}</Text>
                )}
                {o.type === 'text' && (
                  <Text style={{ color: o.color, fontWeight: 'bold', fontSize: o.fontSize }}>{o.text}</Text>
                )}
                {o.type === 'location' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 6, padding: 6 }}>
                    <Icon name="map-marker" color="#f44" size={o.fontSize * 0.7} />
                    <Text style={{ fontWeight: 'bold', fontSize: o.fontSize * 0.7, marginLeft: 6 }}>{o.text}</Text>
                  </View>
                )}
              </View>
            </PinchGestureHandler>
          </PanGestureHandler>
        ))}

        {}
        {draggingId && (
          <View style={styles.trashBar}>
            <Icon name="trash-can-outline" size={38} color="#fff" />
          </View>
        )}
      </View>

      {}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => setAddMode('text')} style={styles.toolBtn}>
          <Icon name="format-text" size={27} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEmojiModal(true)} style={styles.toolBtn}>
          <Icon name="emoticon-outline" size={27} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addOverlay('location', 'City Park')}
          style={styles.toolBtn}
        >
          <Icon name="map-marker" size={27} color="#fff" />
        </TouchableOpacity>
        {}
      </View>

      <View style={{ position: 'absolute', top: 40, right: 20, zIndex: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 22,
            elevation: 6
          }}
          onPress={() => onDone({ overlays })}>
          <Text style={{ fontWeight: 'bold', color: '#136afe' }}>Done</Text>
        </TouchableOpacity>
      </View>

      {}
      <Modal isVisible={addMode === 'text'} onBackdropPress={() => setAddMode(null)}>
        <View style={styles.modalPanel}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter text"
            autoFocus
            style={{ fontSize: 26, fontWeight: 'bold', color: selectedColor, width: 240, textAlign: 'center' }}
            onSubmitEditing={onFinishAddText}
          />
          <View style={{ flexDirection: 'row', marginTop: 14 }}>
            {['#fff', '#000', '#f44', '#13e', '#fc0', '#009e06', '#00c8e0'].map(c => (
              <TouchableOpacity
                key={c}
                style={{
                  height: 30, width: 30, borderRadius: 15,
                  backgroundColor: c, marginHorizontal: 6, borderWidth: selectedColor === c ? 2 : 0,
                  borderColor: '#136afe'
                }}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={onFinishAddText}
            style={{
              marginTop: 20,
              backgroundColor: "#136afe", borderRadius: 8, padding: 10, alignItems: 'center', width: 120,
            }}>
            <Text style={{ color: "#fff", fontWeight: 'bold' }}>Add</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {}
      <Modal isVisible={showEmojiModal} onBackdropPress={() => setShowEmojiModal(false)}>
        <View style={styles.modalPanel}>
          <ScrollView horizontal style={{ width: 320 }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {EMOJIS.map(emoji => (
              <TouchableOpacity
                key={emoji}
                onPress={() => onSelectEmoji(emoji)}
                style={{ margin: 10 }}>
                <Text style={{ fontSize: 36 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
    padding: 2,
    zIndex: 10
  },
  trashBar: {
    position: 'absolute', bottom: 22, width: '100%', alignItems: 'center', zIndex: 30
  },
  toolbar: {
    position: 'absolute', bottom: 38, left: 0, width: '100%',
    flexDirection: 'row', justifyContent: 'center', zIndex: 22
  },
  toolBtn: {
    marginHorizontal: 14,
    backgroundColor: "#234157",
    borderRadius: 22,
    padding: 12,
    elevation: 2
  },
  modalPanel: {
    backgroundColor: "#fff",
    borderRadius: 18,
    alignItems: 'center',
    padding: 22,
    width: 320,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT / 4,
  }
});

export default ImageEditorScreen;