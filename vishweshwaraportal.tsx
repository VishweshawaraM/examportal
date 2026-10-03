import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Clock, User, ChevronRight, LogOut, CheckCircle, 
  FileText, Award, Calendar, BarChart, Settings, Search,
  AlertCircle, BookMarked, PenTool, Edit3
} from 'lucide-react';

// Custom Styles to inject Google Fonts (Playfair Display & Inter)
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

  :root {
    --color-ivory: #F8F5EE;
    --color-gold: #B58A3B;
    --color-maroon: #5B1E24;
    --color-black: #1D1D1D;
    --color-grey: #ECE8DF;
  }

  body {
    background-color: var(--color-ivory);
    color: var(--color-black);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6, .font-serif {
    font-family: 'Playfair Display', serif;
  }

  .devanagari {
    font-family: 'Tiro Devanagari Hindi', 'Sanskrit Text', serif;
  }

  .fade-in {
    animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Custom Scrollbar for luxury feel */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--color-ivory); }
  ::-webkit-scrollbar-thumb { background: var(--color-grey); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--color-gold); }
  
  .premium-input {
    background: transparent;
    border: 1px solid var(--color-grey);
    color: var(--color-black);
    transition: all 0.3s ease;
  }
  .premium-input:focus {
    outline: none;
    border-color: var(--color-gold);
    box-shadow: 0 0 0 1px var(--color-gold);
  }
