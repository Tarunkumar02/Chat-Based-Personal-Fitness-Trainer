import { useState, useEffect } from 'react'
import api from '../services/api'

const WORKOUT_TYPES = [
  { id: 'strength', icon: '💪', label: 'Strength' },
  { id: 'cardio', icon: '🏃', label: 'Cardio' },
  { id: 'yoga', icon: '🧘', label: 'Yoga' },
  { id: 'hiit', icon: '⚡', label: 'HIIT' },
  { id: 'sports', icon: '⚽', label: 'Sports' },
  { id: 'other', icon: '📝', label: 'Other' }
]

const WorkoutLog = () => {
  const [workouts, setWorkouts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'strength',
    durationMinutes: '',
    caloriesBurned: '',
    exercises: []
  })
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weightKg: ''
  })

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const response = await api.get('/workouts')
      if (response.data.ok) {
        setWorkouts(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) return
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...newExercise }]
    }))
    setNewExercise({ name: '', sets: '', reps: '', weightKg: '' })
  }

  const handleRemoveExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await api.post('/workouts', {
        ...formData,
        durationMinutes: parseInt(formData.durationMinutes) || 0,
        caloriesBurned: parseInt(formData.caloriesBurned) || 0
      })

      if (response.data.ok) {
        setWorkouts(prev => [response.data.data, ...prev])
        setShowModal(false)
        setFormData({
          date: new Date().toISOString().split('T')[0],
          type: 'strength',
          durationMinutes: '',
          caloriesBurned: '',
          exercises: []
        })
      }
    } catch (error) {
      console.error('Failed to save workout:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this workout?')) return

    try {
      const response = await api.delete(`/workouts/${id}`)
      if (response.data.ok) {
        setWorkouts(prev => prev.filter(w => w._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete workout:', error)
    }
  }

  const getWorkoutIcon = (type) => {
    const workout = WORKOUT_TYPES.find(w => w.id === type)
    return workout?.icon || '💪'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Workout Log 🏋️
          </h1>
          <p style={{ color: 'var(--gray-400)' }}>
            Track your exercises and progress
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Log Workout
        </button>
      </div>

      {/* Workout List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
        </div>
      ) : workouts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏋️</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No workouts yet</h3>
          <p style={{ color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
            Start tracking your fitness journey!
          </p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Log Your First Workout
          </button>
        </div>
      ) : (
        <div className="workout-list">
          {workouts.map(workout => (
            <div key={workout._id} className="workout-item">
              <div className="workout-info">
                <div className="workout-type-icon">
                  {getWorkoutIcon(workout.type)}
                </div>
                <div className="workout-details">
                  <h4 style={{ textTransform: 'capitalize' }}>{workout.type} Workout</h4>
                  <p>{formatDate(workout.date)}</p>
                </div>
              </div>
              <div className="workout-stats">
                <div>
                  <div className="workout-stat-label">Duration</div>
                  <div className="workout-stat-value">{workout.durationMinutes || 0} min</div>
                </div>
                <div>
                  <div className="workout-stat-label">Calories</div>
                  <div className="workout-stat-value">{workout.caloriesBurned || 0}</div>
                </div>
                <div>
                  <div className="workout-stat-label">Exercises</div>
                  <div className="workout-stat-value">{workout.exercises?.length || 0}</div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDelete(workout._id)}
                  style={{ marginLeft: '1rem' }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Workout Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Log Workout</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Date and Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Workout Type</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {WORKOUT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration and Calories */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="45"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Calories Burned</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="300"
                    value={formData.caloriesBurned}
                    onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                  />
                </div>
              </div>

              {/* Exercises */}
              <div className="form-group">
                <label className="form-label">Exercises</label>

                {/* Exercise List */}
                {formData.exercises.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    {formData.exercises.map((ex, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          background: 'var(--dark-bg)',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '0.5rem'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: '500' }}>{ex.name}</span>
                          <span style={{ color: 'var(--gray-400)', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                            {ex.sets && `${ex.sets} sets`}
                            {ex.reps && ` × ${ex.reps} reps`}
                            {ex.weightKg && ` @ ${ex.weightKg}kg`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(i)}
                          style={{ color: 'var(--error-500)', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Exercise Form */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: '0.5rem',
                  alignItems: 'end'
                }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Exercise name"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Sets"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Reps"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="kg"
                    value={newExercise.weightKg}
                    onChange={(e) => setNewExercise({ ...newExercise, weightKg: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddExercise}
                    style={{ height: '44px' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? 'Saving...' : 'Save Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutLog
