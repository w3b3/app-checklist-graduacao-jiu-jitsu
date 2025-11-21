import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform, ActionSheetIOS, Modal, Pressable } from 'react-native';
import { Belt, BeltId } from '../types';
import { BELT_ORDER, BELT_COLORS } from '../data/belts';

interface BeltDropdownProps {
  selectedBelt: BeltId;
  onSelectBelt: (belt: BeltId) => void;
}

export const BeltDropdown: React.FC<BeltDropdownProps> = ({ selectedBelt, onSelectBelt }) => {
  const currentBelt = BELT_COLORS[selectedBelt];
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      // Use ActionSheet on iOS
      const options = [...BELT_ORDER.map((belt) => belt.displayName), 'Cancelar'];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          title: 'Selecionar Faixa',
        },
        (buttonIndex) => {
          if (buttonIndex < BELT_ORDER.length) {
            onSelectBelt(BELT_ORDER[buttonIndex].id);
          }
        }
      );
    } else {
      // Use custom modal on Android (Alert.alert has 3-button limit)
      setModalVisible(true);
    }
  };

  const handleSelectBelt = (beltId: BeltId) => {
    onSelectBelt(beltId);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: currentBelt.lightColor }]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Graduação: ${currentBelt.displayName}. Tocar para alterar`}
      >
        <View style={styles.content}>
          <Text style={styles.label}>Graduação:</Text>
          <View style={styles.beltInfo}>
            <View style={[styles.colorBadge, { backgroundColor: currentBelt.color }]} />
            <Text style={[styles.beltName, { color: currentBelt.textColor }]}>
              {currentBelt.displayName}
            </Text>
            <Text style={styles.chevron}>▼</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal for Android (Alert.alert has 3-button limit) */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Faixa</Text>
            <Text style={styles.modalSubtitle}>Escolha sua faixa atual:</Text>

            {BELT_ORDER.map((belt) => (
              <TouchableOpacity
                key={belt.id}
                style={styles.modalOption}
                onPress={() => handleSelectBelt(belt.id)}
              >
                <View style={[styles.modalColorBadge, { backgroundColor: belt.color }]} />
                <Text style={styles.modalOptionText}>{belt.displayName}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  beltInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  beltName: {
    fontSize: 16,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  // Modal styles for Android
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  modalColorBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalCancel: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
