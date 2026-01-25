/**
 * List Selector Screen
 *
 * Browse public lists, enter share codes, and manage subscriptions.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  getLists,
  getListById,
  getListByShareCode,
  subscribeByShareCode,
  unsubscribe,
  TechniqueList,
  ListsResponse,
} from '../api/lists';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store';

interface ListSelectorScreenProps {
  onSelectList?: (list: TechniqueList) => void;
  onClose?: () => void;
}

export default function ListSelectorScreen({ onSelectList, onClose }: ListSelectorScreenProps) {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();
  const { setActiveList, cacheTechniques, techniquesCache } = useStore();

  const [lists, setLists] = useState<ListsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isSelectingList, setIsSelectingList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      setError(null);
      const response = await getLists();
      setLists(response);
    } catch (err) {
      console.error('Error fetching lists:', err);
      setError('Não foi possível carregar as listas');
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setIsLoading(true);
    await fetchLists();
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLists();
    setIsRefreshing(false);
  };

  const handleJoinByCode = async () => {
    if (!shareCode.trim()) {
      Alert.alert('Erro', 'Digite um código de compartilhamento');
      return;
    }

    if (!isAuthenticated) {
      Alert.alert('Login Necessário', 'Você precisa estar logado para seguir uma lista');
      return;
    }

    try {
      setIsJoining(true);
      setError(null);

      const list = await subscribeByShareCode(shareCode.trim().toUpperCase());

      Alert.alert('Sucesso', `Você agora está seguindo "${list.name}"`);
      setShareCode('');
      await fetchLists();

      if (onSelectList) {
        onSelectList(list);
      }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Lista não encontrada';
      Alert.alert('Erro', message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleUnsubscribe = async (list: TechniqueList) => {
    Alert.alert(
      'Deixar de Seguir',
      `Tem certeza que deseja deixar de seguir "${list.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              await unsubscribe(list.id);
              await fetchLists();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível deixar de seguir a lista');
            }
          },
        },
      ]
    );
  };

  const handleSelectList = async (list: TechniqueList) => {
    if (isSelectingList) return;

    try {
      setIsSelectingList(true);

      // Check if techniques are already cached
      const cached = techniquesCache[list.id];
      if (!cached?.techniques) {
        // Fetch techniques from API
        const listData = await getListById(list.id);
        cacheTechniques(list.id, listData.techniques);
      }

      // Set as active list in store
      setActiveList(list);

      // Call optional callback
      if (onSelectList) {
        onSelectList(list);
      }

      navigation.goBack();
    } catch (err) {
      console.error('Error selecting list:', err);
      Alert.alert('Erro', 'Não foi possível carregar a lista');
    } finally {
      setIsSelectingList(false);
    }
  };

  const renderListItem = ({ item, isSubscribed }: { item: TechniqueList; isSubscribed?: boolean }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleSelectList(item)}
      onLongPress={isSubscribed ? () => handleUnsubscribe(item) : undefined}
    >
      <View style={styles.listInfo}>
        <View style={styles.listHeader}>
          <Text style={styles.listName}>{item.name}</Text>
          {item.is_default && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Padrão</Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text style={styles.listDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.listStats}>
          <View style={styles.stat}>
            <Ionicons name="list-outline" size={14} color="#666" />
            <Text style={styles.statText}>{item.technique_count} técnicas</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.statText}>{item.subscriber_count} seguidores</Text>
          </View>
          {item.share_code && (
            <View style={styles.stat}>
              <Ionicons name="share-outline" size={14} color="#666" />
              <Text style={styles.statText}>{item.share_code}</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Listas de Técnicas</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
      </View>

      {/* Share Code Input */}
      <View style={styles.shareCodeContainer}>
        <View style={styles.shareCodeInput}>
          <Ionicons name="key-outline" size={20} color="#666" />
          <TextInput
            style={styles.shareCodeTextInput}
            placeholder="Código de compartilhamento"
            placeholderTextColor="#999"
            value={shareCode}
            onChangeText={setShareCode}
            autoCapitalize="characters"
            maxLength={10}
            editable={!isJoining}
          />
        </View>
        <TouchableOpacity
          style={[styles.joinButton, isJoining && styles.joinButtonDisabled]}
          onPress={handleJoinByCode}
          disabled={isJoining}
        >
          {isJoining ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.joinButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={(() => {
          const defaultId = lists?.default?.id;
          const subscribedIds = new Set(lists?.subscribed?.map((l) => l.id) || []);
          const myListIds = new Set(lists?.my_lists?.map((l) => l.id) || []);

          return [
            ...(lists?.default ? [{ ...lists.default, _section: 'default' }] : []),
            ...(lists?.subscribed?.map((l) => ({ ...l, _section: 'subscribed' })) || []),
            ...(lists?.my_lists?.map((l) => ({ ...l, _section: 'my_lists' })) || []),
            // Filter public to exclude default, subscribed, and my_lists
            ...(lists?.public
              ?.filter((l) => l.id !== defaultId && !subscribedIds.has(l.id) && !myListIds.has(l.id))
              .map((l) => ({ ...l, _section: 'public' })) || []),
          ];
        })()}
        keyExtractor={(item) => `${item._section}-${item.id}`}
        renderItem={({ item, index }) => {
          // Calculate section boundaries
          const defaultCount = lists?.default ? 1 : 0;
          const subscribedCount = lists?.subscribed?.length || 0;
          const myListsCount = lists?.my_lists?.length || 0;

          const subscribedStart = defaultCount;
          const myListsStart = subscribedStart + subscribedCount;
          const publicStart = myListsStart + myListsCount;

          // Show section headers at the start of each section
          const showDefaultHeader = item._section === 'default' && index === 0;
          const showSubscribedHeader = item._section === 'subscribed' && index === subscribedStart && subscribedCount > 0;
          const showMyListsHeader = item._section === 'my_lists' && index === myListsStart && myListsCount > 0;
          const showPublicHeader = item._section === 'public' && index === publicStart;

          return (
            <View>
              {showDefaultHeader && <Text style={styles.sectionTitle}>Lista Padrão</Text>}
              {showSubscribedHeader && <Text style={styles.sectionTitle}>Seguindo</Text>}
              {showMyListsHeader && <Text style={styles.sectionTitle}>Minhas Listas</Text>}
              {showPublicHeader && <Text style={styles.sectionTitle}>Listas Públicas</Text>}
              {renderListItem({
                item: item as TechniqueList,
                isSubscribed: item._section === 'subscribed',
              })}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma lista encontrada</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  shareCodeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 12,
  },
  shareCodeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  shareCodeTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  joinButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listInfo: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  defaultBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  listStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});
