
import React, { useState } from 'react';
import { Project } from '../types';
import { db, storage } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onSave: (updatedProject: Project) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose, isAdmin, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<Project>(project);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Sync edited state when project prop changes (e.g. switching between view/edit)
  React.useEffect(() => {
    setEdited(project);
  }, [project]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to Firestore 'showcase' collection
      await setDoc(doc(db, "showcase", edited.id), edited);
      onSave(edited);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Lỗi khi lưu dự án! Kiểm tra console.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImg(true);
    const file = e.target.files[0];
    // Create a reference in 'showcase' folder
    const storageRef = ref(storage, `showcase/images/${Date.now()}_${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Add new image URL to the beginning of the list
      setEdited(prev => ({
        ...prev,
        images: [downloadURL, ...prev.images]
      }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload ảnh thất bại!");
    } finally {
      setUploadingImg(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setEdited(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-white/80 backdrop-blur-md z-10 flex justify-between items-center p-6 border-b border-slate-100 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Chỉnh sửa dự án' : project.name}
          </h2>
          <div className="flex gap-2">
            {isAdmin && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
              >
                Chỉnh sửa
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto modal-scroll">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tên dự án</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={edited.name}
                      onChange={e => setEdited({...edited, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Link dự án</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={edited.url}
                      onChange={e => setEdited({...edited, url: e.target.value})}
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tags (phân cách bằng dấu phẩy)</label>
                <input 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={edited.tags.join(', ')}
                  onChange={e => setEdited({...edited, tags: e.target.value.split(',').map(t => t.trim())})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Hình ảnh</label>
                <div className="flex flex-wrap gap-4 mb-3">
                  {edited.images.map((img, idx) => (
                    <div key={idx} className="relative group w-24 h-24">
                      <img src={img} alt="thumb" className="w-full h-full object-cover rounded-lg border border-slate-200" />
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${uploadingImg ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingImg ? (
                       <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                      <>
                        <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs text-slate-500 font-medium">Thêm ảnh</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImg}/>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả ngắn</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-20"
                  value={edited.description}
                  onChange={e => setEdited({...edited, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung chi tiết (Markdown)</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-40 font-mono text-sm"
                  value={edited.longDescription || ''}
                  onChange={e => setEdited({...edited, longDescription: e.target.value})}
                  placeholder="Viết chi tiết về dự án..."
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                 <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSaving ? (
                     <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang lưu...
                     </>
                  ) : 'Lưu thay đổi'}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((img, i) => (
                  <img key={i} src={img} className="rounded-2xl w-full aspect-video object-cover shadow-sm bg-slate-100" alt="" />
                ))}
              </div>
              <div className="prose prose-slate max-w-none">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(t => <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase">{t}</span>)}
                </div>
                <p className="text-xl text-slate-600 leading-relaxed mb-6 italic">{project.description}</p>
                <div className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {project.longDescription || 'Chưa có thông tin chi tiết.'}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  Truy cập Website dự án
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
