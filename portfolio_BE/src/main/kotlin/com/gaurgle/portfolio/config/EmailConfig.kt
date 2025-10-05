package com.gaurgle.portfolio.config


import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class EmailConfig (
    @Value("\\${app.email.enabled:false}") private val enabled: Boolean,
    @Value("\\${app.email.to:}") private val toAddress: String,
    @Value("\\${app.email.fromAddress:}") private val fromAddress: String,
    @Value("\\${app.email.fromName:Portfolio Contact}") private val fromName: String,
    @Value("\${BREVO_API_KEY:}") private val apiKey: String
) {
    @Bean
    fun emailSettings() = EmailSettings(enabled, toAddress, fromAddress, fromName, apiKey)

}

data class EmailSettings(
    val enabled: Boolean,
    val to: String,
    val from: String,
    val fromName: String,
    val apiKey: String
)