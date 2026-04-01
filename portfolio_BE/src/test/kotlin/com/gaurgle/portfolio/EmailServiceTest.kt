package com.gaurgle.portfolio

import com.gaurgle.portfolio.config.EmailSettings
import com.gaurgle.portfolio.service.EmailServiceImpl
import com.resend.Resend
import com.resend.services.emails.Emails
import com.resend.services.emails.model.SendEmailRequest
import com.resend.services.emails.model.SendEmailResponse
import io.mockk.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class EmailServiceTest {

    private lateinit var emailService: EmailServiceImpl
    private lateinit var settings: EmailSettings
    private lateinit var mockEmails: Emails

    @BeforeEach
    fun setup() {
        settings = mockk()

        mockEmails = mockk()
        val mockResend = mockk<Resend>()
        every { mockResend.emails() } returns mockEmails

        mockkConstructor(Resend::class)
        every { anyConstructed<Resend>().emails() } returns mockEmails

        emailService = EmailServiceImpl(settings)
    }

    @AfterEach
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `should not send email when service is disabled`() {
        every { settings.enabled } returns false
        every { settings.to } returns "admin@example.com"

        emailService.sendContactEmail("Test User", "user@example.com", "Hello")

        verify(exactly = 0) { mockEmails.send(any()) }
    }

    @Test
    fun `should throw exception when required settings are missing`() {
        every { settings.enabled } returns true
        every { settings.apiKey } returns ""
        every { settings.to } returns "admin@example.com"
        every { settings.from } returns "system@example.com"

        assertThrows<IllegalArgumentException> {
            emailService.sendContactEmail("Test User", "user@example.com", "Hello")
        }
    }

    @Test
    fun `should send email with correct content when enabled`() {
        every { settings.enabled } returns true
        every { settings.apiKey } returns "re_test_key"
        every { settings.to } returns "admin@example.com"
        every { settings.from } returns "system@example.com"
        every { settings.fromName } returns "Portfolio"

        val requestSlot = slot<SendEmailRequest>()
        val response = mockk<SendEmailResponse>()
        every { response.id } returns "test-id"
        every { mockEmails.send(capture(requestSlot)) } returns response

        emailService.sendContactEmail("Test User", "user@example.com", "Hello World")

        verify(exactly = 1) { mockEmails.send(any()) }
    }
}
