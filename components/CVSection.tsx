
import React, { useState, useEffect } from 'react';
import { CV_DATA as DEFAULT_CV_DATA } from '../constants';
import { CVData, Experience } from '../types';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CVSectionProps {
  isAdmin: boolean;
}

const CVSection: React.FC<CVSectionProps> = ({ isAdmin }) => {
  const [data, setData] = useState<CVData>(DEFAULT_CV_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch CV data from Firestore (collection: 'portfolio', doc: 'profile')
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const docRef = doc(db, "portfolio", "profile");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data() as CVData);
        } else {
          // If no doc exists, we stick with DEFAULT_CV_DATA
          console.log("No profile doc found, using default");
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "portfolio", "profile"), data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Lỗi khi lưu thông tin!");
    } finally {
      setSaving(false);
    }
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setData({ ...data, experience: newExp });
  };

  const addExperience = () => {
    const newExp: Experience = {
      role: "Vị trí mới",
      company: "Tên công ty",
      period: "2024 - Present",
      description: "Mô tả công việc..."
    };
    setData({ ...data, experience: [newExp, ...data.experience] });
  };

  const removeExperience = (index: number) => {
    const newExp = data.experience.filter((_, i) => i !== index);
    setData({ ...data, experience: newExp });
  };

  if (loading) return <div className="py-12 text-center text-slate-500">Đang tải thông tin...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 relative group">
      {/* Admin Edit Button */}
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          Chỉnh sửa hồ sơ
        </button>
      )}

      {isEditing ? (
        // EDIT MODE
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 bg-white rounded-2xl shadow-xl border border-indigo-100 space-y-6">
            <h2 className="text-xl font-bold text-indigo-900 border-b pb-2">Thông tin chung</h2>
            <div className="grid md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Họ và tên</label>
                  <input 
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    value={data.fullName}
                    onChange={e => setData({...data, fullName: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Chức danh</label>
                  <input 
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    value={data.title}
                    onChange={e => setData({...data, title: e.target.value})}
                  />
               </div>
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
               <input 
                 className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                 value={data.email}
                 onChange={e => setData({...data, email: e.target.value})}
               />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Giới thiệu bản thân</label>
               <textarea 
                 className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 text-slate-900"
                 value={data.bio}
                 onChange={e => setData({...data, bio: e.target.value})}
               />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Kỹ năng (phân cách dấu phẩy)</label>
               <input 
                 className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                 value={data.skills.join(', ')}
                 onChange={e => setData({...data, skills: e.target.value.split(',').map(s => s.trim())})}
               />
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-indigo-900">Kinh nghiệm làm việc</h2>
                <button onClick={addExperience} className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors">+ Thêm mới</button>
             </div>
             {data.experience.map((exp, idx) => (
               <div key={idx} className="p-6 bg-white rounded-2xl shadow-md border border-slate-100 relative group/item">
                 <button onClick={() => removeExperience(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity">Xóa</button>
                 <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input 
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                      value={exp.role}
                      placeholder="Vị trí"
                      onChange={e => handleExperienceChange(idx, 'role', e.target.value)}
                    />
                    <input 
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                      value={exp.company}
                      placeholder="Công ty"
                      onChange={e => handleExperienceChange(idx, 'company', e.target.value)}
                    />
                    <input 
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm md:col-span-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                      value={exp.period}
                      placeholder="Thời gian"
                      onChange={e => handleExperienceChange(idx, 'period', e.target.value)}
                    />
                 </div>
                 <textarea 
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg h-20 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={exp.description}
                    placeholder="Mô tả công việc"
                    onChange={e => handleExperienceChange(idx, 'description', e.target.value)}
                 />
               </div>
             ))}
          </div>

          <div className="flex gap-4 sticky bottom-6 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-200 z-50">
             <button onClick={handleSave} disabled={saving} className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
               {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
             </button>
             <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">
               Hủy bỏ
             </button>
          </div>
        </div>
      ) : (
        // VIEW MODE
        <div className="grid md:grid-cols-3 gap-12 animate-in fade-in duration-500">
          <div className="md:col-span-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Thông tin cá nhân</h2>
              <p className="text-slate-600 leading-relaxed">{data.bio}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Liên hệ</h3>
              <a href={`mailto:${data.email}`} className="text-indigo-600 hover:underline block font-medium">
                {data.email}
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Kỹ năng</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium shadow-sm">
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
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white shadow-sm" />
                    <div className="space-y-2 group">
                      <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md mb-1">{exp.period}</span>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.role}</h3>
                      <p className="font-bold text-slate-700">{exp.company}</p>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVSection;
