package com.gaurgle.portfolio

import com.gaurgle.portfolio.config.EmailSettings
import com.gaurgle.portfolio.service.EmailServiceImpl
import io.mockk.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import sendinblue.ApiClient
import sendinblue.Configuration
import sendinblue.auth.ApiKeyAuth
import sibApi.TransactionalEmailsApi
import sibModel.CreateSmtpEmail
import sibModel.SendSmtpEmail

class EmailServiceTest {

    private lateinit var emailService: EmailServiceImpl
    private lateinit var settings: EmailSettings
    private lateinit var apiClient: ApiClient
    private lateinit var apiKeyAuth: ApiKeyAuth

    @BeforeEach
    fun setup() {
        // Set up mocks
        settings = mockk()
        apiClient = mockk()
        apiKeyAuth = mockk(relaxed = true)

        mockkStatic(Configuration::class)
        every { Configuration.getDefaultApiClient() } returns apiClient
        every { apiClient.getAuthentication("api-key") } returns apiKeyAuth

        // Mock TransactionalEmailsApi constructor and sendTransacEmail method
        mockkConstructor(TransactionalEmailsApi::class)
        every { anyConstructed<TransactionalEmailsApi>().sendTransacEmail(any()) } returns CreateSmtpEmail()

        // Create service with mocked dependencies
        emailService = EmailServiceImpl(settings)
    }

    @AfterEach
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `should not send email when service is disabled`() {
        // Arrange
        every { settings.enabled } returns false
        every { settings.to } returns "admin@example.com"

        // Act
        emailService.sendContactEmail("Test User", "user@example.com", "Hello")

        // Assert
        verify(exactly = 0) { anyConstructed<TransactionalEmailsApi>().sendTransacEmail(any()) }
    }

    @Test
    fun `should throw exception when required settings are missing`() {
        // Arrange
        every { settings.enabled } returns true
        every { settings.apiKey } returns ""
        every { settings.to } returns "admin@example.com"
        every { settings.from } returns "system@example.com"

        // Act & Assert
        assertThrows<IllegalArgumentException> {
            emailService.sendContactEmail("Test User", "user@example.com", "Hello")
        }
    }

    @Test
    fun `should send email with correct content when enabled`() {
        // Arrange
        every { settings.enabled } returns true
        every { settings.apiKey } returns "test-api-key"
        every { settings.to } returns "admin@example.com"
        every { settings.from } returns "system@example.com"
        every { settings.fromName } returns "Portfolio"

        val emailSlot = slot<SendSmtpEmail>()
        every { anyConstructed<TransactionalEmailsApi>().sendTransacEmail(capture(emailSlot)) } returns CreateSmtpEmail()

        // Act
        emailService.sendContactEmail("Test User", "user@example.com", "Hello World")

        // Assert
        verify { apiKeyAuth.apiKey = "test-api-key" }

        val capturedEmail = emailSlot.captured
        assert(capturedEmail.subject == "New contact message from Test User")
        assert(capturedEmail.htmlContent.contains("Test User"))
        assert(capturedEmail.htmlContent.contains("user@example.com"))
        assert(capturedEmail.htmlContent.contains("Hello World"))
    }
}