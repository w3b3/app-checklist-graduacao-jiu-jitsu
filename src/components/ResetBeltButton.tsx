import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ResetBeltButtonProps {
  beltName: string;
  onReset: () => void;
}

export const ResetBeltButton: React.FC<ResetBeltButtonProps> = ({ beltName, onReset }) => {
  const handlePress = () => {
    Alert.alert(
      'Limpar Progresso?',
      `Todas as marcações da faixa ${beltName} serão removidas. Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: onReset,
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Limpar progresso da faixa ${beltName}`}
    >
      <Ionicons name="trash-outline" size={16} color="#DC2626" />
      <Text style={styles.text}>Limpar Progresso da Faixa</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
});
