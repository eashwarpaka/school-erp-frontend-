import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Shield, X, Check, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { useAgentStore } from '../store/agentStore';

interface CameraViewfinderProps {
  onCapture?: (dataUrl: string) => void;
  title?: string;
  subtitle?: string;
  allowHandwritingScan?: boolean;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  onCapture,
  title = 'Astra Optical Intelligence',
  subtitle = 'Point camera at textbook formulas, diagrams, or student handwritten steps',
  allowHandwritingScan = true,
}) => {
  const { hasCameraPermission, setCameraPermission, toggleCameraViewfinder } = useAgentStore();
  const [isScanning, setIsScanning] = useState(false);
  const [detectedInsight, setDetectedInsight] = useState<string | null>(null);

  const handleRequestPermission = (allow: boolean) => {
    setCameraPermission(allow);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setDetectedInsight(null);
    setTimeout(() => {
      setIsScanning(false);
      setDetectedInsight(
        'Captured: "x² - 5x + 6 = 0". Identified step: Factorization (x - 2)(x - 3) = 0. Roots identified as x=2, x=3.'
      );
    }, 1800);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white text-slate-800 shadow-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              {title}
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded-full font-mono">
                VISION v2.4
              </span>
            </h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => toggleCameraViewfinder(false)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Permission UX check */}
      {hasCameraPermission === null ? (
        <div className="my-6 p-6 rounded-xl bg-slate-50 border border-amber-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-900">Camera Permission Required</h4>
          <p className="text-xs text-slate-600 max-w-sm mt-1 mb-4">
            Astra Vision requires temporary optical access to analyze blackboard calculations, textbook pages, and student problem steps in real-time.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRequestPermission(false)}
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-200/70 rounded-lg hover:bg-slate-200 transition"
            >
              Deny
            </button>
            <button
              onClick={() => handleRequestPermission(true)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition"
            >
              <Check className="w-3.5 h-3.5" /> Allow Optical Scanner
            </button>
          </div>
        </div>
      ) : !hasCameraPermission ? (
        <div className="my-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center flex flex-col items-center">
          <AlertCircle className="w-6 h-6 mb-2 text-rose-600" />
          Camera access was denied. You can re-enable permission in browser settings to utilize live problem scanning.
          <button
            onClick={() => handleRequestPermission(true)}
            className="mt-3 px-3 py-1 bg-rose-100 rounded text-rose-700 font-semibold hover:bg-rose-200 transition"
          >
            Retry Permission
          </button>
        </div>
      ) : (
        /* Active Viewfinder Screen */
        <div className="mt-4 relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 border border-indigo-300 flex flex-col items-center justify-center">
          {/* Viewfinder reticle */}
          <div className="absolute inset-4 border border-dashed border-indigo-400 rounded-lg pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between text-[10px] text-indigo-700 font-mono font-medium">
              <span>[RECOGNITION: ACTIVE]</span>
              <span>ASTRA-MULTIMODAL</span>
            </div>
            {isScanning && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-600 to-transparent shadow-[0_0_10px_rgba(79,70,229,0.8)]"
              />
            )}
            <div className="flex justify-between text-[10px] text-indigo-700 font-mono font-medium">
              <span>FOV: 84°</span>
              <span>FPS: 60</span>
            </div>
          </div>

          <div className="text-center p-4 z-10">
            <p className="text-xs text-slate-600 mb-2 font-medium">Simulated Live Camera Stream</p>
            <button
              disabled={isScanning}
              onClick={handleSimulateScan}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 flex items-center gap-2 mx-auto transition disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Math & Syntax...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Scan Document / Blackboard
                </>
              )}
            </button>
          </div>

          {detectedInsight && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/95 border border-emerald-300 shadow-md backdrop-blur-md text-emerald-900 text-xs"
            >
              <div className="font-semibold text-[11px] uppercase tracking-wider text-emerald-700 mb-0.5">
                Astra Vision Extraction:
              </div>
              {detectedInsight}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
