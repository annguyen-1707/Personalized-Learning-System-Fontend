import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  getCoureraRateFromAPI, getOverviewFromAPI, getMonthlyUserFromAPI, getAllSubjectFromAPI
} from '../../services/DashboardService';

import {
  Users,
  Book,
  Layers,
  Activity,
  ArrowUp,
  ArrowDown,
  User,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { sub } from 'framer-motion/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [overview, setOverview] = useState({
    "totalUserNow": 0,
    "totalUserCompareLastMonth": 0,
    "totalSubjectNow": 0,
    "totalSubjectCompareLastMonth": 0,
    "totalLessonNow": 0,
    "totalLessonCompareLastMonth": 0,
    "completionRateSubjectNow": 0,
    "completionRateSubjectCompareLastMonth": 0,
    "totalUserNormal": 0,
    "totalUserOneYear": 0,
    "totalUserOneMonth": 0,
    "totalUserSixMonths": 0,
    "systemLogs": []
  });
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [listSubject, setListSubject] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  useEffect(() => {
    getOverview();
    getMonthlUserCount();
    getListSubject();
    getCouseraRate();
  }, [year], [selectedSubjectIds])

  const [userProgressData, setUserProgressData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Active Users',
        data: [],
      }
    ]
  });
  const [userDistributionData, setDistributionData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderWidth: 1
      }
    ]
  });

  const [subjectCompletionData, setSubjectCompletionData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: [],
        borderWidth: 1
      }
    ]
  });

  const [subjectNumberUserData, setSubjectNumberUserData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number user learn',
        data: [],
        borderWidth: 1
      }
    ]
  });

  const generateRandomColors = (count, alpha = 0.6) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.floor((360 / count) * i); // chia đều màu theo vòng tròn HSL
      colors.push(`hsla(${hue}, 70%, 60%, ${alpha})`);
    }
    return colors;
  };

  const generateColors = (count) => {
    const baseColors = [
      'rgba(59, 130, 246, 0.6)',   // blue
      'rgba(79, 70, 229, 0.6)',    // indigo
      'rgba(16, 185, 129, 0.6)',   // green
      'rgba(245, 158, 11, 0.6)',   // amber
      'rgba(239, 68, 68, 0.6)',    // red
      'rgba(124, 58, 237, 0.6)',   // violet
      'rgba(14, 165, 233, 0.6)',   // sky
      'rgba(236, 72, 153, 0.6)',   // pink
    ];

    // Lặp lại màu nếu số lượng label vượt quá màu gốc
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  const toggleSubject = (id) => {
    const newSelectedIds = selectedSubjectIds.includes(id)
      ? selectedSubjectIds.filter(item => item !== id)
      : [...selectedSubjectIds, id];

    setSelectedSubjectIds(newSelectedIds); // Cập nhật state
    getCouseraRate(newSelectedIds);        // Gọi API ngay với danh sách mới
    getCouseraNumberUser(newSelectedIds);        // Gọi API ngay với danh sách mới

  };

  const getMonthlUserCount = async () => {
    let res = await getMonthlyUserFromAPI(year)
    if (res?.data) {
      const counts = res.data.map(item => item.activeCount);
      const labels = res.data.map(item => item.month.toString()); // ['1', '2', ..., '12']
      setUserProgressData(prev => ({
        ...prev,
        labels: labels,
        datasets: [
          {
            label: `Number users join in ${year}`,
            data: counts,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)'
          }
        ]
      }));
    }
  }
  const getOverview = async () => {
    let res = await getOverviewFromAPI();
    if (res && res.data) {
      setOverview(res.data)
    }
    if (res?.data) {
      const counts = res.data.countUserEachMembership.map(item => item.count);
      const labels = res.data.countUserEachMembership.map(item => item.membershipLevel.toString());
      const bgColors = generateRandomColors(labels.length, 0.6);
      const borderColors = generateRandomColors(labels.length, 1);
      setDistributionData(prev => ({
        ...prev,
        labels: labels,
        datasets: [
          {
            data: counts,
            backgroundColor: bgColors,
            borderColor: borderColors,
            borderWidth: 1
          }
        ]
      }))
    }
  }
  const getListSubject = async () => {
    let res = await getAllSubjectFromAPI();
    if (res && res.data) {
      setListSubject(res.data)
    }
  }

  const getCouseraRate = async (ids) => {
    const res = await getCoureraRateFromAPI(ids);
    if (res?.data) {
      const counts = res.data.map(item => item.couseraCompleteRate);
      const labels = res.data.map(item => item.subjectName);
      const colors = generateColors(labels.length);

      setSubjectCompletionData({
        labels,
        datasets: [
          {
            label: 'Completion Rate (%)',
            data: counts,
            backgroundColor: colors,
            borderWidth: 1
          }
        ]
      });
    }
  };

  const getCouseraNumberUser = async (ids) => {
    const res = await getCoureraRateFromAPI(ids);
    if (res?.data) {
      const counts = res.data.map(item => item.totalUserJoin);
      const labels = res.data.map(item => item.subjectName);
      const colors = generateColors(labels.length);

      setSubjectNumberUserData({
        labels,
        datasets: [
          {
            label: 'Number user learn',
            data: counts,
            backgroundColor: colors,
            borderWidth: 1
          }
        ]
      });
    }
  };


  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex items-start">
          <div className="rounded-md bg-primary-100 p-3 mr-4">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{overview.totalUserNow}</p>
            <div className="flex items-center mt-1 text-xs">
              {overview.totalUserCompareLastMonth >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
              )}              <span className={
                overview.totalUserCompareLastMonth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }>
                {overview.totalUserCompareLastMonth}
                {overview.totalUserCompareLastMonth >= 0 ? " increase" : " decrease"} user
              </span>              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-start">
          <div className="rounded-md bg-secondary-100 p-3 mr-4">
            <Book className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Subjects</p>
            <p className="text-2xl font-bold text-gray-900">{overview.totalSubjectNow}</p>
            <div className="flex items-center mt-1 text-xs">
              {overview.totalSubjectCompareLastMonth >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
              )}              <span className={
                overview.totalSubjectCompareLastMonth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }>
                {overview.totalSubjectCompareLastMonth}
                {overview.totalSubjectCompareLastMonth >= 0 ? " increase" : " decrease"} subject
              </span>              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-start">
          <div className="rounded-md bg-success-50 p-3 mr-4">
            <Layers className="h-6 w-6 text-success-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Lessons</p>
            <p className="text-2xl font-bold text-gray-900">{overview.totalLessonNow}</p>
            <div className="flex items-center mt-1 text-xs">
              {overview.totalLessonCompareLastMonth >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
              )}              <span className={
                overview.totalLessonCompareLastMonth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }>
                {overview.totalLessonCompareLastMonth}
                {overview.totalLessonCompareLastMonth >= 0 ? " increase" : " decrease"} lesson
              </span>              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-start">
          <div className="rounded-md bg-warning-50 p-3 mr-4">
            <Activity className="h-6 w-6 text-warning-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Completion </p>
            <p className="text-2xl font-bold text-gray-900">{Math.floor(overview.completionRateSubjectNow)}%</p>

            <div className="flex items-center mt-1 text-xs">
              {overview.completionRateSubjectCompareLastMonth >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
              )}              <span className={
                overview.completionRateSubjectCompareLastMonth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }>
                {Math.floor(overview.completionRateSubjectCompareLastMonth)}%
                {overview.completionRateSubjectCompareLastMonth >= 0 ? " increase" : " decrease"}
              </span>              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">User create account</h2>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-28" // 👈 w-28 = nhỏ lại
            >
              {[2022, 2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="h-80">
            <Line
              data={userProgressData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
        {/* User Distribution */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h2>
          <div className="h-80 flex items-center justify-center">
            <Pie
              data={userDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  },
                  datalabels: {
                    color: '#fff',
                    font: {
                      weight: 'bold',
                      size: 12
                    },
                    formatter: (value, context) => {
                      const data = context.chart.data.datasets[0].data;
                      const total = data.reduce((sum, val) => sum + val, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${percentage}%`;
                    }
                  }
                }
              }}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
      </div>
      {/* Subject Completion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Subject Completion Rates</h2>
          <div className="h-80">
            <Bar
              data={subjectCompletionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
        </div>
        {/* Subject Number User Join */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Subject Number User Join</h2>
          <div className="h-80">
            <Bar
              data={subjectNumberUserData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
        </div>
        {/* Select Subjects */}
        <div className="col-span-2 card p-4">
          <h2 className="text-md font-medium text-gray-800 mb-2">Select Subjects</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {listSubject.map((subject) => {
              const isSelected = selectedSubjectIds.includes(subject.subjectId); // `selectedSubjectIds` là listId
              return (
                <button
                  key={subject.subjectId}
                  onClick={() => toggleSubject(subject.subjectId)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all duration-150 ${isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                >
                  {subject.subjectName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="users" className="card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <Users className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Manage Users</span>
          </Link>
          <Link to="courses" className="card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <Book className="h-8 w-8 text-secondary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Manage Courses</span>
          </Link>
          <Link to="admins" className="card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <User className="h-8 w-8 text-success-700 mb-2" />
            <span className="text-sm font-medium text-gray-900">Admin List</span>
          </Link>
          <Link to="system-logs" className="card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <Activity className="h-8 w-8 text-warning-700 mb-2" />
            <span className="text-sm font-medium text-gray-900">System Logs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;