// src/components/Portfolio/ProjectCards.tsx
import React from "react";
import BorderBeam from "./HibubbaIO/BorderBeam.tsx";

const projects = [
    {
        title: "Project one",
        description: "info about this project",
        image: "/images/project1.png",
        link: "#",
    },
    {
        title: "Project two",
        description: "info about this project",
        image: "/images/project2.png",
        link: "#",
    },
    {
        title: "Project three",
        description: "info about this project",
        image: "/images/project3.png",
        link: "#",
    },
    {
        title: "Project four",
        description: "info about this project",
        image: "/images/project4.png",
        link: "#",
    },
];

export default function ProjectCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
                <div key={idx} className="relative group rounded-2xl">
                    <BorderBeam
                        className="opacity-20 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
                        <div
                            key={idx}
                            className="flex h-64 bg-white dark:bg-black rounded-2xl shadow-lg overflow-hidden border-2 border-gray-950 dark:border-b-gray-950">


                            {/* card */}
                            <div
                                className="relative flex bg-white dark:bg-black rounded-2xl shadow-lg overflow-hidden">
                                {/* Left: Image */}
                                <div className="w-[240px] min-w-[120px]">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="object-cover h-full w-full"
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-[180px] w-px bg-gray-700 mx-4 self-center"></div>

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
                </div>
                ))}
        </div>
    );
}