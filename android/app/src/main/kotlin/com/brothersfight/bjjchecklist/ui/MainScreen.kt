package com.brothersfight.bjjchecklist.ui

import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Feedback
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.brothersfight.bjjchecklist.R
import com.brothersfight.bjjchecklist.data.FeedbackType
import com.brothersfight.bjjchecklist.model.beltById
import com.brothersfight.bjjchecklist.model.requirementsByBeltGrouped
import com.brothersfight.bjjchecklist.ui.components.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
@Composable
fun MainScreen(viewModel: MainViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val belt = beltById(state.selectedBelt)
    val grouped = requirementsByBeltGrouped(state.selectedBelt)

    var showResetDialog by remember { mutableStateOf(false) }
    var showCompletionDialog by remember(state.isComplete) { mutableStateOf(state.isComplete) }
    var showFeedbackDialog by remember { mutableStateOf(false) }

    // Toast feedback response
    LaunchedEffect(state.feedbackSentSuccess) {
        state.feedbackSentSuccess?.let { success ->
            if (success) {
                Toast.makeText(context, "Obrigado! Seu feedback foi enviado para o nosso time. 🥋", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(context, "Feedback registrado com sucesso!", Toast.LENGTH_SHORT).show()
            }
            viewModel.clearFeedbackStatus()
        }
    }

    // Feedback Dialog
    if (showFeedbackDialog) {
        var selectedType by remember { mutableStateOf(FeedbackType.GENERAL) }
        var messageText by remember { mutableStateOf("") }
        var emailText by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { if (!state.isSendingFeedback) showFeedbackDialog = false },
            title = {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("Fale com a gente", fontWeight = FontWeight.Bold, fontSize = 20.sp)
                    Text("💬", fontSize = 20.sp)
                }
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                ) {
                    Text(
                        text = "Sua opinião ajuda muito a evoluir o aplicativo! Projeto mantido com carinho junto ao tatame0.com.",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 18.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    // Type Selector
                    Text(text = "Tipo de mensagem", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        FeedbackType.entries.forEach { type ->
                            FilterChip(
                                selected = selectedType == type,
                                onClick = { selectedType = type },
                                label = { Text(type.label, fontSize = 12.sp) }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = messageText,
                        onValueChange = { messageText = it },
                        placeholder = { Text("Escreva sua mensagem, dúvida ou sugestão...", fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3,
                        maxLines = 5,
                        shape = MaterialTheme.shapes.medium
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = emailText,
                        onValueChange = { emailText = it },
                        placeholder = { Text("Seu e-mail (opcional)", fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = MaterialTheme.shapes.medium
                    )
                }
            },
            confirmButton = {
                Button(
                    enabled = messageText.isNotBlank() && !state.isSendingFeedback,
                    onClick = {
                        viewModel.sendFeedback(selectedType, messageText, emailText)
                        showFeedbackDialog = false
                    }
                ) {
                    if (state.isSendingFeedback) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
                    } else {
                        Text("Enviar")
                    }
                }
            },
            dismissButton = {
                TextButton(
                    enabled = !state.isSendingFeedback,
                    onClick = { showFeedbackDialog = false }
                ) { Text(stringResource(R.string.cancel)) }
            }
        )
    }

    // Reset confirmation dialog
    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            title = { Text(stringResource(R.string.reset_confirm_title)) },
            text = { Text(stringResource(R.string.reset_confirm_message)) },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.resetBelt()
                        showResetDialog = false
                    }
                ) { Text(stringResource(R.string.reset_confirm_yes), color = Color.Red) }
            },
            dismissButton = {
                TextButton(onClick = { showResetDialog = false }) { Text(stringResource(R.string.cancel)) }
            }
        )
    }

    // Completion celebration dialog
    if (showCompletionDialog) {
        AlertDialog(
            onDismissRequest = { showCompletionDialog = false },
            title = { Text(stringResource(R.string.completion_title), textAlign = TextAlign.Center) },
            text = {
                Text(
                    text = stringResource(R.string.completion_message, belt.displayName),
                    textAlign = TextAlign.Center,
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    val date = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date())
                    val shareText = context.getString(R.string.share_text, belt.displayName, date)
                    val sendIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_TEXT, shareText)
                    }
                    context.startActivity(Intent.createChooser(sendIntent, context.getString(R.string.share_title)))
                    showCompletionDialog = false
                }) { Text("Compartilhar 🎉") }
            },
            dismissButton = {
                TextButton(onClick = { showCompletionDialog = false }) { Text("Fechar") }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = stringResource(R.string.app_name),
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = belt.color,
                    titleContentColor = Color.White,
                    actionIconContentColor = Color.White,
                ),
                actions = {
                    // Feedback button
                    IconButton(onClick = { showFeedbackDialog = true }) {
                        Icon(Icons.Default.Feedback, contentDescription = "Enviar Feedback")
                    }
                    // Share button
                    IconButton(onClick = {
                        val date = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date())
                        val pct = (state.progressPercent * 100).toInt()
                        val shareText = "Meu progresso para a faixa ${belt.displayName}: $pct%! 🥋 Graduação Jiu Jitsu - https://tatame0.com?utm_source=bjj_checklist_app&utm_medium=share ($date)"
                        val sendIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, shareText)
                        }
                        context.startActivity(Intent.createChooser(sendIntent, "Compartilhar progresso"))
                    }) {
                        Icon(Icons.Default.Share, contentDescription = "Compartilhar")
                    }
                    // Reset button
                    IconButton(onClick = { showResetDialog = true }) {
                        Icon(Icons.Default.Delete, contentDescription = "Resetar faixa")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Belt selector tabs
            BeltTabs(
                selectedBelt = state.selectedBelt,
                onBeltSelected = viewModel::selectBelt,
            )

            // Progress bar
            BJJProgressBar(
                percent = state.progressPercent,
                color = belt.color,
            )

            HorizontalDivider()

            // Requirements list
            LazyColumn(modifier = Modifier.fillMaxSize()) {
                grouped.forEach { (category, requirements) ->
                    val categoryKey = "${state.selectedBelt}_$category"
                    val isExpanded = state.expandedCategories.contains(categoryKey)
                    val completedCount = requirements.count {
                        state.progressMap[state.selectedBelt]?.get(it.id)?.completed == true
                    }

                    // Sticky category header
                    stickyHeader(key = categoryKey) {
                        CategoryHeader(
                            title = category,
                            completedCount = completedCount,
                            totalCount = requirements.size,
                            isExpanded = isExpanded,
                            accentColor = belt.textColor,
                            lightColor = belt.lightColor,
                            onClick = { viewModel.toggleCategory(categoryKey) },
                        )
                    }

                    // Requirements (shown only when expanded)
                    if (isExpanded) {
                        items(requirements, key = { it.id }) { requirement ->
                            val progress = state.progressMap[state.selectedBelt]?.get(requirement.id)
                                ?: com.brothersfight.bjjchecklist.model.RequirementProgress()
                            RequirementItem(
                                requirement = requirement,
                                progress = progress,
                                accentColor = belt.color,
                                onToggle = { viewModel.toggleRequirement(requirement.id) },
                                onNoteChange = { note -> viewModel.updateNote(requirement.id, note) },
                                onUrlChange = { url -> viewModel.updateMediaUrl(requirement.id, url) },
                            )
                        }
                    }
                }

                // Bottom spacer
                item { Spacer(modifier = Modifier.height(24.dp)) }
            }
        }
    }
}
