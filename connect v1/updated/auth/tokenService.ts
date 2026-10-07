import EncryptedStorage from 'react-native-encrypted-storage';
import { Tokens } from '../types';

export const saveTokens = async (access: string, refresh: string): Promise<void> => {
  const payload: Tokens = { access, refresh };
  await EncryptedStorage.setItem('tokens', JSON.stringify(payload));
};

export const getTokens = async (): Promise<Tokens | null> => {
  const data = await EncryptedStorage.getItem('tokens');
  return data ? JSON.parse(data) as Tokens : null;
};

export const clearTokens = async (): Promise<void> => {
  await EncryptedStorage.removeItem('tokens');
};
