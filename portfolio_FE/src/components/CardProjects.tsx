// src/components/Portfolio/ProjectCards.tsx
import React from "react";
import BorderBeam from "./HibubbaIO/BorderBeam.tsx";

const projects = [
    {
        title: "Project one",
        description: "info about this project",
        image: "https://picsum.photos/200",
        link: "#",
    },
    {
        title: "Project two",
        description: "info about this project",
        image: "https://picsum.photos/200" +"1",
        link: "#",
    },
    {
        title: "Project three",
        description: "info about this project",
        image: "https://picsum.photos/200" +"2",
        link: "#",
    },
    {
        title: "Project four",
        description: "info about this project",
        image: "https://picsum.photos/200" +"3",
        link: "#",
    },
    
    
];

export default function ProjectCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
                <div key={idx} className="relative group rounded-2xl">
                    {/* card content */}
                    <div className="flex h-[200px] w-[300px] bg-black dark:bg-black rounded-2xl shadow-lg overflow-visible border-2 border-gray-950 dark:border-b-gray-950">
                        {/* Left: Image */}
                        <div className="w-[180px] h-[180px] min-w-[180px] rounded-2xl overflow-hidden">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="object-cover h-full w-full transition duration-300
                                ease-in-out filter group-hover:filter-none blur-sm
                                sm:group-hover:blur-0 grayscale group-hover:grayscale-0"
                            />
                        </div>

                        {/* Divider */}
                        {/*<div className="h-[200px] w-px bg-gray-800 ml-1.5 self-center"></div>*/}
                        <div className="h-[180px] w-px bg-gray-700 opacity-100 ml-2 self-center"></div>
                        {/*<div className="h-[160px] w-px bg-gray-900 mx-1 self-center"></div>*/}

                        {/* Right: Text */}
                        <div className="flex flex-col justify-center p-4 w-2/3">
                            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {project.description}
                            </p>
                            <a
                                href={project.link}
                                className="text-sm font-medium text-white hover:underline"
                            >
                                View Project →
                            </a>
                        </div>
                    </div>

                    <BorderBeam className="rounded-2xl z-10" />
                </div>
            ))}
        </div>
    );
}