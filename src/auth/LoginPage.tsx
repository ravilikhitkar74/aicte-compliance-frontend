import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_USERS, useSessionStore } from './session';
import { Role } from '../api/types';
import { Lock, Megaphone, X, FileText, Calendar, Download } from 'lucide-react';

// Declare marquee for TypeScript JSX so it never throws ts(2339) or ts(7006)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        scrollamount?: string | number;
        scrolldelay?: string | number;
        direction?: 'left' | 'right' | 'up' | 'down';
      };
    }
  }
}

interface NoticeItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'ANNOUNCEMENTS' | 'CIRCULARS' | 'ADVERTISEMENTS';
  referenceNo: string;
}

export const LoginPage: React.FC = () => {
  const loginAsRole = useSessionStore((s) => s.loginAsRole);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'OFFICIAL' | 'INSTITUTION' | 'STUDENT'>('OFFICIAL');

  // Student login state simulation
  const [studentForm, setStudentForm] = useState({ name: '', enrollmentNo: '', mobile: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);

  // Modal state for notices ("Read More" archive)
  const [modalCategory, setModalCategory] = useState<'ANNOUNCEMENTS' | 'CIRCULARS' | 'ADVERTISEMENTS' | null>(null);

  // Modal state for APH / Resource facilitation links
  const [activeResourceModal, setActiveResourceModal] = useState<number | null>(null);

  // Demo student profiles for quick selection
  const DEMO_STUDENTS = [
    { name: 'Ravi Likhitkar', enrollment: '0103CS221045', mobile: '9876543210' },
    { name: 'Durgesh', enrollment: '0103CS221046', mobile: '9123456789' },
    { name: 'Aarav Sharma', enrollment: '0103AI221088', mobile: '9988776655' }
  ];

  const allNotices: NoticeItem[] = [
    {
      id: '1',
      title: 'Approval Process 2026-27 Schedule Updated',
      description: 'Scrutiny and EVC timelines extended for Central and Western regions by 15 working days following stakeholder representations.',
      date: '28 Oct 2026',
      category: 'ANNOUNCEMENTS',
      referenceNo: 'AICTE/APH/2026/894'
    },
    {
      id: '2',
      title: 'Mandatory SGRC Compliance Notice',
      description: 'Institutions must resolve pending fee refund and document retention tickets within 7 working days to avoid EoA withholding.',
      date: '24 Oct 2026',
      category: 'ANNOUNCEMENTS',
      referenceNo: 'AICTE/SGRC/2026/112'
    },
    {
      id: '3',
      title: 'EVC Digital Verification Portal Live',
      description: 'All expert visit committee members can now submit GPS-tagged inspection reports and live timestamped media directly.',
      date: '18 Oct 2026',
      category: 'ANNOUNCEMENTS',
      referenceNo: 'AICTE/EVC/2026/405'
    },
    {
      id: '4',
      title: 'For Diploma Students: Revised Calendar',
      description: 'Revised calendar for reporting to the allotted institute will be updated shortly on the SSSJKL Portal for all lateral entry admissions.',
      date: '13 August, 2026',
      category: 'CIRCULARS',
      referenceNo: 'AICTE/DIP/2026/099'
    },
    {
      id: '5',
      title: 'EVC Panel Member Guidelines 2026',
      description: 'Standard operating procedure for Expert Visit Committee digital report submissions, conflict disclosures, and TA/DA claims.',
      date: '02 August, 2026',
      category: 'CIRCULARS',
      referenceNo: 'AICTE/CIRCULAR/2026/331'
    },
    {
      id: '6',
      title: 'Anti-Ragging Compliance Circular',
      description: 'Annual submission of online undertakings by affiliated colleges and mandatory display of national anti-ragging helpline boards.',
      date: '20 July, 2026',
      category: 'CIRCULARS',
      referenceNo: 'AICTE/AR/2026/55'
    },
    {
      id: '7',
      title: 'Adviser & Director Deputation Posts',
      description: 'Application invited for the post of Adviser-I, Adviser-II, Director and Assistant Director on deputation basis at AICTE headquarters.',
      date: '26 May, 2025',
      category: 'ADVERTISEMENTS',
      referenceNo: 'AICTE/RECT/2025/02'
    },
    {
      id: '8',
      title: 'Smart India Hackathon 2026 Mentorship',
      description: 'Invitation for technical evaluation panels, software architects, and problem statement evaluators for SIH grand finales.',
      date: '15 Jan, 2026',
      category: 'ADVERTISEMENTS',
      referenceNo: 'SIH/2026/MEND-88'
    },
    {
      id: '9',
      title: 'AICTE Post-Doctoral Fellowship (APDF)',
      description: 'Applications invited for research fellowships across technical institutions specializing in AI, Robotics, and Quantum Computing.',
      date: '10 Jan, 2026',
      category: 'ADVERTISEMENTS',
      referenceNo: 'AICTE/APDF/2026/14'
    }
  ];

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDemoLogin = (role: Role) => {
    loginAsRole(role);
    navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
  };

  const handleStudentLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      return;
    }
    const matchedStudent = DEMO_STUDENTS.find(
      (s) => s.enrollment.toUpperCase() === studentForm.enrollmentNo.trim().toUpperCase()
    );
    const resolvedName = studentForm.name || matchedStudent?.name || 'Ravi Likhitkar';
    const resolvedEnrollment = studentForm.enrollmentNo || '0103CS221045';

    useSessionStore.setState({
      user: {
        id: `student-${resolvedEnrollment}`,
        name: `${resolvedName} (${resolvedEnrollment})`,
        email: 'student@example.edu.in',
        role: 'INSTITUTION',
      },
      lastActiveAt: Date.now()
    });
    navigate('/student-grievances');
  };

  const selectDemoStudent = (student: typeof DEMO_STUDENTS[0]) => {
    setStudentForm({
      name: student.name,
      enrollmentNo: student.enrollment,
      mobile: student.mobile,
      otp: '1234'
    });
    setOtpSent(true);
  };

  const portalResources = [
    { 
      label: 'Approval Process Handbook (APH) 2026-27 & Guidelines :', 
      btn: 'To Download APH Click Here',
      title: 'Approval Process Handbook (APH) 2026-27 & Guidelines',
      content: 'The Approval Process Handbook (APH) 2026-27 governs norms and standards for setting up new technical institutions, extension of approval (EoA), introduction of new courses, intake variations, and faculty-student ratio mandates.'
    },
    { 
      label: 'Public Notice for Approval Process 2026-27 :', 
      btn: 'Click Here',
      title: 'Public Notice - Approval Process 2026-27',
      content: 'Notice No: AICTE/PBN/2026/01. Online applications for Approval Process 2026-27 are live. Institutions are advised to submit applications well before deadlines.'
    },
    { 
      label: 'Corrigendum / Addendum for Approval Process 2026-27 :', 
      btn: 'To Download Click Here',
      title: 'Corrigendum & Addendum',
      content: 'Corrigendum Details: Clause 4.2 regarding built-up area requirements for emerging AI/ML laboratories has been updated.'
    },
    { 
      label: 'Centralized Support System for Approval Queries :', 
      btn: 'Click Here',
      title: 'Centralized Support System (Helpdesk)',
      content: 'For technical grievances regarding digital signatures, PID mapping, or payment failures, raise a support ticket or contact helpdesk@aicte-india.example.'
    },
    { 
      label: 'Frequently Asked Questions (FAQs) & SLA Timelines :', 
      btn: 'Click Here',
      title: 'Frequently Asked Questions (FAQs) & SLA Timelines',
      content: 'Q: What is the scrutiny turnaround time?\nA: Scrutiny committee reports are completed within 7 working days.'
    },
    { 
      label: 'Helpline for Technical & Workflow Queries :', 
      btn: '(011) 2958-1333 / 1338',
      title: 'Helpline & Contact Information',
      content: 'Technical Support Lines: (011) 2958-1333 / 1338. Operational Hours: Monday to Friday (9:30 AM to 5:30 PM IST).'
    },
    { 
      label: 'Student Grievance Redressal (SGRC) Portal :', 
      btn: 'Click Here to File / Track',
      title: 'Student Grievance Redressal Mechanism (SGRC)',
      content: 'Mandated under AICTE regulations. Students can file grievances for fee refunds, document retention, or ragging.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#EBF3FA] text-slate-900 relative">
      {/* Top White Statutory Header Band */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-11 rounded-sm bg-gradient-to-b from-[#FF9933] via-white to-[#138808] border border-slate-300 shrink-0" />
            <div>
              <div className="text-sm font-bold text-slate-800 tracking-wide">
                तकनीकी शिक्षा अनुमोदन एवं अनुपालन निगरानी प्रणाली
              </div>
              <div className="text-base font-extrabold text-[#1B3A6B] tracking-tight">
                Approval & Compliance Monitor
              </div>
              <div className="text-[11px] text-slate-500">
                Integrated Workflow Automation, Pendency Monitoring & Student Grievance Portal
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-medium text-slate-700">
              English / हिन्दी
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-300 text-amber-900 font-semibold">
              SIH 2026 Prototype (ID 26262)
            </span>
          </div>
        </div>
      </div>

      {/* Deep Navy Horizontal Navigation Bar */}
      <nav className="bg-[#0B2447] text-white shadow-sm border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 overflow-x-auto text-xs font-medium py-2.5">
          <span className="text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5 cursor-pointer">
            Home
          </span>
          <span className="hover:text-amber-300 cursor-pointer whitespace-nowrap">Approval Process 2026-27</span>
          <span onClick={() => navigate('/student-grievances')} className="hover:text-amber-300 cursor-pointer whitespace-nowrap">Student Grievances (SGRC)</span>
          <span className="hover:text-amber-300 cursor-pointer whitespace-nowrap">APH Guidelines</span>
          <span className="hover:text-amber-300 cursor-pointer whitespace-nowrap">EVC & SAC Schedules</span>
          <span className="hover:text-amber-300 cursor-pointer whitespace-nowrap">Compliance & Undertakings</span>
          <span className="hover:text-amber-300 cursor-pointer whitespace-nowrap">Statistics & Pendency</span>
        </div>
      </nav>

      {/* LATEST NEWS Ticker Bar */}
      <div className="bg-white border-b border-slate-300 shadow-sm flex items-center overflow-hidden">
        <div className="bg-[#FFB800] text-slate-900 font-black text-xs px-6 py-2.5 tracking-wider shrink-0 flex items-center gap-1.5 uppercase border-r border-amber-400">
          <Megaphone className="w-4 h-4" /> Latest News
        </div>
        <div className="flex-1 overflow-hidden whitespace-nowrap px-4 text-xs font-semibold text-slate-800">
          <marquee 
            scrollamount="5" 
            className="py-1 cursor-pointer"
            onMouseOver={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).stop?.()}
            onMouseOut={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).start?.()}
          >
            <span className="text-[#B3261E] font-bold mr-2">*</span> Extension of last date for submission of online applications under AICTE Approval Process 2026-27 &nbsp;&nbsp;|&nbsp;&nbsp; 
            <span className="text-[#B3261E] font-bold mr-2">*</span> Mandatory 7-day SGRC resolution compliance notices issued to regional institutions &nbsp;&nbsp;|&nbsp;&nbsp; 
            <span className="text-[#B3261E] font-bold mr-2">*</span> EVC expert committee scheduling window open for Central Region
          </marquee>
        </div>
      </div>

      {/* Main Content Banner Area */}
      <div className="flex-1 bg-gradient-to-b from-[#CFE4F7] via-[#E3EFFA] to-[#F4F6FA] py-6 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B2447]">
              Approval Process & Student Grievance Monitoring 2026-2027
            </h1>
            <p className="text-xs sm:text-sm text-[#1B3A6B] font-medium mt-1">
              (Automated Workflow Routing, SLA Tracking, Student SGRC & Digital Audit Trail)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Official Information Links + Live Compliance Summary */}
            <div className="lg:col-span-7 bg-white border border-[#B8D4EE] rounded-lg p-6 shadow-sm">
              <h2 className="text-sm font-bold text-[#0B2447] uppercase tracking-wider border-b border-slate-200 pb-2.5 mb-4">
                Approval Process Handbook (APH) & Student Facilitation Links
              </h2>
              <div className="space-y-3.5">
                {portalResources.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70 last:border-none"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#0B2447]">
                      {item.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (idx === 6) {
                          navigate('/student-grievances');
                        } else {
                          setActiveResourceModal(idx);
                        }
                      }}
                      className="bg-[#F5A623] hover:bg-[#E09112] text-white font-bold text-xs px-5 py-1.5 rounded-full shadow-sm transition-colors shrink-0 text-center min-w-[190px]"
                    >
                      {item.btn}
                    </button>
                  </div>
                ))}
              </div>

              {/* Live System Status Bar */}
              <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#EBF3FA] p-3 rounded border border-[#B8D4EE]">
                  <div className="text-[10px] font-bold text-[#0B2447] uppercase">Active Applications</div>
                  <div className="text-lg font-extrabold text-[#0B2447] mt-0.5">1,482</div>
                </div>
                <div className="bg-amber-50 p-3 rounded border border-amber-200">
                  <div className="text-[10px] font-bold text-amber-900 uppercase">Pending EVC Visits</div>
                  <div className="text-lg font-extrabold text-amber-700 mt-0.5">124</div>
                </div>
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <div className="text-[10px] font-bold text-red-900 uppercase">Open SGRC Cases</div>
                  <div className="text-lg font-extrabold text-[#B3261E] mt-0.5">18</div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Official / Institution / Student Login Box */}
            <div className="lg:col-span-5 bg-white border-2 border-[#D4AF37]/60 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#1B3A6B]" />
                  <h2 className="text-base font-bold text-[#0B2447]">
                    Unified Portal Sign-In
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Secure Gateway</span>
              </div>

              {/* Login Type Tabs */}
              <div className="grid grid-cols-3 gap-1 mb-4 bg-slate-100 p-1 rounded text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('OFFICIAL')}
                  className={`py-1.5 text-[11px] font-bold rounded transition-colors ${
                    activeTab === 'OFFICIAL' ? 'bg-[#0B2447] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Official
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('INSTITUTION')}
                  className={`py-1.5 text-[11px] font-bold rounded transition-colors ${
                    activeTab === 'INSTITUTION' ? 'bg-[#0B2447] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Institution
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('STUDENT')}
                  className={`py-1.5 text-[11px] font-bold rounded transition-colors ${
                    activeTab === 'STUDENT' ? 'bg-[#0B2447] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Student Portal
                </button>
              </div>

              {activeTab === 'STUDENT' ? (
                <div className="space-y-3 text-xs">
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-[11px] text-amber-900">
                    <span className="font-bold">Demo Student Quick-Sign In:</span> Click any student below to auto-fill & login!
                  </div>
                  
                  {/* Demo Student Quick Buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {DEMO_STUDENTS.map((st, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectDemoStudent(st)}
                        className="p-1.5 bg-slate-50 hover:bg-[#1B3A6B] hover:text-white border border-slate-300 rounded text-center transition-colors"
                      >
                        <div className="font-bold truncate">{st.name}</div>
                        <div className="text-[10px] opacity-75 font-mono">{st.enrollment}</div>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleStudentLoginSubmit} className="space-y-3 pt-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Enrollment / Roll Number</label>
                      <input
                        type="text"
                        required
                        value={studentForm.enrollmentNo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentForm({ ...studentForm, enrollmentNo: e.target.value })}
                        placeholder="e.g. 0103CS221045"
                        className="w-full px-3 py-2 rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Registered Mobile Number</label>
                      <input
                        type="text"
                        required
                        value={studentForm.mobile}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentForm({ ...studentForm, mobile: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                      />
                    </div>
                    {otpSent && (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Enter OTP (Simulated: 1234)</label>
                        <input
                          type="text"
                          required
                          defaultValue="1234"
                          className="w-full px-3 py-2 rounded border border-slate-300 bg-white font-mono"
                        />
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-[#F5A623] hover:bg-[#E09112] text-white font-bold py-2 rounded-full shadow-sm transition-colors text-xs uppercase tracking-wider"
                    >
                      {otpSent ? 'Verify & Access Student Dashboard' : 'Send OTP'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {activeTab === 'INSTITUTION' ? 'Permanent Institution ID' : 'Official User ID / Email'}
                    </label>
                    <input
                      type="text"
                      defaultValue={
                        activeTab === 'INSTITUTION'
                          ? '1-102345 (VIT Bhopal - Demo)'
                          : 'meera.nair@aicte-cr.example.gov.in'
                      }
                      className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        defaultValue="••••••••••••"
                        className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Captcha: 14 + 5 =
                      </label>
                      <input
                        type="text"
                        defaultValue="19"
                        className="w-full px-3 py-2 rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleDemoLogin(activeTab === 'INSTITUTION' ? 'INSTITUTION' : 'REGIONAL_OFFICER')
                    }
                    className="w-full bg-[#F5A623] hover:bg-[#E09112] text-white font-bold py-2 rounded-full shadow-sm transition-colors text-xs uppercase tracking-wider"
                  >
                    Proceed to Login
                  </button>
                </div>
              )}

              {/* Demo Mode One-Click Role Sign-In */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1B3A6B] mb-2">
                  Demo mode: sign in directly as any role (skips OTP)
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(DEMO_USERS) as Role[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleDemoLogin(role)}
                      className="text-left px-2.5 py-1.5 text-[11px] rounded border border-slate-300 bg-slate-50 hover:bg-[#1B3A6B] hover:text-white transition-colors"
                    >
                      <div className="font-bold">{role.replace(/_/g, ' ')}</div>
                      <div className="text-[10px] opacity-80 truncate">
                        {DEMO_USERS[role].name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Three-Card Section with Vertical Hover-Pause Marquee */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Announcements Card */}
            <div className="bg-white border border-[#DDE3EE] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between h-72">
              <div className="bg-[#0B2447] text-white font-bold text-xs py-3 px-4 text-center tracking-wider uppercase shrink-0">
                Announcements
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <marquee 
                  direction="up" 
                  scrollamount="3" 
                  scrolldelay="100"
                  className="h-full cursor-pointer"
                  onMouseOver={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).stop?.()}
                  onMouseOut={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).start?.()}
                >
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <div className="font-bold text-[#0B2447] mb-0.5">Approval Process 2026-27 Schedule Updated</div>
                      <p className="text-[11px] text-slate-500">Scrutiny and EVC timelines extended for Central and Western regions.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 28 Oct 2026</span>
                    </div>
                    <div className="border-b border-slate-100 pb-3">
                      <div className="font-bold text-[#0B2447] mb-0.5">Mandatory SGRC Compliance Notice</div>
                      <p className="text-[11px] text-slate-500">Institutions must resolve pending fee refund tickets within 7 working days.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 24 Oct 2026</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#0B2447] mb-0.5">EVC Digital Verification Portal Live</div>
                      <p className="text-[11px] text-slate-500">All expert visit committee members can now submit GPS-tagged reports.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 18 Oct 2026</span>
                    </div>
                  </div>
                </marquee>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0">
                <button
                  type="button"
                  onClick={() => setModalCategory('ANNOUNCEMENTS')}
                  className="bg-[#F5A623] hover:bg-[#E09112] text-white font-bold text-xs px-6 py-1.5 rounded-full shadow-sm transition-colors"
                >
                  Read More
                </button>
              </div>
            </div>

            {/* Circulars Card */}
            <div className="bg-white border border-[#DDE3EE] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between h-72">
              <div className="bg-[#0B2447] text-white font-bold text-xs py-3 px-4 text-center tracking-wider uppercase shrink-0">
                Circulars
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <marquee 
                  direction="up" 
                  scrollamount="3" 
                  scrolldelay="100"
                  className="h-full cursor-pointer"
                  onMouseOver={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).stop?.()}
                  onMouseOut={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).start?.()}
                >
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <div className="font-bold text-[#0B2447] mb-0.5">For Diploma Students: Revised Calendar</div>
                      <p className="text-[11px] text-slate-500">Revised calendar for reporting to the allotted institute will be updated shortly on the SSSJKL Portal.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 13 August, 2026</span>
                    </div>
                    <div className="border-b border-slate-100 pb-3">
                      <div className="font-bold text-[#0B2447] mb-0.5">EVC Panel Member Guidelines 2026</div>
                      <p className="text-[11px] text-slate-500">Standard operating procedure for Expert Visit Committee digital report submissions.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 02 August, 2026</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#0B2447] mb-0.5">Anti-Ragging Compliance Circular</div>
                      <p className="text-[11px] text-slate-500">Annual submission of online undertakings by affiliated colleges.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 20 July, 2026</span>
                    </div>
                  </div>
                </marquee>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0">
                <button
                  type="button"
                  onClick={() => setModalCategory('CIRCULARS')}
                  className="bg-[#F5A623] hover:bg-[#E09112] text-white font-bold text-xs px-6 py-1.5 rounded-full shadow-sm transition-colors"
                >
                  Read More
                </button>
              </div>
            </div>

            {/* Advertisements Card */}
            <div className="bg-white border border-[#DDE3EE] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between h-72">
              <div className="bg-[#0B2447] text-white font-bold text-xs py-3 px-4 text-center tracking-wider uppercase shrink-0">
                Advertisements
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <marquee 
                  direction="up" 
                  scrollamount="3" 
                  scrolldelay="100"
                  className="h-full cursor-pointer"
                  onMouseOver={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).stop?.()}
                  onMouseOut={(e: React.MouseEvent<HTMLElement>) => (e.currentTarget as any).start?.()}
                >
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <div className="font-bold text-[#0B2447] mb-0.5">Adviser & Director Deputation Posts</div>
                      <p className="text-[11px] text-slate-500">Application for the post of Adviser-I, Adviser-II, Director and Assistant Director on deputation across AICTE.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 26 May, 2025</span>
                    </div>
                    <div className="border-b border-slate-100 pb-3">
                      <div className="font-bold text-[#0B2447] mb-0.5">Smart India Hackathon 2026 Mentorship</div>
                      <p className="text-[11px] text-slate-500">Invitation for technical evaluation panels and problem statement evaluators.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 15 Jan, 2026</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#0B2447] mb-0.5">AICTE Post-Doctoral Fellowship (APDF)</div>
                      <p className="text-[11px] text-slate-500">Applications invited for research fellowships across technical institutions.</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold">Published on 10 Jan, 2026</span>
                    </div>
                  </div>
                </marquee>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center shrink-0">
                <button
                  type="button"
                  onClick={() => setModalCategory('ADVERTISEMENTS')}
                  className="bg-[#F5A623] hover:bg-[#E09112] text-white font-bold text-xs px-6 py-1.5 rounded-full shadow-sm transition-colors"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for APH / Guidelines / Public Notices Details */}
      {activeResourceModal !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-slate-300">
            <div className="bg-[#0B2447] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold tracking-wider">
                  {portalResources[activeResourceModal].title}
                </h3>
              </div>
              <button
                onClick={() => setActiveResourceModal(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-white text-xs text-slate-700 leading-relaxed">
              <div className="p-4 rounded bg-[#EBF3FA] border border-[#B8D4EE] text-[#0B2447] font-medium">
                {portalResources[activeResourceModal].content}
              </div>
              <p>
                Official statutory guidelines under the Approval Process 2026-27 framework. All parameters are digitally verified against institutional records.
              </p>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 text-xs">
              <button
                onClick={() => {
                  const res = portalResources[activeResourceModal!];
                  handleDownloadFile(`${res.title.replace(/\s+/g, '_')}.txt`, `${res.title}\n\n${res.content}`);
                }}
                className="px-4 py-2 bg-[#0B2447] hover:bg-[#1B3A6B] text-white font-bold rounded shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Official Document (.txt)
              </button>
              <button
                onClick={() => setActiveResourceModal(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Page Modal Archive for Read More */}
      {modalCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-300">
            {/* Modal Header */}
            <div className="bg-[#0B2447] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-extrabold tracking-wider uppercase">
                    AICTE Official {modalCategory} Archive
                  </h3>
                  <p className="text-xs text-slate-300">Complete statutory notices and publications register</p>
                </div>
              </div>
              <button
                onClick={() => setModalCategory(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content List */}
            <div className="p-6 overflow-y-auto space-y-4 bg-[#F4F6FA] flex-1">
              {allNotices
                .filter((n) => n.category === modalCategory)
                .map((notice) => (
                  <div key={notice.id} className="bg-white border border-[#DDE3EE] rounded-lg p-5 shadow-sm hover:shadow transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                      <div className="font-bold text-sm text-[#0B2447]">{notice.title}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {notice.referenceNo}
                        </span>
                        <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded font-semibold">
                          <Calendar className="w-3.5 h-3.5" /> {notice.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-4">{notice.description}</p>
                    <div className="flex items-center justify-end gap-3 text-xs">
                      <button
                        onClick={() => handleDownloadFile(`${notice.referenceNo.replace(/\//g, '_')}_Notice.txt`, `${notice.title}\n\nRef: ${notice.referenceNo}\nDate: ${notice.date}\n\n${notice.description}`)}
                        className="px-4 py-1.5 bg-[#0B2447] hover:bg-[#1B3A6B] text-white rounded font-medium shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> Download PDF Notice
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 text-xs text-slate-500">
              <span>Showing official verified records for Approval Process 2026-27</span>
              <button
                onClick={() => setModalCategory(null)}
                className="px-5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Multi-Column Footer */}
      <footer className="bg-[#0B2447] text-slate-300 border-t border-slate-700 text-xs">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white text-lg">
              <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold hover:bg-white/20 cursor-pointer">f</span>
              <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold hover:bg-white/20 cursor-pointer">𝕏</span>
              <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold hover:bg-white/20 cursor-pointer">🤖</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Official Portal Channels & Mobile App Integration
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="hover:text-amber-300 cursor-pointer">AICTE Dashboard</div>
            <div className="hover:text-amber-300 cursor-pointer">Reports</div>
            <div className="hover:text-amber-300 cursor-pointer">Directory</div>
            <div className="hover:text-amber-300 cursor-pointer">Cyber Security</div>
            <div className="hover:text-amber-300 cursor-pointer">Term of use</div>
            <div className="hover:text-amber-300 cursor-pointer">Privacy Policy</div>
            <div className="hover:text-amber-300 cursor-pointer">Right to Information</div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="hover:text-amber-300 cursor-pointer">Centralized Support System</div>
            <div className="hover:text-amber-300 cursor-pointer">Verify Institute Approval</div>
            <div className="hover:text-amber-300 cursor-pointer">Deemed University Result</div>
            <div className="hover:text-amber-300 cursor-pointer">PGDM Student Verification</div>
            <div className="hover:text-amber-300 cursor-pointer">Contact us</div>
            <div className="hover:text-amber-300 cursor-pointer">Sitemap</div>
            <div className="hover:text-amber-300 cursor-pointer">AICTE Approved Universities/Institutions</div>
          </div>

          <div className="space-y-3 text-right md:text-left">
            <div className="font-bold text-white text-sm">
              अखिल भारतीय तकनीकी शिक्षा परिषद<br />
              <span className="text-xs text-amber-300">All India Council for Technical Education</span>
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed">
              Nelson Mandela Marg, Vasant Kunj,<br />
              New Delhi -110070
            </div>
            <div className="text-[11px] text-amber-300 font-mono font-semibold">
              Phone: 011-2958 1050 - 1000
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-3 px-6 text-center text-[11px] text-slate-400 bg-[#071933]">
          Copyright © 2026. AICTE. All rights reserved. Prototype with synthetic data for SIH 2026.
        </div>
      </footer>
    </div>
  );
};