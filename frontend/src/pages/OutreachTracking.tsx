import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdOutlineEmail, 
  MdPhone, 
  MdCheck, 
  MdClose, 
  MdOutlineSchedule, 
  MdOutlineCalendarToday, 
  MdNotes, 
  MdOutlineInsights, 
  MdOutlineBarChart, 
  MdOutlinePieChart, 
  MdOutlineShowChart,
  MdOutlineTrackChanges,
  MdOutlineQueryStats,
  MdOutlineMoreVert,
  MdOutlineTrendingUp,
  MdOutlineAttachMoney,
  MdOutlineGroups,
  MdOutlineSpeed,
  MdOutlineTimeline,
  MdOutlineAnalytics,
  MdOutlineAssessment,
  MdOutlineDataUsage,
  MdOutlineTrendingDown,
  MdOutlineTrendingFlat,
  MdExpandMore,
  MdExpandLess,
  MdOutlineMailOutline,
  MdOutlineOpenInNew,
  MdOutlineMouse,
  MdOutlineReply,
  MdFilterList,
  MdSort,
  MdChevronLeft,
  MdChevronRight,
  MdSend,
  MdOutlineChat,
  MdOutlinePerson,
  MdOutlineBusiness,
  MdOutlineLocationOn,
  MdOutlineWork,
  MdOutlineAccessTime,
  MdOutlineTag,
  MdOutlineStar,
  MdOutlineSearch,
  MdOutlineFilterList,
  MdOutlinePersonAdd,
  MdOutlineLightbulb
} from 'react-icons/md';
import { FaRegEdit, FaRegTrashAlt, FaRegClock, FaRegCheckCircle, FaRegTimesCircle, FaRegLightbulb, FaRegChartBar, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line, 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Add HTMLDialogElement to the global Window interface
declare global {
  interface HTMLElementTagNameMap {
    'dialog': HTMLDialogElement;
  }
}

interface EmailStatus {
  drafted: boolean;
  sent: boolean;
  scheduled: boolean;
  scheduledDate?: Date;
}

interface Facility {
  id: number;
  name: string;
  industry: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  buildingData: {
    size: number; // sq ft
    built: number; // year
    employees: number;
    currentEnergyCost: number; // annual
    annualkWh: number;
    costPerkWh: number;
  };
  emailStatus: EmailStatus;
  outreachStatus: {
    opened: boolean;
    openedAt?: Date;
    replied: boolean;
    repliedAt?: Date;
    interested: boolean | null;
    followUpScheduled: boolean;
    followUpDate?: Date;
    notes: string;
  };
  energyPotential: {
    annualSavings: number;
    paybackPeriod: number;
    totalSavings: number;
    efficiency: number;
    installationCost: number;
  };
}

type ChannelType = 'email' | 'linkedin' | 'whatsapp';

// Define a class for glassmorphic panels using CSS classes
const glassPanelClass = "backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/10 p-6 mb-8 hover:border-blue-500/20 transition-all duration-300";

// For the metric cards we need additional styling
const metricCardClass = "backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/10 p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10";

const OutreachTracking = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [outreachData, setOutreachData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<ChannelType>('email');
  const [showContacts, setShowContacts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(28);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalContacts, setTotalContacts] = useState(12347);
  const [selectedColumns, setSelectedColumns] = useState(['name', 'email', 'company', 'position', 'location', 'status', 'lastContact']);
  const [timeRange, setTimeRange] = useState('30d'); // '7d', '30d', '90d', '1y'
  const [selectedMetric, setSelectedMetric] = useState('engagement'); // 'engagement', 'conversion', 'revenue'
  const [showAiInsight, setShowAiInsight] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showContactsList, setShowContactsList] = useState(false);

  // Sample data for charts
  const engagementData = [
    { date: '2024-01', email: 165, linkedin: 145, whatsapp: 155 },
    { date: '2024-02', email: 175, linkedin: 160, whatsapp: 180 },
    { date: '2024-03', email: 185, linkedin: 190, whatsapp: 210 },
    { date: '2024-04', email: 210, linkedin: 225, whatsapp: 245 },
    { date: '2024-05', email: 250, linkedin: 265, whatsapp: 295 },
    { date: '2024-06', email: 295, linkedin: 320, whatsapp: 360 },
  ];

  const conversionData = [
    { date: '2024-01', email: 28, linkedin: 22, whatsapp: 32 },
    { date: '2024-02', email: 35, linkedin: 30, whatsapp: 38 },
    { date: '2024-03', email: 42, linkedin: 39, whatsapp: 47 },
    { date: '2024-04', email: 51, linkedin: 49, whatsapp: 56 },
    { date: '2024-05', email: 63, linkedin: 58, whatsapp: 68 },
    { date: '2024-06', email: 78, linkedin: 72, whatsapp: 85 },
  ];

  const revenueData = [
    { date: '2024-01', email: 750000, linkedin: 680000, whatsapp: 820000 },
    { date: '2024-02', email: 890000, linkedin: 820000, whatsapp: 950000 },
    { date: '2024-03', email: 1050000, linkedin: 980000, whatsapp: 1200000 },
    { date: '2024-04', email: 1280000, linkedin: 1150000, whatsapp: 1420000 },
    { date: '2024-05', email: 1650000, linkedin: 1430000, whatsapp: 1750000 },
    { date: '2024-06', email: 2150000, linkedin: 1850000, whatsapp: 2300000 },
  ];

  const dealSizeData = [
    { name: 'Small (<$50k)', value: 35 },
    { name: 'Medium ($50k-$200k)', value: 45 },
    { name: 'Large ($200k-$500k)', value: 15 },
    { name: 'Enterprise (>$500k)', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Extended sample data for contacts to make it look more like a big database
  const expandedContacts = [
    { 
      id: 1, 
      name: "Patricia Williams", 
      email: "p.williams@detroitmi.gov", 
      company: "Coleman A. Young Municipal Building", 
      location: "Detroit, MI", 
      position: "Facilities Operations Director", 
      status: "Engaged", 
      lastContact: "2023-12-15", 
      tags: ["Municipal", "Decision Maker"], 
      leadScore: 91, 
      outreachHistory: [
        { id: 1, date: "2023-12-15", type: "email", subject: "Coleman Young Municipal energy efficiency opportunity", status: "sent", response: "interested", notes: "Requested detailed analysis for city budget planning" },
        { id: 2, date: "2023-12-10", type: "email", subject: "Detroit sustainability initiatives analysis", status: "sent", response: "positive", notes: "Mentioned upcoming infrastructure budget discussions" }
      ],
      buildingMetrics: {
        size: 780000,
        currentCost: 2600000,
        projectedSavings: 482000,
        paybackPeriod: 18
      }
    },
    { 
      id: 2, 
      name: "Marcus Johnson", 
      email: "m.johnson@detroitmi.gov", 
      company: "Coleman A. Young Municipal Building", 
      location: "Detroit, MI", 
      position: "Energy Management Coordinator", 
      status: "New", 
      lastContact: "2023-12-12", 
      tags: ["Energy Management", "Technical"], 
      leadScore: 78, 
      outreachHistory: [
        { id: 1, date: "2023-12-12", type: "email", subject: "Energy optimization analysis", status: "sent", response: "none", notes: "" }
      ],
      buildingMetrics: {
        size: 780000,
        currentCost: 2600000,
        projectedSavings: 482000,
        paybackPeriod: 18
      }
    },
    { 
      id: 3, 
      name: "Jennifer Rodriguez", 
      email: "j.rodriguez@detroitmi.gov", 
      company: "Detroit General Services Department", 
      location: "Detroit, MI", 
      position: "Building Operations Manager", 
      status: "Engaged", 
      lastContact: "2023-12-18", 
      tags: ["Operations", "Prospect"], 
      leadScore: 84, 
      outreachHistory: [
        { id: 1, date: "2023-12-18", type: "email", subject: "Municipal building efficiency opportunities", status: "sent", response: "positive", notes: "Interested in case studies from other cities" },
        { id: 2, date: "2023-12-13", type: "call", subject: "Initial Discussion", status: "completed", response: "interested", notes: "Discussed Detroit's infrastructure modernization goals" }
      ],
      buildingMetrics: {
        size: 780000,
        currentCost: 2600000,
        projectedSavings: 482000,
        paybackPeriod: 18
      }
    }
  ]; 

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setOutreachData(expandedContacts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'completed':
        return 'bg-blue-500/20 text-[#2a64f5] border border-blue-500/20';
      case 'scheduled':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'interested':
      case 'positive':
        return 'text-blue-500';
      case 'not_interested':
        return 'text-red-500';
      case 'neutral':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'interested':
      case 'positive':
        return <FaRegCheckCircle className="text-success" />;
      case 'not_interested':
        return <FaRegTimesCircle className="text-error" />;
      case 'neutral':
        return <FaRegClock className="text-warning" />;
      case 'none':
      case 'pending':
      default:
        return <FaRegClock className="text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <MdOutlineEmail className="text-primary" />;
      case 'call':
        return <MdPhone className="text-primary" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddNote = () => {
    if (!selectedContact || !newNote.trim()) {
      return;
    }

    // In a real app, you would make an API call here
    toast.success('Note added successfully');
    setNewNote('');
    setShowNoteModal(false);
  };

  const handleScheduleFollowUp = (contact: any) => {
    // In a real app, you would navigate to the email composer or show a scheduling modal
    toast.success(`Follow-up scheduled for ${contact.name}`);
  };

  // Generate additional contact data for demo purposes
  const generateAdditionalContacts = () => {
    return expandedContacts.map(contact => ({
      ...contact
    }));
  };

  const displayContacts = generateAdditionalContacts();

  // Display channel-specific metrics based on active tab
  const getActiveChannelMetrics = () => {
    switch (activeTab) {
      case 'email':
        return { 
          metrics: {
            sent: 8456,
            opened: 3782,
            clicked: 1893,
            responded: 872,
            meetings: 143
          }
        };
      case 'linkedin':
        return {
          metrics: {
            connections: 1245,
            messages: 867,
            responses: 392,
            meetings: 87
          }
        };
      case 'whatsapp':
        return {
          metrics: {
            sent: 1893,
            delivered: 1876,
            read: 1654,
            replied: 845,
            meetings: 67
          }
        };
      default:
        return {
          metrics: {
            sent: 8456,
            opened: 3782,
            clicked: 1893,
            responded: 872,
            meetings: 143
          }
        };
    }
  };

  // Get the appropriate icon for each channel
  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'email':
        return <MdOutlineEmail className="text-xl" />;
      case 'linkedin':
        return <FaLinkedin size={24} />;
      case 'whatsapp':
        return <FaWhatsapp size={24} />;
      default:
        return <MdOutlineEmail className="text-xl" />;
    }
  };

  // Get the channel name with proper formatting
  const getChannelName = (channel: ChannelType) => {
    switch (channel) {
      case 'email':
        return 'Email';
      case 'linkedin':
        return 'LinkedIn';
      case 'whatsapp':
        return 'WhatsApp';
      default:
        return 'Email';
    }
  };

  // Channel-specific data with updated metrics for Coleman Young Municipal
  const emailMetrics = {
    delivery: {
      sent: 1247,
      delivered: 1232,
      spamRate: 1.2,
      deliverability: 98.8,
    },
    engagement: {
      opens: 842,
      openRate: 68.3,
      clicks: 387,
      clickRate: 31.4,
      uniqueOpens: 721,
      uniqueOpenRate: 58.5,
    },
    responses: {
      total: 156,
      responseRate: 12.5,
      positive: 89,
      positiveRate: 7.1,
      negative: 23,
      negativeRate: 1.8,
      neutral: 44,
      neutralRate: 3.5,
    },
    aiOptimization: {
      autoReplyRate: 423,
      avgResponseTime: 22, // seconds
      optimizedTemplates: 12,
      personalizationScore: 92,
    },
    timing: {
      bestDay: 'Tuesday',
      bestHour: '09:30',
      worstDay: 'Friday',
      worstHour: '16:00',
    }
  };

  const linkedinMetrics = {
    connections: {
      total: 3247,
      new: 284,
      pending: 67,
      accepted: 2891,
      acceptRate: 75.2,
    },
    engagement: {
      profileViews: 8934,
      postEngagement: 3456,
      messageOpens: 2847,
      messageOpenRate: 87.3,
      contentInteractions: 4782,
    },
    responses: {
      total: 1247,
      responseRate: 43.8,
      positive: 798,
      positiveRate: 28.0,
      negative: 189,
      negativeRate: 6.6,
      neutral: 260,
      neutralRate: 9.1,
    },
    aiOptimization: {
      connectionQuality: 94,
      messageOptimization: 89,
      contentRecommendations: 18,
      engagementPredictions: 91,
    },
    content: {
      postsCreated: 47,
      articlesShared: 28,
      commentsReceived: 1247,
      sharesGenerated: 456,
    }
  };

  const whatsappMetrics = {
    delivery: {
      sent: 567,
      delivered: 559,
      deliveredRate: 98.6,
      failed: 8,
      failedRate: 1.4,
    },
    engagement: {
      read: 487,
      readRate: 87.1,
      replied: 234,
      replyRate: 48.1,
      forwarded: 89,
      forwardedRate: 18.3,
    },
    responses: {
      total: 234,
      responseRate: 48.1,
      positive: 156,
      positiveRate: 32.0,
      negative: 34,
      negativeRate: 7.0,
      neutral: 44,
      neutralRate: 9.0,
    },
    aiOptimization: {
      responseTime: 15, // seconds
      autoReplyRate: 287,
      contextUnderstanding: 95,
      sentimentAnalysis: 93,
    },
    timing: {
      bestDay: 'Wednesday',
      bestHour: '10:00',
      worstDay: 'Sunday',
      worstHour: '20:00',
    }
  };

  // AI Insights for each channel with Coleman Young Municipal focus
  const aiInsights = {
    email: [
      {
        type: 'optimization',
        title: 'Municipal Building Response Patterns',
        description: '423% higher reply rate when mentioning specific city budget cycles and infrastructure priorities. AI has learned optimal timing for municipal decision-makers.',
        impact: 'high',
        metric: 'response_rate',
        change: '+423%',
        icon: <MdOutlineSpeed className="text-blue-500" />,
        learnings: 'AI discovered that municipal contacts respond 4x better when emails reference specific city planning cycles and budget considerations.'
      },
      {
        type: 'pattern',
        title: 'Government Decision Timeline Analysis',
        description: 'Emails sent on Tuesday mornings at 9:30 AM show 67% higher open rates for municipal contacts. AI optimized timing for government work schedules.',
        impact: 'high',
        metric: 'open_rate',
        change: '+67%',
        icon: <MdOutlineTrendingUp className="text-blue-500" />,
        learnings: 'Neural system identified that government employees check emails most actively during early morning hours after weekly planning meetings.'
      },
      {
        type: 'timing',
        title: 'Municipal Budget Cycle Optimization',
        description: 'AI identified budget planning periods for Detroit city departments, increasing engagement by 58% during key decision windows.',
        impact: 'medium',
        metric: 'engagement',
        change: '+58%',
        icon: <MdOutlineAccessTime className="text-blue-500" />,
        learnings: 'AI learned to recognize municipal budget cycles and time outreach for maximum decision-maker availability.'
      }
    ],
    linkedin: [
      {
        type: 'optimization',
        title: 'Government Professional Network Mapping',
        description: 'AI autonomously identified 284 high-value municipal connections based on decision-making authority and infrastructure responsibilities.',
        impact: 'high',
        metric: 'connection_quality',
        change: '+94%',
        icon: <MdOutlineGroups className="text-blue-500" />,
        learnings: 'System learned to distinguish between administrative and decision-making roles in municipal organizations.'
      },
      {
        type: 'content',
        title: 'Municipal Case Study Engagement',
        description: 'Posts about government building energy retrofits generate 3.2x more engagement. AI continuously optimizes content for municipal audiences.',
        impact: 'high',
        metric: 'engagement',
        change: '+320%',
        icon: <MdOutlineTrendingUp className="text-blue-500" />,
        learnings: 'AI discovered that municipal professionals engage most with peer success stories and budget impact data.'
      },
      {
        type: 'timing',
        title: 'Government Work Schedule Adaptation',
        description: 'AI-optimized posting schedule for municipal professionals yields 75% higher response rates during business hours.',
        impact: 'high',
        metric: 'response_rate',
        change: '+75%',
        icon: <MdOutlineAccessTime className="text-blue-500" />,
        learnings: 'Neural analysis revealed optimal engagement windows for government employees with standard business hour schedules.'
      }
    ],
    whatsapp: [
      {
        type: 'optimization',
        title: 'Municipal Contact Compliance',
        description: '287% higher engagement with compliant municipal messaging delivered within 15 seconds.',
        impact: 'high',
        metric: 'engagement',
        change: '+287%',
        icon: <MdOutlineSpeed className="text-blue-500" />,
        learnings: 'AI learned proper communication protocols for government contacts while maintaining high engagement rates.'
      },
      {
        type: 'pattern',
        title: 'Government Communication Optimization',
        description: 'Messages referencing fiscal responsibility and public benefit show 156% higher response rates. AI adapts messaging for public sector values.',
        impact: 'high',
        metric: 'response_rate',
        change: '+156%',
        icon: <MdOutlineTrendingUp className="text-blue-500" />,
        learnings: 'System learned to emphasize public benefit and fiscal responsibility in government communications.'
      },
      {
        type: 'timing',
        title: 'Municipal Work Hour Optimization',
        description: 'AI detected government employee availability patterns, increasing read rates by 87% during optimal contact windows.',
        impact: 'high',
        metric: 'read_rate',
        change: '+87%',
        icon: <MdOutlineAccessTime className="text-blue-500" />,
        learnings: 'Neural network identified consistent municipal work patterns and optimized message timing accordingly.'
      }
    ]
  };

  // Example data for Email with municipal building focus
  const emailChartData = [
    { month: 'Jan', contacted: 45, opened: 31, replied: 12, positive: 8 },
    { month: 'Feb', contacted: 58, opened: 42, replied: 18, positive: 13 },
    { month: 'Mar', contacted: 72, opened: 53, replied: 24, positive: 17 },
    { month: 'Apr', contacted: 89, opened: 67, replied: 32, positive: 23 },
    { month: 'May', contacted: 107, opened: 81, replied: 41, positive: 29 },
    { month: 'Jun', contacted: 128, opened: 98, replied: 52, positive: 37 },
    { month: 'Jul', contacted: 152, opened: 118, replied: 64, positive: 46 },
    { month: 'Aug', contacted: 178, opened: 141, replied: 78, positive: 56 },
    { month: 'Sep', contacted: 206, opened: 167, replied: 94, positive: 67 },
    { month: 'Oct', contacted: 234, opened: 192, replied: 112, positive: 81 },
    { month: 'Nov', contacted: 267, opened: 219, replied: 134, positive: 97 },
    { month: 'Dec', contacted: 298, opened: 247, replied: 156, positive: 115 },
  ];

  // Example spike explanations with municipal focus
  const emailSpikes = {
    4: 'AI detected Detroit municipal budget planning cycle - implemented targeted messaging for infrastructure decisions',
    7: 'Neural system learned to identify key municipal decision-makers, increasing targeting precision by 78%',
    9: 'Self-improving AI optimized for government work schedules, boosting replies by 423%',
    11: 'AI autonomously refined messaging for municipal fiscal priorities based on 1,247 previous interactions'
  };

  // For LinkedIn/WhatsApp charts with municipal focus
  const linkedinChartData = [
    { month: 'Jan', connections: 67, messages: 34, replies: 12, positive: 8 },
    { month: 'Feb', connections: 84, messages: 45, replies: 18, positive: 13 },
    { month: 'Mar', connections: 102, messages: 58, replies: 26, positive: 18 },
    { month: 'Apr', connections: 123, messages: 73, replies: 35, positive: 25 },
    { month: 'May', connections: 147, messages: 91, replies: 46, positive: 33 },
    { month: 'Jun', connections: 173, messages: 112, replies: 59, positive: 42 },
    { month: 'Jul', connections: 201, messages: 136, replies: 74, positive: 53 },
    { month: 'Aug', connections: 232, messages: 163, replies: 91, positive: 65 },
    { month: 'Sep', connections: 265, messages: 193, replies: 110, positive: 79 },
    { month: 'Oct', connections: 301, messages: 226, replies: 132, positive: 95 },
    { month: 'Nov', connections: 340, messages: 262, replies: 156, positive: 112 },
    { month: 'Dec', connections: 382, messages: 301, replies: 183, positive: 131 },
  ];

  const whatsappChartData = [
    { month: 'Jan', sent: 23, delivered: 23, read: 19, replied: 8 },
    { month: 'Feb', sent: 31, delivered: 30, read: 26, replied: 12 },
    { month: 'Mar', sent: 42, delivered: 41, read: 36, replied: 17 },
    { month: 'Apr', sent: 54, delivered: 53, read: 47, replied: 23 },
    { month: 'May', sent: 69, delivered: 68, read: 61, replied: 31 },
    { month: 'Jun', sent: 86, delivered: 85, read: 77, replied: 40 },
    { month: 'Jul', sent: 105, delivered: 104, read: 95, replied: 51 },
    { month: 'Aug', sent: 127, delivered: 125, read: 116, replied: 64 },
    { month: 'Sep', sent: 152, delivered: 150, read: 140, replied: 79 },
    { month: 'Oct', sent: 179, delivered: 177, read: 167, replied: 96 },
    { month: 'Nov', sent: 209, delivered: 207, read: 197, replied: 116 },
    { month: 'Dec', sent: 242, delivered: 239, read: 230, replied: 138 },
  ];

  // Spike explanations with municipal focus
  const linkedinSpikes = {
    5: 'AI neural network identified optimal municipal professional connection patterns, boosting acceptance rate by 76%',
    7: 'AI autonomously evolved content strategy for government audiences, increasing engagement by 320%',
    9: 'Neural system developed municipal-specific messaging, improving response quality by 218%',
    11: 'AI discovered and implemented new decision-maker identification patterns for city government'
  };

  const whatsappSpikes = {
    4: 'AI learned optimal communication tone for municipal contacts, increasing read rates by 56%',
    6: 'Neural response time optimization reduced average response time to 15 seconds for government contacts',
    8: 'AI autonomously refined message structure based on 567 municipal interactions',
    10: 'AI detected and implemented government-specific terminology patterns, boosting reply rate by 287%'
  };

  // Example contacts data for the list with Coleman Young focus
  const contactsData = [
    { id: 1, name: "Patricia Williams", email: "p.williams@detroitmi.gov", company: "Coleman A. Young Municipal", position: "Facilities Operations Director", status: "positive", date: "2023-12-15", notes: "Interested in detailed budget analysis for city planning" },
    { id: 2, name: "Marcus Johnson", email: "m.johnson@detroitmi.gov", company: "Coleman A. Young Municipal", position: "Energy Management Coordinator", status: "replied", date: "2023-12-12", notes: "Requested technical specifications and ROI data" },
    { id: 3, name: "Jennifer Rodriguez", email: "j.rodriguez@detroitmi.gov", company: "Detroit General Services", position: "Building Operations Manager", status: "not_replied", date: "2023-12-18", notes: "" },
    { id: 4, name: "David Chen", email: "d.chen@detroitmi.gov", company: "Detroit Public Works", position: "Facilities Maintenance Director", status: "positive", date: "2023-12-10", notes: "Very interested in maintenance cost reduction opportunities" },
    { id: 5, name: "Sarah Thompson", email: "s.thompson@detroitmi.gov", company: "Coleman A. Young Municipal", position: "Sustainability Coordinator", status: "negative", date: "2023-12-08", notes: "Currently focused on other sustainability projects" },
    { id: 6, name: "Robert Martinez", email: "r.martinez@detroitmi.gov", company: "Detroit Planning Department", position: "Infrastructure Manager", status: "replied", date: "2023-12-05", notes: "Interested in long-term infrastructure planning applications" },
  ];

  // Filter contacts based on selected filter
  const filteredContacts = useMemo(() => {
    switch(selectedFilter) {
      case 'replied':
        return contactsData.filter(c => c.status === 'replied');
      case 'not_replied':
        return contactsData.filter(c => c.status === 'not_replied');
      case 'positive':
        return contactsData.filter(c => c.status === 'positive');
      case 'negative':
        return contactsData.filter(c => c.status === 'negative');
      default:
        return contactsData;
    }
  }, [selectedFilter]);

  // Get status badge styling
  const getStatusBadge = (status: string): string => {
    switch(status) {
      case 'positive':
        return 'bg-[#2a64f5]/20 text-[#2a64f5] border border-[#2a64f5]/20';
      case 'negative':
        return 'bg-red-500/20 text-red-400 border border-red-500/20';
      case 'replied':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'not_replied':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
    }
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    switch(status) {
      case 'positive':
        return 'Positive';
      case 'negative':
        return 'Negative';
      case 'replied':
        return 'Replied';
      case 'not_replied':
        return 'No Reply';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
                            <div className="absolute inset-0 bg-[#2a64f5] rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-blue-500 relative"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">AI Analytics System</h2>
            <p className="text-white/60">Neural network processing outreach patterns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-1 py-8 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header with Time Range Selector */}
          <div className="pt-4 pb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#2a64f5]">
                {getChannelName(activeTab)} Neural Analytics
              </h1>
              <p className="text-white/60 mt-2">
                {activeTab === 'email' && 'AI system analyzing Coleman A. Young Municipal Building energy efficiency outreach performance'}
                {activeTab === 'linkedin' && 'Neural network optimizing municipal professional engagement patterns for Coleman Young Building contacts'}
                {activeTab === 'whatsapp' && 'Adaptive AI enhancing government contact messaging effectiveness for Detroit municipal operations'}
              </p>
            </div>
            <div className="flex gap-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="select select-bordered bg-[#1e222b]/50 border-blue-500/20 text-white focus:border-blue-500/50"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>

          {/* AI System Status Banner */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/20 p-6 mb-6">
            <div className="flex items-center gap-4">
                              <div className="bg-[#2a64f5] p-4 rounded-xl text-white shadow-lg flex items-center justify-center">
                <MdOutlineDataUsage size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-white">Municipal AI System Active</h3>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a64f5] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                </div>
                <p className="text-white/80 mt-1">AI brain specialized for Coleman A. Young Municipal Building has processed 1,247 interactions and implemented 67 municipal-specific optimizations</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-blue-500">
                    <MdOutlineTrendingUp />
                    <span>Municipal learning rate: 94.8%</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <MdOutlineQueryStats />
                    <span>Government pattern confidence: 92.3%</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <FaRegLightbulb />
                    <span>Detroit insights: 23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Channel Tabs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Email Tab */}
            <button
              onClick={() => setActiveTab('email')}
              className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                activeTab === 'email' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#2a64f5] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <MdOutlineEmail size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Email Outreach</h2>
                  <p className="text-white/60 text-sm">LuxWall energy efficiency campaigns</p>
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
                  <p className="text-white/60 text-sm">B2B LuxWall professional targeting</p>
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
                <div className="bg-gradient-to-br from-[#25D366] to-[#25D366]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <FaWhatsapp size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">WhatsApp Outreach</h2>
                  <p className="text-white/60 text-sm">Direct messaging for key contacts</p>
                </div>
              </div>
            </button>
          </div>

          {/* AI Insights Banner */}
          {showAiInsight && (
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/20 p-6 mb-6 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                                  <div className="p-3 bg-[#2a64f5]/20 rounded-xl border border-[#2a64f5]/30">
                  {aiInsights[activeTab][0].icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white mb-2">{aiInsights[activeTab][0].title}</h3>
                    <span className="px-2 py-0.5 bg-[#2a64f5]/20 text-[#2a64f5] text-xs rounded-full border border-[#2a64f5]/30">
                      AI Discovery
                    </span>
                  </div>
                  <p className="text-white/80">{aiInsights[activeTab][0].description}</p>
                  <div className="mt-2 text-white/70 text-sm">
                    <span className="font-medium text-[#2a64f5]">Neural learning: </span>
                    {aiInsights[activeTab][0].learnings}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-blue-500 font-medium">{aiInsights[activeTab][0].change}</span>
                    <span className="text-white/60">improvement in {aiInsights[activeTab][0].metric}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAiInsight(null)}
                  className="text-white/60 hover:text-white"
                >
                  <MdClose size={24} />
                </button>
              </div>
            </div>
          )}

          {/* Channel-specific Analytics */}
          {activeTab === 'email' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-3 rounded-full mb-2 border border-blue-500/30"><MdOutlinePerson className="text-blue-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">298</div>
                  <div className="text-white/60 mt-1">Municipal Contacts</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+34.2%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-3 rounded-full mb-2 border border-purple-500/30"><MdOutlineMailOutline className="text-purple-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">247</div>
                  <div className="text-white/60 mt-1">Opened</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+68.3%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#2a64f5]/20 p-3 rounded-full mb-2 border border-blue-500/30"><MdOutlineReply className="text-[#2a64f5] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">156</div>
                  <div className="text-white/60 mt-1">Replied</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+91.7%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 p-3 rounded-full mb-2 border border-red-500/30"><MdOutlineTrendingUp className="text-red-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">89</div>
                  <div className="text-white/60 mt-1">Positive Interest</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+147.3%</span>
                  </div>
                </div>
              </div>
              {/* Stacked Area Chart */}
              <div className={glassPanelClass}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Analytics</h3>
                  <select className="select select-bordered bg-[#1e222b]/50 border-white/10 text-white w-40">
                    <option>Last Year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={emailChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorContacted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorReplied" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // Find the index of the current month in the data array
                        const idx = emailChartData.findIndex(d => d.month === label);
                        const spikeMsg = emailSpikes[idx as keyof typeof emailSpikes];
                        return (
                          <div className={glassPanelClass}>
                            <div className="font-semibold text-white mb-1">{label}</div>
                            {payload.map((entry: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-white/80">
                                <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}:</span>
                                <span>{entry.value}</span>
                              </div>
                            ))}
                            {spikeMsg && (
                              <div className="mt-2 text-blue-400 text-sm font-medium flex items-center gap-2">
                                <MdOutlineLightbulb className="text-yellow-400" />
                                {spikeMsg}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend iconType="circle" wrapperStyle={{ color: 'white' }} />
                    <Area type="monotone" dataKey="contacted" stackId="1" stroke="#2563eb" fill="url(#colorContacted)" name="Contacted" />
                    <Area type="monotone" dataKey="opened" stackId="1" stroke="#8b5cf6" fill="url(#colorOpened)" name="Opened" />
                    <Area type="monotone" dataKey="replied" stackId="1" stroke="#10b981" fill="url(#colorReplied)" name="Replied" />
                    <Area type="monotone" dataKey="positive" stackId="1" stroke="#f43f5e" fill="url(#colorPositive)" name="Positive" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Contacts List with Filtering */}
              <div className={glassPanelClass}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">Coleman Young Municipal Contacts</h3>
                    <div className="badge badge-primary">{filteredContacts.length}</div>
                  </div>
                  <button 
                    onClick={() => setShowContactsList(!showContactsList)}
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    {showContactsList ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                    {showContactsList ? 'Hide Contacts' : 'Show Contacts'}
                  </button>
                </div>

                {/* Filter buttons */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <button 
                    onClick={() => setSelectedFilter('all')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'all' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('replied')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'replied' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    Replied
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('not_replied')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'not_replied' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    Not Replied
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('positive')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'positive' ? 'bg-blue-500/20 text-[#2a64f5] border border-blue-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    Positive
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('negative')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'negative' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    Negative
                  </button>
                </div>

                {/* Contacts table */}
                {showContactsList && (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr className="text-white/60 border-b border-white/10">
                          <th className="bg-transparent">Name</th>
                          <th className="bg-transparent">Company</th>
                          <th className="bg-transparent">Position</th>
                          <th className="bg-transparent">Date</th>
                          <th className="bg-transparent">Status</th>
                          <th className="bg-transparent">Notes</th>
                          <th className="bg-transparent"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.map((contact) => (
                          <tr key={contact.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="bg-transparent">
                              <div className="font-medium text-white">{contact.name}</div>
                              <div className="text-white/60 text-xs">{contact.email}</div>
                            </td>
                            <td className="bg-transparent">{contact.company}</td>
                            <td className="bg-transparent">{contact.position}</td>
                            <td className="bg-transparent">{contact.date}</td>
                            <td className="bg-transparent">
                              <span className={`py-1 px-2 rounded-md text-xs ${getStatusBadge(contact.status)}`}>
                                {getStatusLabel(contact.status)}
                              </span>
                            </td>
                            <td className="bg-transparent max-w-[150px] truncate">{contact.notes || '-'}</td>
                            <td className="bg-transparent">
                              <div className="flex gap-2">
                                <button className="p-1 text-white/60 hover:text-white">
                                  <FaRegEdit />
                                </button>
                                <button className="p-1 text-white/60 hover:text-white">
                                  <MdOutlineMoreVert />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Original Detailed Metrics - Now Below the Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Delivery Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Delivery Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Sent</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.delivery.sent.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Delivered</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.delivery.delivered.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Spam Rate</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.delivery.spamRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Deliverability</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.delivery.deliverability}%</div>
                    </div>
                  </div>
                </div>

                {/* Email Engagement Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Open Rate</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.engagement.openRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Click Rate</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.engagement.clickRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Unique Opens</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.engagement.uniqueOpens.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Unique Open Rate</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.engagement.uniqueOpenRate}%</div>
                    </div>
                  </div>
                </div>

                {/* AI Response Optimization */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">AI Response Optimization</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Auto Reply Rate</div>
                      <div className="text-2xl font-bold text-blue-500">+{emailMetrics.aiOptimization.autoReplyRate}%</div>
                      <div className="text-white/60 text-sm mt-1">vs manual responses</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Avg Response Time</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.aiOptimization.avgResponseTime}s</div>
                      <div className="text-white/60 text-sm mt-1">to first response</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Optimized Templates</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.aiOptimization.optimizedTemplates}</div>
                      <div className="text-white/60 text-sm mt-1">AI-enhanced</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Personalization Score</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.aiOptimization.personalizationScore}%</div>
                      <div className="text-white/60 text-sm mt-1">AI-optimized</div>
                    </div>
                  </div>
                </div>

                {/* Response Analysis */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Response Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Responses</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.responses.total.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{emailMetrics.responses.responseRate}% response rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Positive Responses</div>
                      <div className="text-2xl font-bold text-blue-500">{emailMetrics.responses.positive.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{emailMetrics.responses.positiveRate}% positive rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Negative Responses</div>
                      <div className="text-2xl font-bold text-red-500">{emailMetrics.responses.negative.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{emailMetrics.responses.negativeRate}% negative rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Neutral Responses</div>
                      <div className="text-2xl font-bold text-yellow-500">{emailMetrics.responses.neutral.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{emailMetrics.responses.neutralRate}% neutral rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'linkedin' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-3 rounded-full mb-2 border border-blue-500/30"><MdOutlineGroups className="text-blue-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">382</div>
                  <div className="text-white/60 mt-1">Government Connections</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+42.7%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-3 rounded-full mb-2 border border-purple-500/30"><MdOutlineChat className="text-[#0A66C2] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">301</div>
                  <div className="text-white/60 mt-1">Messages</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+67.8%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#2a64f5]/20 p-3 rounded-full mb-2 border border-blue-500/30"><MdOutlineReply className="text-[#2a64f5] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">183</div>
                  <div className="text-white/60 mt-1">Replies</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+78.4%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#0A66C2]/20 p-3 rounded-full mb-2"><MdOutlineTrendingUp className="text-[#0A66C2] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">131</div>
                  <div className="text-white/60 mt-1">Municipal Interest</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+94.2%</span>
                  </div>
                </div>
              </div>

              {/* Stacked Area Chart */}
              <div className={glassPanelClass}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">LinkedIn Performance</h3>
                  <select className="select select-bordered bg-[#1e222b]/50 border-white/10 text-white w-40">
                    <option>Last Year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={linkedinChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0A66C2" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRepliesLI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPositiveLI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // Find the index of the current month in the data array
                        const idx = linkedinChartData.findIndex(d => d.month === label);
                        const spikeMsg = linkedinSpikes[idx as keyof typeof linkedinSpikes];
                        return (
                          <div className={glassPanelClass}>
                            <div className="font-semibold text-white mb-1">{label}</div>
                            {payload.map((entry: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-white/80">
                                <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}:</span>
                                <span>{entry.value}</span>
                              </div>
                            ))}
                            {spikeMsg && (
                              <div className="mt-2 text-blue-400 text-sm font-medium flex items-center gap-2">
                                <MdOutlineLightbulb className="text-yellow-400" />
                                {spikeMsg}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend iconType="circle" wrapperStyle={{ color: 'white' }} />
                    <Area type="monotone" dataKey="connections" stackId="1" stroke="#0A66C2" fill="url(#colorConnections)" name="Connections" />
                    <Area type="monotone" dataKey="messages" stackId="1" stroke="#4F46E5" fill="url(#colorMessages)" name="Messages" />
                    <Area type="monotone" dataKey="replies" stackId="1" stroke="#10b981" fill="url(#colorRepliesLI)" name="Replies" />
                    <Area type="monotone" dataKey="positive" stackId="1" stroke="#f43f5e" fill="url(#colorPositiveLI)" name="Positive" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Original LinkedIn Metrics - Keep as they are */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LinkedIn Connection Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Connection Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Connections</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.connections.total.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">New Connections</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.connections.new.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Accept Rate</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.connections.acceptRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Pending</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.connections.pending.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Engagement Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Profile Views</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.engagement.profileViews.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Post Engagement</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.engagement.postEngagement.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Message Open Rate</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.engagement.messageOpenRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Content Interactions</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.engagement.contentInteractions.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* AI Optimization */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">AI Optimization</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Connection Quality</div>
                      <div className="text-2xl font-bold text-blue-500">{linkedinMetrics.aiOptimization.connectionQuality}%</div>
                      <div className="text-white/60 text-sm mt-1">AI-scored quality</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Message Optimization</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.aiOptimization.messageOptimization}%</div>
                      <div className="text-white/60 text-sm mt-1">AI-enhanced</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Content Recommendations</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.aiOptimization.contentRecommendations}</div>
                      <div className="text-white/60 text-sm mt-1">AI-generated</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Engagement Predictions</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.aiOptimization.engagementPredictions}%</div>
                      <div className="text-white/60 text-sm mt-1">Accuracy rate</div>
                    </div>
                  </div>
                </div>

                {/* Content Performance */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Content Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Posts Created</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.content.postsCreated}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Articles Shared</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.content.articlesShared}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Comments Received</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.content.commentsReceived.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Shares Generated</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.content.sharesGenerated.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'whatsapp' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdSend className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">242</div>
                  <div className="text-white/60 mt-1">Municipal Messages</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+58.9%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineOpenInNew className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">230</div>
                  <div className="text-white/60 mt-1">Read</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+73.2%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineReply className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">138</div>
                  <div className="text-white/60 mt-1">Replied</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+78.9%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineTrendingUp className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">89</div>
                  <div className="text-white/60 mt-1">Government Interest</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+112.4%</span>
                  </div>
                </div>
              </div>

              {/* Stacked Area Chart */}
              <div className={glassPanelClass}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">WhatsApp Performance</h3>
                  <select className="select select-bordered bg-[#1e222b]/50 border-white/10 text-white w-40">
                    <option>Last Year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={whatsappChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#25D366" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#25D366" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34B7F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#34B7F1" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ECB71" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4ECB71" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRepliedWA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // Find the index of the current month in the data array
                        const idx = whatsappChartData.findIndex(d => d.month === label);
                        const spikeMsg = whatsappSpikes[idx as keyof typeof whatsappSpikes];
                        return (
                          <div className={glassPanelClass}>
                            <div className="font-semibold text-white mb-1">{label}</div>
                            {payload.map((entry: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-white/80">
                                <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}:</span>
                                <span>{entry.value}</span>
                              </div>
                            ))}
                            {spikeMsg && (
                              <div className="mt-2 text-blue-400 text-sm font-medium flex items-center gap-2">
                                <MdOutlineLightbulb className="text-yellow-400" />
                                {spikeMsg}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend iconType="circle" wrapperStyle={{ color: 'white' }} />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#25D366" fill="url(#colorSent)" name="Sent" />
                    <Area type="monotone" dataKey="delivered" stackId="1" stroke="#34B7F1" fill="url(#colorDelivered)" name="Delivered" />
                    <Area type="monotone" dataKey="read" stackId="1" stroke="#4ECB71" fill="url(#colorRead)" name="Read" />
                    <Area type="monotone" dataKey="replied" stackId="1" stroke="#10b981" fill="url(#colorRepliedWA)" name="Replied" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Original WhatsApp Metrics - Keep as they are */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* WhatsApp Delivery Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Delivery Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Sent</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.delivery.sent.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Delivered</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.delivery.delivered.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Delivery Rate</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.delivery.deliveredRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Failed</div>
                      <div className="text-2xl font-bold text-red-500">{whatsappMetrics.delivery.failed}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.delivery.failedRate}% failure rate</div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Engagement Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Read Rate</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.engagement.readRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Reply Rate</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.engagement.replyRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Forwarded</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.engagement.forwarded.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.engagement.forwardedRate}% forward rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Replies</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.engagement.replied.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* AI Response Optimization */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">AI Response Optimization</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Response Time</div>
                      <div className="text-2xl font-bold text-blue-500">{whatsappMetrics.aiOptimization.responseTime}s</div>
                      <div className="text-white/60 text-sm mt-1">average response time</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Auto Reply Rate</div>
                      <div className="text-2xl font-bold text-white">+{whatsappMetrics.aiOptimization.autoReplyRate}%</div>
                      <div className="text-white/60 text-sm mt-1">vs manual responses</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Context Understanding</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.aiOptimization.contextUnderstanding}%</div>
                      <div className="text-white/60 text-sm mt-1">AI accuracy</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Sentiment Analysis</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.aiOptimization.sentimentAnalysis}%</div>
                      <div className="text-white/60 text-sm mt-1">AI accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Response Analysis */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Response Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Responses</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.responses.total.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.responses.responseRate}% response rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Positive Responses</div>
                      <div className="text-2xl font-bold text-blue-500">{whatsappMetrics.responses.positive.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.responses.positiveRate}% positive rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Negative Responses</div>
                      <div className="text-2xl font-bold text-red-500">{whatsappMetrics.responses.negative.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.responses.negativeRate}% negative rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Neutral Responses</div>
                      <div className="text-2xl font-bold text-yellow-500">{whatsappMetrics.responses.neutral.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.responses.neutralRate}% neutral rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* AI Insights Section */}
          <div className={glassPanelClass}>
            <h3 className="text-xl font-semibold text-white mb-4">AI-Powered Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-[#1e222b]/50 rounded-xl p-4 border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-2">Top Performing Campaigns</h4>
                  <ul className="space-y-2">
                    {aiInsights[activeTab].map((insight, index) => (
                      <li 
                        key={index}
                        className="flex items-center gap-2 text-white/80 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                        onClick={() => setShowAiInsight(insight.title)}
                      >
                        {insight.icon}
                        <span>{insight.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Section with enhanced design */}
          <div className={glassPanelClass}>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#2a64f5] p-4 rounded-xl text-white shadow-lg">
                <MdOutlineLightbulb size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Neural Network Discoveries</h3>
                <p className="text-white/60">AI-identified patterns and autonomous optimizations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiInsights[activeTab].map((insight, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-xl shadow-lg border border-blue-500/15 p-5 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => setShowAiInsight(insight.title)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#2a64f5]/20 p-2 rounded-lg border border-blue-500/30">
                      {insight.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{insight.title}</h4>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-[#2a64f5] text-xs rounded-full border border-blue-500/30">
                        +{insight.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2">{insight.description}</p>
                  <div className="mt-3 text-blue-500 text-xs font-medium flex items-center gap-1">
                    <MdOutlineQueryStats />
                    <span>Pattern confidence: {Math.floor(85 + Math.random() * 13)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Evolution Graph */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">AI Learning Evolution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  {day: 1, accuracy: 65},
                  {day: 2, accuracy: 68},
                  {day: 3, accuracy: 72},
                  {day: 4, accuracy: 74},
                  {day: 5, accuracy: 78},
                  {day: 6, accuracy: 81},
                  {day: 7, accuracy: 83},
                  {day: 8, accuracy: 84},
                  {day: 9, accuracy: 87},
                  {day: 10, accuracy: 89},
                  {day: 11, accuracy: 91},
                  {day: 12, accuracy: 93},
                  {day: 13, accuracy: 94},
                  {day: 14, accuracy: 95},
                  {day: 15, accuracy: 96},
                  {day: 16, accuracy: 97},
                  {day: 17, accuracy: 97.5},
                  {day: 18, accuracy: 98},
                  {day: 19, accuracy: 98.2},
                  {day: 20, accuracy: 98.5},
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" fontSize={12} label={{value: 'Learning Days', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.7)'}} />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} label={{value: 'Pattern Accuracy %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)'}} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="backdrop-blur-2xl bg-[#1a1a1a]/90 p-3 border border-blue-500/20 rounded-lg text-white text-sm">
                            <p>Day {payload[0].payload.day}: {payload[0].value}% accuracy</p>
                            {payload[0].payload.day === 7 && 
                              <p className="text-[#2a64f5] text-xs mt-1">First pattern established</p>
                            }
                            {payload[0].payload.day === 14 && 
                              <p className="text-[#2a64f5] text-xs mt-1">Neural refinement complete</p>
                            }
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5, fill: '#10b981', stroke: 'white' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={glassPanelClass}>
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-4 text-white">
                Add Note for {selectedContact?.name}
              </h3>
              <div className="form-control">
                <textarea 
                  className="textarea backdrop-blur-md bg-[#28292b]/60 border border-blue-500/20 text-white focus:border-blue-500 h-32"
                  placeholder="Enter your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => setShowNoteModal(false)}
                  className="btn bg-transparent hover:bg-orange-500/10 border border-orange-500/30 text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddNote}
                  className="btn bg-gradient-to-br from-blue-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 transition-all"
                  disabled={!newNote.trim()}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutreachTracking; 
