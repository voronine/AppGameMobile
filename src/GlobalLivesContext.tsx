import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIFE_STORAGE_KEY = 'globalLives';
const LIFE_TIMESTAMP_KEY = 'livesTimestamp';
const DEFAULT_LIVES = 8;
const ONE_HOUR = 30;

interface GlobalLivesContextProps {
  lives: number;
  setLives: (lives: number) => void;
  decrementLives: () => void;
}

export const GlobalLivesContext = createContext<GlobalLivesContextProps>({
  lives: DEFAULT_LIVES,
  setLives: () => {},
  decrementLives: () => {}
});

interface GlobalLivesProviderProps {
  children: React.ReactNode;
}

export const GlobalLivesProvider: React.FC<GlobalLivesProviderProps> = ({ children }) => {
  const [lives, setLivesState] = useState<number>(DEFAULT_LIVES);

  const loadLives = async () => {
    try {
      const storedLives = await AsyncStorage.getItem(LIFE_STORAGE_KEY);
      const storedTimestamp = await AsyncStorage.getItem(LIFE_TIMESTAMP_KEY);
      const currentTime = Date.now();
      let livesValue = storedLives ? parseInt(storedLives, 10) : DEFAULT_LIVES;
      if (!storedTimestamp || currentTime - parseInt(storedTimestamp, 10) > ONE_HOUR) {
        livesValue = DEFAULT_LIVES;
        await AsyncStorage.setItem(LIFE_TIMESTAMP_KEY, currentTime.toString());
        await AsyncStorage.setItem(LIFE_STORAGE_KEY, livesValue.toString());
      }
      setLivesState(livesValue);
    } catch (e) {
      setLivesState(DEFAULT_LIVES);
    }
  };

  const setLives = async (newLives: number) => {
    setLivesState(newLives);
    await AsyncStorage.setItem(LIFE_STORAGE_KEY, newLives.toString());
  };

  const decrementLives = () => {
    setLivesState(prev => {
      if (prev <= 0) return 0;
      const newLives = prev - 1;
      AsyncStorage.setItem(LIFE_STORAGE_KEY, newLives.toString());
      return newLives;
    });
  };

  useEffect(() => {
    loadLives();
  }, []);

  return (
    <GlobalLivesContext.Provider value={{ lives, setLives, decrementLives }}>
      {children}
    </GlobalLivesContext.Provider>
  );
};
