import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileText, UploadCloud, CheckCircle, ArrowRight, ArrowLeft, Building, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const ApplicationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    grade: '',
    parentName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    birthCert: null,
    reportCard: null,
    idProof: null,
  });

  const handleNext = () => {
    if (step === 1 && (!formData.studentName || !formData.dob || !formData.grade)) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }
    if (step === 2 && (!formData.parentName || !formData.phone)) {
      toast.error('Please fill in parent/guardian details.');
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call & AI Document Verification
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Application submitted successfully! Documents are under verification.');
      setStep(4);
    }, 2000);
  };

  const steps = [
    { id: 1, label: 'Student Info', icon: User },
    { id: 2, label: 'Parent Info', icon: Users },
    { id: 3, label: 'Documents', icon: UploadCloud },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-visible">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Admission Application</h2>
          <p className="text-blue-100">Academic Year 2026-27</p>
        </div>
        <Building size={120} className="absolute -bottom-10 -right-10 text-white/10" />
      </div>

      {/* Progress Bar */}
      <div className="px-8 pt-6 pb-2 border-b border-slate-100">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step >= s.id;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {step > s.id ? <CheckCircle size={20} /> : <Icon size={18} />}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">Student Information</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student's Full Name *</label>
                <input 
                  type="text" 
                  value={formData.studentName}
                  onChange={e => setFormData({...formData, studentName: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                  <input 
                    type="date" 
                    value={formData.dob}
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Applying for Grade *</label>
                  <select 
                    value={formData.grade}
                    onChange={e => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                  >
                    <option value="">Select Grade</option>
                    <option value="Pre-K">Pre-K</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">Parent / Guardian Information</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parent's Full Name *</label>
                <input 
                  type="text" 
                  value={formData.parentName}
                  onChange={e => setFormData({...formData, parentName: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="Enter parent's name"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Residential Address</label>
                <textarea 
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="Enter full address"
                ></textarea>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">Document Upload</h3>
              
              <div className="space-y-4">
                {[
                  { key: 'birthCert', label: 'Birth Certificate *', desc: 'PDF, JPG or PNG up to 5MB' },
                  { key: 'reportCard', label: 'Previous Report Card', desc: 'PDF up to 10MB' },
                  { key: 'idProof', label: 'Parent ID Proof *', desc: 'Aadhar/Passport/Driver License' },
                ].map((doc) => (
                  <div key={doc.key} className="border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{doc.label}</p>
                          <p className="text-xs text-slate-500">{doc.desc}</p>
                        </div>
                      </div>
                      <div>
                        <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm">
                          Browse
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                    </div>
                    {files[doc.key] && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
                        <CheckCircle size={14} />
                        <span className="font-medium truncate">{files[doc.key]?.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <UploadCloud className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-amber-800">
                  <strong>Note on Document Verification:</strong> Uploaded documents will be automatically verified by our AI system. If any discrepancies are found, they will be routed for manual review.
                </p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-3">Application Submitted!</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Thank you, {formData.parentName}. {formData.studentName}'s application has been successfully submitted. We've sent a confirmation email to {formData.email}.
              </p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-slate-800 mb-2">Next Steps:</h4>
                <ul className="text-sm text-slate-600 space-y-2 text-left list-disc list-inside">
                  <li>AI Document Verification (In Progress)</li>
                  <li>Entrance Test / Interview Scheduling</li>
                  <li>Admission Committee Review</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      {step < 4 && (
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
              step === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 shadow-sm'
            }`}
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application <CheckCircle size={18} />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
