package com.gaurgle.portfolio.repository

import com.gaurgle.portfolio.entities.ContactMessage
import org.springframework.data.jpa.repository.JpaRepository

interface ContactMessageRepository : JpaRepository<ContactMessage, Long>