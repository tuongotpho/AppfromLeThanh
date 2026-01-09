
import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="group flex flex-col h-full overflow-hidden transition-all duration-300 rounded-2xl bg-white shadow-sm hover:shadow-xl border border-slate-200">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.images[currentImage]}
          alt={project.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        
        {project.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {project.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImage === idx ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {project.name}
          </h3>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{project.date}</span>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <button
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform"
          >
            Chi tiết dự án
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
