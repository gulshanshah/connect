import * as Keychain from 'react-native-keychain';

export const saveTokens = async (accessToken, refreshToken) => {
  try {
    const value = JSON.stringify({ accessToken, refreshToken });
    await Keychain.setGenericPassword('tokens', value);
    return true;
  } catch (error) {
    console.log('Keychain Save Error:', error);
    return false;
  }
};

export const loadTokens = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const { accessToken, refreshToken } = JSON.parse(credentials.password);
      return { accessToken, refreshToken };
    }
    return null;
  } catch (error) {
    console.log('Keychain Load Error:', error);
    return null;
  }
};

export const deleteTokens = async () => {
  try {
    await Keychain.resetGenericPassword();
    return true;
  } catch (error) {
    console.log('Keychain Delete Error:', error);
    return false;
  }
};
