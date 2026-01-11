import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    heightCm: '',
    weightKg: '',
    activityLevel: '',
    goals: [],
    dietaryPreferences: { type: '' },
    fitnessLevel: ''
  })

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        age: user.profile.age || '',
        gender: user.profile.gender || '',
        heightCm: user.profile.heightCm || '',
        weightKg: user.profile.weightKg || '',
        activityLevel: user.profile.activityLevel || '',
        goals: user.profile.goals || [],
        dietaryPreferences: user.profile.dietaryPreferences || { type: '' },
        fitnessLevel: user.profile.fitnessLevel || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await api.put('/profile', formData)
      if (response.data.ok) {
        updateUser({ profile: response.data.data })
        setEditing(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  const goalLabels = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Build Muscle',
    endurance: 'Endurance',
    flexibility: 'Flexibility',
    general: 'General Fitness',
    strength: 'Strength'
  }

  return (
    <div>
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {formData.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h2>{formData.firstName} {formData.lastName || 'User'}</h2>
          <p>{user?.email}</p>
        </div>
        <button
          className={`btn ${editing ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => editing ? setEditing(false) : setEditing(true)}
          style={{ marginLeft: 'auto' }}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {success && (
        <div className="alert alert-success">
          <span>✓</span>
          Profile updated successfully!
        </div>
      )}

      <div className="profile-sections">
        {/* Personal Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Personal Information</h3>
          </div>

          {editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
                  First Name
                </div>
                <div style={{ fontWeight: '500' }}>{formData.firstName || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
                  Last Name
                </div>
                <div style={{ fontWeight: '500' }}>{formData.lastName || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
                  Age
                </div>
                <div style={{ fontWeight: '500' }}>{formData.age || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
                  Gender
                </div>
                <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{formData.gender || '-'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Physical Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Physical Stats</h3>
          </div>

          {editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Activity Level</label>
                <select
                  className="form-select"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fitness Level</label>
                <select
                  className="form-select"
                  value={formData.fitnessLevel}
                  onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
                  Height
                </div>
                <div style={{ fontWeight: '500' }}>{formData.heightCm ? `${formData.heightCm} cm` : '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
                  Weight
                </div>
                <div style={{ fontWeight: '500' }}>{formData.weightKg ? `${formData.weightKg} kg` : '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
                  Activity Level
                </div>
                <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{formData.activityLevel || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
                  Fitness Level
                </div>
                <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>{formData.fitnessLevel || '-'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Goals & Preferences */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Goals & Preferences</h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {formData.goals?.length > 0 ? (
              formData.goals.map((goal, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(14, 165, 233, 0.1)',
                    border: '1px solid var(--primary-500)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    color: 'var(--primary-400)'
                  }}
                >
                  {goalLabels[goal] || goal}
                </span>
              ))
            ) : (
              <span style={{ color: 'var(--gray-400)' }}>No goals set</span>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: '0.25rem' }}>
              Diet Preference
            </div>
            <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>
              {formData.dietaryPreferences?.type || 'Not set'}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {editing && (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Profile
