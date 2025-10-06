package com.gaurgle.portfolio.service

import com.gaurgle.portfolio.config.EmailSettings
import org.springframework.stereotype.Service
import sendinblue.ApiClient
import sendinblue.ApiException
import sendinblue.Configuration
import sendinblue.auth.ApiKeyAuth
import sibApi.TransactionalEmailsApi
import sibModel.SendSmtpEmail
import sibModel.SendSmtpEmailReplyTo
import sibModel.SendSmtpEmailSender
import sibModel.SendSmtpEmailTo

interface EmailService {
    fun sendContactEmail(name: String, email: String, message: String)
}

@Service
class EmailServiceImpl(
    private val settings: EmailSettings
) : EmailService {

    override fun sendContactEmail(name: String, email: String, message: String) {
        if (!settings.enabled) {
            println("[EmailService] Disabled. Would send to ${settings.to} | Subject: New contact from $name")
            return
        }

        require(settings.apiKey.isNotBlank()) { "BREVO_API_KEY is missing" }
        require(settings.to.isNotBlank()) { "app.email.to is missing" }
        require(settings.from.isNotBlank()) { "app.email.fromAddress is missing" }

        // Helpful debug line – remove later
        println("[EmailService] enabled=${settings.enabled} from=${settings.from} to=${settings.to} keyPrefix=${settings.apiKey.take(8)}")

        val client: ApiClient = Configuration.getDefaultApiClient()
        val apiKeyAuth = client.getAuthentication("api-key") as ApiKeyAuth
        apiKeyAuth.apiKey = settings.apiKey
        val api = TransactionalEmailsApi(client)

        val from = SendSmtpEmailSender().email(settings.from).name(settings.fromName)
        val to = listOf(SendSmtpEmailTo().email(settings.to))

        val subject = "New contact message from $name"
        val html = """
            <h2>New contact</h2>
            <p><b>Name:</b> ${escape(name)}<br/>
            <b>Email:</b> ${escape(email)}</p>
            <pre style="white-space:pre-wrap">${escape(message)}</pre>
        """.trimIndent()

        val mail = SendSmtpEmail()
            .sender(from)
            .to(to)
            .subject(subject)
            .htmlContent(html)
            .replyTo(SendSmtpEmailReplyTo().email(email).name(name))

        try {
            val resp = api.sendTransacEmail(mail)
            println("[EmailService] sent OK: $resp")
        } catch (e: ApiException) {
            println("[EmailService] failed (ApiException): code=${e.code}, body=${e.responseBody}, headers=${e.responseHeaders}")
            e.printStackTrace()
        } catch (e: Exception) {
            println("[EmailService] failed (Exception): ${e::class.simpleName}: ${e.message}")
            e.printStackTrace()
        }
    }

    private fun escape(s: String) =
        s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
}