package com.gaurgle.portfolio.repository

import com.gaurgle.portfolio.entities.PortfolioProject
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PortfolioProjectRepository : JpaRepository<PortfolioProject, Long>

