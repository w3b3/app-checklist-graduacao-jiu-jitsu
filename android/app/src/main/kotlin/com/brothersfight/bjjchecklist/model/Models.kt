package com.brothersfight.bjjchecklist.model

import androidx.compose.ui.graphics.Color
import kotlinx.serialization.Serializable

// ─────────────── Belt ───────────────
data class Belt(
    val id: String,
    val displayName: String,
    val color: Color,
    val textColor: Color,
    val lightColor: Color,
)

val BELTS = listOf(
    Belt("azul",   "Azul",   Color(0xFF1E40AF), Color(0xFF1E3A8A), Color(0xFFDBEAFE)),
    Belt("roxa",   "Roxa",   Color(0xFF7C3AED), Color(0xFF5B21B6), Color(0xFFEDE9FE)),
    Belt("marrom", "Marrom", Color(0xFF92400E), Color(0xFF78350F), Color(0xFFFEF3C7)),
    Belt("preta",  "Preta",  Color(0xFF1F2937), Color(0xFF111827), Color(0xFFF3F4F6)),
)

fun beltById(id: String) = BELTS.first { it.id == id }

// ─────────────── Requirement ───────────────
data class Requirement(
    val id: String,
    val belt: String,
    val category: String,
    val name: String,
)

// ─────────────── Progress ───────────────
@Serializable
data class RequirementProgress(
    val completed: Boolean = false,
    val note: String = "",
    val mediaUrl: String = "",
)
