package com.gaurgle.portfolio.controller

import com.gaurgle.portfolio.entities.ContactMessage
import com.gaurgle.portfolio.repository.ContactMessageRepository
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping
@Validated
class ContactMessageController(
    private val repo: ContactMessageRepository
) {
    data class ContactReq(
        @field:NotBlank val name: String,
        @field:Email @field:NotBlank val email: String,
        @field:NotBlank val message: String
    )

    @PostMapping
    fun send(@RequestBody req: ContactReq): Map<String, Any> {
        repo.save(ContactMessage(name = req.name, email = req.email, message = req.message))
        return mapOf("sent" to true)
    }
}
