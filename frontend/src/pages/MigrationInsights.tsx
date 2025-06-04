import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineStorage, MdOutlineBusiness, MdOutlineAttachMoney, MdArrowForward, MdArrowBack, MdEdit, MdRefresh, MdCloudUpload, MdOutlineCalculate, MdOutlineSettings, MdInfoOutline, MdClose, MdAccessTime, MdOutlineSavings, MdOutlineTimeline, MdFullscreen } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FaServer, FaMoneyBillWave, FaDatabase, FaChartLine, FaRegCalendarAlt, FaWindowMaximize, FaCalculator, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

const WindowReplacementInsights = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(true);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Gathering satellite data...");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleContinue = () => {
    navigate('/outreach');
  };

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const openImageModal = (imageSrc: string) => {
    setExpandedImage(imageSrc);
  };

  const closeImageModal = () => {
    setExpandedImage(null);
  };

  // Initial Page Loading Screen Component
  const InitialLoadingScreen = () => (
    <div className="fixed inset-0 z-50 bg-[#020305] flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
        {/* Main Loading Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-4 w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>

        {/* Loading Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-4">
          Luxwall Analytics Engine
        </h1>
        
        {/* Dynamic Loading Message */}
        <div className="mb-8">
          <p className="text-xl text-blue-300 mb-2 animate-pulse">{loadingMessage}</p>
          <p className="text-gray-400 text-sm">Advanced AI processing satellite imagery and building data</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-800/50 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full transition-all duration-300 animate-pulse"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="text-cyan-400 text-sm font-medium">{loadingProgress}% Complete</div>
        </div>

        {/* Processing Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MdOutlineStorage className="text-blue-300 text-xl animate-pulse" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-2">Data Collection</h3>
            <p className="text-gray-400 text-xs">Scanning 2,547 buildings across Detroit metropolitan area</p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MdOutlineCalculate className="text-cyan-300 text-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <h3 className="text-white font-semibold text-sm mb-2">AI Analysis</h3>
            <p className="text-gray-400 text-xs">Processing window counts and energy efficiency metrics</p>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500/40 to-blue-500/40 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FaChartLine className="text-purple-300 text-xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <h3 className="text-white font-semibold text-sm mb-2">Report Generation</h3>
            <p className="text-gray-400 text-xs">Calculating Section 179D benefits and ROI projections</p>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  // Loading Animation Component
  const LoadingSection = ({ height = "500px", title }: { height?: string; title: string }) => (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden" style={{ height }}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-lg animate-pulse w-64"></div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="space-y-4">
              <div className="h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse"></div>
              <div className="h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-lg animate-pulse"></div>
              <div className="h-64 bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-xl animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-cyan-400/20 to-green-400/20 rounded animate-pulse w-2/3"></div>
                <div className="h-4 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TimelineLoadingSection = () => (
    <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-xl animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-lg animate-pulse w-48"></div>
          <div className="h-4 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded animate-pulse w-64"></div>
        </div>
      </div>
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-48 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse"></div>
            <div className="flex-1 h-12 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChartLoadingSection = () => (
    <div className="relative bg-gradient-to-br from-blue-500/6 via-white/3 to-cyan-500/4 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-lg animate-pulse"></div>
        <div className="h-6 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-lg animate-pulse w-64"></div>
      </div>
      <div className="h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl animate-pulse flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse"></div>
        <div className="h-16 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );

  // Section 179D calculation
  const calculate179D = (squareFootage: number, energySavingsPercent: number = 40) => {
    const baseRate = 0.50 + (energySavingsPercent - 25) * 0.02;
    const bonusRate = 2.50 + (energySavingsPercent - 25) * 0.10;
    
    const baseDeduction = Math.round(squareFootage * baseRate);
    const bonusDeduction = Math.round(squareFootage * bonusRate);
    const totalDeduction = bonusDeduction;
    
    return {
      squareFootage,
      energySavingsPercent,
      baseRate,
      bonusRate,
      baseDeduction,
      bonusDeduction,
      totalDeduction,
      paybackReduction: Math.round(totalDeduction * 0.35)
    };
  };

  const section179DData = calculate179D(500000, 42);

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode; 
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <MdClose className="text-white text-xl" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Image Modal component
  const ImageModal = ({ isOpen, onClose, imageSrc }: { 
    isOpen: boolean; 
    onClose: () => void; 
    imageSrc: string; 
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative max-w-[95vw] max-h-[95vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <MdClose className="text-white text-xl" />
          </button>
          <img 
            src={imageSrc} 
            alt="Expanded view" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      </div>
    );
  };

  const modalContent = {
    section179D: {
      title: "Section 179D Tax Deduction",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 p-6 rounded-xl border border-blue-500/20">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaCalculator className="text-blue-400" />
              Why Luxwall is the Smart Choice
            </h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Section 179D tax deduction significantly enhances the financial appeal of Luxwall's energy-efficient glass solutions. 
              With Luxwall's Enthermal™ glass achieving 40-45% HVAC energy cost reduction, your project qualifies for maximum deductions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-blue-400 font-semibold">Base Deduction</div>
                <div className="text-2xl font-bold text-white">${section179DData.baseDeduction.toLocaleString()}</div>
                <div className="text-sm text-gray-400">${section179DData.baseRate.toFixed(2)}/sq ft</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-green-400 font-semibold">Bonus Deduction</div>
                <div className="text-2xl font-bold text-white">${section179DData.bonusDeduction.toLocaleString()}</div>
                <div className="text-sm text-gray-400">${section179DData.bonusRate.toFixed(2)}/sq ft</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    energyEfficiency: {
      title: "Energy Efficiency Analysis",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 rounded-xl border border-green-500/20">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaLightbulb className="text-green-400" />
              Luxwall's Enthermal™ Technology
            </h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              Luxwall's Enthermal™ glass technology provides superior energy efficiency compared to traditional window systems.
              The advanced insulation properties reduce HVAC load significantly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-green-400 font-semibold">R-Value</div>
                <div className="text-2xl font-bold text-white">R-18 to R-21</div>
                <div className="text-sm text-gray-400">Thermal Resistance</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-blue-400 font-semibold">U-Factor</div>
                <div className="text-2xl font-bold text-white">0.15</div>
                <div className="text-sm text-gray-400">Heat Transfer Rate</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-purple-400 font-semibold">SHGC</div>
                <div className="text-2xl font-bold text-white">0.25</div>
                <div className="text-sm text-gray-400">Solar Heat Gain</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    financialBenefits: {
      title: "Financial Benefits Analysis",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-green-500/10 p-6 rounded-xl border border-purple-500/20">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-purple-400" />
              Complete Financial Picture
            </h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              Beyond energy savings, Luxwall provides substantial reductions in maintenance costs and qualifies for multiple tax incentives.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-purple-400 font-semibold">Maintenance Savings</div>
                <div className="text-2xl font-bold text-white">$61,200/year</div>
                <div className="text-sm text-gray-400">Reduced upkeep costs</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-green-400 font-semibold">Tax Benefits</div>
                <div className="text-2xl font-bold text-white">${section179DData.totalDeduction.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Section 179D + other incentives</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage("Gathering satellite data...");

    // Dynamic loading messages and progress
    const messages = [
      "Gathering satellite data...",
      "Analyzing building structures...", 
      "Detecting window configurations...",
      "Calculating energy efficiency metrics...",
      "Processing Section 179D benefits...",
      "Generating financial projections...",
      "Finalizing comprehensive report..."
    ];

    let messageIndex = 0;
    let progress = 0;

    const updateLoading = () => {
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 10; // Random progress increment
        if (progress > 100) progress = 100;
        
        setLoadingProgress(Math.floor(progress));
        
        if (messageIndex < messages.length - 1 && progress > (messageIndex + 1) * (100 / messages.length)) {
          messageIndex++;
          setLoadingMessage(messages[messageIndex]);
        }

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => {
              setIsCalculating(false);
              // Start loading the sections after 1 second
              setTimeout(() => {
                setSectionsLoaded(true);
              }, 5000);
            }, 3000);
          }, 500);
        }
      }, 200);
    };

    updateLoading();
  }, []);

  // Show initial loading screen
  if (isLoading) {
    return <InitialLoadingScreen />;
  }

  return (
    <div className="w-full px-1 py-2 bg-[#020305] min-h-screen min-w-full relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/8 via-cyan-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Title section */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
                <FaWindowMaximize size={32} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Luxwall Window Replacement Analytics
                </h1>
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  Powered by Section 179D Tax Benefits
                  <button
                    onClick={() => openModal('section179D')}
                    className="p-1 rounded-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors"
                  >
                    <MdInfoOutline className="text-blue-400 text-sm" />
                  </button>
                </p>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
                <div className="text-green-400 font-semibold text-sm">Section 179D Eligible</div>
                <div className="text-white font-bold text-xl">${section179DData.totalDeduction.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">Tax Deduction Available</div>
              </div>
            </div>
          </div>

          {/* Statistics Grid with Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Implementation Details Card */}
            <div className="relative h-[500px] overflow-hidden rounded-3xl group">
              <div className="absolute inset-0">
                <img 
                  src="/images/Luxwall/Yellow_Windows/ChatGPT Image Jun 3, 2025, 01_43_27 PM.png" 
                  alt="Luxwall Implementation" 
                  className="w-[95%] h-[95%] object-cover object-center rounded-2xl m-2"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
              </div>
              {/* Expand Icon */}
              <button
                onClick={() => openImageModal("/images/Luxwall/Yellow_Windows/ChatGPT Image Jun 3, 2025, 01_43_27 PM.png")}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200 shadow-lg hover:scale-110"
              >
                <MdFullscreen className="text-xl" />
              </button>
              <div className="relative z-10 h-full w-[50%] p-6 flex flex-col justify-center">
                <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-blue-500/40 to-blue-600/40 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-blue-500/30">
                        <FaWindowMaximize className="text-lg text-blue-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Luxwall Implementation</h3>
                    </div>
                    <button onClick={() => openModal('section179D')} className="p-2 rounded-full bg-blue-500/30 hover:bg-blue-500/50 transition-colors border border-blue-500/40">
                      <MdInfoOutline className="text-blue-300" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">System Scale</span>
                    <span className="text-sm font-semibold text-white">1,250 windows</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Implementation Time</span>
                    <span className="text-sm font-semibold text-white">9 months</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Cost per Window</span>
                    <span className="text-sm font-semibold text-white">$700/window</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-300">Total Investment</span>
                    <span className="text-sm font-semibold text-white">$875,000</span>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
                  <div className="text-green-400 font-semibold text-xs">Section 179D Benefit</div>
                  <div className="text-white font-bold">${section179DData.totalDeduction.toLocaleString()} Tax Deduction</div>
                </div>
              </div>
            </div>

            {/* Financial Benefits Card */}
            <div className="relative h-[500px] overflow-hidden rounded-3xl group">
              <div className="absolute inset-0">
                <img src="/images/Luxwall/Yellow_Windows/ChatGPT Image Jun 3, 2025, 03_22_38 PM.png" alt="Financial Benefits" className="w-[95%] h-[95%] object-cover object-center rounded-2xl m-2" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
              </div>
              {/* Expand Icon */}
              <button
                onClick={() => openImageModal("/images/Luxwall/Yellow_Windows/ChatGPT Image Jun 3, 2025, 03_22_38 PM.png")}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200 shadow-lg hover:scale-110"
              >
                <MdFullscreen className="text-xl" />
              </button>
              <div className="relative z-10 h-full w-[50%] p-6 flex flex-col justify-center">
                <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-green-500/40 to-blue-500/40 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-green-500/30">
                        <FaMoneyBillWave className="text-lg text-green-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Financial Benefits</h3>
                    </div>
                    <button onClick={() => openModal('financialBenefits')} className="p-2 rounded-full bg-green-500/30 hover:bg-green-500/50 transition-colors border border-green-500/40">
                      <MdInfoOutline className="text-green-300" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Annual Energy Savings</span>
                    <span className="text-sm font-semibold text-white">$89,425</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Monthly Average</span>
                    <span className="text-sm font-semibold text-white">$7,452</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Maintenance Reduction</span>
                    <span className="text-sm font-semibold text-white">$61,200</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-300">Section 179D Deduction</span>
                    <span className="text-sm font-semibold text-green-400">${section179DData.totalDeduction.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-green-500/30 to-blue-500/30 backdrop-blur-sm rounded-xl p-3 border border-green-500/40">
                  <div className="text-green-400 font-semibold text-xs">Total First Year Benefit</div>
                  <div className="text-white font-bold text-lg">${(section179DData.totalDeduction + 89425 + 61200).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Energy Assessment Card */}
            <div className="relative h-[500px] overflow-hidden rounded-3xl group">
              <div className="absolute inset-0">
                <img src="/images/Luxwall/Yellow_Windows/ChatGPT Image Jun 3, 2025, 03_42_36 PM.png" alt="Energy Assessment" className="w-[95%] h-[95%] object-cover object-center rounded-2xl m-2" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
              </div>
              {/* Expand Icon */}
              <button
                onClick={() => openImageModal("/images/Luxwall/Yellow_Windows/ChatGPT Image Jun 3, 2025, 03_42_36 PM.png")}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200 shadow-lg hover:scale-110"
              >
                <MdFullscreen className="text-xl" />
              </button>
              <div className="relative z-10 h-full w-[50%] p-6 flex flex-col justify-center">
                <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-500/40 to-blue-500/40 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-purple-500/30">
                        <MdOutlineBusiness className="text-lg text-purple-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Energy Assessment</h3>
                    </div>
                    <button onClick={() => openModal('energyEfficiency')} className="p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-colors border border-purple-500/40">
                      <MdInfoOutline className="text-purple-300" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Current System</span>
                    <span className="text-sm font-semibold text-white">Standard Windows</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Luxwall Solution</span>
                    <span className="text-sm font-semibold text-white">Enthermal™ Glass</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Energy Savings</span>
                    <span className="text-sm font-semibold text-white">42% HVAC Reduction</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-300">Insulation Value</span>
                    <span className="text-sm font-semibold text-white">R-18 to R-21</span>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30">
                  <div className="text-blue-400 font-semibold text-xs">179D Qualified Systems</div>
                  <div className="text-white font-bold text-sm">Building Envelope + HVAC + Lighting</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics Card */}
            <div className="relative h-[500px] overflow-hidden rounded-3xl group">
              <div className="absolute inset-0">
                <img src="/images/Luxwall/Yellow_Windows/ChatGPT Image Jun 3, 2025, 10_11_58 AM.png" alt="Performance Metrics" className="w-[95%] h-[95%] object-cover object-center rounded-2xl m-2" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
              </div>
              {/* Expand Icon */}
              <button
                onClick={() => openImageModal("/images/Luxwall/Yellow_Windows/ChatGPT Image Jun 3, 2025, 10_11_58 AM.png")}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200 shadow-lg hover:scale-110"
              >
                <MdFullscreen className="text-xl" />
              </button>
              <div className="relative z-10 h-full w-[50%] p-6 flex flex-col justify-center">
                <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-cyan-500/40 to-green-500/40 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-cyan-500/30">
                        <FaCalculator className="text-lg text-cyan-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Performance Metrics</h3>
                    </div>
                    <button onClick={() => openModal('section179D')} className="p-2 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 transition-colors border border-cyan-500/40">
                      <MdInfoOutline className="text-cyan-300" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Building Size</span>
                    <span className="text-sm font-semibold text-white">500,000 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">Window Count</span>
                    <span className="text-sm font-semibold text-white">1,250 windows</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-sm text-gray-300">CO₂ Reduction</span>
                    <span className="text-sm font-semibold text-white">185 tons/year</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-300">Payback Period</span>
                    <span className="text-sm font-semibold text-white">2-7 years</span>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-green-500/30 to-cyan-500/30 backdrop-blur-sm rounded-xl p-3 border border-green-500/40">
                  <div className="text-green-400 font-semibold text-xs">Enhanced ROI with 179D</div>
                  <div className="text-white font-bold text-sm">Up to 50% faster payback</div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Visualization Preview Section */}
          <div className="mb-8">
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-blue-500/15 group relative overflow-hidden p-8">
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/20 via-blue-500/15 to-purple-500/10 opacity-30"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/20">
                      <MdOutlineTimeline className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                        AI Satellite Analysis Preview
                      </h3>
                      <p className="text-cyan-300/70 text-sm">AI agents scanning satellite imagery for window detection and analysis</p>
                    </div>
                  </div>
                  
                  <a
                    href="https://www.google.com/maps/@42.3272599,-83.0403222,122a,35y,315.39h,78.95t/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI1MDYwMS4wIKXMDSoASAFQAw%3D%3D&safe=active"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 group border border-cyan-400/20"
                  >
                    <FaChartLine className="text-lg group-hover:scale-110 transition-transform" />
                    See Satellite Imagery
                    <MdArrowForward className="text-lg group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/40 to-blue-500/40 flex items-center justify-center">
                        <MdOutlineStorage className="text-cyan-300 text-lg" />
                      </div>
                      <h4 className="text-white font-semibold">AI Satellite Scanning</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Advanced AI agents continuously scan satellite imagery to identify and count windows across building facades from multiple angles and perspectives.
                    </p>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center">
                        <FaChartLine className="text-blue-300 text-lg" />
                      </div>
                      <h4 className="text-white font-semibold">Window Detection Analytics</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Machine learning algorithms analyze building structures to accurately estimate window counts, sizes, and replacement opportunities for energy efficiency calculations.
                    </p>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/40 to-cyan-500/40 flex items-center justify-center">
                        <MdOutlineSettings className="text-purple-300 text-lg" />
                      </div>
                      <h4 className="text-white font-semibold">Multi-Angle Assessment</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      AI agents position themselves within embedded satellite data to capture comprehensive views, ensuring accurate window counts from all building orientations and elevations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Iframe Window */}
          <div className="mb-8">
            <iframe
              src="https://luxwall-window-tracker.vercel.app/"
              className="w-full h-[1200px] rounded-2xl"
              style={{ border: 'none' }}
              title="Luxwall Window Tracker Application"
            />
          </div>

          {/* Enhanced Section 179D Analytics Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  Luxwall Analytics & Section 179D Benefits
                </h2>
                <button
                  onClick={() => openModal('section179D')}
                  className="p-2 rounded-full bg-blue-500/15 hover:bg-blue-500/25 transition-colors border border-blue-500/20"
                >
                  <MdInfoOutline className="text-blue-400" />
                </button>
              </div>
              
              <div className="hidden lg:block bg-gradient-to-r from-blue-500/12 to-cyan-500/8 backdrop-blur-sm border border-blue-500/20 rounded-xl p-3">
                <div className="text-blue-400 font-semibold text-sm">Immediate Tax Benefit</div>
                <div className="text-white font-bold text-lg">${section179DData.paybackReduction.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">35% of ${section179DData.totalDeduction.toLocaleString()} deduction</div>
              </div>
            </div>
            
            {sectionsLoaded ? (
              <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div className="relative bg-gradient-to-br from-blue-500/8 via-blue-400/4 to-cyan-500/6 backdrop-blur-xl rounded-xl p-6 h-[500px] border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-transparent animate-pulse"></div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaChartLine className="text-blue-400" />
                        System Complexity Analysis
                      </h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart cx="50%" cy="50%" outerRadius={120} data={[
                          { subject: 'Window Size', A: 120, B: 110, fullMark: 150 },
                          { subject: 'Custom Code', A: 98, B: 130, fullMark: 150 },
                          { subject: 'Interfaces', A: 86, B: 130, fullMark: 150 },
                          { subject: 'Window Count', A: 99, B: 100, fullMark: 150 },
                          { subject: 'Transactions', A: 85, B: 90, fullMark: 150 },
                          { subject: 'Modules', A: 65, B: 85, fullMark: 150 },
                        ]}>
                          <PolarGrid stroke="rgba(255,255,255,0.2)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                          <Radar name="Legacy System" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} strokeWidth={2} />
                          <Radar name="Smart Windows" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2} />
                          <Legend wrapperStyle={{ color: '#94a3b8' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="relative bg-gradient-to-br from-blue-500/8 via-cyan-500/4 to-blue-400/6 backdrop-blur-xl rounded-xl p-6 h-[500px] border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaMoneyBillWave className="text-blue-400" />
                        5-Year TCO Comparison
                      </h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                          data={[
                            { year: 'Year 1', legacy: 1250000, cloud: 1025000 },
                            { year: 'Year 2', legacy: 1312500, cloud: 875000 },
                            { year: 'Year 3', legacy: 1378125, cloud: 918750 },
                            { year: 'Year 4', legacy: 1447031, cloud: 964688 },
                            { year: 'Year 5', legacy: 1519383, cloud: 1012922 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                          <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                            contentStyle={{ 
                              backgroundColor: '#1e222b', 
                              borderColor: '#374151', 
                              color: '#fff',
                              borderRadius: '8px',
                              border: '1px solid #374151'
                            }}
                          />
                          <Legend wrapperStyle={{ color: '#94a3b8' }} />
                          <defs>
                            <linearGradient id="legacyGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                            </linearGradient>
                            <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="legacy" name="Legacy System" stroke="#ef4444" fill="url(#legacyGradient)" strokeWidth={2} />
                          <Area type="monotone" dataKey="cloud" name="Smart Windows" stroke="#10b981" fill="url(#cloudGradient)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/12 to-blue-400/8 backdrop-blur-xl rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/30 transition-colors group">
                      <div className="text-xs text-blue-300 mb-1 font-medium">Energy Cost Reduction</div>
                      <div className="font-bold text-2xl text-white group-hover:text-blue-200 transition-colors">42%</div>
                      <div className="text-xs text-gray-400 mt-2">HVAC Savings with Luxwall</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/12 to-cyan-500/8 backdrop-blur-xl rounded-xl p-5 border border-blue-500/20 hover:border-cyan-500/30 transition-colors group">
                      <div className="text-xs text-cyan-300 mb-1 font-medium">Section 179D Deduction</div>
                      <div className="font-bold text-2xl text-white group-hover:text-cyan-200 transition-colors">${(section179DData.totalDeduction / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-400 mt-2">Immediate Tax Benefit</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-400/12 to-blue-500/8 backdrop-blur-xl rounded-xl p-5 border border-blue-400/20 hover:border-blue-400/30 transition-colors group">
                      <div className="text-xs text-blue-300 mb-1 font-medium">Implementation Time</div>
                      <div className="font-bold text-2xl text-white group-hover:text-blue-200 transition-colors">9 months</div>
                      <div className="text-xs text-gray-400 mt-2">Full Deployment</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/12 to-blue-500/8 backdrop-blur-xl rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-500/30 transition-colors group">
                      <div className="text-xs text-cyan-300 mb-1 font-medium">Enhanced ROI</div>
                      <div className="font-bold text-2xl text-white group-hover:text-cyan-200 transition-colors">2-7 years</div>
                      <div className="text-xs text-gray-400 mt-2">Payback with 179D</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <LoadingSection height="500px" title="Analytics" />
            )}
          </section>

          {/* Enhanced Monthly Savings Chart */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Monthly Cost Savings Analysis
              </h2>
              <button
                onClick={() => openModal('section179D')}
                className="p-2 rounded-full bg-blue-500/15 hover:bg-blue-500/25 transition-colors border border-blue-500/20"
              >
                <MdInfoOutline className="text-blue-400" />
              </button>
            </div>
            {sectionsLoaded ? (
              <div className="relative bg-gradient-to-br from-blue-500/6 via-white/3 to-cyan-500/4 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="absolute inset-0 opacity-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/8 animate-pulse"></div>
                </div>
                <div className="relative z-10 p-6">
                  <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2">Smart Windows Cost Savings ($)</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Based on implementation timeline, infrastructure consolidation, and maintenance reductions
                        </p>
                      </div>
                      
                      <div className="flex justify-between mb-2 text-xs font-medium">
                        <div className="text-blue-400">Planning</div>
                        <div className="text-emerald-400">Implementation</div>
                        <div className="text-green-400">Optimization</div>
                        <div className="text-teal-400">Full Operation</div>
                      </div>
                      
                      <div className="h-80 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { month: 'Jan', kwh: 458, baseline: 500 },
                              { month: 'Feb', kwh: 532, baseline: 550 },
                              { month: 'Mar', kwh: 672, baseline: 650 },
                              { month: 'Apr', kwh: 798, baseline: 775 },
                              { month: 'May', kwh: 845, baseline: 825 },
                              { month: 'Jun', kwh: 915, baseline: 900 },
                              { month: 'Jul', kwh: 932, baseline: 925 },
                              { month: 'Aug', kwh: 921, baseline: 910 },
                              { month: 'Sep', kwh: 854, baseline: 840 },
                              { month: 'Oct', kwh: 756, baseline: 735 },
                              { month: 'Nov', kwh: 605, baseline: 585 },
                              { month: 'Dec', kwh: 438, baseline: 470 }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                              dataKey="month" 
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tick={{ fill: '#94a3b8', fontSize: 12 }}
                              tickFormatter={(value) => `$${value}k`}
                            />
                            <Tooltip 
                              formatter={(value: number, name: string) => {
                                return [
                                  `$${value}k`, 
                                  name === "kwh" ? "Savings" : "Baseline"
                                ];
                              }}
                            />
                            <Legend
                              align="right"
                              verticalAlign="top"
                              wrapperStyle={{ paddingBottom: '20px' }}
                            />
                            <defs>
                              <linearGradient id="planningGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="implementationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="optimizationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="operationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <Bar 
                              dataKey="kwh" 
                              name="Savings" 
                              radius={[4, 4, 0, 0]}
                              barSize={36}
                            >
                              <Cell fill="url(#planningGradient)" stroke="#3B82F6" strokeWidth={1} />
                              <Cell fill="url(#planningGradient)" stroke="#3B82F6" strokeWidth={1} />
                              <Cell fill="url(#planningGradient)" stroke="#3B82F6" strokeWidth={1} />
                              <Cell fill="url(#implementationGradient)" stroke="#10B981" strokeWidth={1} />
                              <Cell fill="url(#implementationGradient)" stroke="#10B981" strokeWidth={1} />
                              <Cell fill="url(#implementationGradient)" stroke="#10B981" strokeWidth={1} />
                              <Cell fill="url(#optimizationGradient)" stroke="#22C55E" strokeWidth={1} />
                              <Cell fill="url(#optimizationGradient)" stroke="#22C55E" strokeWidth={1} />
                              <Cell fill="url(#optimizationGradient)" stroke="#22C55E" strokeWidth={1} />
                              <Cell fill="url(#operationGradient)" stroke="#14B8A6" strokeWidth={1} />
                              <Cell fill="url(#operationGradient)" stroke="#14B8A6" strokeWidth={1} />
                              <Cell fill="url(#operationGradient)" stroke="#14B8A6" strokeWidth={1} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Annual Savings</div>
                          <div className="text-2xl font-bold mt-1">$89,425</div>
                          <div className="text-sm text-green-500 mt-1">+3% from estimate</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Average</div>
                          <div className="text-2xl font-bold mt-1">$7,452</div>
                          <div className="text-sm text-green-500 mt-1">After full replacement</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-72 mt-6 md:mt-0">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Savings vs. Costs</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Your window replacement will save 73.5% of your operational costs
                        </p>
                        
                        <div className="relative h-36 bg-gray-100 dark:bg-[#1e222b] rounded-lg overflow-hidden mt-4">
                          <div className="absolute inset-0 flex items-end">
                            <div 
                              className="h-[73.5%] w-full bg-gradient-to-t from-blue-500 to-blue-400 opacity-80"
                              style={{ borderTopRightRadius: '100px' }}
                            >
                              <div className="absolute top-2 left-4 text-white text-sm font-medium drop-shadow-md">
                                Energy Savings
                              </div>
                              <div className="absolute bottom-2 left-4 text-white text-sm font-medium drop-shadow-md">
                                73.5%
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-2 right-4 text-gray-600 dark:text-gray-300 text-sm font-medium">
                            Energy Costs
                          </div>
                          <div className="absolute bottom-2 right-4 text-gray-600 dark:text-gray-300 text-sm font-medium">
                            26.5%
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#1e222b]/70 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Performance Factors</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>System efficiency: 75%</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Window count: 1,250</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Building reduction: 84%</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Support cost: -65%/yr</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-100 dark:bg-[#1e222b]/40 rounded-lg border-l-4 border-blue-500">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Note:</span> Savings estimates reflect typical 
                          operational year data. Actual results may vary based on system performance,
                          window count, and other factors.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ChartLoadingSection />
            )}
          </section>

          {/* Enhanced Migration Timeline */}
          {sectionsLoaded ? (
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-blue-500/15 group relative overflow-hidden mb-8">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" 
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                    backgroundSize: '30px 30px'
                  }}
                ></div>
              </div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
              
              <div className="relative z-10 p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <FaRegCalendarAlt size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                      Replacement Timeline
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Comprehensive timeline for the Smart Windows replacement process (9 months)
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="relative bg-gradient-to-br from-blue-500/6 via-blue-400/3 to-cyan-500/4 backdrop-blur-xl rounded-xl p-6 border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 to-transparent animate-pulse"></div>
                    </div>
                    <div className="relative z-10">
                      <div className="flex border-b border-gray-200 dark:border-[#1e222b] pb-2 mb-4">
                        <div className="w-56 flex-shrink-0 font-semibold">Project Phase</div>
                        <div className="flex-1 flex">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="flex-1 text-center text-sm font-medium">
                              Month {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Initial Assessment</div>
                            <div className="text-xs text-gray-500">4-6 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md"
                              style={{ width: '18%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                System Assessment & Analysis
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Strategy & Planning</div>
                            <div className="text-xs text-gray-500">4-8 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[12%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-90"
                              style={{ width: '22%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Solution Design & Roadmap
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Development Environment</div>
                            <div className="text-xs text-gray-500">4-6 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[25%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-80"
                              style={{ width: '22%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Environment Setup & Configuration
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Window Installation</div>
                            <div className="text-xs text-gray-500">8-12 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[40%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-70"
                              style={{ width: '33%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Window Removal, Installation & Configuration
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Integration & Testing</div>
                            <div className="text-xs text-gray-500">6-8 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[55%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-85"
                              style={{ width: '26%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                System Integration & User Acceptance Testing
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">User Training</div>
                            <div className="text-xs text-gray-500">3-4 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[75%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-95"
                              style={{ width: '15%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                User Training & Knowledge Transfer
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Go-Live & Support</div>
                            <div className="text-xs text-gray-500">2-4 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[88%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-90"
                              style={{ width: '12%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Final Deployment & Support
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-blue-500 font-semibold mb-2">Key Milestones</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span>Assessment Completion</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500 opacity-80"></div>
                              <span>Design Approval</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500 opacity-90"></div>
                              <span>Installation Complete</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span>System Operational</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-blue-500 font-semibold mb-2">Critical Dependencies</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>System Design Approval</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Window Installation Quality</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Interface Testing</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>User Acceptance</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-blue-500 font-semibold mb-2">Potential Delays</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Window Quality Issues</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Custom Window Configuration</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Interface Complexity</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>User Training Delays</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <TimelineLoadingSection />
            </div>
          )}

          {/* Enhanced Next Steps */}
          {sectionsLoaded ? (
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-blue-500/15 group relative overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/30 via-blue-500/20 to-blue-500/25 opacity-25"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/15 p-6 rounded-xl text-white shadow-lg backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300 border border-white/10">
                    <FaLightbulb size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-4">
                      AI-Powered Lead Conversion
                    </h3>
                    <div className="space-y-4">
                      <p className="text-white/90 text-lg leading-relaxed">
                        Our advanced AI algorithms have successfully analyzed this enterprise's energy profile, financial position, and Section 179D eligibility. 
                        The comprehensive data shows exceptional potential for Luxwall implementation with immediate tax benefits and long-term savings.
                      </p>
                      <p className="text-white/80 leading-relaxed">
                        <span className="font-semibold text-blue-400">Next Phase:</span> Convert this qualified prospect into an active customer through targeted outreach, 
                        personalized proposals, and strategic follow-up campaigns. Our system has identified the optimal contact strategy and timing 
                        for maximum conversion probability.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                          <div className="text-blue-400 font-semibold text-sm">Qualification Score</div>
                          <div className="text-2xl font-bold text-white">94%</div>
                          <div className="text-xs text-gray-400">High-value prospect</div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                          <div className="text-cyan-400 font-semibold text-sm">Conversion Probability</div>
                          <div className="text-2xl font-bold text-white">87%</div>
                          <div className="text-xs text-gray-400">Based on profile analysis</div>
                        </div>
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                          <div className="text-blue-300 font-semibold text-sm">Revenue Potential</div>
                          <div className="text-2xl font-bold text-white">$875K</div>
                          <div className="text-xs text-gray-400">Project value</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all backdrop-blur-sm transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3">
                    <FaServer className="text-lg" />
                    Initiate Customer Conversion Process
                    <MdArrowForward className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-8 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-lg animate-pulse w-80"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded animate-pulse w-96"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded animate-pulse w-full"></div>
                  <div className="h-6 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded animate-pulse w-4/5"></div>
                  <div className="h-6 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg animate-pulse"></div>
                  <div className="h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg animate-pulse"></div>
                  <div className="h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex justify-center mt-8">
                  <div className="h-14 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl animate-pulse w-80"></div>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Building Implementation Pipeline Section */}
          {sectionsLoaded ? (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/20">
                  <FaDatabase className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">Implementation Applied Across Database</h2>
                  <p className="text-emerald-300/70 text-sm">Same implementation planning applied to all 2,547 buildings from enriched database</p>
                </div>
              </div>
              
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-blue-500/15 group relative overflow-hidden p-8">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Sample Implementation Results</h3>
                      <p className="text-emerald-300/70 text-sm">Showing 6 of 2,547 implementation-ready buildings</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-emerald-500/20">
                          <th className="text-left py-3 px-4 text-emerald-300 font-semibold text-sm">Company</th>
                          <th className="text-left py-3 px-4 text-emerald-300 font-semibold text-sm">Location</th>
                          <th className="text-left py-3 px-4 text-emerald-300 font-semibold text-sm">Building Type</th>
                          <th className="text-right py-3 px-4 text-emerald-300 font-semibold text-sm">Project Value</th>
                          <th className="text-right py-3 px-4 text-emerald-300 font-semibold text-sm">Timeline</th>
                          <th className="text-center py-3 px-4 text-emerald-300 font-semibold text-sm">Phase</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">MGM Grand Detroit Hotel & Casino</div>
                            <div className="text-emerald-300/60 text-xs">Mixed-Use Complex</div>
                          </td>
                          <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                          <td className="py-4 px-4 text-white/80">Casino/Hotel</td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-green-400 font-bold">$972K</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-orange-400 font-bold">8 months</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Planning</span>
                          </td>
                        </tr>
                        <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">Jeffersonian Apartments</div>
                            <div className="text-emerald-300/60 text-xs">Residential High-Rise</div>
                          </td>
                          <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                          <td className="py-4 px-4 text-white/80">Residential</td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-green-400 font-bold">$2.2M</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-orange-400 font-bold">12 months</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium animate-pulse">Design</span>
                          </td>
                        </tr>
                        <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">Ford Motor Company</div>
                            <div className="text-emerald-300/60 text-xs">Manufacturing Complex</div>
                          </td>
                          <td className="py-4 px-4 text-white/80">Dearborn, MI</td>
                          <td className="py-4 px-4 text-white/80">Manufacturing</td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-green-400 font-bold">$3.8M</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-orange-400 font-bold">7 months</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">Planning</span>
                          </td>
                        </tr>
                        <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">General Motors</div>
                            <div className="text-emerald-300/60 text-xs">Corporate Headquarters</div>
                          </td>
                          <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                          <td className="py-4 px-4 text-white/80">Office Complex</td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-green-400 font-bold">$2.9M</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-orange-400 font-bold">9 months</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium">Design</span>
                          </td>
                        </tr>
                        <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">Henry Ford Health</div>
                            <div className="text-emerald-300/60 text-xs">Medical Center</div>
                          </td>
                          <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                          <td className="py-4 px-4 text-white/80">Healthcare</td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-green-400 font-bold">$4.7M</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-orange-400 font-bold">11 months</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">Approval</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-emerald-500/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">Quicken Loans</div>
                            <div className="text-emerald-300/60 text-xs">Corporate Tower</div>
                          </td>
                          <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                          <td className="py-4 px-4 text-white/80">Office</td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-green-400 font-bold">$1.8M</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-orange-400 font-bold">6 months</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Installation</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-emerald-300/70 text-sm">
                      Showing 6 of 2,547 implementation-ready buildings
                    </div>
                    <div className="flex gap-2">
                      <div className="join">
                        <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">«</button>
                        <button className="join-item btn btn-sm bg-emerald-500 text-white border-emerald-500">1</button>
                        <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">2</button>
                        <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">3</button>
                        <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">»</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500/30 via-emerald-600/30 to-emerald-700/30 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gradient-to-r from-emerald-400/30 to-emerald-500/30 rounded-lg animate-pulse w-96"></div>
                  <div className="h-4 bg-gradient-to-r from-emerald-300/20 to-emerald-400/20 rounded animate-pulse w-80"></div>
                </div>
              </div>
              
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-6 bg-gradient-to-r from-white/20 to-white/10 rounded animate-pulse w-64"></div>
                      <div className="h-4 bg-gradient-to-r from-emerald-400/20 to-emerald-300/20 rounded animate-pulse w-80"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="grid grid-cols-6 gap-4">
                        <div className="h-12 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded animate-pulse col-span-2"></div>
                        <div className="h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded animate-pulse"></div>
                        <div className="h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded animate-pulse"></div>
                        <div className="h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded animate-pulse"></div>
                        <div className="h-12 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="h-4 bg-gradient-to-r from-emerald-400/20 to-emerald-300/20 rounded animate-pulse w-64"></div>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 w-8 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue button */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleContinue}
              className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-medium transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3 group relative overflow-hidden"
            >
              <span className="relative z-10 text-lg">Continue to Email Automation</span>
              <MdArrowForward className="relative z-10 text-2xl group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {Object.entries(modalContent).map(([key, modal]) => (
        <Modal
          key={key}
          isOpen={activeModal === key}
          onClose={closeModal}
          title={modal.title}
        >
          {modal.content}
        </Modal>
      ))}

      {/* Image Modal */}
      {expandedImage && (
        <ImageModal
          isOpen={true}
          onClose={closeImageModal}
          imageSrc={expandedImage}
        />
      )}
    </div>
  );
};

export default WindowReplacementInsights; 