package com.gaurgle.portfolio.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { } // <- Kotlin DSL: no Customizer.withDefaults()
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                    .requestMatchers("/api/**").permitAll()   // open while developing
                    .anyRequest().permitAll()                 // tighten in prod
            }
            .httpBasic { it.disable() }
            .formLogin { it.disable() }

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val cfg = CorsConfiguration().apply {
            // Allow your local FE and your deployed FE
            allowedOriginPatterns = listOf(
                "http://localhost:4321",  // Astro dev default
                "http://localhost:5173",  // Vite
                "https://andreasroos.vercel.app"    // deployed FE
            )
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = true
            maxAge = 3600
        }
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", cfg)
        return source
    }
}