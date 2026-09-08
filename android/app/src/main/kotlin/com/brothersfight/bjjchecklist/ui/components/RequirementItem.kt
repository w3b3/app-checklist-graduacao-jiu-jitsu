package com.brothersfight.bjjchecklist.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Link
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.brothersfight.bjjchecklist.model.Requirement
import com.brothersfight.bjjchecklist.model.RequirementProgress

@Composable
fun RequirementItem(
    requirement: Requirement,
    progress: RequirementProgress,
    accentColor: Color,
    onToggle: () -> Unit,
    onNoteChange: (String) -> Unit,
    onUrlChange: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val haptic = LocalHapticFeedback.current
    val context = LocalContext.current

    var showNoteDialog by remember { mutableStateOf(false) }
    var showUrlDialog by remember { mutableStateOf(false) }

    // Note dialog
    if (showNoteDialog) {
        var noteText by remember { mutableStateOf(progress.note) }
        AlertDialog(
            onDismissRequest = { showNoteDialog = false },
            title = { Text("Anotação") },
            text = {
                OutlinedTextField(
                    value = noteText,
                    onValueChange = { noteText = it },
                    placeholder = { Text("Digite sua anotação...") },
                    modifier = Modifier.fillMaxWidth(),
                    maxLines = 5,
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    onNoteChange(noteText)
                    showNoteDialog = false
                }) { Text("Salvar") }
            },
            dismissButton = {
                TextButton(onClick = { showNoteDialog = false }) { Text("Cancelar") }
            }
        )
    }

    // URL dialog
    if (showUrlDialog) {
        var urlText by remember { mutableStateOf(progress.mediaUrl) }
        AlertDialog(
            onDismissRequest = { showUrlDialog = false },
            title = { Text("Adicionar link") },
            text = {
                OutlinedTextField(
                    value = urlText,
                    onValueChange = { urlText = it },
                    placeholder = { Text("https://") },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri),
                    singleLine = true,
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    onUrlChange(urlText)
                    showUrlDialog = false
                }) { Text("Salvar") }
            },
            dismissButton = {
                TextButton(onClick = { showUrlDialog = false }) { Text("Cancelar") }
            }
        )
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable {
                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                onToggle()
            }
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.Top,
    ) {
        Checkbox(
            checked = progress.completed,
            onCheckedChange = {
                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                onToggle()
            },
            colors = CheckboxDefaults.colors(
                checkedColor = accentColor,
                uncheckedColor = accentColor.copy(alpha = 0.5f),
            ),
            modifier = Modifier.size(24.dp).padding(top = 2.dp),
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = requirement.name,
                fontSize = 15.sp,
                textDecoration = if (progress.completed) TextDecoration.LineThrough else TextDecoration.None,
                color = if (progress.completed) Color.Gray else Color.Black,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
            if (progress.note.isNotBlank()) {
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "📝 ${progress.note}",
                    fontSize = 12.sp,
                    color = Color.Gray,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            if (progress.mediaUrl.isNotBlank()) {
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "🔗 ${progress.mediaUrl}",
                    fontSize = 12.sp,
                    color = accentColor,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    textDecoration = TextDecoration.Underline,
                    modifier = Modifier.clickable {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(progress.mediaUrl))
                        context.startActivity(intent)
                    }
                )
            }
        }
        // Action icons
        IconButton(
            onClick = { showNoteDialog = true },
            modifier = Modifier.size(32.dp),
        ) {
            Icon(
                imageVector = Icons.Default.Edit,
                contentDescription = "Adicionar anotação",
                tint = if (progress.note.isNotBlank()) accentColor else Color.LightGray,
                modifier = Modifier.size(18.dp),
            )
        }
        IconButton(
            onClick = { showUrlDialog = true },
            modifier = Modifier.size(32.dp),
        ) {
            Icon(
                imageVector = Icons.Default.Link,
                contentDescription = "Adicionar link",
                tint = if (progress.mediaUrl.isNotBlank()) accentColor else Color.LightGray,
                modifier = Modifier.size(18.dp),
            )
        }
    }
    HorizontalDivider(thickness = 0.5.dp, color = Color.LightGray.copy(alpha = 0.5f))
}
