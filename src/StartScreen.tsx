import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <ImageBackground
      source={require('./assets/gradient.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image source={require('./assets/startIcon.png')} style={styles.icon} />
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 248, height: 248, marginBottom: 20 },
  button: {
    backgroundColor: '#6EBCF7',
    paddingVertical: 5,
    paddingHorizontal: 60,
    borderRadius: 25,
    position: 'absolute',
    bottom: 90
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
    textTransform: 'uppercase'
  }
});

export default StartScreen;
