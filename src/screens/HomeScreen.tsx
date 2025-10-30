import React, { useMemo } from 'react';
import { View, ScrollView, SectionList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useStore } from '../store';
import { BeltTab } from '../components/BeltTab';
import { ProgressBar } from '../components/ProgressBar';
import { CategoryHeader } from '../components/CategoryHeader';
import { RequirementItem } from '../components/RequirementItem';
import { ResetBeltButton } from '../components/ResetBeltButton';
import { CompletionScreen } from '../components/CompletionScreen';
import { BELT_ORDER, BELT_COLORS } from '../data/belts';
import { getRequirementsByBelt, groupRequirementsByCategory } from '../data/requirements';
import { Requirement } from '../types';

interface Section {
  title: string;
  data: Requirement[];
}

export const HomeScreen: React.FC = () => {
  const {
    selectedBelt,
    setSelectedBelt,
    progress,
    toggleRequirement,
    getRequirementProgress,
    expandedCategories,
    toggleCategory,
    expandedRequirements,
    toggleExpanded,
    updateNote,
    updateMediaUrl,
    resetBeltProgress,
  } = useStore();

  const belt = BELT_COLORS[selectedBelt];

  const requirements = useMemo(() => getRequirementsByBelt(selectedBelt), [selectedBelt]);

  const sections: Section[] = useMemo(() => {
    const grouped = groupRequirementsByCategory(requirements);
    return Array.from(grouped.entries()).map(([category, reqs]) => ({
      title: category,
      data: reqs,
    }));
  }, [requirements]);

  // Calculate progress
  const { completed, total, percentage } = useMemo(() => {
    const beltProgress = progress[selectedBelt] || {};
    const completedCount = Object.values(beltProgress).filter(p => p.completed).length;
    const totalCount = requirements.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return {
      completed: completedCount,
      total: totalCount,
      percentage: pct,
    };
  }, [progress, selectedBelt, requirements]);

  // Calculate progress for each category
  const getCategoryProgress = (category: string) => {
    const beltProgress = progress[selectedBelt] || {};
    const categoryReqs = requirements.filter(r => r.category === category);
    const completedInCategory = categoryReqs.filter(
      r => beltProgress[r.id]?.completed
    ).length;
    return {
      completed: completedInCategory,
      total: categoryReqs.length,
    };
  };

  // Calculate belt tab progress for each belt
  const getBeltProgress = (beltId: string): number => {
    const beltReqs = getRequirementsByBelt(beltId);
    const beltProg = progress[beltId] || {};
    const completedCount = Object.values(beltProg).filter(p => p.completed).length;
    const totalCount = beltReqs.length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  };

  // Show completion screen if 100%
  if (percentage === 100 && total > 0) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <StatusBar style="auto" />
        <CompletionScreen beltId={selectedBelt} />
        <ResetBeltButton
          beltName={belt.displayName}
          onReset={() => resetBeltProgress(selectedBelt)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checklist de Graduação</Text>
      </View>

      {/* Belt Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {BELT_ORDER.map((belt) => (
          <BeltTab
            key={belt.id}
            belt={belt}
            isActive={selectedBelt === belt.id}
            progress={getBeltProgress(belt.id)}
            onPress={() => setSelectedBelt(belt.id)}
          />
        ))}
      </ScrollView>

      {/* Progress Bar */}
      <ProgressBar
        current={completed}
        total={total}
        percentage={percentage}
        beltId={selectedBelt}
      />

      {/* Requirements List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section }) => {
          const { completed: categoryCompleted, total: categoryTotal } = getCategoryProgress(section.title);
          const isExpanded = expandedCategories.has(section.title);
          return (
            <CategoryHeader
              title={section.title}
              completedCount={categoryCompleted}
              totalCount={categoryTotal}
              isExpanded={isExpanded}
              onToggle={() => toggleCategory(section.title)}
              beltId={selectedBelt}
            />
          );
        }}
        renderItem={({ item, section }) => {
          const isExpanded = expandedCategories.has(section.title);
          if (!isExpanded) return null;

          const reqProgress = getRequirementProgress(selectedBelt, item.id);
          const isItemExpanded = expandedRequirements.has(item.id);

          return (
            <RequirementItem
              requirement={item}
              progress={reqProgress}
              onToggle={() => toggleRequirement(selectedBelt, item.id)}
              onExpand={() => toggleExpanded(item.id)}
              isExpanded={isItemExpanded}
              onUpdateNote={(note) => updateNote(selectedBelt, item.id, note)}
              onUpdateUrl={(url) => updateMediaUrl(selectedBelt, item.id, url)}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum requisito encontrado</Text>
          </View>
        }
        ListFooterComponent={
          <ResetBeltButton
            beltName={belt.displayName}
            onReset={() => resetBeltProgress(selectedBelt)}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 48,
  },
  tabsContent: {
    paddingHorizontal: 4,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
