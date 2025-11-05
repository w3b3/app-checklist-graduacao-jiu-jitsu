import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Requirement, RequirementProgress } from '../types';
import { BELT_COLORS } from '../data/belts';

interface RequirementItemProps {
  requirement: Requirement;
  progress: RequirementProgress;
  onToggle: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  onUpdateNote?: (note: string) => void;
  onUpdateUrl?: (url: string) => void;
}

export const RequirementItem: React.FC<RequirementItemProps> = ({
  requirement,
  progress,
  onToggle,
  onExpand,
  isExpanded = false,
  onUpdateNote,
  onUpdateUrl,
}) => {
  const belt = BELT_COLORS[requirement.belt];

  const handleNotePress = () => {
    Alert.prompt(
      progress.note ? 'Editar Nota' : 'Adicionar Nota',
      'Digite uma nota para este requisito:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar',
          onPress: (text?: string) => {
            if (onUpdateNote && text !== undefined) {
              onUpdateNote(text);
            }
          },
        },
      ],
      'plain-text',
      progress.note
    );
  };

  const handleUrlPress = () => {
    Alert.prompt(
      progress.mediaUrl ? 'Editar Link' : 'Adicionar Link',
      'Cole o link do vídeo ou recurso:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar',
          onPress: (text?: string) => {
            if (onUpdateUrl && text !== undefined) {
              onUpdateUrl(text);
            }
          },
        },
      ],
      'plain-text',
      progress.mediaUrl
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggle();
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: progress.completed }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View
            style={[
              styles.checkbox,
              progress.completed && { backgroundColor: belt.color, borderColor: belt.color },
            ]}
          >
            {progress.completed && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.name,
              progress.completed && styles.completedText,
            ]}
            numberOfLines={2}
          >
            {requirement.name}
          </Text>
          {requirement.targetCount && (
            <Text style={styles.targetCount}>{requirement.targetCount} técnicas</Text>
          )}
        </View>

        {/* Info Icon */}
        {onExpand && (
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={onExpand}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={isExpanded ? belt.color : '#9CA3AF'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Expanded State */}
      {isExpanded && (
        <View style={styles.expandedContainer}>
          {progress.note ? (
            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>Nota:</Text>
              <Text style={styles.noteText}>{progress.note}</Text>
            </View>
          ) : null}

          {progress.mediaUrl ? (
            <View style={styles.urlContainer}>
              <Text style={styles.urlLabel}>Link:</Text>
              <Text style={styles.urlText} numberOfLines={1}>{progress.mediaUrl}</Text>
            </View>
          ) : null}

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleNotePress}>
              <Text style={styles.actionButtonText}>
                {progress.note ? 'Editar nota' : '+ Adicionar nota'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleUrlPress}>
              <Text style={styles.actionButtonText}>
                {progress.mediaUrl ? 'Editar link' : '+ Adicionar link'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  checkboxContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  targetCount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  infoContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  noteContainer: {
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  urlContainer: {
    marginBottom: 12,
  },
  urlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  urlText: {
    fontSize: 14,
    color: '#1E40AF',
    textDecorationLine: 'underline',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
