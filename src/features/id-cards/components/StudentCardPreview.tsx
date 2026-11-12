import React from 'react';
import { IDCardTemplate, CHENNAI_SCHOOLS } from '../store/idCardStore';
import { QrCode, User } from 'lucide-react';

// ── Theme Renderers ───────────────────────────────────────────────────────────

interface ThemeProps {
  primaryColor?: string;
  secondaryColor?: string;
  theme?: string;
  width?: number;
  height?: number;
}

const CardThemeRenderer = ({ theme, primaryColor, secondaryColor, width = 324, height = 204 }: ThemeProps) => {
  const p = primaryColor || '#0ea5e9';
  const s = secondaryColor || '#0284c7';

  if (theme === 'modern-wave') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <path d={`M0,0 L${width},0 L${width},${height * 0.27} C${width * 0.74},${height * 0.39} ${width * 0.25},${height * 0.15} 0,${height * 0.27} Z`} fill={p} />
        <path d={`M0,0 L${width},0 L${width},${height * 0.21} C${width * 0.74},${height * 0.32} ${width * 0.25},${height * 0.09} 0,${height * 0.21} Z`} fill={s} />
        <path d={`M0,${height * 0.37} C15,${height * 0.59} -8,${height * 0.86} 12,${height} L0,${height} Z`} fill={p} />
        <path d={`M${width * 0.77},${height} C${width * 0.88},${height * 0.91} ${width * 0.94},${height * 0.81} ${width},${height * 0.87} L${width},${height} Z`} fill={s} />
      </svg>
    );
  }

  if (theme === 'corporate-edge') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <path d={`M${width * 0.5},0 C${width * 0.75},0 ${width},${height * 0.12} ${width},${height * 0.33} L${width},0 Z`} fill={s} opacity="0.85" />
        <path d={`M0,0 L${width},0 L${width},${height * 0.27} C${width * 0.6},${height * 0.27} ${width * 0.4},${height * 0.44} 0,${height * 0.44} Z`} fill={p} />
        <path d={`M0,${height} L${width * 0.5},${height} C${width * 0.25},${height * 0.82} 0,${height * 0.82} 0,${height * 0.82} Z`} fill={p} />
        <path d={`M${width * 0.25},${height} C${width * 0.5},${height * 0.82} ${width * 0.75},${height * 0.91} ${width},${height * 0.69} L${width},${height} Z`} fill={s} />
      </svg>
    );
  }

  if (theme === 'gradient-flow') {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ background: `linear-gradient(135deg, ${p} 0%, ${p}bb 100%)` }}>
        <svg className="absolute -bottom-4 -left-4 w-[110%] h-[55%]" preserveAspectRatio="none" viewBox={`0 0 ${width} 120`}>
          <path d={`M0,120 L${width},120 L${width},40 C${width * 0.76},5 ${width * 0.49},90 0,15 Z`} fill="#ffffff" />
          <path d={`M0,120 L${width},120 L${width},65 C${width * 0.76},25 ${width * 0.49},105 0,40 Z`} fill="rgba(255,255,255,0.5)" />
          <path d={`M0,120 L${width},120 L${width},88 C${width * 0.76},50 ${width * 0.49},125 0,65 Z`} fill="rgba(255,255,255,0.2)" />
        </svg>
      </div>
    );
  }

  if (theme === 'playful-bubbles') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <path d={`M0,0 L${width},0 L${width},${height * 0.49} L0,${height * 0.32} Z`} fill={p} />
        <path d={`M0,${height * 0.49} L${width},${height * 0.64} L${width},${height * 0.69} L0,${height * 0.54} Z`} fill={`${s}60`} />
        <circle cx={width * 0.83} cy={height * 0.17} r={height * 0.11} fill="rgba(255,255,255,0.12)" />
        <circle cx={width * 0.15} cy={height * 0.25} r={height * 0.17} fill="rgba(255,255,255,0.10)" />
        <circle cx={width * 0.56} cy={height * 0.07} r={height * 0.06} fill={`${s}50`} />
      </svg>
    );
  }

  if (theme === 'classic-stripe') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <rect x="0" y="0" width={width} height={height * 0.24} fill={p} />
        <rect x="0" y={height * 0.24} width={width} height={height * 0.04} fill={s} />
        <rect x="0" y={height * 0.76} width={width} height={height * 0.04} fill={s} />
        <rect x="0" y={height * 0.8} width={width} height={height * 0.2} fill={p} />
      </svg>
    );
  }

  return null;
};

// ── Barcode SVG Visual ────────────────────────────────────────────────────────

const BarcodeVisual = ({ width, height, content }: { width: number; height: number; content: string }) => {
  const bars = Array.from({ length: 28 }, (_, i) => ({
    x: 4 + i * ((width - 8) / 28),
    w: i % 3 === 0 ? 3 : 1.5,
    h: i % 5 === 0 ? height - 14 : height - 20,
  }));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <rect width={width} height={height} fill="white" rx="2" />
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x} y={4} width={bar.w} height={bar.h} fill="#1e293b" />
      ))}
      <text x={width / 2} y={height - 2} textAnchor="middle" fontSize="5" fill="#475569" fontFamily="monospace">
        {(content || '').replace(/\{\{[^}]+\}\}/g, 'ADM-001-2026-0001').slice(0, 20)}
      </text>
    </svg>
  );
};

// ── Security Pattern Overlay ──────────────────────────────────────────────────

