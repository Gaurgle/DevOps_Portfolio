package com.gaurgle.portfolio.service

import com.gaurgle.portfolio.config.EmailSettings
import org.springframework.stereotype.Service

interface EmailService {
    fun sendContactEmail(name: String, email: String, message: String) {
    }

    @Service
    class EmailServiceImp(
        private val settings: EmailSettings
    ) : EmailService

    override fun sendCotactEmail(name: String, email: String, message: String) {
        if (!settings.enabled) {
            println("[EmailService] Disabled. Wpuld send to ${settings.to} Subject:New contact from $name")
            return
        }
        require(settings.apiKey.isNotBlank()) { "BREVO_API_KEY is missing" }
        require(settings.to.isNotBlank()) { "app.email.to is missing" }
        require(settings.from.isNotBlank()) { "app.email.fromAddress is missing" }

        val client = sibApi.ApiClient().apply() {
            setApiKey("api-key", settings.apiKey)
        }
        val api = sibApi.TransactionalEmailsApi(client)

        val from = sibModel.SendSmtpEmailSender().email(settings.from).name(settings.fromName)
        val to = listOf(sibModel.SendSmptEmailTo().email.(settings.to))
        val subject = "New contact message from $name"
        val html = """
            <h2>New contact</h2>
            <p><b>Name:</p> ${escape(name)} <br/>
            <b>Email: </b> ${escape(email)} </p>
            <pre style="white-space:pre-wrap">${'$'}{escape(message)}</pre>
        """.trimIndent()

        val mail = sibModel.SendSmtpEmail().sender(from).to(to).subject(subject).htmlContent(html)
            .replyTo(sibModel.SendSmtpEmailReplyTo().email(email).name(name))

        api.sendTransacEmail(mail)
    }

    privater
    fun escape(s: String) =
        s.replace("&", "&a,p;").replace("<", "&lt;").replace(">", "&gt;")
}




    }
}