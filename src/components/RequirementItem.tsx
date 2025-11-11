import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Technique, TechniqueProgress, BeltId } from '../types';
import { BELT_COLORS } from '../data/belts';
import { TextInputModal } from './TextInputModal';

interface RequirementItemProps {
  technique: Technique;
  progress: TechniqueProgress;
  currentBelt: BeltId;
  onToggle: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  onUpdateNote?: (note: string) => void;
  onUpdateUrl?: (url: string) => void;
}

export const RequirementItem: React.FC<RequirementItemProps> = ({
  technique,
  progress,
  currentBelt,
  onToggle,
  onExpand,
  isExpanded = false,
  onUpdateNote,
  onUpdateUrl,
}) => {
  const belt = BELT_COLORS[currentBelt];
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [urlModalVisible, setUrlModalVisible] = useState(false);

  const handleNotePress = () => {
    setNoteModalVisible(true);
  };

  const handleNoteSave = (text: string) => {
    if (onUpdateNote) {
      onUpdateNote(text);
    }
    setNoteModalVisible(false);
  };

  const handleUrlPress = () => {
    setUrlModalVisible(true);
  };

  const handleUrlSave = (text: string) => {
    if (onUpdateUrl) {
      onUpdateUrl(text);
    }
    setUrlModalVisible(false);
  };

  // Get belt badges (other belts this technique counts toward)
  const otherBelts = technique.countsToward.filter(ct => ct.belt !== currentBelt);

  // Belt emoji mapping
  const getBeltEmoji = (beltId: BeltId): string => {
    const emojiMap = {
      azul: '🔵',
      roxa: '🟣',
      marrom: '🟤',
      preta: '⚫',
    };
    return emojiMap[beltId];
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
            {technique.name}
          </Text>
          {technique.position && (
            <Text style={styles.position}>de {technique.position}</Text>
          )}
          {/* Cross-belt badges */}
          {otherBelts.length > 0 && (
            <View style={styles.badgesContainer}>
              <Text style={styles.badgesLabel}>Também conta para:</Text>
              <View style={styles.badges}>
                {otherBelts.map(ct => (
                  <Text key={ct.belt} style={styles.badge}>
                    {getBeltEmoji(ct.belt)}
                  </Text>
                ))}
              </View>
            </View>
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
              size={24}
              color={isExpanded ? belt.color : '#9CA3AF'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Expanded State */}
      {isExpanded && (
        <View style={styles.expandedContainer}>
          {/* Show all belt requirements this technique counts toward */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Conta para os requisitos:</Text>
            {technique.countsToward.map(ct => {
              const beltColor = BELT_COLORS[ct.belt];
              return (
                <View key={`${ct.belt}-${ct.requirementId}`} style={styles.requirementRow}>
                  <Text style={styles.requirementEmoji}>{getBeltEmoji(ct.belt)}</Text>
                  <Text
                    style={[
                      styles.requirementText,
                      ct.belt === currentBelt && { fontWeight: '700', color: beltColor.textColor }
                    ]}
                  >
                    {BELT_COLORS[ct.belt].displayName}: {ct.requirementName}
                  </Text>
                </View>
              );
            })}
          </View>

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

      {/* Modals */}
      <TextInputModal
        visible={noteModalVisible}
        title={progress.note ? 'Editar Nota' : 'Adicionar Nota'}
        placeholder="Digite uma nota para esta técnica..."
        initialValue={progress.note}
        onCancel={() => setNoteModalVisible(false)}
        onSave={handleNoteSave}
      />

      <TextInputModal
        visible={urlModalVisible}
        title={progress.mediaUrl ? 'Editar Link' : 'Adicionar Link'}
        placeholder="Cole o link do vídeo ou recurso..."
        initialValue={progress.mediaUrl}
        onCancel={() => setUrlModalVisible(false)}
        onSave={handleUrlSave}
      />
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
  position: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontStyle: 'italic',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  badgesLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    fontSize: 16,
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
  requirementsContainer: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  requirementEmoji: {
    fontSize: 14,
  },
  requirementText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    flex: 1,
  },
  noteContainer: {
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
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
    color: '#4B5563',
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
