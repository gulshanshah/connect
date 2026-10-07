import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { saveTokens } from '../../assets/Keychain';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

const { width, height } = Dimensions.get('window');

const CustomButton = ({ title, onPress, style, textStyle, iconName, isLoading = false, disabled = false }) => (
  <TouchableOpacity
    style={[styles.button, style, (isLoading || disabled) && styles.buttonDisabled]}
    onPress={onPress}
    disabled={isLoading || disabled}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color={textStyle?.color || "#fff"} />
    ) : (
      <>
        {iconName && <Icon name={iconName} size={22} color={textStyle?.color || "#fff"} style={styles.buttonIcon} />}
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </>
    )}
  </TouchableOpacity>
);

const InputField = ({ iconName, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default', maxLength, autoFocus = false }) => (
  <View style={styles.inputContainer}>
    {iconName && <Icon name={iconName} size={22} color="#757575" style={styles.inputIcon} />}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#bdbdbd"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoCapitalize="none"
      autoCorrect={false}
      autoFocus={autoFocus}
    />
  </View>
);


const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW91bnRhaW4lMjBsYW5kc2NhcGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.welcomeContent}>
          <Icon name="public" size={90} color="#fff" style={styles.welcomeIcon} />
          <Text style={styles.welcomeTitle}>Welcome to Connecto</Text>
          <Text style={styles.welcomeSubtitle}>Your new space to connect, share, pay and discover.</Text>
        </View>

        <View style={styles.buttonGroupBottom}>
          <CustomButton
            title="Create an Account"
            onPress={() => navigation.navigate('CreateAccount')}
            style={styles.primaryButtonWelcome}
            textStyle={styles.primaryButtonTextWelcome}
            iconName="person-add"
          />
          <CustomButton
            title="Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.secondaryButtonWelcome}
            textStyle={styles.secondaryButtonTextWelcome}
            iconName="login"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const CreateAccountScreen = ({ navigation }) => {
  const [phone, setphone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Input', 'Please enter a valid 10-digit phone number.');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    Alert.alert('OTP Sent', `An OTP has been sent to ${phone}. (Simulated)`);
    setStep(2);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      Alert.alert('Invalid Input', 'Please enter a valid OTP (e.g., 4-6 digits).');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    Alert.alert('OTP Verified', 'Your phone number has been verified. (Simulated)');
    setStep(3);
  };
  
  const handleSetPassword = () => {
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match. Please re-enter.');
      return;
    }
    setStep(4);
  };


  const handleCreateAccount = async () => {
    if (phone.length !== 10 || password.length < 6 || !username.trim()) {
      Alert.alert('Error', 'All fields must be valid.');
      return;
    }

    setIsLoading(true);

    try {
    const response = await fetch('http://192.168.94.246:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password, username })
    });

    const result = await response.json();

    if (response.ok) {
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login', { prefillphone: phone });
    } else {
      Alert.alert('Failed', result.message || 'Registration failed');
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong');
  } finally {
    setIsLoading(false);
  }
};

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.instructionText}>We'll send a verification code to this number.</Text>
            <InputField iconName="phone-android" placeholder="phone Number (10 digits)" value={phone} onChangeText={setphone} keyboardType="phone-pad" maxLength={10} autoFocus={true}/>
            <CustomButton title="Send OTP" onPress={handleSendOtp} isLoading={isLoading} style={{marginTop: 10}}/>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.instructionText}>Enter the 4-digit code sent to {phone}.</Text>
            <InputField iconName="dialpad" placeholder="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} autoFocus={true}/>
            <CustomButton title="Verify OTP" onPress={handleVerifyOtp} isLoading={isLoading} style={{marginTop: 10}}/>
            <TouchableOpacity onPress={() => {setStep(1); setOtp('');}}>
              <Text style={styles.linkText}>Entered wrong number?</Text>
            </TouchableOpacity>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.instructionText}>Create a secure password for your account.</Text>
            <InputField iconName="lock-outline" placeholder="Password (min. 6 characters)" value={password} onChangeText={setPassword} secureTextEntry autoFocus={true}/>
            <InputField iconName="security" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <CustomButton title="Next: Choose Username" onPress={handleSetPassword} style={{marginTop: 10}}/>
            {}
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.instructionText}>Finally, pick a unique username.</Text>
            <InputField iconName="person-outline" placeholder="Username" value={username} onChangeText={setUsername} autoFocus={true}/>
            <CustomButton title="Create Account" onPress={handleCreateAccount} isLoading={isLoading} style={{marginTop: 10}}/>
            <TouchableOpacity onPress={() => setStep(3)}>
              <Text style={styles.linkText}>Back to Password Setup</Text>
            </TouchableOpacity>
          </>
        );
      default: return null;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Icon name="person-add-alt-1" size={70} color={styles.screenTitle.color} style={styles.screenIcon} />
        <Text style={styles.screenTitle}>Join Connecto</Text>
        {renderStepContent()}
      
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{marginTop: 30}}>
                <Text style={styles.footerLinkText}>Already have an account? <Text style={{fontWeight: 'bold'}}>Login</Text></Text>
            </TouchableOpacity>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const LoginScreen = ({ navigation, route }) => {
  const [identifier, setidentifier] = useState(route.params?.prefillphone || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    if (route.params?.prefillphone) {
      setidentifier(route.params.prefillphone);
    }
  }, [route.params?.prefillphone]);


  const onLoginSuccess = () => {
    navigation.navigate('BottomTabs');
  };

  const fetchFcmToken = async () => {
      try {
        const app = getApp();
        const messagingInstance = getMessaging(app);
        const token = await getToken(messagingInstance);
        return token;
      } catch (err) {
        console.error('Error fetching FCM token:', err);
        return null;
      }
    };

  const handleLogin = async () => {
  if (!identifier || !password) {
    Alert.alert('Missing Info', 'Please enter both phone number and password.');
    return;
  }

  try {
    setIsLoading(true);
    const fcmToken = await fetchFcmToken();

    const response = await fetch('http://192.168.94.246:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier, password, fcmToken })
    });

    const data = await response.json();
    setIsLoading(false);

    if (response.ok && data.accessToken && data.refreshToken) {
      const { accessToken, refreshToken } = data;

      const saved = await saveTokens(accessToken, refreshToken);
      if (saved) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        Alert.alert('Error', 'Failed to store tokens securely.');
      }

    } else {
      Alert.alert('Login Failed', data.message || 'Invalid credentials.');
    }
  } catch (error) {
    setIsLoading(false);
    console.log('Login error:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Icon name="meeting-room" size={70} color={styles.screenTitle.color} style={styles.screenIcon} />
        <Text style={styles.screenTitle}>Welcome Back!</Text>
        <InputField iconName="person-outline" placeholder="username or phone Number" value={identifier} onChangeText={setidentifier} keyboardType="phone-pad" maxLength={10} autoFocus={!route.params?.prefillphone}/>
        <InputField iconName="lock-outline" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoFocus={!!route.params?.prefillphone}/>
        <CustomButton title="Login" onPress={handleLogin} isLoading={isLoading} style={{marginTop: 10}}/>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')} style={{marginTop: 20}}>
          <Text style={styles.footerLinkText}>Don't have an account? <Text style={{fontWeight: 'bold'}}>Sign Up</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const ForgotPasswordScreen = ({ navigation }) => {
  const [phone, setphone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Input', 'Please enter a valid 10-digit phone number.');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    Alert.alert('OTP Sent', `Password reset OTP sent to ${phone}. (Simulated)`);
    setStep(2);
  };

  const handleVerifyOtpAndProceed = async () => {
     if (otp.length < 4) {
      Alert.alert('Invalid Input', 'Please enter a valid OTP.');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    Alert.alert('OTP Verified', 'You can now set a new password. (Simulated)');
    setStep(3);
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    Alert.alert('Password Reset!', 'Your password has been successfully reset. Please login. (Simulated)');
    navigation.replace('Login', { prefillphone: phone });
  };

  const renderStepContent = () => {
    switch (step) {
        case 1: return (<><Text style={styles.instructionText}>Enter your registered phone number to receive a reset code.</Text><InputField iconName="phone-android" placeholder="Registered phone Number" value={phone} onChangeText={setphone} keyboardType="phone-pad" maxLength={10} autoFocus={true}/><CustomButton title="Send OTP" onPress={handleSendOtp} isLoading={isLoading} style={{marginTop:10}}/></>);
        case 2: return (<><Text style={styles.instructionText}>Enter the OTP sent to {phone}.</Text><InputField iconName="dialpad" placeholder="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} autoFocus={true}/><CustomButton title="Verify OTP" onPress={handleVerifyOtpAndProceed} isLoading={isLoading} style={{marginTop:10}}/><TouchableOpacity onPress={() => {setStep(1); setOtp('');}}><Text style={styles.linkText}>Change phone Number?</Text></TouchableOpacity></>);
        case 3: return (<><Text style={styles.instructionText}>Create a new strong password.</Text><InputField iconName="lock-outline" placeholder="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry autoFocus={true}/><InputField iconName="lock-check" placeholder="Confirm New Password" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry /><CustomButton title="Reset Password" onPress={handleResetPassword} isLoading={isLoading} style={{marginTop:10}}/><TouchableOpacity onPress={() => setStep(2)}><Text style={styles.linkText}>Back to OTP</Text></TouchableOpacity></>);
        default: return null;
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Icon name="lock-reset" size={70} color={styles.screenTitle.color} style={styles.screenIcon} />
        <Text style={styles.screenTitle}>Reset Password</Text>
        {renderStepContent()}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{marginTop: 30}}>
            <Text style={styles.footerLinkText}>Remembered your password? <Text style={{fontWeight: 'bold'}}>Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const AuthStack = createStackNavigator();

const AuthNavigator = ({ onLoginSuccess }) => {
  return (
      <AuthStack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
          headerTintColor: styles.screenTitle.color,
          headerTitleStyle: { fontWeight: '600', fontSize: 18 },
          headerBackTitleVisible: false,
          cardStyle: { backgroundColor: styles.screenContainer.backgroundColor },
        }}
      >
        <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }}/>
        <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ title: 'Create Your Account' }} />
        <AuthStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login to Connecto' }}
            initialParams={{ onLoginSuccess: onLoginSuccess }}
        />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Your Password' }} />
      </AuthStack.Navigator>
  );
};

