import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const Dashboard = () => {
  const { user } = useAuth()
  const [chartData, setChartData] = useState([])
  const [stats, setStats] = useState({
    currentWeight: '-',
    weeklyWorkouts: 0,
    caloriesBurned: 0,
    activePlans: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch chart data
      const chartRes = await api.get('/progress/chart')
      if (chartRes.data.ok) {
        setChartData(chartRes.data.data)

        // Calculate stats from chart data
        const data = chartRes.data.data
        if (data.length > 0) {
          const latestWeight = data.filter(d => d.weightKg).pop()?.weightKg || '-'
          const weeklyWorkouts = data.reduce((sum, d) => sum + (d.workouts || 0), 0)
          const totalCalories = data.reduce((sum, d) => sum + (d.caloriesBurned || 0), 0)

          setStats(prev => ({
            ...prev,
            currentWeight: latestWeight,
            weeklyWorkouts,
            caloriesBurned: totalCalories
          }))
        }
      }

      // Fetch plans count
      const plansRes = await api.get('/chat/plans')
      if (plansRes.data.ok) {
        setStats(prev => ({ ...prev, activePlans: plansRes.data.data.length }))
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sample data for demo if no real data
  const demoChartData = [
    { date: '2026-01-05', weightKg: 80, workouts: 1, caloriesBurned: 350 },
    { date: '2026-01-06', weightKg: 79.8, workouts: 0, caloriesBurned: 0 },
    { date: '2026-01-07', weightKg: 79.5, workouts: 1, caloriesBurned: 420 },
    { date: '2026-01-08', weightKg: 79.3, workouts: 1, caloriesBurned: 380 },
    { date: '2026-01-09', weightKg: 79.0, workouts: 0, caloriesBurned: 0 },
    { date: '2026-01-10', weightKg: 78.8, workouts: 1, caloriesBurned: 450 },
    { date: '2026-01-11', weightKg: 78.5, workouts: 1, caloriesBurned: 400 }
  ]

  const displayData = chartData.length > 0 ? chartData : demoChartData

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Welcome back, {user?.profile?.firstName || 'Champion'}! 💪
        </h1>
        <p style={{ color: 'var(--gray-400)' }}>
          Here's your fitness overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">⚖️</div>
          <div className="stat-content">
            <h3>Current Weight</h3>
            <div className="stat-value">{stats.currentWeight} kg</div>
            <span className="stat-change">↓ 1.5 kg this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🏋️</div>
          <div className="stat-content">
            <h3>Weekly Workouts</h3>
            <div className="stat-value">{stats.weeklyWorkouts}</div>
            <span className="stat-change">On track!</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">🔥</div>
          <div className="stat-content">
            <h3>Calories Burned</h3>
            <div className="stat-value">{stats.caloriesBurned.toLocaleString()}</div>
            <span className="stat-change">This week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">📋</div>
          <div className="stat-content">
            <h3>Active Plans</h3>
            <div className="stat-value">{stats.activePlans}</div>
            <Link to="/chat" style={{ fontSize: '0.75rem' }}>Create new →</Link>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <h2 className="chart-title">Progress Overview</h2>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#0ea5e9' }}></span>
              Weight (kg)
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#f97316' }}></span>
              Workouts
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#22c55e' }}></span>
              Calories Burned
            </div>
          </div>
        </div>

        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(val) => {
                  const d = new Date(val)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="caloriesBurned"
                name="Calories"
                fill="rgba(34, 197, 94, 0.2)"
                stroke="#22c55e"
                strokeWidth={2}
              />
              <Bar
                yAxisId="right"
                dataKey="workouts"
                name="Workouts"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weightKg"
                name="Weight (kg)"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <Link to="/chat" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>🤖</div>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Ask AI Coach</h3>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                Get a personalized workout or nutrition plan
              </p>
            </div>
          </div>
        </Link>

        <Link to="/workouts" className="card" style={{ textDecoration: 'none', transition: 'all 0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>📝</div>
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Log Workout</h3>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                Track your exercises and progress
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
