package com.gaurgle.portfolio.service

import com.gaurgle.portfolio.entities.PortfolioProject
import com.gaurgle.portfolio.repository.PortfolioProjectRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PortfolioProjectService(
    private val portfolioProjectRepository: PortfolioProjectRepository
) {

    fun getAllProjects(): List<PortfolioProject> {
        return portfolioProjectRepository.findAll()
    }

    fun getProjectById(id: Long): PortfolioProject? {
        return portfolioProjectRepository.findById(id).orElse(null)
    }

    @Transactional
    fun createProject(project: PortfolioProject): PortfolioProject {
        return portfolioProjectRepository.save(project)
    }

    @Transactional
    fun updateProject(id: Long, project: PortfolioProject): PortfolioProject {
        val updated = project.copy(id = id)
        return portfolioProjectRepository.save(project)
    }

    @Transactional
    fun deleteProject(id: Long) {
        portfolioProjectRepository.deleteById(id)
    }
}