const APP_PRIMARY_COLOR = '#3498db';
const APP_TEXT_COLOR = '#2c3e50';
const APP_LIGHT_TEXT_COLOR = '#7f8c8d';
const APP_BACKGROUND_COLOR = '#F7F9FC';
const INPUT_BACKGROUND_COLOR = '#FFFFFF';
const WHITE_COLOR = '#FFFFFF';
const DISABLED_OPACITY = 0.6;

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 40, 60, 0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? height * 0.07 : height * 0.10,
    paddingHorizontal: width * 0.05,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  welcomeIcon: {
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4
  },
  welcomeTitle: {
    fontSize: width * 0.095,
    fontWeight: '700',
    color: WHITE_COLOR,
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 1.5},
    textShadowRadius: 3
  },
  welcomeSubtitle: {
    fontSize: width * 0.045,
    color: '#EAEAEA',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: width * 0.065,
    paddingHorizontal: width * 0.05,
  },
  buttonGroupBottom: {
    width: '100%',
    maxWidth: 450,
    alignItems: 'center',
  },
  primaryButtonWelcome: {
    backgroundColor: WHITE_COLOR,
    width: '100%',
    marginBottom: 15,
    paddingVertical: 16,
  },
  primaryButtonTextWelcome: {
    color: APP_PRIMARY_COLOR,
    fontWeight: '600',
  },
  secondaryButtonWelcome: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: WHITE_COLOR,
    width: '100%',
    paddingVertical: 16,
  },
  secondaryButtonTextWelcome: {
    color: WHITE_COLOR,
    fontWeight: '600',
  },

  screenContainer: {
    flex: 1,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    paddingVertical: 30,
  },
  screenIcon: {
    marginBottom: 25,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: APP_TEXT_COLOR,
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 15,
    color: APP_LIGHT_TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
    width: '95%'
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BACKGROUND_COLOR,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 18,
    width: '100%',
    maxWidth: 450,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#B0B0B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: APP_TEXT_COLOR,
  },

  button: {
    flexDirection: 'row',
    backgroundColor: APP_PRIMARY_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 450,
    shadowColor: APP_PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    minHeight: 50,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: WHITE_COLOR,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: APP_PRIMARY_COLOR,
    opacity: DISABLED_OPACITY,
    shadowOpacity: 0.1,
    elevation: 1,
  },

  linkText: {
    color: APP_PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 18,
    paddingVertical: 8,
  },
  footerLinkText: {
    fontSize: 15,
    color: APP_LIGHT_TEXT_COLOR,
    textAlign: 'center',
    lineHeight: 22,
  }
});

export default AuthNavigator;