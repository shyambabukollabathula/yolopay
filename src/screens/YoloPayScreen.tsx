import React, {useState} from 'react';
import { BlurView } from 'expo-blur';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import type {AnimatedStyle} from 'react-native-reanimated';
import {faker} from '@faker-js/faker';

const {width, height} = Dimensions.get('window');

const YoloPayScreen = () => {
  const [paymentMode, setPaymentMode] = useState<'pay' | 'card'>('pay');
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [cardData] = useState({
    number: faker.finance.creditCardNumber('####-####-####-####'),
    expiry: '01/28',
    cvv: faker.finance.creditCardCVV(),
    name: faker.person.fullName().toUpperCase(),
  });

  // Animation values
  const freezeOpacity = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const freezeRotation = useSharedValue(0);

  const toggleFreeze = () => {
    setIsCardFrozen(!isCardFrozen);
    
    if (!isCardFrozen) {
      // Start freeze animation
      freezeOpacity.value = withTiming(0.9, {duration: 800});
      cardScale.value = withSequence(
        withTiming(0.98, {duration: 150}),
        withTiming(1.02, {duration: 150}),
        withTiming(1, {duration: 150})
      );
      freezeRotation.value = withRepeat(
        withSequence(
          withTiming(2, {duration: 80}),
          withTiming(-2, {duration: 80}),
          withTiming(1, {duration: 80}),
          withTiming(-1, {duration: 80}),
          withTiming(0, {duration: 80})
        ),
        2,
        false
      );
    } else {
      // Remove freeze animation
      freezeOpacity.value = withTiming(0, {duration: 600});
      cardScale.value = withTiming(1, {duration: 400});
    }
  };

  const freezeAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: freezeOpacity.value,
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const scaleTransform = {scale: cardScale.value};
    const rotateTransform = {rotate: `${freezeRotation.value}deg`};
    
    return {
      transform: [scaleTransform, rotateTransform],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>select payment mode</Text>
        <Text style={styles.subtitle}>
          choose your preferred payment method to make payment
        </Text>
      </View>

      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            paymentMode === 'pay' && styles.activeModeButton,
          ]}
          onPress={() => setPaymentMode('pay')}>
          <Text
            style={[
              styles.modeText,
              paymentMode === 'pay' && styles.activeModeText,
            ]}>
            pay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            paymentMode === 'card' && styles.activeModeButton,
          ]}
          onPress={() => setPaymentMode('card')}>
          <Text
            style={[
              styles.modeText,
              paymentMode === 'card' && styles.activeModeText,
            ]}>
            card
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.cardLabel}>YOUR DIGITAL DEBIT CARD</Text>
        
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          {/* Card Content: Blur if frozen */}
          {isCardFrozen ? (
            <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="light">
              <View style={styles.cardContent}>
                <View style={styles.cardPattern}>
                  {/* Geometric pattern lines */}
                  <View style={[styles.patternLine, {top: 50, left: 20, width: 80, transform: [{rotate: '45deg'}]}]} />
                  <View style={[styles.patternLine, {top: 100, left: 60, width: 60, transform: [{rotate: '-30deg'}]}]} />
                  <View style={[styles.patternLine, {top: 150, left: 30, width: 100, transform: [{rotate: '60deg'}]}]} />
                  <View style={[styles.patternLine, {top: 200, left: 80, width: 70, transform: [{rotate: '-45deg'}]}]} />
                </View>
                <View style={styles.profileSection}>
                  <View style={styles.profileIcon}>
                    <Text style={styles.profileText}>y</Text>
                  </View>
                  <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>😱</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.freezeButton} onPress={toggleFreeze}>
                  <Text style={styles.freezeIcon}>❄️</Text>
                  <Text style={styles.freezeText}>unfreeze</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          ) : (
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardBrand}>YOLO</Text>
                <Text style={styles.cardType}>DEBIT</Text>
              </View>
              <View style={styles.cardNumber}>
                <Text style={styles.numberText}>{cardData.number}</Text>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>expiry</Text>
                  <Text style={styles.cardValue}>{cardData.expiry}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardLabel}>CVV</Text>
                  <Text style={styles.cardValue}>***</Text>
                </View>
                <TouchableOpacity style={styles.freezeButton} onPress={toggleFreeze}>
                  <Text style={styles.freezeIcon}>❄️</Text>
                  <Text style={styles.freezeText}>freeze</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardName}>
                <Text style={styles.nameText}>{cardData.name}</Text>
              </View>
              <TouchableOpacity style={styles.copyButton}>
                <Text style={styles.copyText}>📋 copy details</Text>
              </TouchableOpacity>
              <View style={styles.cardLogo}>
                <Text style={styles.logoText}>RuPay</Text>
                <Text style={styles.logoSubtext}>PREPAID</Text>
              </View>
            </View>
          )}
          {/* Freeze Overlay: animated frost and lines */}
          <Animated.View style={[styles.freezeOverlay, freezeAnimatedStyle]} pointerEvents="none">
            <View style={styles.freezePattern}>
              {Array.from({length: 15}).map((_, i) => (
                <View
                  key={`crystal-${i}`}
                  style={[
                    styles.freezeCrystal,
                    {
                      left: Math.random() * (width * 0.7),
                      top: Math.random() * 280,
                      transform: [{rotate: `${Math.random() * 360}deg`}],
                      opacity: 0.6 + Math.random() * 0.4,
                    },
                  ]}
                />
              ))}
              {Array.from({length: 8}).map((_, i) => (
                <View
                  key={`frost-${i}`}
                  style={[
                    styles.frostLine,
                    {
                      left: Math.random() * (width * 0.6),
                      top: Math.random() * 260,
                      width: 30 + Math.random() * 50,
                      transform: [{rotate: `${Math.random() * 180}deg`}],
                      opacity: 0.3 + Math.random() * 0.3,
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.frostGradient} />
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  modeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 15,
  },
  activeModeButton: {
    borderColor: '#fff',
  },
  modeText: {
    color: '#888',
    fontSize: 16,
  },
  activeModeText: {
    color: '#fff',
  },
  cardContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
    letterSpacing: 1,
  },
  card: {
    width: width * 0.85,
    height: 320,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardContent: {
    flex: 1,
  },
  cardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#ff4444',
    opacity: 0.6,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a9eff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emojiContainer: {
    marginLeft: 10,
  },
  emoji: {
    fontSize: 24,
  },
  freezeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  freezeIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  freezeText: {
    color: '#fff',
    fontSize: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardBrand: {
    color: '#ff4444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardType: {
    fontSize: 12,
    backgroundColor: '#4a9eff',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardNumber: {
    marginBottom: 30,
  },
  numberText: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  cardInfo: {
    flex: 1,
  },
  cardValue: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  cardName: {
    marginBottom: 15,
  },
  nameText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  copyButton: {
    marginBottom: 15,
  },
  copyText: {
    color: '#ff4444',
    fontSize: 12,
  },
  cardLogo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#888',
    fontSize: 10,
  },
  freezeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(173, 216, 230, 0.2)',
    borderRadius: 20,
  },
  freezePattern: {
    flex: 1,
    position: 'relative',
  },
  freezeCrystal: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  frostLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#fff',
    borderRadius: 0.5,
  },
  frostGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
});

export default YoloPayScreen;