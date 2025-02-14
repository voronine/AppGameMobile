import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Button, 
  StyleSheet, 
  ImageBackground 
} from 'react-native';

interface Card {
  id: number;
  value: string;
  revealed: boolean;
  matched: boolean;
}

interface MemoryGameProps {
  onBack: () => void;
}

const generateCards = (level: number): Card[] => {
  const numPairs = level === 1 ? 2 : level === 2 ? 4 : 6;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const selectedLetters = letters.split('').slice(0, numPairs);
  const cards: Card[] = [];
  selectedLetters.forEach((letter, index) => {
    cards.push({ id: index * 2, value: letter, revealed: true, matched: false });
    cards.push({ id: index * 2 + 1, value: letter, revealed: true, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
};

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [level, setLevel] = useState<number>(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [message, setMessage] = useState<string>('');
  const openCardsRef = useRef<number[]>([]);
  const inputLockRef = useRef<boolean>(false);

  const initLevel = () => {
    const newCards = generateCards(level);
    setCards(newCards);
    setMessage(`Level ${level}: Memorize the cards`);
    openCardsRef.current = [];
    inputLockRef.current = true;
    const revealTime = level === 1 ? 2000 : level === 2 ? 3000 : 4000;
    setTimeout(() => {
      setCards(prev => prev.map(card => ({ ...card, revealed: false })));
      setMessage('Choose a card');
      inputLockRef.current = false;
    }, revealTime);
  };

  useEffect(() => {
    initLevel();
  }, [level]);

  const flipCard = (index: number) => {
    setCards(prev =>
      prev.map((card, i) =>
        i === index ? { ...card, revealed: true } : card
      )
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
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setMessage(`Level ${level} completed!`);
    }
  }, [cards, level]);

  const nextLevel = () => {
    setLevel(prev => (prev < 3 ? prev + 1 : 1));
  };

  return (
    <ImageBackground
      source={require('./assets/gradient.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Memory Game</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.grid}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                card.revealed || card.matched ? styles.cardRevealed : styles.cardHidden
              ]}
              onPress={() => handleCardPress(index)}
            >
              <Text style={styles.cardText}>
                {card.revealed || card.matched ? card.value : '?'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {cards.length > 0 && cards.every(card => card.matched) && (
          <View style={styles.buttonContainer}>
            <Button title="Next Level" onPress={nextLevel} />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    width: '100%',
    height: 102,
    backgroundColor: '#541896',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: { padding: 10 },
  backText: { color: '#fff', fontSize: 18 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 22, fontWeight: 'bold' },
  message: { fontSize: 16, margin: 10, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: {
    width: 70,
    height: 70,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cardHidden: { backgroundColor: '#333' },
  cardRevealed: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#333' },
  cardText: { fontSize: 24, fontWeight: 'bold' },
  buttonContainer: { marginTop: 20 },
});

export default MemoryGame;
