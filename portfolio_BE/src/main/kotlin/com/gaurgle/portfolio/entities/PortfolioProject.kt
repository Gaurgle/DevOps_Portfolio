package com.gaurgle.portfolio.entities

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Column

@Entity
class PortfolioProject {
    
    @Id
    var id: Long? = null

    @Column(nullable = false)
    var projectName: String = ""

    @Column(nullable = false)
    var gitHubURL: String = ""


}