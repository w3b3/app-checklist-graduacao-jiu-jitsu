import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BeltId } from '../types';
import { BELT_COLORS } from '../data/belts';

interface CompletionScreenProps {
  beltId: BeltId;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ beltId }) => {
  const belt = BELT_COLORS[beltId];

  const handleShare = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const today = new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const message = `🥋 Concluí todos os requisitos da Faixa ${belt.displayName}!\n\nBrothers Fight - ${today}\n\nApp: Checklist de Graduação BJJ`;

    try {
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🥋</Text>
        <Text style={styles.title}>Parabéns!</Text>
        <Text style={styles.subtitle}>
          Faixa {belt.displayName} completa
        </Text>
        <Text style={styles.description}>
          Você concluiu todos os requisitos para a faixa {belt.displayName.toLowerCase()}.
        </Text>

        <View style={[styles.beltIndicator, { backgroundColor: belt.color }]} />

        <TouchableOpacity style={[styles.shareButton, { backgroundColor: belt.color }]} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Compartilhar Conquista</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  beltIndicator: {
    width: 120,
    height: 20,
    borderRadius: 10,
    marginBottom: 32,
  },
  shareButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
