import { projects } from "../data/projects";
import { ProjectCard } from "./CardProjects";

/** The rest of the projects as the familiar grid (flagships live in the
 *  FeaturedShowcase filmstrip above). */
export default function ProjectsGrid() {
    const rest = projects.filter((p) => !("featured" in p) || !p.featured);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((project, idx) => (
                <ProjectCard key={project.projectTitle} project={project} idx={idx} />
            ))}
        </div>
    );
}
