import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ImageBackground,
} from 'react-native';

interface GameModalProps {
  visible: boolean;
  message: string;
  onHomePress: () => void;
  onSecondaryPress: () => void;
}

const GameModal: React.FC<GameModalProps> = ({
  visible,
  message,
  onHomePress,
  onSecondaryPress,
}) => {
  const secondaryIcon =
    message === 'You lost!' ? require('./assets/back.png') : require('./assets/next.png');
  const homeIcon = require('./assets/home.png');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onHomePress}
    >
      <View style={styles.modalContainer}>
        <ImageBackground
          source={require('./assets/bg_1.png')}
          style={styles.backgroundImage}
          imageStyle={{ transform: [{ rotate: '180deg' }] }}
          resizeMode="cover"
        >
          <View style={styles.modalContent}>
            <View style={styles.squareContainer}>
              <Text style={styles.modalText}>{message}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onHomePress} style={styles.iconButtonHomeOutside}>
            <Image
              source={homeIcon}
              style={styles.iconImageHomeOutside}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onSecondaryPress}>
              <Image
                source={secondaryIcon}
                style={styles.iconImageArrow}
                resizeMode="contain"
              />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    width: 310,
    height: 160,
    padding: 42,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    color: '#fff',
    textTransform: 'uppercase',
    fontFamily: 'Baloo2-Regular'
  },
  squareContainer: {
    width: 160,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5A1792',
    borderRadius: 20,
  },
  iconImageArrow: {
    width: 40,
    height: 40,
  },
  iconButtonHomeOutside: {
    width: 40,
    height: 40,
  },
  iconImageHomeOutside: {
    width: 40,
    height: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
    marginTop: 10,
  },
});

export default GameModal;
