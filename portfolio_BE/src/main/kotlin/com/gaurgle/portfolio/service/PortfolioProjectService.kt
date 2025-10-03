package com.gaurgle.portfolio.service

import com.gaurgle.portfolio.entities.PortfolioProjectEntity
import com.gaurgle.portfolio.repository.PortfolioProjectRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class PortfolioProjectService(
    private val portfolioProjectRepository: PortfolioProjectRepository
) {

    fun getAllProjects(): List<PortfolioProjectEntity> {
        return portfolioProjectRepository.findAll()
    }

    fun getProjectById(id: Long): PortfolioProjectEntity =
        portfolioProjectRepository.findByIdOrNull(id)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "project $id not found")


    @Transactional
    fun deleteProject(id: Long) {
        getProjectById((id))
        portfolioProjectRepository.deleteById(id)
    }
}