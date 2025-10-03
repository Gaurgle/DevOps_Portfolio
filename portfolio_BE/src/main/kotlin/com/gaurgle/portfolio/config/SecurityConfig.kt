// src/main/kotlin/com/gaurgle/portfolio/config/SecurityConfig.kt
package com.gaurgle.portfolio.config

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
class SecurityConfig {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers(
                        EndpointRequest.to("health", "metrics", "prometheus")).permitAll()

                    .requestMatchers("/api/**").permitAll()
                    .anyRequest().authenticated()
            }
            .httpBasic(Customizer.withDefaults())
            .csrf { it.disable() } // if you only have APIs; keep enabled if you serve forms
        return http.build()
    }
}