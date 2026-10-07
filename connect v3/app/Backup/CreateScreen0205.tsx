import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CROP_HEIGHT = 280;

const CreatePostScreen = () => {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const selectImages = async () => {
    try {
      const picked = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        cropping: false,
      });
      setImages(
        picked.map((img, idx) => ({
          uri: img.path,
          id: img.path + '_' + Date.now() + '_' + idx,
        }))
      );
    } catch {}
  };

  const addCameraImage = async () => {
    try {
      const photo = await ImagePicker.openCamera({
        mediaType: 'photo',
        cropping: false,
      });
      setImages([
        ...images,
        { uri: photo.path, id: photo.path + '_' + Date.now() }
      ]);
    } catch (error) {
      console.log('Camera error:', error);
    }
  };

  const cropImage = async (idx) => {
    try {
      const result = await ImagePicker.openCropper({
        path: images[idx].uri,
        width: SCREEN_WIDTH,
        height: CROP_HEIGHT,
        cropperToolbarTitle: 'Crop Image',
      });
      let current = [...images];
      current[idx] = { ...current[idx], uri: result.path + '?crop=' + Math.random() };
      setImages(current);
      setShowEdit(false);
    } catch {}
  };

  const rotateImage = async (idx) => {
    try {
      const result = await ImagePicker.openCropper({
        path: images[idx].uri,
        width: SCREEN_WIDTH,
        height: CROP_HEIGHT,
        rotateEnabled: true,
        cropperToolbarTitle: 'Rotate Image',
      });
      let current = [...images];
      current[idx] = { ...current[idx], uri: result.path + '?rot=' + Math.random() };
      setImages(current);
      setShowEdit(false);
    } catch {}
  };

  const removeImage = (idx) => {
    let updated = [...images];
    updated.splice(idx, 1);
    setImages(updated);
    setShowEdit(false);
  };

  const renderItem = ({ item, index, drag }) => (
    <TouchableOpacity
      style={styles.previewThumbWrap}
      onLongPress={drag}
      onPress={() => { setEditingIdx(index); setShowEdit(true); }}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.previewThumb} />
      <View style={styles.editOverlay}>
        <Icon name="create-outline" size={17} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  const renderGridImg = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => { setEditingIdx(index); setShowEdit(true); }}
      style={{ margin: 6 }}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.uri }} style={styles.gridImage} />
      <View style={styles.gridEditIcon}>
        <Icon name="create-outline" size={17} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:32}}>
        <Text style={styles.header}>Create Post</Text>

        {}
        {images.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <TouchableOpacity style={styles.pickBtn} onPress={selectImages}>
              <Icon name="images-outline" size={25} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 18, marginLeft: 8 }}>Pick Images</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickBtn} onPress={addCameraImage}>
              <Icon name="camera-outline" size={25} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 18, marginLeft: 8 }}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {}
            <View style={{ height: 88 }}>
              <DraggableFlatList
                data={images}
                horizontal
                onDragEnd={({ data }) => setImages(data)}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ alignItems: 'center', paddingLeft:6 }}
              />
            </View>

            {}
            <FlatList
              data={images}
              renderItem={renderGridImg}
              numColumns={2}
              keyExtractor={item => item.id}
              contentContainerStyle={{ alignItems: "center", marginBottom:10 }}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: SCREEN_WIDTH*0.95 }}
            />

            {}
            <TextInput
              placeholder="Write a caption..."
              value={caption}
              onChangeText={setCaption}
              style={styles.captionInput}
              maxLength={2200}
              multiline
            />

            {}
            <TouchableOpacity
              style={styles.postBtn}
              onPress={() => {
                if (!images.length) return Alert.alert('Add a photo!');
                Alert.alert('Posted!', `Photos: ${images.length}\nCaption: ${caption}`);
              }}
            >
              <Icon name="send" color="#fff" size={21} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>Post</Text>
            </TouchableOpacity>
          </>
        )}

        {}
        <Modal
          visible={showEdit}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEdit(false)}
        >
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 8 }}>Edit Image</Text>
              {editingIdx !== null && images[editingIdx] &&
                <Image
                  source={{ uri: images[editingIdx].uri }}
                  style={{ width: SCREEN_WIDTH - 32, height: CROP_HEIGHT, borderRadius: 13, alignSelf: "center" }}
                  resizeMode="cover"
                />
              }
              <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 15 }}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => cropImage(editingIdx)}>
                  <Icon name="crop-outline" size={23} color="#232323" />
                  <Text style={{marginLeft: 4, fontSize: 14}}>Crop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtn} onPress={() => rotateImage(editingIdx)}>
                  <Icon name="refresh-outline" size={20} color="#232323" />
                  <Text style={{marginLeft: 4, fontSize: 14}}>Rotate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtn} onPress={() => removeImage(editingIdx)}>
                  <Icon name="trash-outline" size={20} color="#B00020" />
                  <Text style={{marginLeft:4, color:"#B00020", fontSize:14}}>Delete</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowEdit(false)}>
                <Text style={{ color: "#fff" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: { fontSize: 24, marginBottom: 16, fontWeight: 'bold', color:'#222', alignSelf:"center" },
  pickBtn: {
    backgroundColor: '#4f62c0',
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 13,
    padding: 15,
    marginVertical: 13,
    alignSelf: "center",
  },
  previewThumbWrap: {
    width: 72, height: 72, marginRight: 10, marginVertical: 8,
    borderRadius: 8, overflow: "hidden", borderColor: "#4f62c0", borderWidth: 2.2, justifyContent: "center"
  },
  previewThumb: { width: '100%', height: '100%' },
  editOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: '#6c6c6cbb',
    borderRadius: 10,
    padding: 3,
  },
  gridImage: {
    width: SCREEN_WIDTH / 2.22,
    height: SCREEN_WIDTH / 2.22,
    borderRadius: 13,
    backgroundColor: '#eee',
  },
  gridEditIcon: { position:'absolute', bottom: 7, right: 13, backgroundColor:'#232323bb', borderRadius:9, padding:2 },
  captionInput: {
    borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 9, backgroundColor: "#f9f9f9",
    minHeight: 45, padding: 12, fontSize: 16, marginVertical: 14,
  },
  postBtn: {
    backgroundColor: "#4f62c0", flexDirection: "row", alignItems: "center",
    borderRadius: 11, padding: 12, alignSelf: "flex-end", minWidth: 95, justifyContent:'center'
  },
  modalBg: {
    backgroundColor: "rgba(30,30,30,0.25)", flex: 1, justifyContent: "center", alignItems: "center"
  },
  modalCard: {
    backgroundColor: "#fff", borderRadius: 16, paddingVertical: 21, width: SCREEN_WIDTH - 40, alignItems:'center'
  },
  modalBtn: {
    flexDirection:"row", alignItems:"center", marginHorizontal: 7, paddingVertical: 7, paddingHorizontal: 8,
    backgroundColor: "#efefef", borderRadius: 12
  },
  closeModalBtn: {
    backgroundColor: "#4f62c0", paddingVertical: 8, paddingHorizontal: 34, borderRadius: 8, marginTop: 8
  }
});

export default CreatePostScreen;