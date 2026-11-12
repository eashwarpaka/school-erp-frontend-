// ============================================================
// Rich Multimodal Mock Library (English & Tamil Education Content)
// ============================================================

import { ContentArtifact } from '../types/agentTypes';

export const SAMPLE_ARTIFACTS_BY_MODE: Record<string, Record<string, ContentArtifact>> = {
  photosynthesis: {
    notes: {
      id: 'art-photo-notes',
      type: 'notes',
      title: 'Photosynthesis & Solar Energy Conversion',
      subject: 'Biology / Science',
      topic: 'Cellular Energetics',
      summary: 'Chemical equations, chloroplast mechanics, and light/dark reaction summary.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Understand',
      content: {
        equation: '6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂',
        keyPoints: [
          'Occurs inside chlorophyll thylakoids (Light reactions).',
          'ATP & NADPH produced drive the Calvin Cycle in the stroma.',
          'Crucial catalyst: RuBisCO enzyme.',
          'Vital oxygen output sustaining aerobic life on Earth.'
        ]
      }
    },
    quiz: {
      id: 'art-photo-quiz',
      type: 'quiz',
      title: 'Rapid Knowledge Check: Light Dependent Reactions',
      subject: 'Biology / Science',
      topic: 'Photosynthesis Examination',
      summary: 'Diagnostic Bloom taxonomy assessment evaluating photolysis comprehension.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Apply',
      content: {
        questions: [
          {
            q: 'Where does the photolysis of water occur during photosynthesis?',
            options: ['Stroma', 'Thylakoid Lumen', 'Outer Membrane', 'Mitochondria'],
            correctIndex: 1,
            explanation: 'Water photolysis takes place on the inner surface of the thylakoid membrane.'
          },
          {
            q: 'Which byproduct gas is directly released into the atmosphere?',
            options: ['Carbon Dioxide', 'Oxygen', 'Methane', 'Nitrogen'],
            correctIndex: 1,
            explanation: 'Oxygen gas is released through plant stomata.'
          },
          {
            q: 'What is the primary function of ATP and NADPH produced in light reactions?',
            options: ['Absorb green light', 'Fuel the Calvin Cycle in the stroma', 'Decompose soil minerals', 'Activate root hairs'],
            correctIndex: 1,
            explanation: 'Chemical energy stored in ATP and NADPH powers carbon fixation.'
          }
        ]
      }
    },
    curiosity: {
      id: 'art-photo-curiosity',
      type: 'curiosity_prompt',
      title: 'What If? Quantum Biology in Chlorophyll',
      subject: 'Quantum Biophysics',
      topic: 'Photosynthetic Quantum Coherence',
      summary: 'Mind-expanding connection between subatomic quantum superposition and plant survival.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Create',
      content: {
        scenario: 'What if plants utilize quantum superposition to test every photon transfer route simultaneously?',
        sparkFact: 'Physicists discovered that light-harvesting FMO complexes exploit quantum wave coherence to transfer solar excitation with nearly 100% quantum efficiency — avoiding energy dissipation.',
        investigationQuestion: 'Could bio-inspired synthetic quantum solar cells double rooftop panel efficiency in cloudy regions?'
      }
    },
    visual: {
      id: 'art-photo-visual',
      type: 'diagram',
      title: 'Dynamic Chloroplast Dual-Reaction Architecture',
      subject: 'Visual Synthesis',
      topic: 'Light Reactions vs Calvin Cycle Flow',
      summary: 'Real-time animated conceptual pipeline rendered from teacher lecture acoustics.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Analyze',
      content: {
        flowStages: [
          { name: 'Thylakoid Membrane', role: 'Photon absorption & H₂O Photolysis', output: 'O₂ + ATP + NADPH' },
          { name: 'Stroma Matrix', role: 'RuBisCO Enzyme CO₂ Fixation', output: 'G3P / Glucose precursor' },
          { name: 'Cytoplasm Vascular', role: 'Sucrose transport & starch storage', output: 'Plant growth & cellular respiration' }
        ],
        diagramNote: 'Dynamic Vector Synthesis: 480nm photon excitation triggers electron transport chain across Photosystem II (P680) to Photosystem I (P700).'
      }
    },
    '3d_world': {
      id: 'art-photo-3d',
      type: '3d_scene',
      title: '3D Interactive Plant Cell & Thylakoid Stacks',
      subject: 'Spatial 3D Simulation',
      topic: 'Granum & Stroma Lamellae Volumetrics',
      summary: 'Interactive micro-world simulation with real-time electron transport inspection.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Analyze',
      content: {
        interactiveLayers: ['Chloroplast Outer Double Envelope', 'Thylakoid Disc Stack (Granum)', 'ATP Synthase Turbine Complex', 'Stroma RuBisCO Pool'],
        simulationMetrics: { photonFlux: '1850 μmol/m²/s', atpYieldRate: '98.4%', co2Concentration: '415 ppm' }
      }
    }
  },

  quadratic: {
    notes: {
      id: 'art-quad-notes',
      type: 'notes',
      title: 'Quadratic Equations & Parabolic Trajectories',
      subject: 'Mathematics',
      topic: 'Algebra & Functions',
      summary: 'Derivation of quadratic formula and projectile trajectory real-world modeling.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Apply',
      content: {
        formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
        discriminantInfo: 'Discriminant Δ = b² - 4ac defines real, repeated, or complex roots.',
        keyPoints: [
          'Rocket trajectory navigation and space probe apogee',
          'Satellite dish parabolic reflective focusing',
          'Video game engine physics (gravity jump curves)'
        ]
      }
    },
    quiz: {
      id: 'art-quad-quiz',
      type: 'quiz',
      title: 'Rapid Knowledge Check: Discriminant Analysis',
      subject: 'Mathematics',
      topic: 'Roots of Quadratic Equations',
      summary: '3 targeted diagnostic questions analyzing root behaviors.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Apply',
      content: {
        questions: [
          {
            q: 'If the discriminant b² - 4ac is less than zero (Δ < 0), what is the nature of the roots?',
            options: ['Two distinct real roots', 'Two complex conjugate roots', 'One repeated real root', 'Roots are zero'],
            correctIndex: 1,
            explanation: 'A negative value under the square root yields imaginary/complex conjugate roots.'
          },
          {
            q: 'What is the vertex x-coordinate of the parabola y = ax² + bx + c?',
            options: ['x = -b / (2a)', 'x = b / (2a)', 'x = -b / a', 'x = c / a'],
            correctIndex: 0,
            explanation: 'The axis of symmetry and vertex occur at x = -b / (2a).'
          }
        ]
      }
    },
    curiosity: {
      id: 'art-quad-curiosity',
      type: 'curiosity_prompt',
      title: 'What If? Gravity Followed a Cubic Trajectory',
      subject: 'Theoretical Mechanics',
      topic: 'Non-Newtonian Projectile Curves',
      summary: 'Investigating planetary orbits and ballistic flight if acceleration was non-linear.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Create',
      content: {
        scenario: 'What if gravitational force scaled with the cube of inverse distance instead of square?',
        sparkFact: 'Isaac Newton showed that only inverse-square central forces produce stable, closed circular and elliptical orbits. In an inverse-cube universe, planets would spiral into their stars.',
        investigationQuestion: 'How would basketball trajectories look if projectile velocity decayed quadratically?'
      }
    },
    visual: {
      id: 'art-quad-visual',
      type: 'diagram',
      title: 'Vector Parabolic Projectile Synthesis',
      subject: 'Mathematics & Physics',
      topic: 'Flight Path vs Gravity Decomposition',
      summary: 'Kinematic decomposition of velocity vectors into horizontal and vertical components.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Analyze',
      content: {
        flowStages: [
          { name: 'Launch Apex', role: 'Initial Velocity Vector (v₀ cos θ, v₀ sin θ)', output: 'High Kinetic Energy' },
          { name: 'True Apogee', role: 'Vertical Velocity vy = 0 at maximum height', output: 'Maximum Potential Energy' },
          { name: 'Impact Ground', role: 'Symmetric parabolic touchdown angle', output: 'Range R = (v₀² sin 2θ) / g' }
        ],
        diagramNote: 'Astra Math Pipeline: Quadratic curve models exact trajectory minimizing air drag coefficient.'
      }
    },
    '3d_world': {
      id: 'art-quad-3d',
      type: '3d_scene',
      title: '3D Projectile Cannon & Space Orbital Simulator',
      subject: 'Interactive Spatial Physics',
      topic: 'Escape Velocity and Parabolic Trajectories',
      summary: '3D interactive gravity well with customizable launch angles and real-time path traces.',
      language: 'en',
      createdAt: 'Just now',
      bloomLevel: 'Analyze',
      content: {
        interactiveLayers: ['Newton Cannon Trajectory', 'Gravity Well Deformation', 'Apogee Height Sensor', 'Orbital Velocity Gauge'],
        simulationMetrics: { launchAngle: '45°', velocity: '28.4 m/s', gravityConstant: '9.81 m/s²' }
      }
    }
  }
};

