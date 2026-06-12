import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '../config/google';

WebBrowser.maybeCompleteAuthSession();

/**
 * Shared Google sign-in flow for the Login and Signup screens.
 *
 * On installed apps the expo-auth-session Google provider already exchanges the
 * authorization code for tokens (it issues the request against the Android
 * client and uses the matching native redirect), so we just read the resulting
 * ID token and hand it to Firebase. The previous manual token exchange used the
 * web client id for a code issued to the Android client, which Google rejected.
 */
export function useGoogleAuth() {
  const { loginWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'error') {
      Alert.alert('Google Sign-In failed', response.error?.message || 'Please try again');
      return;
    }
    if (response?.type !== 'success') return;

    const idToken = response.authentication?.idToken ?? response.params?.id_token;
    if (!idToken) {
      Alert.alert('Google Sign-In failed', 'Could not obtain an ID token from Google. Please try again.');
      return;
    }

    setGoogleLoading(true);
    loginWithGoogle(idToken)
      .catch((err: any) => Alert.alert('Google Sign-In failed', err.message || 'Please try again'))
      .finally(() => setGoogleLoading(false));
  }, [response]);

  return { request, promptAsync, googleLoading };
}
