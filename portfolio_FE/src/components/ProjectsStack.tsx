import { projects } from "../data/projects";
import { ProjectCard } from "./CardProjects";

/**
 * Projects as a scroll experience: flagship projects stack on top of each
 * other via position: sticky (each new card slides over the previous one),
 * followed by the full grid for the rest.
 */
const FEATURED = [
    "notez",
    "noiz",
    "Wireless Testing App",
    "Wireless Test Platform",
    "Portfolio",
];

export default function ProjectsStack() {
    const featured = FEATURED
        .map((name) => projects.find((p) => p.projectTitle === name))
        .filter((p): p is (typeof projects)[number] => Boolean(p));
    const rest = projects.filter((p) => !FEATURED.includes(p.projectTitle));

    return (
        <div>
            {/* Featured: sticky stacking deck */}
            <div className="max-w-2xl mx-auto mb-24">
                {featured.map((project, i) => (
                    <div key={project.projectTitle} className="stack-item" style={{ top: `${110 + i * 14}px` }}>
                        <ProjectCard project={project} idx={0} />
                    </div>
                ))}
            </div>

            {/* The rest, as the familiar grid */}
            <p className="font-mono text-sm text-zinc-400 mb-6">
                <span className="text-ctp-blue">$</span> ls projects/ --all
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((project, idx) => (
                    <ProjectCard key={project.projectTitle} project={project} idx={idx} />
                ))}
            </div>
        </div>
    );
}
