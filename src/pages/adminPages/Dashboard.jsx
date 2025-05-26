import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
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
  const { users, lessons, logs, subjects } = useData();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSubjects: 0,
    activeSubjects: 0,
    totalLessons: 0,
    recentActivity: []
  });

  // Calculate statistics when data changes
  useEffect(() => {
    setStats({
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      totalSubjects: subjects.length,
      activeSubjects: subjects.filter(subject => subject.status === 'ACTIVE').length,
      totalLessons: lessons.length,
      recentActivity: logs.slice(0, 5)
    });
  }, [users, subjects, lessons, logs]);


  // Sample data for charts
  const userProgressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Active Users',
        data: [42, 49, 65, 78],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  };

  const subjectCompletionData = {
    labels: subjects.slice(0, 5).map(subject => subject.subjectCode),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: subjects.slice(0, 5).map(subject => subject.completion),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(79, 70, 229, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  const userDistributionData = {
    labels: ['Beginner', 'Intermediate', 'Advanced'],
    datasets: [
      {
        data: [35, 45, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(79, 70, 229, 0.6)',
          'rgba(16, 185, 129, 0.6)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex items-start">
          <div className="rounded-md bg-primary-100 p-3 mr-4">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            <div className="flex items-center mt-1 text-xs">
              <ArrowUp className="h-4 w-4 text-success-500 mr-1" />
              <span className="text-success-700">12% increase</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-start">
          <div className="rounded-md bg-secondary-100 p-3 mr-4">
            <Book className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Subjects</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeSubjects}</p>
            <div className="flex items-center mt-1 text-xs">
              <ArrowUp className="h-4 w-4 text-success-500 mr-1" />
              <span className="text-success-700">3 new</span>
              <span className="text-gray-500 ml-1">since last week</span>
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-start">
          <div className="rounded-md bg-success-50 p-3 mr-4">
            <Layers className="h-6 w-6 text-success-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Lessons</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
            <div className="flex items-center mt-1 text-xs">
              <ArrowUp className="h-4 w-4 text-success-500 mr-1" />
              <span className="text-success-700">8 new</span>
              <span className="text-gray-500 ml-1">since last week</span>
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-start">
          <div className="rounded-md bg-warning-50 p-3 mr-4">
            <Activity className="h-6 w-6 text-warning-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Completion</p>
            <p className="text-2xl font-bold text-gray-900">68%</p>
            <div className="flex items-center mt-1 text-xs">
              <ArrowDown className="h-4 w-4 text-error-500 mr-1" />
              <span className="text-error-700">3% decrease</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">User Activity Trends</h2>
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
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

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
                    max: 100
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <Link to="/system-logs" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  {activity.action.includes('User') && <User size={16} className="text-primary-600" />}
                  {activity.action.includes('Course') && <Book size={16} className="text-secondary-600" />}
                  {activity.action.includes('Lesson') && <FileText size={16} className="text-success-700" />}
                  {!activity.action.includes('User') && !activity.action.includes('Course') && !activity.action.includes('Lesson') && 
                    <Activity size={16} className="text-warning-700" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">by {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/users" className="card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <Users className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Manage Users</span>
          </Link>
          <Link to="/courses" className="card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <Book className="h-8 w-8 text-secondary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Manage Courses</span>
          </Link>
          <Link to="/admins" className="card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <User className="h-8 w-8 text-success-700 mb-2" />
            <span className="text-sm font-medium text-gray-900">Admin List</span>
          </Link>
          <Link to="/system-logs" className="card p-4 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <Activity className="h-8 w-8 text-warning-700 mb-2" />
            <span className="text-sm font-medium text-gray-900">System Logs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;