import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

interface RulesScreenProps {
  onBack: () => void;
}

const RulesScreen: React.FC<RulesScreenProps> = ({ onBack }) => {
  return (
    <ImageBackground
          source={require('./assets/bg_1.png')}
          style={styles.background}
          imageStyle={{ transform: [{ rotate: '180deg' }] }}
          resizeMode="cover"
        >
    <View style={styles.container}>
      <ImageBackground
        source={require('./assets/Rectangle.png')}
        style={styles.header}
        resizeMode="cover"
      >

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Image source={require('./assets/back.png')} resizeMode="contain" />
        </TouchableOpacity>

        <Image source={require('./assets/Logo.png')} style={styles.icon} />
      </ImageBackground>
      <View style={styles.content}>
        <Text style={styles.rules}>Rules</Text>
        <Text style={styles.rulesText}> Flip two cards at a time to find matching pairs. You are given a memorization period before the cards are turned face down. If the two flipped cards match, they remain open; if not, they will flip back. Try to match all pairs as quickly as possible!
        </Text>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    width: '100%',
    height: 62,
    backgroundColor: '#541896',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: 62, height: 39 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  rules: {
    fontWeight: '600',
    fontSize: 22,
    color: '#fff',
    paddingBottom: 20,
    fontFamily: 'Baloo2-Regular'
  },
  rulesText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Baloo2-Regular'
  },
  background: { flex: 1, width: '100%', height: '100%' },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#541896',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20
  },
});

export default RulesScreen;
