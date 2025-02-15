import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  Text, 
  Dimensions 
} from 'react-native';

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

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, gameConfig }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [message, setMessage] = useState<string>('Memorize the cards');
  const openCardsRef = useRef<number[]>([]);
  const inputLockRef = useRef<boolean>(false);

  const initGame = () => {
    const newCards = generateCards(gameConfig);
    setCards(newCards);
    setMessage('Memorize the cards');
    openCardsRef.current = [];
    inputLockRef.current = true;
    setTimeout(() => {
      setCards(prev => prev.map(card => ({ ...card, revealed: false })));
      setMessage('Choose a card');
      inputLockRef.current = false;
    }, 2000);
  };

  useEffect(() => {
    initGame();
  }, [gameConfig]);

  const flipCard = (index: number) => {
    setCards(prev =>
      prev.map((card, i) => (i === index ? { ...card, revealed: true } : card))
    );
  };

  const unflipCards = (indices: number[]) => {
    setCards(prev =>
      prev.map((card, i) =>
        indices.includes(i) ? { ...card, revealed: false } : card
      )
    );
  };

  const markMatched = (indices: number[]) => {
    setCards(prev =>
      prev.map((card, i) =>
        indices.includes(i) ? { ...card, matched: true } : card
      )
    );
  };

  const handleCardPress = async (index: number) => {
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
        setMessage('Match found!');
        await new Promise(res => setTimeout(res, 500));
      } else {
        setMessage('No match, try again');
        await new Promise(res => setTimeout(res, 700));
        unflipCards([first, second]);
      }
      openCardsRef.current = [];
      inputLockRef.current = false;
    }
  };

  useEffect(() => {
    if (cards.length && cards.every(card => card.matched)) {
      setMessage('You completed the game!');
    }
  }, [cards]);

  if (gameConfig.numPairs === 6) {
    const rows = chunkArray(cards, 3);
    return (
      <ImageBackground source={gameConfig.background} style={styles.background} resizeMode="cover">
        <View style={styles.container}>
          <ImageBackground source={require('./assets/Rectangle.png')} style={styles.header} resizeMode="cover">
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Image source={require('./assets/back.png')} style={styles.backButtonImage} resizeMode="contain" />
            </TouchableOpacity>
            <Image source={require('./assets/Logo.png')} style={styles.icon} />
          </ImageBackground>
          <Text style={styles.message}>{message}</Text>
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
      </ImageBackground>
    );
  } else {
    return (
      <ImageBackground source={gameConfig.background} style={styles.background} resizeMode="cover">
        <View style={styles.container}>
          <ImageBackground source={require('./assets/Rectangle.png')} style={styles.header} resizeMode="cover">
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Image source={require('./assets/back.png')} style={styles.backButtonImage} resizeMode="contain" />
            </TouchableOpacity>
            <Image source={require('./assets/Logo.png')} style={styles.icon} />
          </ImageBackground>
          <Text style={styles.message}>{message}</Text>
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
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    width: '100%',
    height: 102,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: 62, height: 39 },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#541896',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  backButtonImage: { width: 20, height: 20 },
  message: {
    fontSize: 16,
    margin: 10,
    textAlign: 'center',
    color: '#fff',
  },
  rowsContainer: {
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  card12: {
    width: 100,
    height: 100,
    marginHorizontal: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cardImage: { width: '100%', height: '100%' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardDefault: {
    width: 150,
    height: 150,
    marginVertical: 15,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default MemoryGame;