`;

const EXAM_DURATION = 60 * 60; // 60 minutes in seconds

const mockQuestions = {
  vocab: [
    { id: 'v1', q: 'What is the meaning of "ग्रन्थालयः" (Granthalayah)?', options: ['Hospital', 'Library', 'School', 'Temple'], answer: 'Library' },
    { id: 'v2', q: 'Translate "Tree" to Sanskrit.', options: ['वृक्षः (Vrikshah)', 'जलम् (Jalam)', 'पर्वतः (Parvatah)', 'सूर्यः (Suryah)'], answer: 'वृक्षः (Vrikshah)' },
  ],
  grammar: [
    { id: 'g1', q: 'Fill in the blank: सः बालकः ____ (गच्छति/गच्छन्ति)', options: ['गच्छति', 'गच्छन्ति', 'गच्छसि', 'गच्छामि'], answer: 'गच्छति' },
    { id: 'g2', q: 'Identify the gender of "पुस्तकम्" (Pustakam).', options: ['Masculine (पुंलिङ्ग)', 'Feminine (स्त्रीलिङ्ग)', 'Neuter (नपुंसकलिङ्ग)'], answer: 'Neuter (नपुंसकलिङ्ग)' }
  ],
  comprehension: [
    { id: 'c1', text: 'एषः मम ग्रन्थालयः। अत्र बहूनि पुस्तकानि सन्ति। अहम् अत्र पठामि।', q: 'Where does the person read?', options: ['At home', 'In the library', 'In the garden', 'In the school'], answer: 'In the library' },
    { id: 'c2', text: 'उपायेन सर्वं शक्यम्। (Everything is possible through a solution/effort.)', q: 'True or False: The text implies that efforts are useless.', options: ['True', 'False'], answer: 'False' }
  ]
};

const PremiumCard = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#F8F5EE] border border-[#ECE8DF] p-6 hover:border-[#B58A3B] transition-colors duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#5B1E24] text-[#F8F5EE] hover:bg-[#3d1318]",
    secondary: "bg-transparent border border-[#1D1D1D] text-[#1D1D1D] hover:bg-[#1D1D1D] hover:text-[#F8F5EE]",
    gold: "bg-transparent border border-[#B58A3B] text-[#B58A3B] hover:bg-[#B58A3B] hover:text-[#F8F5EE]"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('student');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 fade-in relative overflow-hidden">
      {/* Decorative subtle background element */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 border border-[#ECE8DF] rounded-full opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] border border-[#ECE8DF] rounded-full opacity-50" />
      
      <div className="w-full max-w-md bg-[#F8F5EE] border border-[#B58A3B] p-10 relative z-10 shadow-2xl shadow-[#ECE8DF]/50">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-[#5B1E24] mb-2 flex items-center justify-center gap-3">
            <span>🕉️</span> VISHWESHWARA
          </h1>
          <h2 className="text-xl font-serif text-[#1D1D1D] tracking-widest uppercase text-sm mb-4">Sanskrit</h2>
          <p className="text-sm text-[#B58A3B] italic font-serif">"A Premium Digital Gurukulam"</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            className={`flex-1 pb-2 border-b-2 transition-colors ${role === 'student' ? 'border-[#5B1E24] text-[#5B1E24]' : 'border-transparent text-[#1D1D1D]/60 hover:text-[#1D1D1D]'}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button 
            className={`flex-1 pb-2 border-b-2 transition-colors ${role === 'teacher' ? 'border-[#5B1E24] text-[#5B1E24]' : 'border-transparent text-[#1D1D1D]/60 hover:text-[#1D1D1D]'}`}
            onClick={() => setRole('teacher')}
          >
            Teacher
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(role); }}>
          {role === 'student' && (
            <>
              <input type="text" placeholder="Student Name" className="w-full p-3 premium-input" required defaultValue="Srujan" />
              <input type="email" placeholder="Email Address" className="w-full p-3 premium-input" required defaultValue="srujan@gurukulam.edu" />
            </>
          )}
          <input type="text" placeholder="Username" className="w-full p-3 premium-input" required defaultValue={role === 'teacher' ? 'admin' : 'srujan108'} />
          <input type="password" placeholder="Password" className="w-full p-3 premium-input" required defaultValue="03102026" />
          
          <div className="pt-4">
            <Button type="submit" className="w-full">Secure Login <ChevronRight size={18} /></Button>
          </div>
          <div className="text-center pt-4">
            <a href="#" className="text-sm text-[#1D1D1D]/60 hover:text-[#B58A3B] transition-colors">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentDashboard = ({ navigate }) => {
  return (
    <div className="min-h-screen fade-in">
      <header className="border-b border-[#ECE8DF] bg-[#F8F5EE] py-6 px-8 md:px-16 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🕉️</span>
          <div>
            <h1 className="font-serif text-[#5B1E24] font-semibold text-lg leading-tight">VISHWESHWARA</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#B58A3B]">Sanskrit Gurukulam</p>
          </div>
        </div>
        <button onClick={() => navigate('login')} className="text-[#1D1D1D] hover:text-[#5B1E24] transition-colors flex items-center gap-2 text-sm">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-8 md:p-12 pt-16">
        <div className="mb-16">
          <h2 className="font-serif text-4xl text-[#1D1D1D] mb-4">Hari Om, Srujan 🙏</h2>
          <p className="text-[#B58A3B] text-lg font-serif italic">Monthly Sanskrit Assessment - October 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Exam Card - Prominent */}
          <PremiumCard className="md:col-span-2 bg-[#5B1E24] text-[#F8F5EE] border-none flex flex-col justify-between" onClick={() => navigate('exam_intro')}>
            <div>
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-serif text-2xl">Active Examination</h3>
                <span className="bg-[#B58A3B] text-xs px-3 py-1 uppercase tracking-wider rounded-sm">Required</span>
              </div>
              <p className="text-[#F8F5EE]/80 mb-2">Monthly Sanskrit Assessment</p>
              <p className="text-sm text-[#F8F5EE]/60 flex items-center gap-2"><Clock size={14}/> Duration: 60 Minutes | Total Marks: 50</p>
            </div>
            <div className="mt-8 flex justify-end">
              <span className="flex items-center gap-2 text-[#B58A3B] hover:text-[#F8F5EE] transition-colors">
                Begin Assessment <ChevronRight size={18} />
              </span>
            </div>
          </PremiumCard>

          <PremiumCard>
            <h3 className="font-serif text-lg mb-4 text-[#5B1E24] flex items-center gap-2"><BarChart size={18}/> Monthly Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Grammar</span> <span>85%</span></div>
                <div className="w-full h-1 bg-[#ECE8DF]"><div className="h-full bg-[#B58A3B] w-[85%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Vocabulary</span> <span>92%</span></div>
                <div className="w-full h-1 bg-[#ECE8DF]"><div className="h-full bg-[#B58A3B] w-[92%]"></div></div>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard>
            <h3 className="font-serif text-lg mb-4 text-[#5B1E24] flex items-center gap-2"><Award size={18}/> Previous Marks</h3>
            <p className="text-3xl font-serif mb-1">42<span className="text-sm text-[#1D1D1D]/50">/50</span></p>
            <p className="text-sm text-[#B58A3B]">Grade: Excellent (Aug 2026)</p>
          </PremiumCard>

          <PremiumCard>
            <h3 className="font-serif text-lg mb-4 text-[#5B1E24] flex items-center gap-2"><BookOpen size={18}/> Homework</h3>
            <ul className="text-sm space-y-3">
              <li className="flex justify-between items-center border-b border-[#ECE8DF] pb-2">
                <span>Lesson 4 Translation</span>
                <span className="text-xs text-[#B58A3B]">Due Tomorrow</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sloka Memorization</span>
                <span className="text-xs text-[#1D1D1D]/50">Completed</span>
              </li>
            </ul>
          </PremiumCard>

          <PremiumCard>
            <h3 className="font-serif text-lg mb-4 text-[#5B1E24] flex items-center gap-2"><Calendar size={18}/> Upcoming Classes</h3>
            <div className="text-sm">
              <p className="font-medium mb-1">Advanced Sandhi Rules</p>
              <p className="text-[#1D1D1D]/60 flex items-center gap-2"><Clock size={14}/> Today, 4:00 PM IST</p>
            </div>
          </PremiumCard>

        </div>
      </main>
    </div>
  );
};

