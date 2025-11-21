import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { submitFeedback, FeedbackData } from '../services/forms';
import { useStore } from '../store';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

const FEEDBACK_TYPES: FeedbackData['feedbackType'][] = [
  'Bug Report',
  'Feature Request',
  'General Feedback',
];

export function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const selectedBelt = useStore((state) => state.selectedBelt);

  const [feedbackType, setFeedbackType] = useState<FeedbackData['feedbackType']>('General Feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!message.trim()) {
      // Could add alert here, but let's keep it lean
      return;
    }

    setIsSubmitting(true);

    await submitFeedback({
      feedbackType,
      message: message.trim(),
      email: email.trim() || undefined,
      belt: selectedBelt || 'unknown',
    });

    // Optimistic success UI
    setIsSubmitting(false);
    setShowSuccess(true);

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Auto-close after showing success
    setTimeout(() => {
      setShowSuccess(false);
      setMessage('');
      setEmail('');
      setFeedbackType('General Feedback');
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (!isSubmitting && !showSuccess) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Dar Feedback</Text>
            <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {showSuccess ? (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successText}>Feedback enviado!</Text>
              <Text style={styles.successSubtext}>Obrigado por ajudar a melhorar o app.</Text>
            </View>
          ) : (
            <>
              {/* Feedback Type Selector */}
              <View style={styles.field}>
                <Text style={styles.label}>Tipo de Feedback</Text>
                <View style={styles.typeContainer}>
                  {FEEDBACK_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        feedbackType === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setFeedbackType(type)}
                      disabled={isSubmitting}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          feedbackType === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type === 'Bug Report' && 'Bug'}
                        {type === 'Feature Request' && 'Sugestão'}
                        {type === 'General Feedback' && 'Geral'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Message */}
              <View style={styles.field}>
                <Text style={styles.label}>Mensagem *</Text>
                <TextInput
                  style={styles.textArea}
                  multiline
                  numberOfLines={6}
                  maxLength={500}
                  placeholder="Descreva seu feedback aqui..."
                  placeholderTextColor="#999"
                  value={message}
                  onChangeText={setMessage}
                  editable={!isSubmitting}
                  autoFocus
                />
                <Text style={styles.charCount}>{message.length}/500</Text>
              </View>

              {/* Email (Optional) */}
              <View style={styles.field}>
                <Text style={styles.label}>Email (opcional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="seu@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  editable={!isSubmitting}
                />
                <Text style={styles.hint}>
                  Se quiser uma resposta nossa, deixe seu email
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!message.trim() || isSubmitting) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!message.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Enviar</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    paddingHorizontal: 8,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fafafa',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  successIcon: {
    fontSize: 72,
    color: '#34C759',
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
