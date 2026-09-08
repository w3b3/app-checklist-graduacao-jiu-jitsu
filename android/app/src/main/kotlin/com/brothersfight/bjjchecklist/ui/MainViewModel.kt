package com.brothersfight.bjjchecklist.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.brothersfight.bjjchecklist.data.FeedbackRepository
import com.brothersfight.bjjchecklist.data.FeedbackType
import com.brothersfight.bjjchecklist.data.ProgressMap
import com.brothersfight.bjjchecklist.data.ProgressRepository
import com.brothersfight.bjjchecklist.model.RequirementProgress
import com.brothersfight.bjjchecklist.model.requirementsByBeltGrouped
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class UiState(
    val selectedBelt: String = "azul",
    val progressMap: ProgressMap = emptyMap(),
    val expandedCategories: Set<String> = emptySet(),
    val progressPercent: Float = 0f,
    val isComplete: Boolean = false,
    val isSendingFeedback: Boolean = false,
    val feedbackSentSuccess: Boolean? = null
)

@HiltViewModel
class MainViewModel @Inject constructor(
    private val repository: ProgressRepository,
    private val feedbackRepository: FeedbackRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init {
        // Combine all persisted flows into a single UI state
        viewModelScope.launch {
            combine(
                repository.selectedBeltFlow,
                repository.progressFlow,
                repository.expandedCategoriesFlow
            ) { belt, progress, expanded ->
                val total = requirementsByBeltGrouped(belt).values.flatten().size
                val done = progress[belt]?.count { it.value.completed } ?: 0
                val percent = if (total == 0) 0f else done.toFloat() / total
                _uiState.value.copy(
                    selectedBelt = belt,
                    progressMap = progress,
                    expandedCategories = expanded,
                    progressPercent = percent,
                    isComplete = total > 0 && done == total,
                )
            }.collect { state ->
                _uiState.value = state
            }
        }
    }

    fun selectBelt(beltId: String) = viewModelScope.launch {
        repository.setSelectedBelt(beltId)
    }

    fun toggleRequirement(reqId: String) = viewModelScope.launch {
        val belt = _uiState.value.selectedBelt
        repository.toggleRequirement(belt, reqId)
    }

    fun updateNote(reqId: String, note: String) = viewModelScope.launch {
        val belt = _uiState.value.selectedBelt
        repository.updateNote(belt, reqId, note)
    }

    fun updateMediaUrl(reqId: String, url: String) = viewModelScope.launch {
        val belt = _uiState.value.selectedBelt
        repository.updateMediaUrl(belt, reqId, url)
    }

    fun toggleCategory(categoryKey: String) = viewModelScope.launch {
        repository.toggleCategory(categoryKey)
    }

    fun resetBelt() = viewModelScope.launch {
        val belt = _uiState.value.selectedBelt
        repository.resetBelt(belt)
    }

    fun sendFeedback(type: FeedbackType, message: String, email: String) = viewModelScope.launch {
        _uiState.value = _uiState.value.copy(isSendingFeedback = true, feedbackSentSuccess = null)
        val success = feedbackRepository.sendFeedback(
            type = type,
            message = message,
            email = email,
            belt = _uiState.value.selectedBelt
        )
        _uiState.value = _uiState.value.copy(isSendingFeedback = false, feedbackSentSuccess = success)
    }

    fun clearFeedbackStatus() {
        _uiState.value = _uiState.value.copy(feedbackSentSuccess = null)
    }

    fun progressForReq(reqId: String): RequirementProgress {
        val belt = _uiState.value.selectedBelt
        return _uiState.value.progressMap[belt]?.get(reqId) ?: RequirementProgress()
    }
}
