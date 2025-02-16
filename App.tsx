import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, Alert, StyleSheet, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import MemoryGame from './src/MemoryGame';
import StartScreen from './src/StartScreen';
import GameSelectionScreen from './src/GameSelectionScreen';
import RulesScreen from './src/RulesScreen';
import * as RNLocalize from 'react-native-localize';
import appsFlyer from 'react-native-appsflyer';
import { getApps, initializeApp } from '@react-native-firebase/app';
import OneSignal from 'react-native-onesignal';
import { gameConfigs } from './src/gameConfigs';
import { GlobalLivesProvider } from './src/GlobalLivesContext';

const App: React.FC = () => {
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [screen, setScreen] = useState<'start' | 'selection' | 'rules' | 'game'>('start');
  const [selectedGameIndex, setSelectedGameIndex] = useState<number>(0);

  useEffect(() => {
    (async () => {
      await initSDKs();
      determineUserCountry();
    })();
  }, []);

  const initSDKs = async (): Promise<void> => {
    try {
      const firebaseConfig = {
        apiKey: "FAKE_API_KEY",
        authDomain: "fake-app.firebaseapp.com",
        projectId: "fake-app",
        storageBucket: "fake-app.appspot.com",
        messagingSenderId: "1234567890",
        appId: "1:1234567890:ios:abcdef123456"
      };
      if (!getApps().length) {
        initializeApp(firebaseConfig);
      }
      appsFlyer.initSdk(
        {
          devKey: 'FAKE_APPSFLYER_KEY',
          isDebug: true,
          onInstallConversionDataListener: true
        },
        (result: any) => {},
        (error: any) => {}
      );
    } catch (error) {
      console.error("SDK initialization error:", error);
    }
  };

  const determineUserCountry = (): void => {
    try {
      const locales = RNLocalize.getLocales();
      if (locales.length > 0) {
        const countryCode = locales[0].countryCode;
        if (countryCode) {
          setCountry(countryCode);
        } else {
          throw new Error('Failed to determine country code');
        }
      } else {
        throw new Error('Failed to get device locales');
      }
    } catch (error) {
      console.error('Error determining country:', error);
      Alert.alert('Error', 'Failed to determine your location. Please try again.');
      setCountry('UA');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={{ fontFamily: 'Baloo2-Regular' }}>Loading...</Text>
      </View>
    );
  }

  if (country !== 'UA') {
    return <WebView source={{ uri: 'https://uk.wikipedia.org' }} style={{ flex: 1 }} />;
  }

  return (
    <GlobalLivesProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#541896" barStyle="light-content" />
        <View style={styles.container}>
          {screen === 'start' && <StartScreen onStart={() => setScreen('selection')} />}
          {screen === 'selection' && (
            <GameSelectionScreen
              onSelectGame={(gameIndex: number) => {
                setSelectedGameIndex(gameIndex);
                setScreen('game');
              }}
              onRules={() => setScreen('rules')}
            />
          )}
          {screen === 'rules' && <RulesScreen onBack={() => setScreen('selection')} />}
          {screen === 'game' && (
            <MemoryGame
              onBack={() => setScreen('selection')}
              gameConfig={gameConfigs[selectedGameIndex]}
              onNextLevel={() => {
                const nextIndex = selectedGameIndex < gameConfigs.length - 1 ? selectedGameIndex + 1 : 0;
                setSelectedGameIndex(nextIndex);
                setScreen('game');
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </GlobalLivesProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#541896'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;
