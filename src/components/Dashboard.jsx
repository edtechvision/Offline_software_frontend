import React, { useEffect, useState } from 'react';
import {
  FaUsers,
  FaUserPlus,
  FaMoneyBillWave,
  FaCreditCard,
  FaClock,
  FaCalendarAlt,
  FaSearch,
  FaBuilding,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaGraduationCap,
  FaBookOpen,
  FaClock as FaTimeIcon,
  FaTrophy,
  FaStar,
  FaChartBar
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { API_BASE_URL, getDefaultHeaders } from '../utils/apiConfig';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE_URL}/get-dashboard`, {
          headers: getDefaultHeaders(),
        });
        const json = await response.json();
        if (!response.ok || json?.success === false) {
          throw new Error(json?.message || 'Failed to fetch dashboard');
        }
        setDashboardData(json?.data || {});
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  };

  const currentMonth = dashboardData?.currentMonth || '';
  const kpiData = [
    { title: 'Students', value: String(dashboardData?.totalStudents ?? 0), color: 'accent', icon: FaUsers, change: '', changeType: 'neutral' },
    { title: "Today's Admission", value: String(dashboardData?.todaysAdmissions ?? 0), color: 'teal', icon: FaUserPlus, change: '', changeType: 'neutral' },
    { title: 'Fee Collection', value: formatCurrency(dashboardData?.totalCollectedFees), color: 'accent-green', icon: FaMoneyBillWave, change: '', changeType: 'neutral' },
    { title: "Today's Fee", value: formatCurrency(dashboardData?.todaysCollectedFees), color: 'red', icon: FaCreditCard, change: '', changeType: 'neutral' },
    { title: 'Pending Fee', value: formatCurrency(dashboardData?.totalPendingFees), color: 'yellow', icon: FaClock, change: '', changeType: 'neutral' },
    { title: `${currentMonth || 'This Month'} Fee`, value: formatCurrency(dashboardData?.currentMonthCollectedFees), color: 'gray', icon: FaCalendarAlt, change: '', changeType: 'neutral' },
    { title: `${currentMonth || 'This Month'} Admission`, value: String(dashboardData?.currentMonthAdmissions ?? 0), color: 'accent-green', icon: FaSearch, change: '', changeType: 'neutral' },
    { title: 'Centers', value: String(dashboardData?.totalCenters ?? 0), color: 'accent', icon: FaBuilding, change: '', changeType: 'neutral' },
  ];

  const courseData = [
    { courseName: 'CRASH COURSE 10TH 2024-25', studentCount: '260', trend: '+15%', color: 'from-green-400 to-green-600' },
    { courseName: 'CRASH COURSE 12TH 2024-25', studentCount: '189', trend: '+8%', color: 'from-blue-400 to-blue-600' },
    { courseName: 'CLASS 12TH BIOLOGY', studentCount: '13', trend: '+25%', color: 'from-purple-400 to-purple-600' },
    { courseName: 'CLASS 12TH PHYSICS', studentCount: '1', trend: '+100%', color: 'from-red-400 to-red-600' },
    { courseName: 'CLASS 12TH HINDI + ENGLISH', studentCount: '2', trend: '+50%', color: 'from-pink-400 to-pink-600' },
    { courseName: 'CLASS 12TH CHEMISTRY', studentCount: '4', trend: '+33%', color: 'from-indigo-400 to-indigo-600' },
    { courseName: 'CLASS 12TH BATCH 2025-26', studentCount: '12', trend: '+20%', color: 'from-yellow-400 to-yellow-600' },
    { courseName: 'CLASS 10TH FOUNDATION BATCH', studentCount: '24', trend: '+14%', color: 'from-teal-400 to-teal-600' },
    { courseName: 'CLASS 10TH FOUNDATION BATCH', studentCount: '213', trend: '+18%', color: 'from-orange-400 to-orange-600' },
  ];

  // Chart data for fee collection trend
  const feeChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Fee Collection (₹)',
        data: [650000, 780000, 820000, 750000, 900000, 850000, 880000, 920000, 870000, 950000, 890000, 930000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  // Student enrollment trend
  const enrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Students Enrolled',
        data: [120, 135, 142, 158, 165, 178, 185, 192, 198, 205, 212, 220],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // Course distribution doughnut chart
  const courseDistributionData = {
    labels: ['10th Foundation', '12th Science', 'Crash Course', 'Other Courses'],
    datasets: [
      {
        data: [237, 20, 449, 611],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8
      }
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-sm text-gray-500">Loading dashboard...</div>
      )}
      {!!error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* Enhanced KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="group">
            <div className={`${kpi.color === 'accent' ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700' :
              kpi.color === 'accent-green' ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700' :
                kpi.color === 'teal' ? 'bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700' :
                  kpi.color === 'green' ? 'bg-gradient-to-br from-green-500 via-green-600 to-green-700' :
                    kpi.color === 'red' ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700' :
                      kpi.color === 'yellow' ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700' :
                        kpi.color === 'gray' ? 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800' :
                          'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'} 
                           text-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden`}>

              {/* Enhanced background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                {/* Header with icon and title */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold opacity-95 tracking-wide">{kpi.title}</h3>
                  <div className="text-3xl opacity-90 bg-white/25 p-3 rounded-2xl backdrop-blur-sm shadow-lg">
                    <kpi.icon />
                  </div>
                </div>

                {/* Main value with enhanced typography */}
                <div className="text-4xl font-black mb-4 tracking-tight leading-tight">{kpi.value}</div>

                {/* Enhanced change indicator */}
                <div className="flex items-center space-x-3">
                  {kpi.changeType === 'up' && (
                    <div className="bg-green-400/30 backdrop-blur-sm rounded-full p-2">
                      <FaArrowUp className="text-green-200 text-lg" />
                    </div>
                  )}
                  {kpi.changeType === 'down' && (
                    <div className="bg-red-400/30 backdrop-blur-sm rounded-full p-2">
                      <FaArrowDown className="text-red-200 text-lg" />
                    </div>
                  )}
                  <span className={`text-lg font-semibold ${kpi.changeType === 'up' ? 'text-green-200' :
                    kpi.changeType === 'down' ? 'text-red-200' : 'text-gray-200'
                    } tracking-wide`}>
                    {kpi.change}
                  </span>
                </div>

                {/* Status indicator for Find Fees card */}
                {kpi.title === 'Find Fees' && (
                  <div className="mt-4 p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="text-sm font-medium opacity-90 text-center">Status</div>
                  </div>
                )}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Professional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Trend Chart */}
        <div className="bg-bg-primary rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Fee Collection Trend</h2>
            <FaChartLine className="text-accent text-2xl" />
          </div>
          <div className="h-64">
            <Line data={feeChartData} options={chartOptions} />
          </div>
        </div>

        {/* Student Enrollment Trend */}
        <div className="bg-bg-primary rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Student Enrollment</h2>
            <FaGraduationCap className="text-accent-green text-2xl" />
          </div>
          <div className="h-64">
            <Bar data={enrollmentData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Course Distribution Chart */}
      <div className="bg-bg-primary rounded-2xl p-6 shadow-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Course Distribution</h2>
          <FaBookOpen className="text-accent text-2xl" />
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="w-64 h-64">
            <Doughnut data={courseDistributionData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Enhanced Courses Section */}
      <div className="bg-gradient-to-r from-bg-primary via-gray-50 to-bg-primary rounded-2xl shadow-xl border border-accent/20 relative overflow-hidden">
        <div className="bg-gradient-to-r from-primary-900 via-accent to-primary-900 text-white p-6 rounded-t-2xl relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
          </div>
          <div className="flex items-center space-x-3 relative z-10">
            <FaBookOpen className="text-2xl" />
            <h2 className="text-xl font-bold">Courses Overview</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseData.map((course, index) => (
              <div key={index} className={`bg-gradient-to-r ${course.color} text-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium leading-tight flex-1 pr-2">{course.courseName}</h3>
                  <div className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    {course.studentCount}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-80">Students</span>
                  <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                    {course.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
