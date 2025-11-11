import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';

interface UpgradeAnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
}

export function UpgradeAnnouncementModal({ visible, onClose }: UpgradeAnnouncementModalProps) {
  const handleVisitTatame = () => {
    Linking.openURL('https://tatame0.com');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.emoji}>🥋✨</Text>
              <Text style={styles.title}>Atualização Incrível!</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.subtitle}>
                Sistema de Progressão Melhorado
              </Text>

              <Text style={styles.paragraph}>
                Agora suas técnicas contam para <Text style={styles.bold}>todas as faixas!</Text>
              </Text>

              <View style={styles.featureBox}>
                <Text style={styles.featureEmoji}>🔵🟣🟤⚫</Text>
                <Text style={styles.featureText}>
                  Quando você marca uma técnica como aprendida, ela automaticamente conta
                  para os requisitos de <Text style={styles.bold}>Azul, Roxa, Marrom e Preta</Text>!
                </Text>
              </View>

              <View style={styles.exampleBox}>
                <Text style={styles.exampleTitle}>Exemplo:</Text>
                <Text style={styles.exampleText}>
                  ✅ Arm lock da guarda fechada
                </Text>
                <Text style={styles.exampleSubtext}>
                  • Conta para Faixa Azul (Guarda Fechada)
                  {'\n'}• Conta para Faixa Roxa (3 Arm Locks)
                  {'\n'}• Conta para Faixa Marrom (4 Arm Locks)
                  {'\n'}• Conta para Faixa Preta (4 Arm Locks)
                </Text>
              </View>

              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Importante:</Text> Para implementar esta melhoria,
                seu progresso anterior foi resetado. Mas agora você terá uma experiência
                muito mais eficiente! 💪
              </Text>

              {/* Tatame0.com section */}
              <View style={styles.tatameBox}>
                <Text style={styles.tatameEmoji}>🥋</Text>
                <Text style={styles.tatameTitle}>Curtiu o app?</Text>
                <Text style={styles.tatameText}>
                  Conheça mais apps focados em Jiu-Jitsu no{' '}
                  <Text style={styles.link} onPress={handleVisitTatame}>
                    tatame0.com
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Close button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Vamos Treinar! 🥋</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  content: {
    gap: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  featureBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1E40AF',
    textAlign: 'center',
  },
  exampleBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  exampleSubtext: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  tatameBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  tatameEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  tatameTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  tatameText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#78350F',
    textAlign: 'center',
  },
  link: {
    color: '#2563EB',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
