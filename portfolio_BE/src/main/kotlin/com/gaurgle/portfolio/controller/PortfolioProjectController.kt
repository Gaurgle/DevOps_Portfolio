package com.gaurgle.portfolio.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import com.gaurgle.portfolio.entities.PortfolioProject

@Repository
interface PortfolioProjectController : JpaRepository<PortfolioProject, Long>