export const SAMPLE_ARTIFACTS: Record<string, ContentArtifact[]> = {
  photosynthesis: Object.values(SAMPLE_ARTIFACTS_BY_MODE.photosynthesis),
  quadratic: Object.values(SAMPLE_ARTIFACTS_BY_MODE.quadratic)
};

export const TAMIL_CONTENT_TRANSLATIONS: Record<string, Record<string, { title: string; summary: string; speech: string }>> = {
  photosynthesis: {
    notes: {
      title: 'ஒளிச்சேர்க்கை மற்றும் சூரிய ஆற்றல் மாற்றம்',
      summary: 'தாவரங்கள் சூரிய ஒளியைப் பயன்படுத்தி உணவை உருவாக்கும் அரிய அறிவியல் நிகழ்வு.',
      speech: 'வணக்கம் மாணவர்களே! ஒளிச்சேர்க்கை எவ்வாறு பூமியின் ஒட்டுமொத்த உயிரினங்களுக்கும் ஆதாரமாக விளங்குகிறது என்பதை நாம் இப்போது நேரடியாகப் பார்க்கலாம்.'
    },
    quiz: {
      title: 'விரைவு அறிவுத் தேர்வு: ஒளி சார்ந்த வினைகள்',
      summary: 'ஒளிச்சேர்க்கையின் அடிப்படை புரிதலை மதிப்பீடு செய்யும் தேர்வுக் கேள்விகள்.',
      speech: 'நாம் இப்போது படித்த பாடத்தின் அடிப்படையில் சில முக்கிய வினாக்களுக்கு விடையளிப்போம்.'
    },
    curiosity: {
      title: 'சிந்தனைத் தூண்டல்: குவாண்டம் உயிரியல்',
      summary: 'தாவரங்கள் குவாண்டம் மேற்பொருந்துதல் முறையில் ஆற்றலை மாற்றுவது பற்றிய வியப்பூட்டும் உண்மை.',
      speech: 'தாவரங்கள் குவாண்டம் இயற்பியலைப் பயன்படுத்துகின்றன என்பது உங்களுக்குத் தெரியுமா?'
    },
    visual: {
      title: 'பசுங்கணிகத்தின் காட்சிப் படம்',
      summary: 'தைலகாய்டு மற்றும் ஸ்ட்ரோமாவின் காட்சி வரைபடம்.',
      speech: 'ஒளிச்சேர்க்கையின் இரு முக்கிய நிலைகளை இந்த வரைபடத்தில் தெளிவாகக் காணலாம்.'
    },
    '3d_world': {
      title: 'முப்பரிமாண (3D) தாவர செல் மாதிரி',
      summary: 'செல்லின் உட்புறத்தை 3D முறையில் ஆராயும் புதிய கற்றல் தளம்.',
      speech: 'வாருங்கள்! நாம் அனைவரும் தாவர செல்லின் உள்ளே சென்று பசுங்கணிகத்தை முப்பரிமாணத்தில் பார்க்கலாம்.'
    }
  },
  quadratic: {
    notes: {
      title: 'இருபடி சமன்பாடுகள் மற்றும் இயற்பியல் பயன்பாடுகள்',
      summary: 'பொருட்களின் வீச்சு மற்றும் பாதையைத் துல்லியமாகக் கணக்கிடும் கணித முறை.',
      speech: 'இருபடிச் சமன்பாடுகள் வெறும் எண்கள் மட்டுமல்ல, ஒரு ஏவுகணை அல்லது பந்தின் வான்வழிப் பாதையைத் துல்லியமாகக் கணக்கிடும் சூத்திரம்.'
    },
    quiz: {
      title: 'கணிதத் தேர்வு: மூலங்களின் தன்மை',
      summary: 'இருபடி சமன்பாட்டின் மூலங்களை ஆராயும் வினாக்கள்.',
      speech: 'இருபடி சமன்பாட்டின் மூலங்களின் தன்மையை மதிப்பிடுங்கள்.'
    },
    curiosity: {
      title: 'கணித சிந்தனை: ஈர்ப்பு விசை வளைவு',
      summary: 'கோள்களின் பாதையும் பரவளைய வளைவுகளும்.',
      speech: 'பரவளைய வளைவுகள் பிரபஞ்சத்தில் எவ்வாறு செயல்படுகின்றன என்பதைச் சிந்திப்போம்.'
    },
    visual: {
      title: 'பரவளைய வரைபடக் காட்சி',
      summary: 'திசைவேக கூறுகள் மற்றும் பரவளையப் பாதை வரைபடம்.',
      speech: 'பொருளின் இயக்கம் எவ்வாறு பரவளையத்தை உருவாக்குகிறது என்பதைப் பாருங்கள்.'
    },
    '3d_world': {
      title: 'முப்பரிமாண (3D) இயற்பியல் உருவகப்படுத்துதல்',
      summary: 'எறியப்படும் பொருட்களின் 3D வான்வழிப் பாதை.',
      speech: '3D முறையில் வெவ்வேறு கோணங்களில் எறியப்படும் பொருட்களின் பாதையை ஆராயலாம்.'
    }
  }
};
