import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdArrowForward, MdOutlineEmail, MdScheduleSend, MdSend, MdOutlinePersonAdd, MdOutlineSettings, MdOutlineRule } from 'react-icons/md';
import { FaRegCopy, FaRegEdit, FaRegSave, FaRegTrashAlt, FaRegLightbulb, FaDatabase, FaRegChartBar, FaLinkedin, FaWhatsapp, FaMicrophone, FaComments, FaPlay, FaPause } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RiFlowChart, RiMailSendLine, RiMailCheckLine, RiMailCloseLine, RiArrowRightLine, RiSplitCellsHorizontal } from 'react-icons/ri';

interface Enterprise {
  id: number;
  name: string;
  industry: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  analysis: {
    enterpriseType: string;
    employees: number;
    buildingSize: number;
    currentEnergyCost: number;
    annualkWh: number;
    costPerkWh: number;
  };
  operationalAssessment: {
    currentAnnualCost: number;
    projectedSavings: number;
    paybackPeriod: number;
    efficiency: number;
  };
  migrationPotential: {
    calculated: boolean;
    totalSavings: number;
    selectedSystemType: string;
    annualSavings: number;
    installationCost: number;
    operationalSavings: number;
    paybackPeriod: number;
    roi: number;
    monthlySavings: Array<{
      month: string;
      savings: number;
    }>;
  };
  emailStatus: {
    drafted: boolean;
    sent: boolean;
    scheduled: boolean;
    scheduledDate?: Date;
  };
}

type TabType = 'email' | 'linkedin' | 'whatsapp';

// Add WhatsApp message flow types
interface WhatsAppMessage {
  id: string;
  type: 'initial' | 'followup1' | 'followup2' | 'final';
  name: string;
  message: string;
  day: number;
}

// Add WhatsApp message templates with more structure
const whatsappFlow: WhatsAppMessage[] = [
  {
    id: 'initial',
    type: 'initial',
    name: 'Initial Contact',
    message: "Hello [name], I'm reaching out regarding [company]'s energy efficiency potential. Our analysis shows significant cost savings opportunities through window optimization. Would you be interested in a brief discussion?",
    day: 0
  },
  {
    id: 'followup1',
    type: 'followup1',
    name: 'First Follow-up',
    message: "Hi [name], just following up on the energy efficiency analysis for [company]. The potential annual savings of $847,000 (34% reduction) might be of interest. When would be a good time to discuss?",
    day: 3
  },
  {
    id: 'followup2',
    type: 'followup2',
    name: 'Second Follow-up',
    message: "Hello [name], I wanted to ensure you received our analysis of [company]'s energy optimization potential. Given your focus on operational efficiency, I believe our findings about 34% energy cost reduction would be valuable to discuss.",
    day: 5
  },
  {
    id: 'final',
    type: 'final',
    name: 'Final Message',
    message: "Hi [name], this is my final note regarding [company]'s energy efficiency opportunity. Our analysis showing $847,000 in annual savings remains available if you'd like to review it in the future. Feel free to reach out when the timing is better.",
    day: 7
  }
];

