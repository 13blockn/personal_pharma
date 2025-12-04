import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Mic, 
  Check, 
  ChevronRight, 
  User, 
  Heart, 
  Pill, 
  Calendar, 
  Bell, 
  Phone, 
  Volume2, 
  AlertCircle, 
  ShieldCheck, 
  X
} from 'lucide-react';

/**
 * Personal Pharma - MVP Prototype
 * Covers Steps 1-4 of the User Journey
 */

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', size = 'normal', icon: Icon, className = '', disabled = false }) => {
  const baseStyle = "flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-md";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200",
    secondary: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-2 border-emerald-200",
    outline: "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50",
    danger: "bg-red-100 text-red-700 border-2 border-red-200 hover:bg-red-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 shadow-none"
  };

  const sizes = {
    normal: "py-4 px-6 text-lg",
    large: "py-6 px-8 text-xl w-full",
    small: "py-2 px-4 text-sm"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className="w-6 h-6 mr-3" />}
      {children}
    </button>
  );
};

const Card = ({ children, title, subtitle, className = '' }) => (
  <div className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 ${className}`}>
    {(title || subtitle) && (
      <div className="mb-6">
        {title && <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h2>}
        {subtitle && <p className="text-slate-500 text-lg mt-2">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex gap-2 mb-8 justify-center">
    {[...Array(totalSteps)].map((_, i) => (
      <div 
        key={i}
        className={`h-2 rounded-full transition-all duration-500 ${
          i < currentStep ? 'w-8 bg-emerald-500' : 
          i === currentStep ? 'w-16 bg-blue-600' : 'w-4 bg-slate-200'
        }`} 
      />
    ))}
  </div>
);

// --- Main App Component ---

export default function App() {
  const [step, setStep] = useState(0); // 0:Welcome, 1:Profile, 2:Caregiver, 3:Scan, 4:Review, 5:Dashboard
  const [userProfile, setUserProfile] = useState({
    name: '',
    ageRange: '',
    reminderType: 'both',
    accessibility: { audio: true, largeText: false }
  });
  const [caregiver, setCaregiver] = useState({ name: '', phone: '', relation: '' });
  const [medication, setMedication] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Dashboard State
  const [demoState, setDemoState] = useState('idle'); // idle, waiting, urgency, sent
  const [notificationStatus, setNotificationStatus] = useState(null); // null, 'banner1', 'banner2'
  
  // Audio Mock
  const speak = (text) => {
    if (userProfile.accessibility.audio && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  // --- Step 1: Onboarding ---
  const Onboarding = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to Personal Pharma</h1>
        <p className="text-xl text-slate-600">Let's set up your personalized health assistant.</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">What should we call you?</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                placeholder="Enter your first name"
                className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
              <button className="bg-slate-100 p-4 rounded-xl text-slate-600 hover:bg-slate-200" title="Use Voice">
                <Mic className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">Select your age range</label>
            <div className="grid grid-cols-3 gap-3">
              {['50-60', '60-70', '70+'].map(range => (
                <button
                  key={range}
                  onClick={() => setUserProfile({...userProfile, ageRange: range})}
                  className={`p-4 rounded-xl text-lg font-medium border-2 transition-all ${
                    userProfile.ageRange === range 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Accessibility Preferences</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setUserProfile({
                  ...userProfile, 
                  accessibility: {...userProfile.accessibility, audio: !userProfile.accessibility.audio}
                })}
                className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 ${
                  userProfile.accessibility.audio ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                Audio Readout
              </button>
               <button 
                onClick={() => setUserProfile({
                  ...userProfile, 
                  accessibility: {...userProfile.accessibility, largeText: !userProfile.accessibility.largeText}
                })}
                className={`flex-1 p-4 rounded-xl border-2 flex items-center justify-center gap-2 ${
                  userProfile.accessibility.largeText ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200'
                }`}
              >
                <span className="text-xl font-serif font-bold">Aa</span>
                Large Text
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Button 
        size="large" 
        onClick={handleNext} 
        disabled={!userProfile.name || !userProfile.ageRange}
        icon={ChevronRight}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );

  // --- Step 2: Caregiver ---
  const CaregiverSetup = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Safety Contact</h2>
        <p className="text-lg text-slate-600 mt-2">Who should we notify if you miss a dose?</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">Caregiver Name</label>
            <input 
              type="text" 
              value={caregiver.name}
              onChange={(e) => setCaregiver({...caregiver, name: e.target.value})}
              placeholder="e.g. Sarah (Daughter)"
              className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={caregiver.phone}
              onChange={(e) => setCaregiver({...caregiver, phone: e.target.value})}
              placeholder="(555) 000-0000"
              className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-slate-700 mb-2">Relationship</label>
            <select 
              value={caregiver.relation}
              onChange={(e) => setCaregiver({...caregiver, relation: e.target.value})}
              className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 bg-white focus:border-rose-500 outline-none"
            >
              <option value="">Select relationship...</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="nurse">Nurse/Aide</option>
              <option value="friend">Friend</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="ghost" onClick={handleBack}>Back</Button>
        <Button 
          variant="primary" 
          size="large" 
          onClick={handleNext}
          disabled={!caregiver.name || !caregiver.phone}
          className="flex-1 bg-rose-600 hover:bg-rose-700 shadow-rose-200"
        >
          Save Contact
        </Button>
      </div>
    </div>
  );

  // --- Step 3: Medication Scan ---
  const MedicationScan = () => {
    const startScan = () => {
      setIsScanning(true);
      // Simulate AI processing time
      setTimeout(() => {
        setIsScanning(false);
        setMedication({
          name: "Amoxicillin",
          dosage: "500mg",
          instructions: "Take 1 capsule every 8 hours",
          duration: "10 Days",
          image: "https://placehold.co/100x100/e2e8f0/475569?text=Pill+Bottle"
        });
        handleNext();
      }, 2500);
    };

    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Add Medication</h2>
          <p className="text-lg text-slate-600 mt-2">We can read your pill bottle label automatically.</p>
        </div>

        {isScanning ? (
          <Card className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-blue-500 rounded-full flex items-center justify-center bg-blue-50">
                <Camera className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 animate-pulse">Scanning Label...</h3>
            <p className="text-slate-500 mt-2">AI is reading dosage instructions</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={startScan}
              className="w-full bg-blue-50 border-2 border-dashed border-blue-300 rounded-3xl p-10 flex flex-col items-center gap-4 hover:bg-blue-100 hover:border-blue-400 transition-all group"
            >
              <div className="bg-white p-4 rounded-full shadow-md group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-blue-900">Scan Pill Bottle</span>
                <span className="text-blue-600">Tap to open camera</span>
              </div>
            </button>

            <div className="flex items-center gap-4 py-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-slate-400 font-medium">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <Button variant="outline" size="large" className="w-full" icon={Pill}>
              Type Manually
            </Button>
            
            <button className="w-full text-slate-500 py-4 font-medium flex items-center justify-center gap-2 hover:text-slate-700">
              <Phone className="w-4 h-4" />
              I'm not sure, call a pharmacist
            </button>
          </div>
        )}
      </div>
    );
  };

  // --- Step 4 (Part A): Schedule Review ---
  const ScheduleReview = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Success!</h2>
        <p className="text-lg text-slate-600">Here is the schedule we created for you.</p>
      </div>

      <Card className="border-2 border-emerald-100 overflow-hidden !p-0">
        <div className="bg-emerald-50 p-6 border-b border-emerald-100">
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Pill className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{medication.name}</h3>
              <p className="text-emerald-700 font-medium">{medication.dosage}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Duration</p>
              <p className="text-xl font-medium text-slate-800">{medication.duration}</p>
              <p className="text-slate-500">Until Dec 14th</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 bg-amber-100 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Daily Schedule</p>
              <p className="text-xl font-medium text-slate-800">3 Times Daily</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">9:00 AM</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">5:00 PM</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">1:00 AM</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl mt-4">
            <p className="text-blue-800 italic">
              "This medicine works best when spaced evenly. We've suggested 9 AM, 5 PM, and 1 AM."
            </p>
          </div>
        </div>
      </Card>

      <Button size="large" onClick={handleNext} className="w-full shadow-xl shadow-blue-200">
        Confirm Schedule
      </Button>
    </div>
  );

  // --- Step 4 (Part B): Dashboard & Live Demo ---
  const Dashboard = () => {
    const timerRef = useRef(null);

    const startDemo = () => {
      setDemoState('waiting');
      setNotificationStatus('banner1');
      speak(`It is time to take your ${medication.name}.`);
      
      // Timer for Urgency Banner (8 seconds to simulate 5 mins)
      timerRef.current = setTimeout(() => {
        setNotificationStatus('banner2');
        speak(`Reminder: Please take your ${medication.name}. It is important not to miss this dose.`);
        
        // Timer for Caregiver Text (5 seconds later)
        setTimeout(() => {
          setDemoState('sent');
          setNotificationStatus('banner2'); // Keep banner 2 but show sent state
          speak(`We have notified ${caregiver.name} that you might need help.`);
        }, 5000);

      }, 8000);
    };

    const confirmDose = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setNotificationStatus(null);
      setDemoState('completed');
      speak("Great job. Dose recorded.");
    };

    return (
      <div className="max-w-md mx-auto h-full relative">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hello, {userProfile.name}</h1>
            <p className="text-slate-500">Dec 4, 2025</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-slate-500" />
          </div>
        </div>

        {/* Dynamic Notification Area */}
        <div className="min-h-[200px] mb-6 relative">
            {notificationStatus === 'banner1' && (
                <div className="animate-in slide-in-from-top duration-500 bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <Pill className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-semibold text-blue-100 uppercase tracking-wide text-sm">Now</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-1">Take {medication?.name}</h2>
                    <p className="text-blue-100 text-lg mb-6">{medication?.dosage} with water</p>
                    <button 
                        onClick={confirmDose}
                        className="w-full bg-white text-blue-700 font-bold text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <Check className="w-6 h-6" />
                        I Took It
                    </button>
                </div>
            )}

            {notificationStatus === 'banner2' && (
                 <div className="animate-in pulse bg-red-500 rounded-3xl p-6 text-white shadow-xl shadow-red-200 relative overflow-hidden border-4 border-red-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-white uppercase tracking-wide text-sm">Urgent Reminder</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-1">Did you take it?</h2>
                    <p className="text-red-100 text-lg mb-6">It's important to stay on schedule.</p>
                    
                    {demoState === 'sent' ? (
                        <div className="bg-black/20 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium">Text sent to {caregiver.name}</p>
                        </div>
                    ) : (
                        <button 
                            onClick={confirmDose}
                            className="w-full bg-white text-red-600 font-bold text-xl py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
                        >
                            Yes, I Took It
                        </button>
                    )}
                </div>
            )}

            {!notificationStatus && demoState === 'completed' && (
                <div className="bg-emerald-100 rounded-3xl p-8 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-10 h-10 text-emerald-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-900">All caught up!</h2>
                    <p className="text-emerald-700">Next dose at 5:00 PM</p>
                </div>
            )}
             {!notificationStatus && demoState === 'idle' && (
                <div className="bg-slate-50 rounded-3xl p-8 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-400">No active reminders</p>
                </div>
            )}
        </div>

        {/* Demo Controls (Simulating Time Passing) */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="max-w-md mx-auto">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hackathon Demo Controls</p>
                <div className="flex gap-2">
                    <Button 
                        size="small" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={startDemo}
                        disabled={demoState !== 'idle' && demoState !== 'completed'}
                    >
                        Trigger Reminder
                    </Button>
                    <Button 
                        size="small" 
                        variant="outline"
                        onClick={() => {
                            setDemoState('idle');
                            setNotificationStatus(null);
                            if(timerRef.current) clearTimeout(timerRef.current);
                        }}
                    >
                        Reset
                    </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    *Triggers Step 4 logic: Normal Banner → (8s) → Urgent Banner → (5s) → Caregiver SMS
                </p>
            </div>
        </div>
      </div>
    );
  };

  // --- Main Render Switch ---
  return (
    <div className={`min-h-screen bg-slate-50 font-sans ${userProfile.accessibility.largeText ? 'text-xl' : ''}`}>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">PersonalPharma</span>
          </div>
          {step > 0 && step < 5 && (
            <button onClick={() => setStep(0)} className="text-slate-400 hover:text-red-500">
                <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 py-8 pb-32">
        {step > 0 && step < 5 && <StepIndicator currentStep={step - 1} totalSteps={4} />}
        
        {step === 0 && <Onboarding />}
        {step === 1 && <CaregiverSetup />}
        {step === 2 && <MedicationScan />}
        {step === 3 && <ScheduleReview />}
        {step === 4 && <Dashboard />}
      </main>
    </div>
  );
}
