import React from "react";
import BorderBeam from "./HibubbaIO/BorderBeam.tsx";
import { projects } from "../data/projects.ts";

export default function ProjectCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
                <div
                    key={idx}
                    className="relative group bg-black dark:bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden hover:border-yellow-500/50 transition-all"
                >
                    {/* Image */}
                    <div className="h-48 w-full overflow-hidden">
                        <img
                            src={project.image}
                            alt={project.projectTitle}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:blur-0 blur-[1px] grayscale group-hover:grayscale-0"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between h-[220px]">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">
                                {project.projectTitle}
                            </h3>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                                {project.description}
                            </p>
                        </div>

                        {/* Link */}
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-yellow-400 hover:underline self-start"
                        >
                            View Project →
                        </a>
                    </div>

                    <BorderBeam className="rounded-2xl z-10" />
                </div>
            ))}
        </div>
    );
}