package com.gaurgle.portfolio

import com.gaurgle.portfolio.entities.ContactMessage
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import java.time.Instant
import java.time.temporal.ChronoUnit

class ContactMessageTest {

    @Test
    fun `ContactMessage should initialize with provided values`() {

        val message = ContactMessage(
            id = 1L,
            name = "Andreas Roos",
            email = "AndreasRoos@Andreas.com",
            message = "Hello! Testing",
            handled = true
        )

        // Assert
        assertEquals(1L, message.id)
        assertEquals("Andreas Roos", message.name)
        assertEquals("AndreasRoos@Andreas.com", message.email)
        assertEquals("Hello! Testing", message.message)
        assertTrue(message.handled)
    }

    @Test
    fun `ContactMessage should have handled=false by default`() {

        val message = ContactMessage(
            name = "Andreas Roos",
            email = "AndreasRoos@Andreas.com",
            message = "Hello! Testing"
        )

        // Assert
        assertFalse(message.handled)
    }

    @Test
    fun `ContactMessage should have createdAt=null by default`() {

        val message = ContactMessage(
            name = "Andreas Roos",
            email = "AndreasRoos@Andreas.com",
            message = "Hello! Testing"
        )

        // Assert
        assertNull(message.createdAt)
    }

    @Test
    fun `ContactMessage instances with same properties should be equal`() {

        val now = Instant.now().truncatedTo(ChronoUnit.MILLIS)
        val message1 = ContactMessage(
            id = 1L,
            name = "Andreas Roos",
            email = "AndreasRoos@Andreas.com",
            message = "Hello! Testing",
            createdAt = now,
            handled = true
        )

        val message2 = ContactMessage(
            id = 1L,
            name = "Andreas Roos",
            email = "AndreasRoos@Andreas.com",
            message = "Hello! Testing",
            createdAt = now,
            handled = true
        )

        // Assert
        assertEquals(message1, message2)
        assertEquals(message1.hashCode(), message2.hashCode())
    }

    @Test
    fun `ContactMessage copy should create identical instance with modified fields`() {

        val original = ContactMessage(
            id = 1L,
            name = "Andreas Roos",
            email = "AndreasRoos@Andreas.com",
            message = "Hello! Testing"
        )

        val copy = original.copy(handled = true)

        // Assert
        assertEquals(original.id, copy.id)
        assertEquals(original.name, copy.name)
        assertEquals(original.email, copy.email)
        assertEquals(original.message, copy.message)
        assertTrue(copy.handled)
        assertNotEquals(original, copy)
    }
}