import React from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

interface GameSelectionScreenProps {
  onSelectGame: (gameIndex: number) => void;
  onRules: () => void;
}

const gameImages = [
  require('./assets/game1.png'),
  require('./assets/game2.png'),
  require('./assets/game3.png'),
  require('./assets/game4.png'),
  require('./assets/game5.png'),
  require('./assets/game6.png'),
  require('./assets/game7.png'),
  require('./assets/game8.png'),
];

const GameSelectionScreen: React.FC<GameSelectionScreenProps> = ({ onSelectGame, onRules }) => {
  return (
    <ImageBackground
      source={require('./assets/gradient.png')}
      style={styles.background}
      imageStyle={{ transform: [{ rotate: '180deg' }] }}
      resizeMode="cover"
    >
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require('./assets/Rectangle.png')}
          style={styles.header}
          resizeMode="cover"
        >
          <Image source={require('./assets/Logo.png')} style={styles.icon} />
          <TouchableOpacity style={styles.infoButton} onPress={onRules}>
            <Image source={require('./assets/info.png')} style={styles.infoImage} resizeMode="contain" />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.grid}>
        {gameImages.map((img, index) => (
          <TouchableOpacity key={index} style={styles.gameSquare} onPress={() => onSelectGame(index)}>
            <Image source={img} style={styles.gameImage} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  icon: { width: 62, height: 39 },
  background: { flex: 1, width: '100%', height: '100%' },
  headerContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: 102 },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  infoButton: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#541896',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 40
  },
  infoImage: { width: 24, height: 24 },
  grid: { flex: 1, marginTop: 102, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 10 },
  gameSquare: { width: 130, height: 130, margin: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  gameImage: { width: '100%', height: '100%' },
});

export default GameSelectionScreen;
