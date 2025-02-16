import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';

interface GameModalProps {
  visible: boolean;
  message: string;
  onHomePress: () => void;
  onSecondaryPress: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ visible, message, onHomePress, onSecondaryPress }) => {
  const secondaryIcon =
    message === "You lost!" ? require('./assets/back.png') : require('./assets/next.png');
  const homeIcon = require('./assets/home.png');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onHomePress}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onHomePress} style={styles.iconButton}>
              <Image source={homeIcon} style={styles.iconImage} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSecondaryPress} style={styles.iconButton}>
              <Image source={secondaryIcon} style={styles.iconImage} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    zIndex: 1000, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalText: { 
    fontSize: 20, 
    marginBottom: 10 
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150, 
    marginTop: 10,
  },
  iconButton: {
    padding: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
});

export default GameModal;
