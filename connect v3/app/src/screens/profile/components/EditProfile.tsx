import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

const EditProfileScreen = () => {
  const [name, setName] = useState('Gulshan Kumar');
  const [username, setUsername] = useState('gulshan123');
  const [bio, setBio] = useState('Dreamer | Coder | Coffee Lover ☕');
  const [email, setEmail] = useState('gulshan@example.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [inputFocus, setInputFocus] = useState({
    name: false,
    username: false,
    bio: false,
    email: false,
    phone: false
  });

  const scrollViewRef = useRef();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone);
  };

  const handleSave = () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePhone(phone.replace(/\s/g, ''))) {
      setPhoneError('Please enter a valid phone number');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (valid) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Profile Updated', 'Your changes have been saved successfully!');
      }, 1500);
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.7,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleInputFocus = (name) => {
    setInputFocus(prev => ({ ...prev, [name]: true }));
    scrollViewRef.current?.scrollTo({ y: 200, animated: true });
  };

  const handleInputBlur = (name) => {
    setInputFocus(prev => ({ ...prev, [name]: false }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Edit Profile</Text>

          <TouchableOpacity
            style={styles.profilePicContainer}
            onPress={pickImage}
            accessibilityLabel="Profile picture"
            accessibilityHint="Tap to change profile picture"
          >
            <Image
              source={profileImage}
              style={styles.profilePic}
            />
            <View style={styles.cameraIconContainer}>
              <Icon name="camera" size={24} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            {[
              { label: 'Full Name', value: name, setValue: setName, field: 'name' },
              { label: 'Username', value: username, setValue: setUsername, field: 'username' },
              { label: 'Bio', value: bio, setValue: setBio, field: 'bio', multiline: true },
              { label: 'Email Address', value: email, setValue: setEmail, field: 'email', keyboardType: 'email-address' },
              { label: 'Phone Number', value: phone, setValue: setPhone, field: 'phone', keyboardType: 'phone-pad' },
            ].map((input, index) => (
              <View key={index} style={styles.inputGroup}>
                <Text style={styles.label}>{input.label}</Text>
                <TextInput
                  value={input.value}
                  onChangeText={input.setValue}
                  placeholder={`Enter your ${input.label.toLowerCase()}`}
                  style={[
                    styles.input,
                    inputFocus[input.field] && styles.inputFocused,
                    (input.field === 'email' && emailError) ? styles.inputError : null,
                    (input.field === 'phone' && phoneError) ? styles.inputError : null,
                    input.multiline && styles.bioInput
                  ]}
                  onFocus={() => handleInputFocus(input.field)}
                  onBlur={() => handleInputBlur(input.field)}
                  multiline={input.multiline || false}
                  keyboardType={input.keyboardType || 'default'}
                />
                {input.field === 'bio' && <Text style={styles.charCount}>{bio.length}/150</Text>}
                {input.field === 'email' && emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                {input.field === 'phone' && phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardAvoid: { flex: 1 },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: '700', color: '#1a1a1a', marginVertical: 24, textAlign: 'center' },
  profilePicContainer: { alignSelf: 'center', marginBottom: 32, position: 'relative' },
  profilePic: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#e9ecef' },
  cameraIconContainer: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#4CAF50', borderRadius: 20, padding: 8, elevation: 2 },
  formContainer: { marginBottom: 16 },
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8, color: '#495057', fontSize: 14, fontWeight: '500' },
  input: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#dee2e6' },
  inputFocused: { borderColor: '#4CAF50', backgroundColor: '#f8fff9' },
  inputError: { borderColor: '#dc3545' },
  bioInput: { height: 100, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', color: '#6c757d', fontSize: 12, marginTop: 4 },
  errorText: { color: '#dc3545', fontSize: 12, marginTop: 4 },
  saveButton: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 2, marginTop: 24 },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default EditProfileScreen;
