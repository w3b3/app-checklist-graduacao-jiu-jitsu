import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';
import { logEvent } from '../services/analytics';

export function JoinClassBetaButton() {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Log analytics event
    await logEvent('join_class_beta_clicked', {
      timestamp: Date.now(),
    });

    // Google Form for BJJ Checklist - Interesse em Turmas
    const formUrl = 'https://docs.google.com/forms/d/1Z_W1SN9Rl3KDqKPR6LrU0R7V899FDDP8P0pL1tWP3RU/viewform';

    try {
      await Linking.openURL(formUrl);
    } catch (error) {
      console.error('Failed to open form:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎓</Text>
      <Text style={styles.title}>Sua academia usa o BJJ Checklist?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Entrar na Turma</Text>
        <View style={styles.betaBadge}>
          <Text style={styles.betaText}>BETA</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.description}>
        Conecte-se com seus colegas e professor para rastrear progresso em grupo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  betaBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  betaText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
});