const SecurityPatternOverlay = ({ pattern, color, width, height }: { pattern?: string; color: string; width: number; height: number }) => {
  if (!pattern || pattern === 'none') return null;

  if (pattern === 'dots') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: Math.ceil(width / 12) }, (_, xi) =>
          Array.from({ length: Math.ceil(height / 12) }, (_, yi) => (
            <circle key={`${xi}-${yi}`} cx={xi * 12 + 6} cy={yi * 12 + 6} r={1.2} fill={color} />
          ))
        )}
      </svg>
    );
  }

  if (pattern === 'lines') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: Math.ceil(height / 8) }, (_, i) => (
          <line key={i} x1={0} y1={i * 8} x2={width} y2={i * 8} stroke={color} strokeWidth={0.8} />
        ))}
      </svg>
    );
  }

  if (pattern === 'guilloche') {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx={width / 2} cy={height / 2} rx={30 + i * 20} ry={20 + i * 12} fill="none" stroke={color} strokeWidth={0.7} />
        ))}
      </svg>
    );
  }

  return null;
};

// ── Watermark Overlay ─────────────────────────────────────────────────────────

const WatermarkOverlay = ({ text, width, height }: { text: string; width: number; height: number }) => (
  <div
    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
    style={{ transform: 'rotate(-30deg)', opacity: 0.04 }}
  >
    <span style={{ fontSize: Math.min(width, height) * 0.22, fontWeight: 900, color: '#000', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
      {text}
    </span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

interface StudentCardPreviewProps {
  template: IDCardTemplate;
  student: any;
  scale?: number;
  side?: 'front' | 'back';
}

export const StudentCardPreview: React.FC<StudentCardPreviewProps> = ({
  template,
  student,
  scale = 1,
  side = 'front',
}) => {
  const school = CHENNAI_SCHOOLS.find(
    (s) => s.id === (student?.schoolId || template.schoolId)
  );

  const resolveMergeField = (content: string) => {
    if (!content) return '';
    return content.replace(/\{\{([^}]+)\}\}/g, (match, field) => {
      const parts = field.split('.');
      if (parts[0] === 'school' && school) {
        const key = parts[1];
        if (key === 'name') return school.name;
        if (key === 'shortName') return school.shortName;
        if (key === 'logo') return school.logoUrl;
        if (key === 'board') return school.board;
        if (key === 'address') return school.address;
        if (key === 'phone') return school.phone;
      }
      let val: any = (parts[0] === 'student' || parts[0] === 'staff' || parts[0] === 'visitor') ? student : null;
      if (val) {
        for (let i = 1; i < parts.length; i++) {
          val = val?.[parts[i]];
          if (val === undefined) break;
        }
      }
      return val !== undefined && val !== null ? val : match;
    });
  };

  const primaryColor = template.cardStyle?.primaryColor || school?.theme.primaryColor || '#1e3a5f';
  const secondaryColor = template.cardStyle?.secondaryColor || school?.theme.secondaryColor || '#c8a951';
  const activeElements = side === 'back' ? (template.backElements || []) : template.elements;
  const activeTheme = side === 'back' ? 'classic-stripe' : template.cardStyle?.theme;

  return (
    <div
      className="bg-white relative overflow-hidden shadow-sm ring-1 ring-slate-900/5 print:ring-0 print:shadow-none"
      style={{
        width: template.width,
        height: template.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        backgroundColor: template.cardStyle?.backgroundColor || '#ffffff',
        border: `${template.cardStyle?.borderWidth || 0}px solid ${template.cardStyle?.borderColor || 'transparent'}`,
        borderRadius: `${template.cardStyle?.borderRadius || 0}px`,
        backgroundImage: template.cardStyle?.backgroundImage ? `url(${template.cardStyle.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Security pattern */}
      <SecurityPatternOverlay
        pattern={template.cardStyle?.securityPattern}
        color={primaryColor}
        width={template.width}
        height={template.height}
      />

      {/* Watermark */}
      {template.cardStyle?.watermark && (
        <WatermarkOverlay text={template.cardStyle.watermark} width={template.width} height={template.height} />
      )}

      {/* Themed Background */}
      {side === 'front' && (
        <CardThemeRenderer
          theme={activeTheme}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          width={template.width}
          height={template.height}
        />
      )}

      {/* BACK side gets a subtle stripe */}
      {side === 'back' && (
        <div
          className="absolute top-0 left-0 right-0 h-8"
          style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
        />
      )}

      {activeElements.map((el) => {
        const resolvedContent = resolveMergeField(el.content || '');

        return (
          <div
            key={el.id}
            className="absolute flex items-center"
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              ...el.style,
            }}
          >
            {el.type === 'text' && (
              <div className="w-full h-full p-1 whitespace-pre-wrap flex items-center leading-tight" style={el.style}>
                {resolvedContent}
              </div>
            )}

            {el.type === 'image' && (
              <div
                className="w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden text-slate-400"
                style={{ borderRadius: el.style?.borderRadius || '4px' }}
              >
                {resolvedContent && !resolvedContent.startsWith('{{') ? (
                  <img src={resolvedContent} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={el.width * 0.55} className="text-slate-300" />
                )}
              </div>
            )}

            {el.type === 'qrcode' && (
              <div className="w-full h-full p-1 flex items-center justify-center">
                <QrCode size={el.width - 8} className="text-slate-800" />
              </div>
            )}

            {el.type === 'barcode' && (
              <div className="w-full h-full flex items-center justify-center">
                <BarcodeVisual width={el.width} height={el.height} content={resolvedContent} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
