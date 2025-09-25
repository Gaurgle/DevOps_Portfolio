package com.gaurgle.portfolio.entities

import jakarta.persistence.*

@Entity
@Table(name = "portfolio_projects")
data class PortfolioProject (
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var projectName: String = "",

    @Column(nullable = false)
    var gitHubURL: String = ""
)