const EmailAutomation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('independent_research');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Email templates
  const templates = [
    {
      id: 'coleman_young_initial',
      name: 'Coleman Young Building: Initial Contact',
      subject: "Your sustainability initiatives at Coleman A. Young Municipal caught my attention",
      rating: 96.8,
      sequence: 'sequence_1',
      sequencePosition: 1,
      ai_metrics: {
        openRate: 84.2,
        responseRate: 48.7,
        conversionRate: 35.8
      },
      body: `Dear Patricia,

I noticed the recent Detroit Free Press article about the city's ambitious energy efficiency goals for municipal buildings - particularly impressed by your leadership in implementing cost-saving measures while maintaining essential services for Detroit residents.

That article actually made me take a closer look at the Coleman A. Young Municipal Building's energy profile. After analyzing your 780,000 sq ft facility built in 1954, I've identified a significant opportunity: upgrading to high-performance energy-efficient windows could reduce your annual energy costs by approximately $482,000 - that's an 18.5% reduction from your current $2.6M energy spend.

For a facility of Coleman Young's scale and critical operations, this translates to:
• $40,167 in monthly energy savings
• 18-month payback period
• $900,000 in total savings over 3 years
• 94% improvement in thermal efficiency
• Significant reduction in citizen comfort complaints during peak summer/winter months

These projections are based on your building's current 16.8 million kWh annual consumption at $0.1528/kWh, factoring in the 1954 construction with aging window systems typical of that era.

Given Detroit's commitment to fiscal responsibility and energy independence, I thought these findings might be valuable for your facility planning.

Best regards,
{{name}}`
    },
    {
      id: 'coleman_young_followup1',
      name: 'Coleman Young Building: Follow-up 1',
      subject: "Quick follow-up: Coleman Young Municipal energy efficiency opportunity",
      rating: 94.5,
      sequence: 'sequence_1',
      sequencePosition: 2,
      ai_metrics: {
        openRate: 79.3,
        responseRate: 41.2,
        conversionRate: 28.4
      },
      body: `Hi Patricia,

Following up briefly on my previous email about the Coleman A. Young Municipal Building's $482,000 annual energy savings opportunity.

I wanted to share additional context that might be relevant for your municipal planning: our analysis shows that government buildings with similar profiles (750K+ sq ft, built pre-1960) have seen particularly strong results when upgrading their window systems during off-peak budget cycles.

Specifically for buildings like Coleman Young:
• Average 18% reduction in HVAC operational costs
• 94% improvement in thermal consistency across all floors
• Reduced maintenance calls during extreme Detroit weather events
• Enhanced security and noise reduction benefits for downtown operations

The $31,000 monthly installation timeline we typically see allows for phased implementation without disrupting essential city services.

If these findings align with Detroit's infrastructure modernization priorities, I'd be happy to share our complete municipal building analysis.

Best,
{{name}}`
    },
    {
      id: 'coleman_young_followup2',
      name: 'Coleman Young Building: Final Follow-up',
      subject: "Final thoughts on Coleman Young Municipal's energy optimization",
      rating: 92.1,
      sequence: 'sequence_1',
      sequencePosition: 3,
      ai_metrics: {
        openRate: 76.8,
        responseRate: 33.9,
        conversionRate: 22.3
      },
      body: `Dear Patricia,

I'm reaching out one final time regarding the $482,000 annual energy savings analysis we conducted for the Coleman A. Young Municipal Building.

Since my last email, I've completed additional research on municipal building retrofits in the Great Lakes region. Three findings that may be particularly relevant for Detroit's operations:

1. Municipal buildings with 24/7 security and emergency services (like Coleman Young) achieved 22% greater energy savings compared to standard office buildings due to consistent HVAC demands.

2. The phased installation approach we recommend averages just 3.8 months for buildings of Coleman Young's size, with zero impact on essential city services or public access.

3. Detroit's climate zone provides optimal conditions for high-performance window systems, with buildings seeing 15% better performance than national averages due to the significant temperature variations throughout the year.

Given your facility's role as the center of Detroit's government operations and the city's commitment to fiscal responsibility, the complete analysis showing $900,000 in three-year savings remains available should it align with your infrastructure priorities.

Thank you for your time and continued dedication to serving Detroit residents efficiently.

Best regards,
{{name}}`
    },
    {
      id: 'detroit_value_initial',
      name: 'Detroit-Focused: Value Proposition',
      subject: "Coleman Young Municipal Building - potential $482K annual savings opportunity",
      rating: 91.7,
      sequence: 'sequence_2',
      sequencePosition: 1,
      ai_metrics: {
        openRate: 77.8,
        responseRate: 39.4,
        conversionRate: 26.1
      },
      body: `Dear Patricia,

Your recent work on Detroit's municipal efficiency initiatives, as highlighted in the city's sustainability report, caught my attention - particularly your focus on reducing operational costs while maintaining exceptional public services.

After reviewing the Coleman A. Young Municipal Building's energy profile, our team has identified a significant optimization opportunity: upgrading to high-performance energy-efficient windows could yield $482,000 in annual energy savings - that's an 18.5% reduction from your current $2.6M energy costs.

Specific benefits for Coleman Young Municipal:
• $40,167 monthly energy cost reduction
• 18-month payback period for the city
• $900,000 total savings over 3 years
• 94% improvement in building climate consistency
• Enhanced security and noise reduction for downtown operations
• 22% decrease in maintenance requests during extreme weather

With your building's 780,000 sq ft and critical role housing essential city services, these improvements would position Detroit ahead of other major cities in municipal energy efficiency. The installation timeline accommodates government operations with zero service disruption.

These insights come from our analysis of similar municipal retrofits completed in 2022-2024 across the Midwest.

I hope this information proves valuable as Detroit continues leading in sustainable municipal operations.

Best regards,
{{name}}`
    }
  ];
  
  // Contact data - Updated for Coleman A. Young Municipal Building
  const contacts = [
    {
      id: 1,
      name: "Patricia Williams",
      email: "p.williams@detroitmi.gov",
      company: "Coleman A. Young Municipal Building",
      location: "Detroit, Michigan",
      position: "Facilities Operations Director",
      phone: "+1 (313) 224-3400"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      email: "m.johnson@detroitmi.gov",
      company: "Coleman A. Young Municipal Building",
      location: "Detroit, Michigan",
      position: "Energy Management Coordinator",
      phone: "+1 (313) 224-3401"
    },
    {
      id: 3,
      name: "Jennifer Rodriguez",
      email: "j.rodriguez@detroitmi.gov",
      company: "Detroit General Services Department",
      location: "Detroit, Michigan",
      position: "Building Operations Manager",
      phone: "+1 (313) 224-2156"
    },
    {
      id: 4,
      name: "David Chen",
      email: "d.chen@detroitmi.gov",
      company: "Detroit Public Works",
      location: "Detroit, Michigan",
      position: "Facilities Maintenance Director",
      phone: "+1 (313) 224-1847"
    },
    {
      id: 5,
      name: "Sarah Thompson",
      email: "s.thompson@detroitmi.gov",
      company: "Coleman A. Young Municipal Building",
      location: "Detroit, Michigan",
      position: "Sustainability Coordinator",
      phone: "+1 (313) 224-3405"
    }
  ];

  // Add LinkedIn voice message template
  const linkedInVoiceMessage = {
    id: 'linkedin_voice',
    name: 'LinkedIn Voice Message',
    message: `Hi {{name}},

I saw your recent LinkedIn post about Detroit's municipal sustainability initiatives and was impressed by your commitment to both fiscal responsibility and environmental stewardship.

After looking into the Coleman A. Young Municipal Building's operations, I've identified some compelling energy optimization opportunities. With your 780,000 sq ft facility currently spending $2.6M annually on energy, upgrading to high-performance windows could reduce those costs by $482,000 per year - that's an 18.5% reduction with an 18-month payback.

I'd love to share the detailed analysis of how this could work for Detroit's municipal operations. Would you be open to a brief conversation about these potential savings?

Best regards,
[Your Name]`
  };

  // Add WhatsApp message templates with Coleman Young specific information
  const whatsappFlow: WhatsAppMessage[] = [
    {
      id: 'initial',
      type: 'initial',
      name: 'Initial Contact',
      message: "Hello {{name}}, I noticed Detroit's recent sustainability initiatives and analyzed the Coleman A. Young Municipal Building's energy profile. Our calculations show potential annual savings of $482,000 (18.5% reduction) through window optimization. Would you be interested in a brief discussion about these findings?",
      day: 0
    },
    {
      id: 'followup1',
      type: 'followup1',
      name: 'First Follow-up',
      message: "Hi {{name}}, following up on the Coleman Young Municipal energy analysis. The potential $482,000 annual savings represents significant budget relief for Detroit operations. Given your building's 780K sq ft and $2.6M current energy costs, when would be a good time to discuss these opportunities?",
      day: 3
    },
    {
      id: 'followup2',
      type: 'followup2',
      name: 'Second Follow-up',
      message: "Hello {{name}}, wanted to ensure you received our analysis of Coleman Young Municipal's energy optimization potential. With Detroit's focus on fiscal efficiency, the 18-month payback and $900K three-year savings might align well with municipal planning priorities.",
      day: 5
    },
    {
      id: 'final',
      type: 'final',
      name: 'Final Message',
      message: "Hi {{name}}, this is my final note regarding Coleman Young Municipal's energy efficiency opportunity. Our analysis showing $482,000 in annual savings remains available if you'd like to review it in the future for Detroit's infrastructure planning.",
      day: 7
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Set default template
      const defaultTemplate = templates.find(t => t.id === 'coleman_young_initial');
      if (defaultTemplate) {
        setEmailSubject(defaultTemplate.subject);
        setEmailBody(defaultTemplate.body);
      }
      
      // Set default selected contacts
      setSelectedContacts([contacts[0].name]);
      
      // Default scheduled date/time (tomorrow at 9am)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
      setScheduledTime('09:00');
    }, 1000);
  }, []);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
    }
  };

  const handleContactToggle = (name: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleSendEmails = () => {
    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact');
      return;
    }
    
    toast.success(`${selectedContacts.length} emails scheduled for ${scheduledDate} at ${scheduledTime}`);
    
    // Navigate to outreach tracking after a short delay
    setTimeout(() => {
      navigate('/outreach-tracking');
    }, 1500);
  };

  const handleContinueToOutreachTracking = () => {
    navigate('/outreach-tracking');
  };

  const personalize = (text: string, contact: any) => {
    return text
      .replace(/{{name}}/g, contact.name)
      .replace(/{{company}}/g, contact.company)
      .replace(/{{location}}/g, contact.location)
      .replace(/{{position}}/g, contact.position);
  };

  const showModal = (messageType: 'initial' | 'followup1' | 'followup2' | 'final') => {
    const message = whatsappFlow.find(m => m.type === messageType);
    if (message) {
      setSelectedMessage(message);
      const modal = document.getElementById('message-preview') as HTMLDialogElement;
      if (modal) modal.showModal();
    }
  };

  // Audio control functions
  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setAudioProgress((current / total) * 100);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioProgress(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-blue-500 relative"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Loading Email Automation</h2>
            <p className="text-white/60">Preparing your email templates and contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-1 py-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="bg-gradient-to-br from-blue-500 to-green-600 p-4 rounded-xl text-white shadow-lg">
                    <MdOutlineEmail size={24} />
                  </div>
          <h1 className="text-2xl font-bold text-white">Outreach</h1>
                </div>
                
        {/* Main Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-6 px-2">
          {/* Email Tab */}
          <button
            onClick={() => setActiveTab('email')}
            className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
              activeTab === 'email' ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <MdOutlineEmail size={24} />
                        </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Email Outreach</h2>
                <p className="text-white/60 text-sm">Personalized email campaigns</p>
                      </div>
                  </div>
                    </button>

          {/* LinkedIn Tab */}
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#0A66C2]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
              activeTab === 'linkedin' ? 'ring-2 ring-[#0A66C2]' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaLinkedin size={24} />
                    </div>
                    <div>
                <h2 className="text-lg font-semibold text-white">LinkedIn Outreach</h2>
                <p className="text-white/60 text-sm">Voice messages and connections</p>
                    </div>
                    </div>
          </button>

          {/* WhatsApp Tab */}
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#25D366]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
              activeTab === 'whatsapp' ? 'ring-2 ring-[#25D366]' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaWhatsapp size={24} />
                    </div>
                    <div>
                <h2 className="text-lg font-semibold text-white">WhatsApp Outreach</h2>
                <p className="text-white/60 text-sm">Direct messaging campaigns</p>
                    </div>
                      </div>
          </button>
                    </div>
                    
        {/* Tab Content */}
        <div className="space-y-6 px-2">
          {/* Email Content */}
          {activeTab === 'email' && (
            <>
              {/* Email Editor */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Editor */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-br from-blue-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                        <FaRegEdit size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Email Editor</h2>
                        <p className="text-white/60 text-sm">Craft your message</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Template Selection UI */}
                      <div className="bg-gradient-to-br from-[#1e222b]/80 to-[#1e222b]/50 rounded-lg border border-blue-500/10 p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-blue-500/20 p-2 rounded">
                            <FaRegLightbulb className="text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">AI-Recommended Templates</h3>
                            <p className="text-xs text-white/60">Our AI has analyzed performance metrics to suggest the most effective templates</p>
                          </div>
                          <div className="ml-auto bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                            <span className="text-xs text-blue-400 font-medium">Self-improving AI</span>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {/* Template Sequence 1 */}
                          <div className="space-y-2">
                            <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                              High-Conversion Sequence
                            </div>
                            
                            {templates
                              .filter(t => t.sequence === 'sequence_1')
                              .sort((a, b) => a.sequencePosition - b.sequencePosition)
                              .map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleTemplateChange(template.id)}
                                  className={`w-full flex items-center p-2 rounded text-left hover:bg-[#28292b]/60 transition-colors ${
                                    selectedTemplate === template.id ? 'bg-[#28292b]/80 border border-blue-500/30' : 'bg-[#28292b]/40'
                                  }`}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm text-white truncate">{template.name}</p>
                                    <p className="text-xs text-white/60 truncate">Open rate: <span className="text-blue-400">{template.ai_metrics.openRate}%</span></p>
                                  </div>
                                  <div className="text-xs bg-blue-500/20 px-2 py-1 rounded">
                                    <span className="text-blue-400 font-medium">{template.rating.toFixed(1)}%</span>
                                  </div>
                                </button>
                              ))}
                          </div>
                          
                          {/* Template Sequence 2 */}
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                              Value-Focused Sequence
                            </div>
                            
                            {templates
                              .filter(t => t.sequence === 'sequence_2')
                              .sort((a, b) => a.sequencePosition - b.sequencePosition)
                              .map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleTemplateChange(template.id)}
                                  className={`w-full flex items-center p-2 rounded text-left hover:bg-[#28292b]/60 transition-colors ${
                                    selectedTemplate === template.id ? 'bg-[#28292b]/80 border border-blue-500/30' : 'bg-[#28292b]/40'
                                  }`}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm text-white truncate">{template.name}</p>
                                    <p className="text-xs text-white/60 truncate">Open rate: <span className="text-blue-400">{template.ai_metrics.openRate}%</span></p>
                                  </div>
                                  <div className="text-xs bg-blue-500/20 px-2 py-1 rounded">
                                    <span className="text-blue-400 font-medium">{template.rating.toFixed(1)}%</span>
                                  </div>
                                </button>
                              ))}
                          </div>
                          
                          {/* Problem-Solution (Single) */}
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                              Problem-Solution Approach
                            </div>
                            
                            {templates
                              .filter(t => t.sequence === 'sequence_3')
                              .map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleTemplateChange(template.id)}
                                  className={`w-full flex items-center p-2 rounded text-left hover:bg-[#28292b]/60 transition-colors ${
                                    selectedTemplate === template.id ? 'bg-[#28292b]/80 border border-purple-500/30' : 'bg-[#28292b]/40'
                                  }`}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm text-white truncate">{template.name}</p>
                                    <p className="text-xs text-white/60 truncate">Open rate: <span className="text-purple-400">{template.ai_metrics.openRate}%</span></p>
                                  </div>
                                  <div className="text-xs bg-purple-500/20 px-2 py-1 rounded">
                                    <span className="text-purple-400 font-medium">{template.rating.toFixed(1)}%</span>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="text-xs text-white/60">
                            <span className="text-blue-400 font-medium">AI Insight:</span> Personalized subject lines have increased open rates by 37.8%
                          </div>
                          <button className="btn btn-xs bg-gradient-to-br from-[#28292b]/80 to-[#28292b]/60 text-white border border-blue-500/20">
                            View all templates
                          </button>
                        </div>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-white/80">Subject</span>
                          <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                            <FaRegLightbulb size={10} />
                            <span>+23% opens with personalization</span>
                          </span>
                        </label>
                        <input 
                          type="text" 
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="input w-full backdrop-blur-md bg-[#28292b]/60 border border-blue-500/20 text-white focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-white/80">Email Body</span>
                          <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                            <FaRegLightbulb size={10} />
                            <span>~120 words optimal</span>
                          </span>
                        </label>
                        <textarea 
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          className="textarea h-96 backdrop-blur-md bg-[#28292b]/60 border border-blue-500/20 text-white focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-sm bg-gradient-to-br from-[#28292b]/80 to-[#28292b]/60 hover:from-[#28292b]/90 hover:to-[#28292b]/70 text-white border border-blue-500/20 gap-2 shadow-lg hover:shadow-blue-500/10 transition-all">
                          <FaRegCopy size={16} />
                          Copy
                        </button>
                        <button className="btn btn-sm bg-gradient-to-br from-blue-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 gap-2 shadow-lg hover:shadow-blue-500/20 transition-all">
                          <FaRegSave size={16} />
                          Save as Template
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Email Preview */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-br from-blue-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                        <MdOutlineEmail size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Email Preview</h2>
                        <p className="text-white/60 text-sm">How recipients will see it</p>
                      </div>
                    </div>
                    
                    <div>
                      {selectedContacts.length > 0 ? (
                        <div className="backdrop-blur-md bg-[#28292b]/40 rounded-lg p-4 border border-blue-500/10">
                          <div className="mb-2 text-white/80 flex items-center gap-2">
                            <span className="font-medium">To:</span>
                            <div className="flex items-center gap-1">
                              <span className="bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 text-white">{contacts.find(c => c.name === selectedContacts[0])?.email}</span>
                              {selectedContacts.length > 1 && (
                                <span className="bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 text-white">+{selectedContacts.length - 1} more</span>
                              )}
                            </div>
                          </div>
                          <div className="mb-4 text-white/80">
                            <span className="font-medium">Subject:</span>
                            <div className="bg-blue-500/10 px-3 py-2 rounded mt-1 border border-blue-500/20 text-white">
                              {personalize(emailSubject, contacts.find(c => c.name === selectedContacts[0]))}
                            </div>
                          </div>
                          <div className="whitespace-pre-line border-t border-blue-500/20 pt-4 text-white">
                            {personalize(emailBody, contacts.find(c => c.name === selectedContacts[0]))}
                          </div>
                          
                          {/* AI Insights Panel */}
                          <div className="mt-6 pt-4 border-t border-blue-500/20">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="text-blue-500">
                                <FaRegLightbulb size={18} />
                              </div>
                              <h3 className="text-white text-sm font-medium">AI Message Analysis</h3>
                              <div className="ml-auto bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                                <span className="text-xs text-blue-400 font-medium">Continually learning</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-[#1e222b]/50 p-3 rounded-lg border border-blue-500/5">
                                <div className="text-xs text-white/60 mb-1">Readability Score</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-white font-medium">Excellent</div>
                                  <div className="text-blue-400 font-medium">92/100</div>
                                </div>
                                <div className="w-full h-1.5 bg-[#28292b] rounded-full mt-1 overflow-hidden">
                                  <div className="h-full w-[92%] bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
                                </div>
                              </div>
                              
                              <div className="bg-[#1e222b]/50 p-3 rounded-lg border border-blue-500/5">
                                <div className="text-xs text-white/60 mb-1">Predicted Open Rate</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-white font-medium">High</div>
                                  <div className="text-blue-400 font-medium">78.4%</div>
                                </div>
                                <div className="w-full h-1.5 bg-[#28292b] rounded-full mt-1 overflow-hidden">
                                  <div className="h-full w-[78.4%] bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
                                </div>
                              </div>
                              
                              <div className="bg-[#1e222b]/50 p-3 rounded-lg border border-blue-500/5">
                                <div className="text-xs text-white/60 mb-1">CTR Prediction</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-white font-medium">Above Average</div>
                                  <div className="text-blue-400 font-medium">42.1%</div>
                                </div>
                                <div className="w-full h-1.5 bg-[#28292b] rounded-full mt-1 overflow-hidden">
                                  <div className="h-full w-[42.1%] bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
                                </div>
                              </div>
                              
                              <div className="bg-[#1e222b]/50 p-3 rounded-lg border border-blue-500/5">
                                <div className="text-xs text-white/60 mb-1">Meeting Conversion</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-white font-medium">Outstanding</div>
                                  <div className="text-blue-400 font-medium">31.5%</div>
                                </div>
                                <div className="w-full h-1.5 bg-[#28292b] rounded-full mt-1 overflow-hidden">
                                  <div className="h-full w-[31.5%] bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-white/80">
                              <span className="text-blue-400 font-medium">AI Recommendation:</span> This message is optimized for Patricia Williams' profile as Facilities Operations Director at Coleman A. Young Municipal Building. The specific mention of Detroit's sustainability initiatives and municipal efficiency increases personal connection by 67%.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 backdrop-blur-md bg-[#28292b]/40 rounded-lg border border-blue-500/10">
                          <div className="text-blue-500 mb-4">
                            <MdOutlineEmail size={48} className="mx-auto" />
                          </div>
                          <p className="text-white/60">
                            Select a contact to preview the personalized email
                          </p>
                        </div>
                      )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Sequencing Visualization */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <RiFlowChart size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Email Sequencing</h2>
                <p className="text-white/60 text-sm">Automated follow-up flow based on recipient actions</p>
              </div>
              <div className="ml-auto">
                <button className="btn btn-sm bg-gradient-to-br from-[#28292b]/80 to-[#28292b]/60 hover:from-[#28292b]/90 hover:to-[#28292b]/70 text-white border border-blue-500/20 gap-2 shadow-lg hover:shadow-blue-500/10 transition-all">
                  <RiSplitCellsHorizontal size={16} />
                  Edit Sequence
                </button>
              </div>
            </div>
            
            <div className="mt-6 relative">
              {/* Flow diagram for email sequence */}
              <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                {/* Initial Email */}
                <div className="relative flex flex-col items-center w-40">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-blue-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="flex flex-col items-center gap-2">
                      <RiMailSendLine size={28} className="text-blue-400" />
                      <div className="text-white text-center font-medium">Initial Email</div>
                      <div className="text-xs text-white/60 text-center">Day 0</div>
                    </div>
                  </div>
                  <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-emerald-300 mt-2"></div>
                </div>
                
                {/* Conditional: Opened? */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-blue-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="text-white text-center text-sm font-medium">Opened?</div>
                  </div>
                  
                  {/* Yes/No paths */}
                  <div className="flex gap-10 mt-2">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-1 bg-blue-500"></div>
                      <div className="text-green-400 text-xs">Yes</div>
                      <div className="h-6 w-1 bg-blue-500"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-1 bg-red-500"></div>
                      <div className="text-red-400 text-xs">No</div>
                      <div className="h-6 w-1 bg-red-500"></div>
                    </div>
                  </div>
                </div>
                
                {/* Follow-up Email 1 */}
                <div className="relative flex flex-col items-center w-40">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-blue-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="flex flex-col items-center gap-2">
                      <RiMailCloseLine size={28} className="text-blue-400" />
                      <div className="text-white text-center font-medium">Follow-up Email 1</div>
                      <div className="text-xs text-white/60 text-center">Day 3</div>
                    </div>
                  </div>
                  <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-emerald-300 mt-2"></div>
                </div>
                
                {/* Conditional: Replied? */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-blue-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="text-white text-center text-sm font-medium">Replied?</div>
                  </div>
                  
                  {/* Yes/No paths */}
                  <div className="flex gap-10 mt-2">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-1 bg-blue-500"></div>
                      <div className="text-green-400 text-xs">Yes</div>
                      <div className="h-6 w-1 bg-blue-500"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-1 bg-red-500"></div>
                      <div className="text-red-400 text-xs">No</div>
                      <div className="h-6 w-1 bg-red-500"></div>
                    </div>
                  </div>
                </div>
                
                {/* Follow-up Email 2 */}
                <div className="relative flex flex-col items-center w-40">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-blue-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="flex flex-col items-center gap-2">
                      <RiMailCloseLine size={28} className="text-blue-400" />
                      <div className="text-white text-center font-medium">Follow-up Email 2</div>
                          <div className="text-xs text-white/60 text-center">Day 5</div>
                        </div>
                      </div>
                    </div>

                    {/* Final Message */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node hover:border-[#25D366]/40 cursor-pointer transition-all"
                           onClick={() => showModal('final')}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp size={28} className="text-[#25D366]" />
                          <div className="text-white text-center font-medium">Final Message</div>
                      <div className="text-xs text-white/60 text-center">Day 7</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom row outcomes */}
              <div className="mt-12 flex justify-center gap-12">
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-blue-500/20 relative group/node">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-green-300/5 to-green-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                  <div className="flex flex-col items-center gap-2">
                    <RiMailCheckLine size={24} className="text-green-400" />
                    <div className="text-white text-center font-medium">Move to Opportunities</div>
                  </div>
                </div>
                
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-blue-500/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                  <div className="flex flex-col items-center gap-2">
                    <RiMailCloseLine size={24} className="text-blue-400" />
                    <div className="text-white text-center font-medium">Final Email</div>
                    <div className="text-xs text-white/60 text-center">Day 14</div>
                  </div>
                </div>
              </div>
              
              {/* Visual connecting lines */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                  </marker>
                </defs>
              </svg>
              
              {/* Stats about the sequence */}
              <div className="mt-8 grid grid-cols-4 gap-4">
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                  <div className="text-sm text-blue-400 mb-1">Average Sequence Length</div>
                  <div className="text-lg text-white font-bold">9 days</div>
                </div>
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                  <div className="text-sm text-blue-400 mb-1">Response Rate</div>
                  <div className="text-lg text-white font-bold">30% by 2nd email</div>
                </div>
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                  <div className="text-sm text-blue-400 mb-1">Meeting Bookings</div>
                  <div className="text-lg text-white font-bold">15% conversion</div>
                </div>
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                  <div className="text-sm text-blue-400 mb-1">Complete Sequence</div>
                  <div className="text-lg text-white font-bold">40% of contacts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Database Section - Added for Email tab */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaDatabase className="text-lg text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Contact Database</h2>
                <p className="text-white/60 text-sm">Select your energy efficiency audience from 1,847 verified facility managers</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs text-blue-500 font-medium">AI Optimized</span>
                </div>
                <div className="bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                  <span className="text-xs text-orange-400 font-medium">42% avg. open rate</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="border-b border-blue-500/20">
                    <th className="w-10 bg-[#28292b]/80 text-white/80">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                    </th>
                    <th className="bg-[#28292b]/80 text-white/80">Name</th>
                    <th className="bg-[#28292b]/80 text-white/80">Email</th>
                    <th className="bg-[#28292b]/80 text-white/80">Company</th>
                    <th className="bg-[#28292b]/80 text-white/80">Position</th>
                    <th className="bg-[#28292b]/80 text-white/80 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[#28292b]/40 border-b border-blue-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked />
                    </td>
                    <td className="font-medium text-white">{contacts[0].name}</td>
                    <td className="text-white/80">{contacts[0].email}</td>
                    <td>{contacts[0].company}</td>
                    <td className="text-white/80">{contacts[0].position}</td>
                    <td className="text-right">
                      <span className="text-blue-400 text-sm">Opened previous email</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#28292b]/40 border-b border-blue-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                    </td>
                    <td className="font-medium text-white">{contacts[1].name}</td>
                    <td className="text-white/80">{contacts[1].email}</td>
                    <td>{contacts[1].company}</td>
                    <td className="text-white/80">{contacts[1].position}</td>
                    <td className="text-right">
                      <span className="text-blue-400 text-sm">New contact</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#28292b]/40 border-b border-blue-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked />
                    </td>
                    <td className="font-medium text-white">{contacts[2].name}</td>
                    <td className="text-white/80">{contacts[2].email}</td>
                    <td>{contacts[2].company}</td>
                    <td className="text-white/80">{contacts[2].position}</td>
                    <td className="text-right">
                      <span className="text-blue-400 text-sm">Opened previous email</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#28292b]/40 border-b border-blue-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                    </td>
                    <td className="font-medium text-white">{contacts[3].name}</td>
                    <td className="text-white/80">{contacts[3].email}</td>
                    <td>{contacts[3].company}</td>
                    <td className="text-white/80">{contacts[3].position}</td>
                    <td className="text-right">
                      <span className="text-yellow-400 text-sm">Clicked link</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#28292b]/40 border-b border-blue-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                    </td>
                    <td className="font-medium text-white">{contacts[4].name}</td>
                    <td className="text-white/80">{contacts[4].email}</td>
                    <td>{contacts[4].company}</td>
                    <td className="text-white/80">{contacts[4].position}</td>
                    <td className="text-right"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-white/60 text-sm">2 contacts selected from {contacts.length} total</div>
              <div className="flex gap-2">
                <div className="join">
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-blue-500/20">«</button>
                  <button className="join-item btn btn-sm bg-blue-500 text-white border-blue-500">1</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-blue-500/20">2</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-blue-500/20">3</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-blue-500/20">4</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-blue-500/20">5</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-blue-500/20">»</button>
                </div>
                <button className="btn btn-sm bg-gradient-to-br from-blue-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 gap-2 shadow-lg hover:shadow-blue-500/20 transition-all">
                  Import Contacts
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="text-blue-500">
                  <MdOutlineSettings className="text-xl animate-spin-slow" />
                </div>
                <div>
                  <p className="text-sm text-white/90">
                    <span className="font-medium text-blue-400">AI-powered facility insights:</span> Our intelligent system has analyzed your contacts and identified <span className="text-blue-400 font-medium">127 casino and hospitality properties</span> with high energy efficiency potential based on building age and current energy costs. These contacts have been prioritized based on their facility size and operational requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
            </>
          )}

          {/* LinkedIn Content */}
          {activeTab === 'linkedin' && (
            <>
              {/* LinkedIn Voice Message Section */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#0A66C2]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <FaLinkedin size={24} />
              </div>
              <div>
                    <h2 className="text-lg font-semibold text-white">LinkedIn Voice Message</h2>
                    <p className="text-white/60 text-sm">Personalized voice messages for higher engagement</p>
              </div>
            </div>
            
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Message Preview */}
                  <div className="backdrop-blur-md bg-[#28292b]/40 rounded-lg p-4 border border-[#0A66C2]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center">
                        <FaLinkedin size={20} className="text-white" />
                    </div>
                      <div>
                        <h3 className="text-white font-medium">Message Preview</h3>
                        <p className="text-white/60 text-sm">Personalized for each recipient</p>
                    </div>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg p-4 text-white/80 text-sm whitespace-pre-line">
                      {linkedInVoiceMessage.message}
                  </div>
              </div>
              
                  {/* Audio Simulation */}
                  <div className="backdrop-blur-md bg-[#28292b]/40 rounded-lg p-4 border border-[#0A66C2]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center">
                        <FaMicrophone size={20} className="text-white" />
                </div>
                      <div>
                        <h3 className="text-white font-medium">Voice Simulation</h3>
                        <p className="text-white/60 text-sm">Click to hear the message</p>
                      </div>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={toggleAudioPlayback}
                            className="w-12 h-12 rounded-full bg-[#0A66C2] hover:bg-[#0A66C2]/80 flex items-center justify-center transition-colors"
                          >
                            {isPlaying ? (
                              <FaPause size={20} className="text-white" />
                            ) : (
                              <FaPlay size={20} className="text-white ml-1" />
                            )}
                          </button>
                          <div className="text-white">Voice Message</div>
                        </div>
                        <div className="text-white/60 text-sm">
                          {duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '0:00 / 0:00'}
                        </div>
                      </div>
                      
                      {/* Audio Progress Bar */}
                      <div className="relative h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0A66C2] rounded-full transition-all duration-200"
                          style={{ width: `${audioProgress}%` }}
                        ></div>
                        {isPlaying && (
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Waveform Animation */}
                      {isPlaying && (
                        <div className="flex items-center justify-center gap-1 mt-3">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-[#0A66C2] rounded-full"
                              style={{
                                height: `${Math.random() * 20 + 5}px`,
                                animation: `pulse ${Math.random() * 0.5 + 0.5}s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* Hidden Audio Element */}
                      <audio
                        ref={audioRef}
                        src="/Voice_Note/Recording.m4a"
                        onTimeUpdate={handleAudioTimeUpdate}
                        onLoadedMetadata={handleAudioLoadedMetadata}
                        onEnded={handleAudioEnded}
                        preload="metadata"
                      />
                    </div>
            </div>
          </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                    <div className="text-sm text-[#0A66C2] mb-1">Voice Message Impact</div>
                    <div className="text-lg text-white font-bold">+45% engagement</div>
                  </div>
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                    <div className="text-sm text-[#0A66C2] mb-1">Response Rate</div>
                    <div className="text-lg text-white font-bold">32% reply rate</div>
                  </div>
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                    <div className="text-sm text-[#0A66C2] mb-1">Meeting Conversion</div>
                    <div className="text-lg text-white font-bold">18% to meeting</div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Follow-up Sequence */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#0A66C2]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <RiFlowChart size={24} />
              </div>
              <div>
                    <h2 className="text-lg font-semibold text-white">Voice Message Sequence</h2>
                    <p className="text-white/60 text-sm">Automated follow-up flow for voice messages</p>
              </div>
            </div>
            
                <div className="mt-6 relative">
                  <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                    {/* Initial Voice Message */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#0A66C2]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaMicrophone size={28} className="text-[#0A66C2]" />
                          <div className="text-white text-center font-medium">Initial Voice Message</div>
                          <div className="text-xs text-white/60 text-center">Day 0</div>
                </div>
                      </div>
                      <div className="h-8 w-1 bg-gradient-to-b from-[#0A66C2] to-[#0A66C2]/60 mt-2"></div>
              </div>
              
                    {/* Connection Status */}
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-[#0A66C2]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="text-white text-center text-sm font-medium">Connected?</div>
                      </div>
                      
                      <div className="flex gap-10 mt-2">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-[#0A66C2]"></div>
                          <div className="text-[#0A66C2] text-xs">Yes</div>
                          <div className="h-6 w-1 bg-[#0A66C2]"></div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-red-500"></div>
                          <div className="text-red-400 text-xs">No</div>
                          <div className="h-6 w-1 bg-red-500"></div>
                        </div>
                </div>
              </div>
              
                    {/* Follow-up Message */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#0A66C2]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaMicrophone size={28} className="text-[#0A66C2]" />
                          <div className="text-white text-center font-medium">Follow-up Message</div>
                          <div className="text-xs text-white/60 text-center">Day 3</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row outcomes */}
                  <div className="mt-12 flex justify-center gap-12">
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#0A66C2]/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                      <div className="flex flex-col items-center gap-2">
                        <FaLinkedin size={24} className="text-[#0A66C2]" />
                        <div className="text-white text-center font-medium">Schedule Meeting</div>
                      </div>
                    </div>
                    
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#0A66C2]/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                      <div className="flex flex-col items-center gap-2">
                        <FaMicrophone size={24} className="text-[#0A66C2]" />
                        <div className="text-white text-center font-medium">Final Voice Message</div>
                        <div className="text-xs text-white/60 text-center">Day 7</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats about the sequence */}
                  <div className="mt-8 grid grid-cols-4 gap-4">
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                      <div className="text-sm text-[#0A66C2] mb-1">Average Response Time</div>
                      <div className="text-lg text-white font-bold">2.5 days</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                      <div className="text-sm text-[#0A66C2] mb-1">Connection Rate</div>
                      <div className="text-lg text-white font-bold">45% accept</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                      <div className="text-sm text-[#0A66C2] mb-1">Meeting Rate</div>
                      <div className="text-lg text-white font-bold">18% book</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                      <div className="text-sm text-[#0A66C2] mb-1">Sequence Complete</div>
                      <div className="text-lg text-white font-bold">35% full flow</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Contact Database Section */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#0A66C2]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 mt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <FaDatabase className="text-lg text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">LinkedIn Connections</h2>
                    <p className="text-white/60 text-sm">Professional contacts for voice message outreach</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="bg-[#0A66C2]/20 px-3 py-1 rounded-full border border-[#0A66C2]/30 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#0A66C2] animate-pulse"></div>
                      <span className="text-xs text-[#0A66C2] font-medium">Connection Required</span>
                    </div>
                    <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                      <span className="text-xs text-blue-400 font-medium">65% connection rate</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="border-b border-[#0A66C2]/20">
                        <th className="w-10 bg-[#28292b]/80 text-white/80">
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" />
                        </th>
                        <th className="bg-[#28292b]/80 text-white/80">Name</th>
                        <th className="bg-[#28292b]/80 text-white/80">Company</th>
                        <th className="bg-[#28292b]/80 text-white/80">Position</th>
                        <th className="bg-[#28292b]/80 text-white/80">Location</th>
                        <th className="bg-[#28292b]/80 text-white/80 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" checked />
                        </td>
                        <td className="font-medium text-white">{contacts[0].name}</td>
                        <td className="text-white/80">{contacts[0].company}</td>
                        <td className="text-white/80">{contacts[0].position}</td>
                        <td>{contacts[0].location}</td>
                        <td className="text-right">
                          <span className="text-[#0A66C2] text-sm">Connected</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" />
                        </td>
                        <td className="font-medium text-white">{contacts[1].name}</td>
                        <td className="text-white/80">{contacts[1].company}</td>
                        <td className="text-white/80">{contacts[1].position}</td>
                        <td>{contacts[1].location}</td>
                        <td className="text-right">
                          <span className="text-blue-400 text-sm">Connection pending</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" checked />
                        </td>
                        <td className="font-medium text-white">{contacts[2]?.name || "Contact 3"}</td>
                        <td className="text-white/80">{contacts[2]?.company || "Company 3"}</td>
                        <td className="text-white/80">{contacts[2]?.position || "Position 3"}</td>
                        <td>{contacts[2]?.location || "Location 3"}</td>
                        <td className="text-right">
                          <span className="text-[#0A66C2] text-sm">Connected</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" />
                        </td>
                        <td className="font-medium text-white">{contacts[3]?.name || "Contact 4"}</td>
                        <td className="text-white/80">{contacts[3]?.company || "Company 4"}</td>
                        <td className="text-white/80">{contacts[3]?.position || "Position 4"}</td>
                        <td>{contacts[3]?.location || "Location 4"}</td>
                        <td className="text-right">
                          <span className="text-yellow-400 text-sm">Viewed profile</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" />
                        </td>
                        <td className="font-medium text-white">{contacts[4]?.name || "Contact 5"}</td>
                        <td className="text-white/80">{contacts[4]?.company || "Company 5"}</td>
                        <td className="text-white/80">{contacts[4]?.position || "Position 5"}</td>
                        <td>{contacts[4]?.location || "Location 5"}</td>
                        <td className="text-right">
                          <span className="text-red-400 text-sm">Not connected</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-white/60 text-sm">2 contacts selected from {contacts.length} total</div>
                  <div className="flex gap-2">
                    <div className="join">
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">«</button>
                      <button className="join-item btn btn-sm bg-[#0A66C2] text-white border-[#0A66C2]">1</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">2</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">3</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">4</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">5</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">»</button>
                    </div>
                    <button className="btn btn-sm bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 hover:from-[#0A66C2]/90 hover:to-[#0A66C2]/70 text-white border-0 gap-2 shadow-lg hover:shadow-[#0A66C2]/20 transition-all">
                      Import Connections
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-[#0A66C2]">
                      <MdOutlineSettings className="text-xl animate-spin-slow" />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">
                        <span className="font-medium text-[#0A66C2]">Connection requirement:</span> LinkedIn voice messages can only be sent to users who have accepted your connection request. Our system will automatically filter your selected contacts based on connection status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* WhatsApp Content */}
          {activeTab === 'whatsapp' && (
            <>
              {/* WhatsApp Message Flow */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#25D366]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <RiFlowChart size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">WhatsApp Message Flow</h2>
                    <p className="text-white/60 text-sm">Automated follow-up sequence for connected contacts</p>
                  </div>
                  <div className="ml-auto bg-[#25D366]/20 px-3 py-1 rounded-full border border-[#25D366]/30 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
                    <span className="text-xs text-[#25D366] font-medium">Previous contact required</span>
                  </div>
                </div>

                <div className="p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg mb-6">
                  <div className="flex items-center gap-2">
                    <div className="text-[#25D366]">
                      <FaWhatsapp size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">
                        <span className="font-medium text-[#25D366]">Important:</span> WhatsApp business messages can only be sent to contacts who have previously connected with your organization. This ensures compliance with WhatsApp's business messaging policies and maintains high engagement rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 relative">
                  {/* Flow diagram for WhatsApp sequence - keep this section */}
                  <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                    {/* Initial Contact */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node hover:border-[#25D366]/40 cursor-pointer transition-all"
                           onClick={() => showModal('initial')}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp size={28} className="text-[#25D366]" />
                          <div className="text-white text-center font-medium">Initial Contact</div>
                          <div className="text-xs text-white/60 text-center">Day 0</div>
                        </div>
                      </div>
                      <div className="h-8 w-1 bg-gradient-to-b from-[#25D366] to-[#128C7E] mt-2"></div>
                    </div>

                    {/* Response Check */}
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-[#25D366]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="text-white text-center text-sm font-medium">Responded?</div>
                      </div>

                      {/* Yes/No paths */}
                      <div className="flex gap-10 mt-2">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-[#25D366]"></div>
                          <div className="text-[#25D366] text-xs">Yes</div>
                          <div className="h-6 w-1 bg-[#25D366]"></div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-red-500"></div>
                          <div className="text-red-400 text-xs">No</div>
                          <div className="h-6 w-1 bg-red-500"></div>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up 1 */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node hover:border-[#25D366]/40 cursor-pointer transition-all"
                           onClick={() => showModal('followup1')}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp size={28} className="text-[#25D366]" />
                          <div className="text-white text-center font-medium">Follow-up 1</div>
                          <div className="text-xs text-white/60 text-center">Day 3</div>
                        </div>
                      </div>
                      <div className="h-8 w-1 bg-gradient-to-b from-[#25D366] to-[#128C7E] mt-2"></div>
                    </div>

                    {/* Interest Check */}
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-[#25D366]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="text-white text-center text-sm font-medium">Interested?</div>
                      </div>

                      {/* Yes/No paths */}
                      <div className="flex gap-10 mt-2">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-[#25D366]"></div>
                          <div className="text-[#25D366] text-xs">Yes</div>
                          <div className="h-6 w-1 bg-[#25D366]"></div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-red-500"></div>
                          <div className="text-red-400 text-xs">No</div>
                          <div className="h-6 w-1 bg-red-500"></div>
                        </div>
                      </div>
                    </div>

                    {/* Final Follow-up */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node hover:border-[#25D366]/40 cursor-pointer transition-all"
                           onClick={() => showModal('final')}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp size={28} className="text-[#25D366]" />
                          <div className="text-white text-center font-medium">Final Message</div>
                          <div className="text-xs text-white/60 text-center">Day 7</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row outcomes */}
                  <div className="mt-12 flex justify-center gap-12">
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                      <div className="flex flex-col items-center gap-2">
                        <FaWhatsapp size={24} className="text-[#25D366]" />
                        <div className="text-white text-center font-medium">Schedule Meeting</div>
                      </div>
                    </div>

                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                      <div className="flex flex-col items-center gap-2">
                        <FaWhatsapp size={24} className="text-[#25D366]" />
                        <div className="text-white text-center font-medium">Archive Contact</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Preview Modal */}
              <dialog id="message-preview" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-[#1e222b] border border-[#25D366]/15">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                      <FaWhatsapp size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Message Preview</h3>
                      <p className="text-sm text-white/60">Personalized for {contacts[0]?.name || "Contact"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
                        <FaWhatsapp size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">{contacts[0]?.name || "Contact"}</div>
                        <div className="text-white/80">
                          {selectedMessage?.message?.replace('[name]', contacts[0]?.name || "Contact").replace('[company]', contacts[0]?.company || "Company") || "Message not available"}
                        </div>
                        <div className="text-xs text-white/40 mt-2">12:45 PM</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="btn btn-sm bg-[#1e222b] text-white border border-[#25D366]/20">Close</button>
                    <button className="btn btn-sm bg-[#25D366] hover:bg-[#128C7E] text-white border-0">
                      Send Message
                    </button>
                  </div>
                </div>
              </dialog>

              {/* WhatsApp Contacts Database Section - ADDING NEW SECTION */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#25D366]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 mt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <FaDatabase className="text-lg text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">WhatsApp Contacts</h2>
                    <p className="text-white/60 text-sm">Contacts who have previously connected with your organization</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="bg-[#25D366]/20 px-3 py-1 rounded-full border border-[#25D366]/30 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
                      <span className="text-xs text-[#25D366] font-medium">Pre-qualified Contacts</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="border-b border-[#25D366]/20">
                        <th className="w-10 bg-[#28292b]/80 text-white/80">
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                        </th>
                        <th className="bg-[#28292b]/80 text-white/80">Name</th>
                        <th className="bg-[#28292b]/80 text-white/80">Phone</th>
                        <th className="bg-[#28292b]/80 text-white/80">Company</th>
                        <th className="bg-[#28292b]/80 text-white/80">Position</th>
                        <th className="bg-[#28292b]/80 text-white/80 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked />
                        </td>
                        <td className="font-medium text-white">{contacts[0].name}</td>
                        <td className="text-white/80">{contacts[0].phone}</td>
                        <td>{contacts[0].company}</td>
                        <td className="text-white/80">{contacts[0].position}</td>
                        <td className="text-right">
                          <span className="text-[#25D366] text-sm">Previously contacted</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                        </td>
                        <td className="font-medium text-white">{contacts[3]?.name || "Contact 4"}</td>
                        <td className="text-white/80">{contacts[3]?.phone || "+1 (000) 000-0004"}</td>
                        <td>{contacts[3]?.company || "Company 4"}</td>
                        <td className="text-white/80">{contacts[3]?.position || "Position 4"}</td>
                        <td className="text-right">
                          <span className="text-[#25D366] text-sm">Previously contacted</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked />
                        </td>
                        <td className="font-medium text-white">{contacts[4]?.name || "Contact 5"}</td>
                        <td className="text-white/80">{contacts[4]?.phone || "+1 (000) 000-0005"}</td>
                        <td>{contacts[4]?.company || "Company 5"}</td>
                        <td className="text-white/80">{contacts[4]?.position || "Position 5"}</td>
                        <td className="text-right">
                          <span className="text-green-400 text-sm">Responded to email</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                        </td>
                        <td className="font-medium text-white">{contacts[1]?.name || "Contact 2"}</td>
                        <td className="text-white/80">{contacts[1]?.phone || "+1 (000) 000-0002"}</td>
                        <td>{contacts[1]?.company || "Company 2"}</td>
                        <td className="text-white/80">{contacts[1]?.position || "Position 2"}</td>
                        <td className="text-right">
                          <span className="text-yellow-400 text-sm">Scheduled meeting</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" disabled />
                        </td>
                        <td className="font-medium text-white opacity-50">{contacts[2]?.name || "Contact 3"}</td>
                        <td className="text-white/80 opacity-50">{contacts[2]?.phone || "+1 (000) 000-0003"}</td>
                        <td className="opacity-50">{contacts[2]?.company || "Company 3"}</td>
                        <td className="text-white/80 opacity-50">{contacts[2]?.position || "Position 3"}</td>
                        <td className="text-right">
                          <span className="text-red-400 text-sm">No prior contact</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-white/60 text-sm">2 contacts selected from {contacts.length} total</div>
                  <div className="flex gap-2">
                    <div className="join">
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">«</button>
                      <button className="join-item btn btn-sm bg-[#25D366] text-white border-[#25D366]">1</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">2</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">3</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">4</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">5</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">»</button>
                    </div>
                    <button className="btn btn-sm bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#25D366]/90 hover:to-[#128C7E]/70 text-white border-0 gap-2 shadow-lg hover:shadow-[#25D366]/20 transition-all">
                      Sync WhatsApp
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-[#25D366]">
                      <MdOutlineRule className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">
                        <span className="font-medium text-[#25D366]">WhatsApp Business Policy:</span> Messages can only be sent to contacts who have previously interacted with your business. Contacts without prior interaction are automatically filtered out to maintain compliance with WhatsApp's business messaging guidelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailAutomation; 
