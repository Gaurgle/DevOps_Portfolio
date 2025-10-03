package com.gaurgle.portfolio.controller

import com.gaurgle.portfolio.entities.PortfolioProjectEntity
import com.gaurgle.portfolio.service.PortfolioProjectService
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/projects")
class PortfolioProjectController(
    private val portfolioProjectService: PortfolioProjectService
) {
    @GetMapping
    fun getAllProjects(): List<PortfolioProjectEntity> =
        portfolioProjectService.getAllProjects()

    @GetMapping("/{id}")
    fun getProjectById(@PathVariable id: Long): PortfolioProjectEntity? =
        portfolioProjectService.getProjectById(id)

    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable id: Long) =
        portfolioProjectService.deleteProject(id)
}
