import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground, Image, Text } from 'react-native';
import { GlobalLivesContext } from './GlobalLivesContext';
import GameModal from './GameModal';

export interface GameConfig {
  background: any;
  cardFaces: any[];
  numPairs: number;
}

interface Card {
  id: number;
  value: number;
  revealed: boolean;
  matched: boolean;
}

interface MemoryGameProps {
  onBack: () => void;
  gameConfig: GameConfig;
  onNextLevel?: () => void;
}

const generateCards = (config: GameConfig): Card[] => {
  const cards: Card[] = [];
  for (let i = 0; i < config.numPairs; i++) {
    cards.push({ id: i * 2, value: i, revealed: true, matched: false });
    cards.push({ id: i * 2 + 1, value: i, revealed: true, matched: false });
  }
  return cards.sort(() => Math.random() - 0.5);
};

const chunkArray = (array: Card[], chunkSize: number): Card[][] => {
  const chunks: Card[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const DEFAULT_LIVES = 8;

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, gameConfig, onNextLevel }) => {
  const { lives, decrementLives } = useContext(GlobalLivesContext);
  const [cards, setCards] = useState<Card[]>([]);
  const [showLostModal, setShowLostModal] = useState<boolean>(false);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const openCardsRef = useRef<number[]>([]);
  const inputLockRef = useRef<boolean>(false);

  const initGame = () => {
    const newCards = generateCards(gameConfig);
    setCards(newCards);
    openCardsRef.current = [];
    inputLockRef.current = true;
    setTimeout(() => {
      setCards(prev => prev.map(card => ({ ...card, revealed: false })));
      inputLockRef.current = false;
    }, 2000);
  };

  useEffect(() => {
    initGame();
  }, [gameConfig]);

  const restartGame = () => {
    setShowLostModal(false);
    setShowWinModal(false);
    initGame();
  };

  const handleNextLevel = () => {
    setShowWinModal(false); 
    if (onNextLevel) {
      onNextLevel();
    } else {
      restartGame();
    }
  };

  const flipCard = (index: number) => {
    setCards(prev => prev.map((card, i) => (i === index ? { ...card, revealed: true } : card)));
  };

  const unflipCards = (indices: number[]) => {
    setCards(prev => prev.map((card, i) => (indices.includes(i) ? { ...card, revealed: false } : card)));
  };

  const markMatched = (indices: number[]) => {
    setCards(prev => prev.map((card, i) => (indices.includes(i) ? { ...card, matched: true } : card)));
  };

  const handleCardPress = async (index: number) => {
    if (lives <= 0) return;
    if (inputLockRef.current) return;
    if (cards[index].revealed || cards[index].matched) return;
    if (openCardsRef.current.length >= 2) return;
    flipCard(index);
    openCardsRef.current.push(index);
    if (openCardsRef.current.length === 2) {
      inputLockRef.current = true;
      await new Promise(res => setTimeout(res, 300));
      const [first, second] = openCardsRef.current;
      if (cards[first].value === cards[second].value) {
        markMatched([first, second]);
        await new Promise(res => setTimeout(res, 500));
      } else {
        const newLives = lives - 1;
        decrementLives();
        await new Promise(res => setTimeout(res, 700));
        if (newLives < 1) {
          setShowLostModal(true);
          inputLockRef.current = true;
        } else {
          unflipCards([first, second]);
        }
      }
      openCardsRef.current = [];
      inputLockRef.current = false;
    }
  };

  useEffect(() => {
    if (lives < 1) {
      setShowLostModal(true);
      inputLockRef.current = true;
    }
  }, [lives]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setShowWinModal(true);
      inputLockRef.current = true;
    }
  }, [cards]);

  const renderHeader = () => (
    <ImageBackground source={require('./assets/Rectangle.png')} style={styles.header} resizeMode="cover">
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Image source={require('./assets/back.png')} style={styles.backButtonImage} resizeMode="contain" />
      </TouchableOpacity>
      <Image source={require('./assets/heart.png')} />
      <View style={styles.livesIndicator}>
        <Text style={styles.livesText}>{lives}/{DEFAULT_LIVES}</Text>
      </View>
    </ImageBackground>
  );

  if (gameConfig.numPairs === 6) {
    const rows = chunkArray(cards, 3);
    return (
      <ImageBackground source={gameConfig.background} style={styles.background} resizeMode="cover">
        <View style={styles.container}>
          {renderHeader()}
          <View style={styles.rowsContainer}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((card, cardIndex) => {
                  const globalIndex = rowIndex * 3 + cardIndex;
                  return (
                    <TouchableOpacity key={card.id} style={styles.card12} onPress={() => handleCardPress(globalIndex)}>
                      {card.revealed || card.matched ? (
                        <Image source={gameConfig.cardFaces[card.value]} style={styles.cardImage} resizeMode="contain" />
                      ) : (
                        <Image source={require('./assets/cardBack.png')} style={styles.cardImage} resizeMode="contain" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
        <GameModal 
          visible={showLostModal} 
          message="You lost!" 
          onHomePress={onBack} 
          onSecondaryPress={restartGame} 
        />
        <GameModal 
          visible={showWinModal} 
          message="You won!" 
          onHomePress={onBack} 
          onSecondaryPress={handleNextLevel} 
        />
      </ImageBackground>
    );
  } else {
    return (
      <ImageBackground source={gameConfig.background} style={styles.background} resizeMode="cover">
        <View style={styles.container}>
          {renderHeader()}
          <View style={styles.grid}>
            {cards.map((card, index) => (
              <TouchableOpacity key={index} style={styles.cardDefault} onPress={() => handleCardPress(index)}>
                {card.revealed || card.matched ? (
                  <Image source={gameConfig.cardFaces[card.value]} style={styles.cardImage} resizeMode="contain" />
                ) : (
                  <Image source={require('./assets/cardBack.png')} style={styles.cardImage} resizeMode="contain" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <GameModal 
          visible={showLostModal} 
          message="You lost!" 
          onHomePress={onBack} 
          onSecondaryPress={restartGame} 
        />
        <GameModal 
          visible={showWinModal} 
          message="You won!" 
          onHomePress={onBack} 
          onSecondaryPress={handleNextLevel} 
        />
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { width: '100%', height: 102, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: 20, width: 28, height: 28 },
  backButtonImage: { width: 28, height: 28 },
  livesIndicator: { 
    position: 'absolute', 
    right: 20, 
    top: 30,
    backgroundColor: '#00FFB2',
    borderRadius: 50,
    width: 45,
    display: 'flex',
    alignItems: 'center'
  },
  livesText: { fontSize: 18, fontWeight: 'bold', color: '#fff', fontFamily: 'Baloo2-Regular'},
  rowsContainer: { alignSelf: 'center', paddingTop: 15 },
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  card12: { width: 100, height: 100, marginHorizontal: 7.5, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#2E2B42', borderWidth: 3, borderColor: '#6EBCF7', overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  cardDefault: { width: 150, height: 150, marginVertical: 15, marginHorizontal: 8, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#2E2B42', borderWidth: 3, borderColor: '#6EBCF7', overflow: 'hidden' }
});

export default MemoryGame;
