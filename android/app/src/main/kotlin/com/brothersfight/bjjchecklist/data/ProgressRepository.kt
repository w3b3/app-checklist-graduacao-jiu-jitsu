package com.brothersfight.bjjchecklist.data

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import com.brothersfight.bjjchecklist.model.RequirementProgress
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

// Type alias: beltId -> (requirementId -> progress)
typealias ProgressMap = Map<String, Map<String, RequirementProgress>>
typealias MutableProgressMap = MutableMap<String, MutableMap<String, RequirementProgress>>

@Singleton
class ProgressRepository @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    companion object {
        private val SELECTED_BELT_KEY = stringPreferencesKey("selected_belt")
        private val PROGRESS_JSON_KEY = stringPreferencesKey("progress_json")
        private val EXPANDED_CATEGORIES_KEY = stringSetPreferencesKey("expanded_categories")
    }

    // ─── Selected Belt ───────────────────────────────────────────────
    val selectedBeltFlow: Flow<String> = dataStore.data.map { prefs ->
        prefs[SELECTED_BELT_KEY] ?: "azul"
    }

    suspend fun setSelectedBelt(belt: String) {
        dataStore.edit { it[SELECTED_BELT_KEY] = belt }
    }

    // ─── Progress ────────────────────────────────────────────────────
    val progressFlow: Flow<ProgressMap> = dataStore.data.map { prefs ->
        val json = prefs[PROGRESS_JSON_KEY] ?: "{}"
        try {
            Json.decodeFromString<Map<String, Map<String, RequirementProgress>>>(json)
        } catch (e: Exception) {
            emptyMap()
        }
    }

    suspend fun getProgressMap(): ProgressMap {
        return progressFlow.first()
    }

    suspend fun setProgressMap(map: ProgressMap) {
        val json = Json.encodeToString(map)
        dataStore.edit { it[PROGRESS_JSON_KEY] = json }
    }

    suspend fun toggleRequirement(beltId: String, reqId: String) {
        val current = getProgressMap()
        val beltMap = current[beltId]?.toMutableMap() ?: mutableMapOf()
        val existing = beltMap[reqId] ?: RequirementProgress()
        beltMap[reqId] = existing.copy(completed = !existing.completed)
        val updated = current.toMutableMap()
        updated[beltId] = beltMap
        setProgressMap(updated)
    }

    suspend fun updateNote(beltId: String, reqId: String, note: String) {
        val current = getProgressMap()
        val beltMap = current[beltId]?.toMutableMap() ?: mutableMapOf()
        val existing = beltMap[reqId] ?: RequirementProgress()
        beltMap[reqId] = existing.copy(note = note)
        val updated = current.toMutableMap()
        updated[beltId] = beltMap
        setProgressMap(updated)
    }

    suspend fun updateMediaUrl(beltId: String, reqId: String, url: String) {
        val current = getProgressMap()
        val beltMap = current[beltId]?.toMutableMap() ?: mutableMapOf()
        val existing = beltMap[reqId] ?: RequirementProgress()
        beltMap[reqId] = existing.copy(mediaUrl = url)
        val updated = current.toMutableMap()
        updated[beltId] = beltMap
        setProgressMap(updated)
    }

    suspend fun resetBelt(beltId: String) {
        val current = getProgressMap().toMutableMap()
        current[beltId] = emptyMap()
        setProgressMap(current)
    }

    // ─── Expanded Categories ─────────────────────────────────────────
    val expandedCategoriesFlow: Flow<Set<String>> = dataStore.data.map { prefs ->
        prefs[EXPANDED_CATEGORIES_KEY] ?: emptySet()
    }

    suspend fun toggleCategory(categoryKey: String) {
        val current = expandedCategoriesFlow.first().toMutableSet()
        if (current.contains(categoryKey)) current.remove(categoryKey) else current.add(categoryKey)
        dataStore.edit { it[EXPANDED_CATEGORIES_KEY] = current }
    }

    suspend fun setExpandedCategories(set: Set<String>) {
        dataStore.edit { it[EXPANDED_CATEGORIES_KEY] = set }
    }
}
