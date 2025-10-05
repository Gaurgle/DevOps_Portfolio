package com.gaurgle.portfolio.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "app.email")
data class EmailSettings(
    var enabled: Boolean = false,
    var to: String = "",
    var from: String = "",
    var fromName: String = "Portfolio",
    var apiKey: String = ""
)