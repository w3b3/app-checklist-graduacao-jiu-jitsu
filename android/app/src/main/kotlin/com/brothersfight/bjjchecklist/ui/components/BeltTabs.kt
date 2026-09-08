package com.brothersfight.bjjchecklist.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.brothersfight.bjjchecklist.model.BELTS
import com.brothersfight.bjjchecklist.model.beltById

@Composable
fun BeltTabs(
    selectedBelt: String,
    onBeltSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val selectedIndex = BELTS.indexOfFirst { it.id == selectedBelt }.coerceAtLeast(0)
    ScrollableTabRow(
        selectedTabIndex = selectedIndex,
        modifier = modifier,
        containerColor = MaterialTheme.colorScheme.surface,
        contentColor = MaterialTheme.colorScheme.primary,
        edgePadding = 8.dp,
    ) {
        BELTS.forEach { belt ->
            val isSelected = belt.id == selectedBelt
            Tab(
                selected = isSelected,
                onClick = { onBeltSelected(belt.id) },
                modifier = Modifier.padding(horizontal = 4.dp, vertical = 8.dp),
                content = {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) belt.color else Color.Transparent)
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            text = belt.displayName,
                            color = if (isSelected) Color.White else belt.textColor,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            fontSize = 14.sp,
                        )
                    }
                }
            )
        }
    }
}
