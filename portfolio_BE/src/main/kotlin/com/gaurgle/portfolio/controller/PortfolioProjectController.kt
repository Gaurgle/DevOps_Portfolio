package com.gaurgle.portfolio.controller

import com.gaurgle.portfolio.entities.PortfolioProject
import com.gaurgle.portfolio.service.PortfolioProjectService
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/projects")
class PortfolioProjectController(
    private val portfolioProjectService: PortfolioProjectService
) {
    @GetMapping
    fun getAllProjects(): List<PortfolioProject> =
        portfolioProjectService.getAllProjects()

    @GetMapping("/{id}")
    fun getProjectById(@PathVariable id: Long): PortfolioProject? =
        portfolioProjectService.getProjectById(id)

    @PostMapping
    fun createProject(@RequestBody project: PortfolioProject): PortfolioProject =
        portfolioProjectService.createProject(project)

    @PutMapping("/{id}")
    fun updateProject(@PathVariable id: Long, @RequestBody project: PortfolioProject): PortfolioProject =
        portfolioProjectService.updateProject(id, project)

    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable id: Long) =
        portfolioProjectService.deleteProject(id)
}
