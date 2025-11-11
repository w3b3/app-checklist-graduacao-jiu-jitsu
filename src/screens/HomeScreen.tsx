import React, { useMemo, useState, useEffect } from 'react';
import { View, ScrollView, SectionList, StyleSheet, Text, useWindowDimensions, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useStore } from '../store';
import { BeltTab } from '../components/BeltTab';
import { BeltSidebarItem } from '../components/BeltSidebarItem';
import { ProgressBar } from '../components/ProgressBar';
import { CategoryHeader } from '../components/CategoryHeader';
import { RequirementItem } from '../components/RequirementItem';
import { ResetBeltButton } from '../components/ResetBeltButton';
import { CompletionScreen } from '../components/CompletionScreen';
import { UpgradeAnnouncementModal } from '../components/UpgradeAnnouncementModal';
import { BELT_ORDER, BELT_COLORS } from '../data/belts';
import { getTechniquesByCategory } from '../data/techniques';
import { Technique } from '../types';

interface Section {
  title: string;
  data: Technique[];
}

export const HomeScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [orientationState, setOrientationState] = useState<boolean>(false);

  const {
    selectedBelt,
    setSelectedBelt,
    hasSeenUpgradeAnnouncement,
    setHasSeenUpgradeAnnouncement,
    toggleTechnique,
    getTechniqueProgress,
    getProgressForBelt,
    expandedCategories,
    toggleCategory,
    expandedRequirements,
    toggleExpanded,
    updateNote,
    updateMediaUrl,
    resetAllProgress,
  } = useStore();

  const belt = BELT_COLORS[selectedBelt];

  // Robust landscape detection using multiple strategies
  useEffect(() => {
    // Strategy 1: Use expo-screen-orientation API (most reliable)
    const checkOrientation = async () => {
      try {
        const orientation = await ScreenOrientation.getOrientationAsync();
        const isLandscapeOrientation =
          orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
        setOrientationState(isLandscapeOrientation);
      } catch (error) {
        // Fallback to dimension-based detection
        console.warn('Screen orientation API failed, using fallback');
      }
    };

    checkOrientation();

    // Listen for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      const isLandscapeOrientation =
        event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
      setOrientationState(isLandscapeOrientation);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // Strategy 2: Fallback to screen dimensions (not window dimensions)
  // Use screen API which gives physical screen size regardless of system UI
  const screenDimensions = Dimensions.get('screen');
  const isLandscapeByScreen = screenDimensions.width > screenDimensions.height;

  // Strategy 3: Aspect ratio check (more forgiving than absolute comparison)
  // Landscape typically has aspect ratio > 1.2
  const aspectRatio = width / height;
  const isLandscapeByAspectRatio = aspectRatio > 1.2;

  // Final decision: Prioritize orientation API, fallback to screen dimensions
  const isLandscape = orientationState || isLandscapeByScreen || isLandscapeByAspectRatio;

  // Split-view requires landscape AND sufficient width
  // Use screen width for threshold check (more reliable than window width on Android)
  const useSplitView = isLandscape && screenDimensions.width >= 768;

  // Increased padding for phones
  const phonePadding = 20;

  // Get techniques grouped by category for current belt
  const techniquesByCategory = useMemo(
    () => getTechniquesByCategory(selectedBelt),
    [selectedBelt]
  );

  const sections: Section[] = useMemo(() => {
    return Array.from(techniquesByCategory.entries()).map(([category, techniques]) => ({
      title: category,
      data: techniques,
    }));
  }, [techniquesByCategory]);

  // Calculate progress using new store method
  const beltProgress = useMemo(() => getProgressForBelt(selectedBelt), [selectedBelt, getProgressForBelt]);

  const { completed, total, percentage } = useMemo(() => {
    return {
      completed: beltProgress.completedCount,
      total: beltProgress.totalCount,
      percentage: Math.round(beltProgress.overallPercent),
    };
  }, [beltProgress]);

  // Calculate progress for each category
  const getCategoryProgress = (category: string) => {
    const categoryTechniques = techniquesByCategory.get(category) || [];
    const completedInCategory = categoryTechniques.filter(
      tech => getTechniqueProgress(tech.id).completed
    ).length;
    return {
      completed: completedInCategory,
      total: categoryTechniques.length,
    };
  };

  // Calculate belt tab progress for each belt
  const getBeltProgress = (beltId: string): number => {
    const progress = getProgressForBelt(beltId);
    return Math.round(progress.overallPercent);
  };

  // Show completion screen if 100%
  if (percentage === 100 && total > 0) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <StatusBar style="auto" />
        <CompletionScreen beltId={selectedBelt} />
        <ResetBeltButton
          beltName={belt.displayName}
          onReset={() => resetAllProgress()}
        />
      </SafeAreaView>
    );
  }

  // Split-view layout for tablets
  if (useSplitView) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <UpgradeAnnouncementModal
          visible={!hasSeenUpgradeAnnouncement}
          onClose={() => setHasSeenUpgradeAnnouncement(true)}
        />
        <View style={styles.splitContainer}>
          {/* Left Sidebar */}
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Faixas</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {BELT_ORDER.map((beltItem) => (
                <BeltSidebarItem
                  key={beltItem.id}
                  belt={beltItem}
                  isActive={selectedBelt === beltItem.id}
                  progress={getBeltProgress(beltItem.id)}
                  onPress={() => setSelectedBelt(beltItem.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Right Main Content */}
          <View style={styles.mainContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{belt.displayName}</Text>
            </View>

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

                const techProgress = getTechniqueProgress(item.id);
                const isItemExpanded = expandedRequirements.has(item.id);

                return (
                  <RequirementItem
                    technique={item}
                    progress={techProgress}
                    currentBelt={selectedBelt}
                    onToggle={() => toggleTechnique(item.id)}
                    onExpand={() => toggleExpanded(item.id)}
                    isExpanded={isItemExpanded}
                    onUpdateNote={(note) => updateNote(item.id, note)}
                    onUpdateUrl={(url) => updateMediaUrl(item.id, url)}
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
                  beltName="Todas as Faixas"
                  onReset={() => resetAllProgress()}
                />
              }
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>
      </View>
    );
  }

  // Mobile layout for phones
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <StatusBar style="auto" />
      <UpgradeAnnouncementModal
        visible={!hasSeenUpgradeAnnouncement}
        onClose={() => setHasSeenUpgradeAnnouncement(true)}
      />

      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: phonePadding }]}>
        <Text style={styles.headerTitle}>Checklist de Graduação</Text>
      </View>

      {/* Belt Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsContent, { paddingHorizontal: phonePadding - 16 }]}
        >
        {BELT_ORDER.map((beltItem) => (
          <BeltTab
            key={beltItem.id}
            belt={beltItem}
            isActive={selectedBelt === beltItem.id}
            progress={getBeltProgress(beltItem.id)}
            onPress={() => setSelectedBelt(beltItem.id)}
          />
        ))}
        </ScrollView>
      </View>

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

          const techProgress = getTechniqueProgress(item.id);
          const isItemExpanded = expandedRequirements.has(item.id);

          return (
            <RequirementItem
              technique={item}
              progress={techProgress}
              currentBelt={selectedBelt}
              onToggle={() => toggleTechnique(item.id)}
              onExpand={() => toggleExpanded(item.id)}
              isExpanded={isItemExpanded}
              onUpdateNote={(note) => updateNote(item.id, note)}
              onUpdateUrl={(url) => updateMediaUrl(item.id, url)}
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
            beltName="Todas as Faixas"
            onReset={() => resetAllProgress()}
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
  // Split-view styles for tablets
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 220,
    backgroundColor: '#F9FAFB',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  mainContent: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
  },
  // Shared styles
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
  },
  tabsContent: {
    paddingHorizontal: 4,
    height: 60,
    alignItems: 'center',
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
