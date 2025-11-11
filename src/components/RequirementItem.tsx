import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Requirement, RequirementProgress } from '../types';
import { BELT_COLORS } from '../data/belts';
import { TextInputModal } from './TextInputModal';
import { selectPhotoSource, takePhoto, pickPhoto } from '../utils/photoUtils';

interface RequirementItemProps {
  requirement: Requirement;
  progress: RequirementProgress;
  onToggle: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  onUpdateNote?: (note: string) => void;
  onUpdateUrl?: (url: string) => void;
  onUpdatePhoto?: (photoUri: string) => void;
  onRemovePhoto?: () => void;
}

export const RequirementItem: React.FC<RequirementItemProps> = ({
  requirement,
  progress,
  onToggle,
  onExpand,
  isExpanded = false,
  onUpdateNote,
  onUpdateUrl,
  onUpdatePhoto,
  onRemovePhoto,
}) => {
  const belt = BELT_COLORS[requirement.belt];
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

  const handlePhotoPress = async () => {
    const source = await selectPhotoSource();
    if (!source) return;

    try {
      const photoUri = source === 'camera' ? await takePhoto() : await pickPhoto();
      if (photoUri && onUpdatePhoto) {
        onUpdatePhoto(photoUri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a foto.');
      console.error('Error adding photo:', error);
    }
  };

  const handlePhotoLongPress = () => {
    if (!progress.photoUri) return;

    Alert.alert(
      'Remover Foto',
      'Deseja remover esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            if (onRemovePhoto) {
              onRemovePhoto();
            }
          },
        },
      ]
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
              size={24}
              color={isExpanded ? belt.color : '#9CA3AF'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Expanded State */}
      {isExpanded && (
        <View style={styles.expandedContainer}>
          {progress.photoUri ? (
            <TouchableOpacity
              style={styles.photoContainer}
              onLongPress={handlePhotoLongPress}
              delayLongPress={500}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: progress.photoUri }}
                style={styles.photo}
                resizeMode="cover"
              />
              <Text style={styles.photoHint}>Pressione e segure para remover</Text>
            </TouchableOpacity>
          ) : null}

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
            <TouchableOpacity style={styles.actionButton} onPress={handlePhotoPress}>
              <Text style={styles.actionButtonText}>
                {progress.photoUri ? '📷 Alterar foto' : '+ Adicionar foto'}
              </Text>
            </TouchableOpacity>
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
        placeholder="Digite uma nota para este requisito..."
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
  targetCount: {
    fontSize: 14,
    color: '#4B5563',
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
  photoContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  photo: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  photoHint: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
