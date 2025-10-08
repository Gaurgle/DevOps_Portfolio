package com.gaurgle.portfolio

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue

class SanityTest {

    @Test
    fun `one plus one is two`() {
        assertEquals(2, 1 + 1)
    }

    @Test
    fun `non-empty message stays non-empty after trim`() {
        val msg = "  hello  "
        assertTrue(msg.trim().isNotEmpty())
    }
}