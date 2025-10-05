package com.gaurgle.portfolio.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfig(
    @Value("\${app.allowedOrigins:*}") private val allowedOrigins: String
) {
    @Bean
    fun corsFilter(): CorsFilter {
        val cfg = CorsConfiguration()
        cfg.allowedOrigins = allowedOrigins.split(",").map { it.trim() }
        cfg.addAllowedHeader("*")
        cfg.addAllowedMethod("*")
        cfg.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", cfg)
        return CorsFilter(source)
    }
}