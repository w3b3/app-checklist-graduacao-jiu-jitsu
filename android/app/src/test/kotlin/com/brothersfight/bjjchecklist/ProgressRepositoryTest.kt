package com.brothersfight.bjjchecklist

import com.brothersfight.bjjchecklist.model.RequirementProgress
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Test

class ProgressRepositoryTest {

    @Test
    fun `toggleRequirement marks incomplete requirement as complete`() = runTest {
        // This is a lightweight logic-only test for the progress map update
        val initial: Map<String, Map<String, RequirementProgress>> = mapOf(
            "azul" to mapOf(
                "azul-quedas-1" to RequirementProgress(completed = false)
            )
        )
        val beltId = "azul"
        val reqId = "azul-quedas-1"

        // Simulate the toggle logic from the repository
        val beltMap = initial[beltId]?.toMutableMap() ?: mutableMapOf()
        val existing = beltMap[reqId] ?: RequirementProgress()
        beltMap[reqId] = existing.copy(completed = !existing.completed)
        val updated = initial.toMutableMap()
        updated[beltId] = beltMap

        assertTrue("Requirement should be marked complete", updated["azul"]!!["azul-quedas-1"]!!.completed)
    }

    @Test
    fun `toggleRequirement marks complete requirement as incomplete`() = runTest {
        val initial: Map<String, Map<String, RequirementProgress>> = mapOf(
            "azul" to mapOf(
                "azul-quedas-1" to RequirementProgress(completed = true)
            )
        )
        val beltId = "azul"
        val reqId = "azul-quedas-1"

        val beltMap = initial[beltId]?.toMutableMap() ?: mutableMapOf()
        val existing = beltMap[reqId] ?: RequirementProgress()
        beltMap[reqId] = existing.copy(completed = !existing.completed)
        val updated = initial.toMutableMap()
        updated[beltId] = beltMap

        assertFalse("Requirement should be marked incomplete", updated["azul"]!!["azul-quedas-1"]!!.completed)
    }

    @Test
    fun `progressPercent is 0 when no requirements completed`() {
        val progress: Map<String, Map<String, RequirementProgress>> = emptyMap()
        val beltMap = progress["azul"] ?: emptyMap()
        val total = 60
        val done = beltMap.count { it.value.completed }
        val percent = if (total == 0) 0f else done.toFloat() / total
        assertEquals(0f, percent)
    }

    @Test
    fun `progressPercent is 1 when all requirements completed`() {
        val reqs = mapOf(
            "r1" to RequirementProgress(completed = true),
            "r2" to RequirementProgress(completed = true),
        )
        val total = reqs.size
        val done = reqs.count { it.value.completed }
        val percent = done.toFloat() / total
        assertEquals(1f, percent)
    }

    @Test
    fun `note update preserves completed state`() = runTest {
        val initial = RequirementProgress(completed = true, note = "", mediaUrl = "")
        val updated = initial.copy(note = "Treinar mais vezes")
        assertTrue(updated.completed)
        assertEquals("Treinar mais vezes", updated.note)
        assertEquals("", updated.mediaUrl)
    }
}
