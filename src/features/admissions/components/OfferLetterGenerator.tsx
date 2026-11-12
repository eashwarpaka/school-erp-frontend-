import React, { useState } from 'react';
import { FileText, Download, Mail, CheckCircle, Send, FileSignature } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface OfferDetail {
  applicantId: string;
  name: string;
  grade: string;
  date: string;
  academicYear: string;
  fees: {
    admission: number;
    tuition: number;
    total: number;
  };
}

export const OfferLetterGenerator: React.FC = () => {
  const [offer, setOffer] = useState<OfferDetail>({
    applicantId: 'ADM-2026-001',
    name: 'Arjun Sharma',
    grade: 'Grade 6',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    academicYear: '2026-27',
    fees: {
      admission: 50000,
      tuition: 120000,
      total: 170000,
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendOffer = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsSent(true);
      toast.success('Offer Letter generated and emailed successfully!');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      
      {/* Left Panel - Configuration */}
      <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileSignature size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Generate Offer</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Applicant</label>
              <div className="mt-1 font-medium text-slate-800">{offer.name} ({offer.applicantId})</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Grade</label>
              <div className="mt-1 font-medium text-slate-800">{offer.grade}</div>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Fee Breakdown (₹)</label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Admission Fee</span>
                  <span className="font-medium text-slate-800">{offer.fees.admission.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Annual Tuition Fee</span>
                  <span className="font-medium text-slate-800">{offer.fees.tuition.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-800">Total Due on Admission</span>
                  <span className="text-indigo-600">{offer.fees.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button 
            disabled={isSent || isGenerating}
            onClick={handleSendOffer}
            className={clsx(
              "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
              isSent 
                ? "bg-emerald-100 text-emerald-700 cursor-default" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
            )}
          >
            {isGenerating ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Generating...</>
            ) : isSent ? (
              <><CheckCircle size={18} /> Sent Successfully</>
            ) : (
              <><Send size={18} /> Generate & Email Offer</>
            )}
          </button>
          
          <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-full md:w-2/3 p-8 bg-slate-200/50 flex items-start justify-center relative overflow-y-auto custom-scrollbar">
        {/* Animated Confetti overlay if sent */}
        {isSent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center bg-white/40 backdrop-blur-[2px]"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200/50">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Offer Letter Dispatched</h3>
              <p className="text-slate-600 font-medium">An email with the payment link has been sent to the parents.</p>
            </div>
          </motion.div>
        )}

        {/* Letter Document Preview */}
        <div className="bg-white w-full max-w-[480px] shadow-2xl p-8 rounded-sm relative">
          <div className="text-center border-b-2 border-indigo-900 pb-4 mb-6">
            <h1 className="text-2xl font-serif font-bold text-indigo-900">Smart School ERP</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Excellence in Education</p>
          </div>

          <div className="flex justify-between items-start text-xs text-slate-600 mb-8 font-serif">
            <div>
              <p>Ref: OFF/{offer.academicYear.replace('-', '')}/{offer.applicantId.split('-')[2]}</p>
            </div>
            <div>
              <p>Date: {offer.date}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-800 font-serif leading-relaxed">
            <p className="font-bold">To,<br/>The Parents of {offer.name}</p>
            <p className="font-bold text-indigo-900 mt-4 text-lg">Subject: Offer of Admission for Academic Year {offer.academicYear}</p>
            
            <p>Dear Parent,</p>
            <p>
              We are delighted to inform you that your ward, <strong>{offer.name}</strong>, has been successfully selected for admission to <strong>{offer.grade}</strong> at Smart School for the upcoming academic session.
            </p>
            <p>
              The selection committee was highly impressed with the performance during the assessment and interactive session.
            </p>
            <p>
              To confirm the admission, we request you to complete the fee payment of <strong>₹{offer.fees.total.toLocaleString('en-IN')}</strong> by the due date. The breakdown is as follows:
            </p>
            <table className="w-full border-collapse mt-2 text-xs">
              <tbody>
                <tr className="border-b border-slate-200"><td className="py-2">Admission Fee</td><td className="py-2 text-right">₹{offer.fees.admission.toLocaleString('en-IN')}</td></tr>
                <tr className="border-b border-slate-200"><td className="py-2">Tuition Fee (Annual)</td><td className="py-2 text-right">₹{offer.fees.tuition.toLocaleString('en-IN')}</td></tr>
                <tr className="font-bold"><td className="py-2">Total Amount Payable</td><td className="py-2 text-right">₹{offer.fees.total.toLocaleString('en-IN')}</td></tr>
              </tbody>
            </table>
            
            <p className="mt-4">
              Failure to complete the payment within the stipulated 48 hours will result in automatic expiration of this offer. A secure payment link has been sent to your registered email.
            </p>

            <div className="mt-12">
              <p>Sincerely,</p>
              <div className="w-32 h-10 bg-indigo-50/50 my-2 flex items-center justify-center text-indigo-900 font-signature text-xl">
                Principal Signature
              </div>
              <p className="font-bold">Principal</p>
              <p className="text-xs text-slate-500">Smart School ERP</p>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-slate-400">
            This is an automatically generated document.
          </div>
        </div>
      </div>
    </div>
  );
};