const ExamIntro = ({ navigate }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 fade-in bg-[#ECE8DF]/30">
      <div className="w-full max-w-2xl bg-[#F8F5EE] border border-[#ECE8DF] p-12 shadow-sm">
        <div className="text-center mb-10 border-b border-[#ECE8DF] pb-8">
          <h1 className="font-serif text-3xl text-[#5B1E24] mb-2">Monthly Sanskrit Assessment</h1>
          <p className="text-[#B58A3B] italic font-serif">Vishweshwara Digital Gurukulam</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12 text-[#1D1D1D]">
          <div>
            <p className="text-sm text-[#1D1D1D]/60 uppercase tracking-wider mb-1">Student</p>
            <p className="font-serif text-xl">Srujan</p>
          </div>
          <div>
            <p className="text-sm text-[#1D1D1D]/60 uppercase tracking-wider mb-1">Duration</p>
            <p className="font-serif text-xl">60 Minutes</p>
          </div>
          <div>
            <p className="text-sm text-[#1D1D1D]/60 uppercase tracking-wider mb-1">Total Marks</p>
            <p className="font-serif text-xl">50</p>
          </div>
          <div>
            <p className="text-sm text-[#1D1D1D]/60 uppercase tracking-wider mb-1">Attempt</p>
            <p className="font-serif text-xl">1 of 1</p>
          </div>
        </div>

        <div className="bg-[#ECE8DF]/50 p-6 mb-10 border-l-2 border-[#B58A3B]">
          <h3 className="font-serif text-[#5B1E24] mb-2 flex items-center gap-2"><AlertCircle size={18} /> Instructions</h3>
          <ul className="text-sm space-y-2 text-[#1D1D1D]/80 list-disc list-inside">
            <li>Ensure a stable internet connection.</li>
            <li>Do not switch tabs or windows during the examination.</li>
            <li>Answers will auto-save every 15 seconds.</li>
            <li>The exam will auto-submit when the timer reaches zero.</li>
          </ul>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate('student_dashboard')}>Cancel</Button>
          <Button onClick={() => navigate('exam_active')}>Start Examination</Button>
        </div>
      </div>
    </div>
  );
};

