package com.gaurgle.portfolio.service

import com.gaurgle.portfolio.config.EmailSettings
import com.resend.Resend
import com.resend.services.emails.model.SendEmailRequest
import org.springframework.stereotype.Service

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

        require(settings.apiKey.isNotBlank()) { "RESEND_API_KEY is missing" }
        require(settings.to.isNotBlank()) { "app.email.to is missing" }
        require(settings.from.isNotBlank()) { "app.email.from is missing" }

        println("[EmailService] enabled=${settings.enabled} from=${settings.from} to=${settings.to} keyPrefix=${settings.apiKey.take(8)}")

        val resend = Resend(settings.apiKey)

        val subject = "New contact message from $name"
        val html = """
            <h2>New contact</h2>
            <p><b>Name:</b> ${escape(name)}<br/>
            <b>Email:</b> ${escape(email)}</p>
            <pre style="white-space:pre-wrap">${escape(message)}</pre>
        """.trimIndent()

        val request = SendEmailRequest.builder()
            .from("${settings.fromName} <${settings.from}>")
            .to(settings.to)
            .subject(subject)
            .html(html)
            .replyTo(email)
            .build()

        try {
            val response = resend.emails().send(request)
            println("[EmailService] sent OK: id=${response.id}")
        } catch (e: Exception) {
            println("[EmailService] failed: ${e::class.simpleName}: ${e.message}")
            e.printStackTrace()
        }
    }

    private fun escape(s: String) =
        s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
}
