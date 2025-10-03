package com.gaurgle.portfolio.repository

import com.gaurgle.portfolio.entities.PortfolioProjectEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PortfolioProjectRepository : JpaRepository<PortfolioProjectEntity, Long>