const ExamActive = ({ navigate }) => {
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [currentSection, setCurrentSection] = useState('A');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('exam_result'); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return 'text-red-600 animate-pulse'; // 1 min
    if (timeLeft <= 300) return 'text-[#5B1E24] font-bold'; // 5 mins
    if (timeLeft <= 600) return 'text-[#B58A3B]'; // 10 mins
    if (timeLeft <= 1800) return 'text-[#1D1D1D]'; // 30 mins
    return 'text-[#1D1D1D]';
  };

  const handleAnswer = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const sections = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] fade-in">
      {/* Sticky Header with Timer */}
      <header className="sticky top-0 z-50 bg-[#F8F5EE] border-b border-[#ECE8DF] px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="font-serif text-[#5B1E24] text-xl">Sanskrit Assessment</h2>
          <p className="text-xs text-[#B58A3B] uppercase tracking-widest">Section {currentSection}</p>
        </div>
        <div className={`flex items-center gap-3 font-serif text-2xl transition-colors ${getTimerColor()}`}>
          <Clock size={24} className={timeLeft <= 300 ? "animate-pulse" : ""} />
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-[#ECE8DF] hidden md:block bg-[#F8F5EE]">
          <nav className="p-6 space-y-2">
            {[
              { id: 'A', title: 'Reading Test', marks: 10 },
              { id: 'B', title: 'Vocabulary', marks: 10 },
              { id: 'C', title: 'Grammar', marks: 10 },
              { id: 'D', title: 'Comprehension', marks: 10 },
              { id: 'E', title: 'Summary Writing', marks: 10 },
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setCurrentSection(sec.id)}
                className={`w-full text-left p-4 transition-all flex flex-col ${currentSection === sec.id ? 'bg-[#5B1E24] text-[#F8F5EE]' : 'hover:bg-[#ECE8DF] text-[#1D1D1D]'}`}
              >
                <span className="font-serif text-lg">Section {sec.id}</span>
                <span className={`text-xs ${currentSection === sec.id ? 'text-[#F8F5EE]/70' : 'text-[#B58A3B]'}`}>{sec.title} • {sec.marks} M</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 pb-32">
          
          {currentSection === 'A' && (
            <div className="fade-in max-w-3xl">
              <h3 className="font-serif text-3xl mb-6 text-[#5B1E24] border-b border-[#ECE8DF] pb-4">Section A: Reading Test</h3>
              <div className="bg-[#ECE8DF]/50 p-8 text-center border border-[#ECE8DF] mb-8">
                <BookMarked size={48} className="mx-auto text-[#B58A3B] mb-4" />
                <p className="text-lg text-[#1D1D1D] mb-2">Oral Evaluation</p>
                <p className="text-sm text-[#1D1D1D]/70">The Teacher will evaluate your performance based on:</p>
                <div className="flex justify-center gap-6 mt-6">
                  <span className="bg-[#F8F5EE] px-4 py-2 text-sm border border-[#ECE8DF]">Pronunciation</span>
                  <span className="bg-[#F8F5EE] px-4 py-2 text-sm border border-[#ECE8DF]">Reading Fluency</span>
                  <span className="bg-[#F8F5EE] px-4 py-2 text-sm border border-[#ECE8DF]">Confidence</span>
                </div>
              </div>
              <p className="text-[#B58A3B] italic text-center font-serif">Please wait for the Acharya's instructions to begin reading aloud.</p>
            </div>
          )}

          {currentSection === 'B' && (
            <div className="fade-in max-w-3xl">
              <h3 className="font-serif text-3xl mb-6 text-[#5B1E24] border-b border-[#ECE8DF] pb-4">Section B: Vocabulary</h3>
              <div className="space-y-10">
                {mockQuestions.vocab.map((q, idx) => (
                  <div key={q.id}>
                    <p className="text-lg mb-4"><span className="text-[#B58A3B] font-serif mr-2">{idx + 1}.</span> {q.q}</p>
                    <div className="space-y-3 pl-6">
                      {q.options.map(opt => (
                        <label key={opt} className={`flex items-center gap-3 p-3 border transition-colors cursor-pointer ${answers[q.id] === opt ? 'border-[#5B1E24] bg-[#5B1E24]/5' : 'border-[#ECE8DF] hover:border-[#B58A3B]'}`}>
                          <input 
                            type="radio" 
                            name={q.id} 
                            value={opt} 
                            checked={answers[q.id] === opt} 
                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                            className="accent-[#5B1E24]"
                          />
                          <span className={opt.includes('(') ? 'devanagari text-lg' : ''}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === 'C' && (
            <div className="fade-in max-w-3xl">
              <h3 className="font-serif text-3xl mb-6 text-[#5B1E24] border-b border-[#ECE8DF] pb-4">Section C: Grammar</h3>
              <div className="space-y-10">
                {mockQuestions.grammar.map((q, idx) => (
                  <div key={q.id}>
                    <p className="text-lg mb-4 devanagari"><span className="text-[#B58A3B] font-serif mr-2 font-sans">{idx + 1}.</span> {q.q}</p>
                    <div className="space-y-3 pl-6">
                      {q.options.map(opt => (
                        <label key={opt} className={`flex items-center gap-3 p-3 border transition-colors cursor-pointer ${answers[q.id] === opt ? 'border-[#5B1E24] bg-[#5B1E24]/5' : 'border-[#ECE8DF] hover:border-[#B58A3B]'}`}>
                          <input 
                            type="radio" 
                            name={q.id} 
                            value={opt} 
                            checked={answers[q.id] === opt} 
                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                            className="accent-[#5B1E24]"
                          />
                          <span className="devanagari text-lg">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === 'D' && (
            <div className="fade-in max-w-3xl">
              <h3 className="font-serif text-3xl mb-6 text-[#5B1E24] border-b border-[#ECE8DF] pb-4">Section D: Comprehension</h3>
              <div className="space-y-12">
                {mockQuestions.comprehension.map((q, idx) => (
                  <div key={q.id} className="bg-white p-8 border border-[#ECE8DF]">
                    <div className="mb-6 pb-6 border-b border-[#ECE8DF] border-dashed">
                      <p className="text-sm text-[#B58A3B] uppercase tracking-widest mb-3">Passage {idx + 1}</p>
                      <p className="devanagari text-xl leading-relaxed text-[#1D1D1D]">{q.text}</p>
                    </div>
                    <div>
                      <p className="text-lg mb-4">{q.q}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map(opt => (
                          <label key={opt} className={`flex items-center gap-3 p-3 border transition-colors cursor-pointer ${answers[q.id] === opt ? 'border-[#5B1E24] bg-[#5B1E24]/5' : 'border-[#ECE8DF] hover:border-[#B58A3B]'}`}>
                            <input 
                              type="radio" 
                              name={q.id} 
                              value={opt} 
                              checked={answers[q.id] === opt} 
                              onChange={(e) => handleAnswer(q.id, e.target.value)}
                              className="accent-[#5B1E24]"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === 'E' && (
            <div className="fade-in max-w-4xl">
              <h3 className="font-serif text-3xl mb-6 text-[#5B1E24] border-b border-[#ECE8DF] pb-4">Section E: Summary Writing</h3>
              <p className="mb-8 text-[#1D1D1D]/70">Write a summary for the following prompts in either English or Sanskrit. Minimum 50 words each.</p>
              
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-lg font-serif">1. Summarize the moral of "उपायेन सर्वं शक्यम्" (Story 1)</p>
                    <span className="text-sm text-[#B58A3B]">5 Marks</span>
                  </div>
                  <textarea 
                    className="w-full h-48 premium-input p-6 resize-y bg-white" 
                    placeholder="Begin writing here..."
                    value={answers['e1'] || ''}
                    onChange={(e) => handleAnswer('e1', e.target.value)}
                  ></textarea>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-lg font-serif">2. Describe your ideal Gurukulam based on "एषः मम ग्रन्थालयः" (Story 2)</p>
                    <span className="text-sm text-[#B58A3B]">5 Marks</span>
                  </div>
                  <textarea 
                    className="w-full h-48 premium-input p-6 resize-y bg-white" 
                    placeholder="Begin writing here..."
                    value={answers['e2'] || ''}
                    onChange={(e) => handleAnswer('e2', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer Controls */}
      <footer className="bg-[#F8F5EE] border-t border-[#ECE8DF] p-6 flex justify-between items-center fixed bottom-0 w-full md:w-[calc(100%-256px)] md:ml-64 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="text-sm text-[#1D1D1D]/50 flex items-center gap-2">
           <CheckCircle size={14} className="text-[#B58A3B]" /> Answers auto-saved
        </div>
        <div className="flex gap-4">
          <Button 
            variant="secondary" 
            onClick={() => {
              const currentIndex = sections.indexOf(currentSection);
              if (currentIndex > 0) setCurrentSection(sections[currentIndex - 1]);
            }}
            disabled={currentSection === 'A'}
            className="disabled:opacity-30"
          >
            Previous
          </Button>
          
          {currentSection !== 'E' ? (
            <Button 
              onClick={() => {
                const currentIndex = sections.indexOf(currentSection);
                if (currentIndex < sections.length - 1) setCurrentSection(sections[currentIndex + 1]);
              }}
            >
              Next Section <ChevronRight size={18} />
            </Button>
          ) : (
            <Button onClick={() => navigate('exam_result')} className="bg-[#1D1D1D]">
              Submit Examination
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

const ExamResult = ({ navigate }) => {
  // Mock logic for determining grade
  const totalScore = 44; 
  const getGrade = (score) => {
    if (score >= 46) return { grade: 'Outstanding', color: 'text-green-700' };
    if (score >= 41) return { grade: 'Excellent', color: 'text-[#B58A3B]' };
    if (score >= 36) return { grade: 'Very Good', color: 'text-blue-700' };
    if (score >= 31) return { grade: 'Good', color: 'text-gray-700' };
    return { grade: 'Needs Improvement', color: 'text-red-700' };
  };
  
  const gradeInfo = getGrade(totalScore);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 fade-in bg-white">
      <div className="w-full max-w-3xl bg-[#F8F5EE] border border-[#B58A3B] p-12 relative shadow-xl">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span className="text-[200px]">🕉️</span>
        </div>

        <div className="text-center mb-12 relative z-10">
          <h1 className="font-serif text-4xl text-[#5B1E24] mb-3">Digital Report Card</h1>
          <p className="text-[#1D1D1D]/70 tracking-widest uppercase text-sm">Vishweshwara Sanskrit Gurukulam</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12 border-b border-[#ECE8DF] pb-12 relative z-10">
          <div>
            <p className="text-xs text-[#1D1D1D]/50 uppercase mb-1">Student Name</p>
            <p className="font-serif text-xl">Srujan</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#1D1D1D]/50 uppercase mb-1">Date of Examination</p>
            <p className="font-serif text-xl">October 3, 2026</p>
          </div>
        </div>

        <div className="relative z-10 mb-12">
          <h3 className="font-serif text-2xl text-[#1D1D1D] mb-6">Sectional Breakdown</h3>
          <div className="space-y-4">
            {[
              { sec: 'Reading', max: 10, obt: 9 },
              { sec: 'Vocabulary', max: 10, obt: 10 },
              { sec: 'Grammar', max: 10, obt: 9 },
              { sec: 'Comprehension', max: 10, obt: 8 },
              { sec: 'Summary Writing', max: 10, obt: 8 },
            ].map(item => (
              <div key={item.sec} className="flex justify-between items-center border-b border-[#ECE8DF] pb-2">
                <span className="text-[#1D1D1D]/80">{item.sec}</span>
                <span className="font-serif">{item.obt} / {item.max}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#5B1E24] text-[#F8F5EE] p-8 relative z-10 flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80 uppercase tracking-widest mb-1">Final Score</p>
            <p className="font-serif text-5xl">{totalScore}<span className="text-2xl opacity-60">/50</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80 uppercase tracking-widest mb-1">Grade</p>
            <p className={`font-serif text-3xl text-[#B58A3B]`}>{gradeInfo.grade}</p>
            <p className="text-sm opacity-80 mt-1">{((totalScore/50)*100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="mt-12 text-center relative z-10">
          <p className="text-[#B58A3B] italic font-serif mb-8">"Teacher Remarks: Excellent progress in Vocabulary. Continue focusing on advanced Grammar."</p>
          <Button onClick={() => navigate('student_dashboard')} className="mx-auto">Return to Dashboard</Button>
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F5EE] flex fade-in">
      {/* Teacher Sidebar */}
      <aside className="w-72 bg-[#1D1D1D] text-[#F8F5EE] flex flex-col">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl text-[#B58A3B]">🕉️</span>
            <h1 className="font-serif text-xl tracking-wide">Admin Portal</h1>
          </div>
          <p className="text-xs text-[#B58A3B] uppercase tracking-widest">Acharya Access</p>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          {[
            { icon: User, label: 'Student Directory', active: false },
            { icon: FileText, label: 'Assign Exams', active: true },
            { icon: Edit3, label: 'Evaluate Answers', active: false },
            { icon: Award, label: 'Certificates', active: false },
            { icon: BarChart, label: 'Progress Analytics', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item, idx) => (
            <button key={idx} className={`w-full flex items-center gap-4 px-8 py-4 transition-colors ${item.active ? 'bg-[#5B1E24] border-l-4 border-[#B58A3B]' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
              <item.icon size={18} className={item.active ? 'text-[#B58A3B]' : 'opacity-60'} />
              <span className="font-medium tracking-wide text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-8 border-t border-white/10">
          <button onClick={() => navigate('login')} className="flex items-center gap-3 text-sm opacity-60 hover:opacity-100 transition-opacity">
            <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Teacher Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-[#ECE8DF] px-12 py-8 flex justify-between items-end">
          <div>
            <h2 className="font-serif text-3xl text-[#5B1E24] mb-2">Assign Examinations</h2>
            <p className="text-[#1D1D1D]/60">Manage question banks and schedule assessments.</p>
          </div>
          <Button><PenTool size={16} /> Create New Exam</Button>
        </header>

        <div className="p-12">
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 border border-[#ECE8DF]">
              <p className="text-sm text-[#1D1D1D]/60 uppercase tracking-widest mb-2">Active Students</p>
              <p className="font-serif text-4xl text-[#1D1D1D]">1,248</p>
            </div>
            <div className="bg-white p-6 border border-[#ECE8DF]">
              <p className="text-sm text-[#1D1D1D]/60 uppercase tracking-widest mb-2">Pending Evaluations</p>
              <p className="font-serif text-4xl text-[#5B1E24]">42</p>
            </div>
            <div className="bg-[#5B1E24] text-[#F8F5EE] p-6">
              <p className="text-sm text-[#F8F5EE]/60 uppercase tracking-widest mb-2">System Status</p>
              <p className="font-serif text-4xl text-[#B58A3B]">Secure</p>
            </div>
          </div>

          <h3 className="font-serif text-2xl text-[#1D1D1D] mb-6">Upcoming Scheduled Exams</h3>
          <div className="bg-white border border-[#ECE8DF] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F5EE] border-b border-[#ECE8DF]">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[#1D1D1D]/60">Exam Name</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[#1D1D1D]/60">Date</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[#1D1D1D]/60">Assigned To</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[#1D1D1D]/60">Status</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[#1D1D1D]/60">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE8DF]">
                {[
                  { name: 'Monthly Assessment (Oct)', date: 'Oct 3, 2026', group: 'Level 2 (Intermediate)', status: 'Active' },
                  { name: 'Gita Chanting Mid-Term', date: 'Oct 15, 2026', group: 'All Students', status: 'Scheduled' },
                  { name: 'Advanced Grammar Test', date: 'Nov 1, 2026', group: 'Level 3 (Advanced)', status: 'Draft' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#F8F5EE]/50 transition-colors">
                    <td className="px-6 py-5 font-medium">{row.name}</td>
                    <td className="px-6 py-5 text-[#1D1D1D]/70">{row.date}</td>
                    <td className="px-6 py-5 text-[#1D1D1D]/70">{row.group}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs tracking-wider ${row.status === 'Active' ? 'bg-[#5B1E24]/10 text-[#5B1E24]' : row.status === 'Scheduled' ? 'bg-[#B58A3B]/10 text-[#B58A3B]' : 'bg-gray-100 text-gray-600'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-5"><button className="text-[#B58A3B] hover:text-[#5B1E24] font-medium">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleLogin = (role) => {
    if (role === 'teacher') setCurrentScreen('teacher_dashboard');
    else setCurrentScreen('student_dashboard');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login': return <LoginPage onLogin={handleLogin} />;
      case 'student_dashboard': return <StudentDashboard navigate={setCurrentScreen} />;
      case 'exam_intro': return <ExamIntro navigate={setCurrentScreen} />;
      case 'exam_active': return <ExamActive navigate={setCurrentScreen} />;
      case 'exam_result': return <ExamResult navigate={setCurrentScreen} />;
      case 'teacher_dashboard': return <TeacherDashboard navigate={setCurrentScreen} />;
      default: return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="font-sans text-[#1D1D1D] antialiased min-h-screen bg-[#F8F5EE]">
        {renderScreen()}
      </div>
    </>
  );
}