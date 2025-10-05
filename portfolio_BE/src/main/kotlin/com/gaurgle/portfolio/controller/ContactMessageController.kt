package com.gaurgle.portfolio.controller

import com.gaurgle.portfolio.entities.ContactMessage
import com.gaurgle.portfolio.repository.ContactMessageRepository
import com.gaurgle.portfolio.service.EmailService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

data class ContactRequest(val name: String,
                          val email: String,
                          val message: String)

@RestController
@RequestMapping("/api")
class ContactMessageController(
    private val repo: ContactMessageRepository,
    private val emailService: EmailService
) {
    @PostMapping("/contact")
    fun create(@RequestBody body: ContactRequest): ResponseEntity<Map<String, Any>> {
        val saved = repo.save(ContactMessage(
            name = body.name,
            email = body.email,
            message = body.message
        ))
        return ResponseEntity.status(201).body(mapOf("id" to saved.id, "status" to "ok"))
    }
}
