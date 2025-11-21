import React, { useMemo, useState, useEffect } from 'react';
import { View, ScrollView, FlatList, StyleSheet, Text, useWindowDimensions, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useStore } from '../store';
import { BeltDropdown } from '../components/BeltDropdown';
import { TechniqueTypeTab } from '../components/TechniqueTypeTab';
import { TechniqueTypeSidebar } from '../components/TechniqueTypeSidebar';
import { ProgressBar } from '../components/ProgressBar';
import { RequirementItem } from '../components/RequirementItem';
import { ResetBeltButton } from '../components/ResetBeltButton';
import { CompletionScreen } from '../components/CompletionScreen';
import { JoinClassBetaButton } from '../components/JoinClassBetaButton';
import { FeatureSuggestionLink } from '../components/FeatureSuggestionLink';
import { BELT_COLORS } from '../data/belts';
import { getRequirementsByBelt, getRequirementsByBeltAndType } from '../data/requirements';
import { TechniqueType } from '../types';

const TECHNIQUE_TYPES: TechniqueType[] = ['finalizacoes', 'quedas', 'raspagens', 'passagens', 'outros'];

export const HomeScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [orientationState, setOrientationState] = useState<boolean>(false);

  const {
    selectedBelt,
    setSelectedBelt,
    selectedTechniqueTab,
    setSelectedTechniqueTab,
    progress,
    toggleRequirement,
    getRequirementProgress,
    expandedRequirements,
    toggleExpanded,
    updateNote,
    updateMediaUrl,
    updatePhoto,
    removePhoto,
    resetBeltProgress,
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

  // Get requirements for current belt AND technique type
  const requirements = useMemo(
    () => getRequirementsByBeltAndType(selectedBelt, selectedTechniqueTab),
    [selectedBelt, selectedTechniqueTab]
  );

  // Calculate progress for current technique type only (per-tab progress)
  const { completed, total, percentage } = useMemo(() => {
    const beltProgress = progress[selectedBelt] || {};
    const completedCount = requirements.filter(req => beltProgress[req.id]?.completed).length;
    const totalCount = requirements.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return {
      completed: completedCount,
      total: totalCount,
      percentage: pct,
    };
  }, [progress, selectedBelt, requirements]);

  // Calculate overall belt progress (for completion check)
  const overallProgress = useMemo(() => {
    const allRequirements = getRequirementsByBelt(selectedBelt);
    const beltProgress = progress[selectedBelt] || {};
    const completedCount = Object.values(beltProgress).filter(p => p.completed).length;
    const totalCount = allRequirements.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { completed: completedCount, total: totalCount, percentage: pct };
  }, [progress, selectedBelt]);

  // Show completion screen if 100% overall belt progress
  if (overallProgress.percentage === 100 && overallProgress.total > 0) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <StatusBar style="auto" />
        <CompletionScreen beltId={selectedBelt} />
        <ResetBeltButton
          beltName={belt.displayName}
          onReset={() => resetBeltProgress(selectedBelt)}
        />
        <FeatureSuggestionLink />
      </SafeAreaView>
    );
  }

  // Split-view layout for tablets
  if (useSplitView) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.splitContainer}>
          {/* Left Sidebar */}
          <View style={styles.sidebar}>
            {/* Belt Dropdown */}
            <BeltDropdown
              selectedBelt={selectedBelt}
              onSelectBelt={setSelectedBelt}
            />

            {/* Technique Type Tabs (Vertical) */}
            <TechniqueTypeSidebar
              selectedType={selectedTechniqueTab}
              onSelectType={setSelectedTechniqueTab}
            />
          </View>

          {/* Right Main Content */}
          <View style={styles.mainContent}>
            {/* Progress Bar */}
            <ProgressBar
              current={completed}
              total={total}
              percentage={percentage}
              beltId={selectedBelt}
            />

            {/* Fake door test - only show if not 100% complete */}
            {overallProgress.percentage < 100 && <JoinClassBetaButton />}

            {/* Requirements List */}
            <FlatList
              data={requirements}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
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
                    onUpdatePhoto={(photoUri) => updatePhoto(selectedBelt, item.id, photoUri)}
                    onRemovePhoto={() => removePhoto(selectedBelt, item.id)}
                  />
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhum requisito encontrado</Text>
                </View>
              }
              ListFooterComponent={
                <>
                  <ResetBeltButton
                    beltName={belt.displayName}
                    onReset={() => resetBeltProgress(selectedBelt)}
                  />
                  <FeatureSuggestionLink />
                </>
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

      {/* Belt Dropdown */}
      <BeltDropdown
        selectedBelt={selectedBelt}
        onSelectBelt={setSelectedBelt}
      />

      {/* Technique Type Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsContent, { paddingHorizontal: phonePadding - 16 }]}
        >
          {TECHNIQUE_TYPES.map((type) => (
            <TechniqueTypeTab
              key={type}
              type={type}
              isActive={selectedTechniqueTab === type}
              onPress={() => setSelectedTechniqueTab(type)}
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

      {/* Fake door test - only show if not 100% complete */}
      {overallProgress.percentage < 100 && <JoinClassBetaButton />}

      {/* Requirements List */}
      <FlatList
        data={requirements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
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
              onUpdatePhoto={(photoUri) => updatePhoto(selectedBelt, item.id, photoUri)}
              onRemovePhoto={() => removePhoto(selectedBelt, item.id)}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum requisito encontrado</Text>
          </View>
        }
        ListFooterComponent={
          <>
            <ResetBeltButton
              beltName={belt.displayName}
              onReset={() => resetBeltProgress(selectedBelt)}
            />
            <FeatureSuggestionLink />
          </>
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
  },
  mainContent: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsContent: {
    paddingHorizontal: 4,
    height: 56,
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
