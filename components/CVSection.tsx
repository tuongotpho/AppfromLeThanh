
import React from 'react';
import { CV_DATA } from '../constants';

const CVSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Thông tin cá nhân</h2>
            <p className="text-slate-600">{CV_DATA.bio}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Liên hệ</h3>
            <a href={`mailto:${CV_DATA.email}`} className="text-indigo-600 hover:underline block">
              {CV_DATA.email}
            </a>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Kỹ năng</h3>
            <div className="flex flex-wrap gap-2">
              {CV_DATA.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Kinh nghiệm làm việc</h2>
            <div className="space-y-10 border-l-2 border-slate-100 pl-8 ml-2">
              {CV_DATA.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white" />
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-indigo-600">{exp.period}</span>
                    <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                    <p className="font-medium text-slate-700">{exp.company}</p>
                    <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVSection;
