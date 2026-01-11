import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const GOALS = [
  { id: 'weight_loss', icon: '🏃', label: 'Weight Loss' },
  { id: 'muscle_gain', icon: '💪', label: 'Build Muscle' },
  { id: 'endurance', icon: '🚴', label: 'Endurance' },
  { id: 'flexibility', icon: '🧘', label: 'Flexibility' },
  { id: 'general', icon: '⭐', label: 'General Fitness' },
  { id: 'strength', icon: '🏋️', label: 'Strength' }
]

const DIET_TYPES = [
  { id: 'balanced', label: 'Balanced' },
  { id: 'veg', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'non-veg', label: 'Non-Vegetarian' },
  { id: 'keto', label: 'Keto' }
]

const FITNESS_LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'New to fitness' },
  { id: 'intermediate', label: 'Intermediate', desc: '1-3 years experience' },
  { id: 'advanced', label: 'Advanced', desc: '3+ years experience' }
]

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    heightCm: '',
    weightKg: '',
    activityLevel: 'moderate',
    goals: [],
    dietaryPreferences: { type: 'balanced', allergies: [] },
    fitnessLevel: 'beginner'
  })
  const { updateUser } = useAuth()
  const navigate = useNavigate()

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await api.put('/profile', formData)
      if (response.data.ok) {
        updateUser({ profile: response.data.data })
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="onboarding-container">
        {/* Progress */}
        <div className="onboarding-progress">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`progress-step ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        <div className="onboarding-card">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <h2 className="onboarding-title">Let's get to know you</h2>
              <p className="onboarding-description">Tell us a bit about yourself</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                    placeholder="175"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                    placeholder="70"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <>
              <h2 className="onboarding-title">What are your goals?</h2>
              <p className="onboarding-description">Select all that apply</p>

              <div className="goal-options">
                {GOALS.map(goal => (
                  <div
                    key={goal.id}
                    className={`goal-option ${formData.goals.includes(goal.id) ? 'selected' : ''}`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <div className="goal-option-icon">{goal.icon}</div>
                    <div className="goal-option-label">{goal.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Diet */}
          {step === 3 && (
            <>
              <h2 className="onboarding-title">Dietary Preferences</h2>
              <p className="onboarding-description">Help us customize your nutrition plans</p>

              <div className="form-group">
                <label className="form-label">Diet Type</label>
                <div className="goal-options" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {DIET_TYPES.map(diet => (
                    <div
                      key={diet.id}
                      className={`goal-option ${formData.dietaryPreferences.type === diet.id ? 'selected' : ''}`}
                      onClick={() => setFormData({
                        ...formData,
                        dietaryPreferences: { ...formData.dietaryPreferences, type: diet.id }
                      })}
                    >
                      <div className="goal-option-label">{diet.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Activity Level</label>
                <select
                  className="form-select"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                </select>
              </div>
            </>
          )}

          {/* Step 4: Fitness Level */}
          {step === 4 && (
            <>
              <h2 className="onboarding-title">Your Fitness Level</h2>
              <p className="onboarding-description">This helps us customize workout intensity</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {FITNESS_LEVELS.map(level => (
                  <div
                    key={level.id}
                    className={`goal-option ${formData.fitnessLevel === level.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, fitnessLevel: level.id })}
                    style={{ textAlign: 'left', padding: '1.25rem' }}
                  >
                    <div className="goal-option-label">{level.label}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
                      {level.desc}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {step > 1 && (
              <button className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button className="btn btn-primary" onClick={handleNext} style={{ marginLeft: 'auto' }}>
                Continue
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ marginLeft: 'auto' }}
              >
                {loading ? 'Saving...' : 'Get Started'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
