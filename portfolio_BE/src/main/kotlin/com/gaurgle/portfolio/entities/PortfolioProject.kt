package com.gaurgle.portfolio.entities

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "portfolio_projects")
data class PortfolioProject (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "project_name", nullable = false)
    val projectName: String,

    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    val thumbnail: String,
    val screenshot: String,

    @Column(name = "repo_url")
    val repoUrl: String? = null,

    @Column(name = "repo_live")
    val liveUrl: String? = null,

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    val createdAt: Instant? = null,

    @UpdateTimestamp
    @Column(name = "updated_at")
    val updatedAt: Instant? = null,
)