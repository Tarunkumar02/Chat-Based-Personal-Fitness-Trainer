import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChatHistory = async () => {
    try {
      const response = await api.get('/chat/history?limit=50')
      if (response.data.ok) {
        setMessages(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString()
    }])

    setLoading(true)

    try {
      const response = await api.post('/chat', { message: userMessage })

      if (response.data.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.data.assistantText,
          metadata: {
            planId: response.data.data.planId,
            planJSON: response.data.data.planJSON
          },
          createdAt: new Date().toISOString()
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          createdAt: new Date().toISOString()
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again later.',
        createdAt: new Date().toISOString()
      }])
    } finally {
      setLoading(false)
    }
  }

  const renderPlanCard = (planJSON) => {
    if (!planJSON) return null

    return (
      <div className="plan-card">
        <div className="plan-card-header">
          <span className="plan-card-title">📋 {planJSON.plan?.type || 'Fitness Plan'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
            {planJSON.plan?.durationWeeks} weeks • {planJSON.plan?.workoutDaysPerWeek} days/week
          </span>
        </div>

        {/* Workout Preview */}
        {planJSON.plan?.exercises?.slice(0, 2).map((day, i) => (
          <div key={i} className="plan-section">
            <h4>{day.day}</h4>
            {day.exercises?.slice(0, 3).map((ex, j) => (
              <div key={j} className="exercise-item">
                <span style={{ fontSize: '1.25rem' }}>
                  {ex.category === 'cardio' ? '🏃' : '💪'}
                </span>
                <div>
                  <div style={{ fontWeight: '500' }}>{ex.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                    {ex.sets && `${ex.sets} sets`}
                    {ex.reps && ` × ${ex.reps} reps`}
                    {ex.durationSec && ` ${Math.round(ex.durationSec / 60)} min`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Nutrition Preview */}
        {planJSON.nutrition && (
          <div className="plan-section">
            <h4>Nutrition</h4>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
              <span>🔥 {planJSON.nutrition.dailyCalories} kcal</span>
              <span>🥩 {planJSON.nutrition.macros?.proteinG}g protein</span>
              <span>🍞 {planJSON.nutrition.macros?.carbsG}g carbs</span>
            </div>
          </div>
        )}

        <button
          className="btn btn-secondary btn-sm btn-full"
          onClick={() => setSelectedPlan(planJSON)}
          style={{ marginTop: '0.75rem' }}
        >
          View Full Plan
        </button>
      </div>
    )
  }

  const suggestedPrompts = [
    "Create a 4-week beginner strength plan",
    "Give me a 2000 kcal meal plan for weight loss",
    "Design a cardio routine for endurance",
    "What exercises can I do at home without equipment?"
  ]

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <span style={{ fontSize: '1.5rem' }}>🤖</span>
        <div>
          <h2>AI Fitness Coach</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
            Ask me anything about fitness, workouts, or nutrition
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Start a conversation</h3>
            <p style={{ color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
              Ask me to create a workout plan, nutrition advice, or fitness tips!
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  className="btn btn-secondary btn-sm"
                  onClick={() => setInput(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div>{msg.content}</div>
            {msg.role === 'assistant' && msg.metadata?.planJSON && (
              renderPlanCard(msg.metadata.planJSON)
            )}
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask about workouts, nutrition, or fitness goals..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={loading || !input.trim()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>

      {/* Plan Modal */}
      {selectedPlan && (
        <div className="modal-overlay" onClick={() => setSelectedPlan(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📋 {selectedPlan.plan?.type || 'Your Plan'}</h3>
              <button className="modal-close" onClick={() => setSelectedPlan(null)}>×</button>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {/* Full workout details */}
              {selectedPlan.plan?.exercises?.map((day, i) => (
                <div key={i} className="plan-section" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: 'var(--primary-400)', marginBottom: '0.75rem' }}>{day.day}</h4>
                  {day.exercises?.map((ex, j) => (
                    <div key={j} className="exercise-item">
                      <span style={{ fontSize: '1.25rem' }}>
                        {ex.category === 'cardio' ? '🏃' : '💪'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500' }}>{ex.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                          {ex.sets && `${ex.sets} sets`}
                          {ex.reps && ` × ${ex.reps} reps`}
                          {ex.durationSec && ` ${Math.round(ex.durationSec / 60)} min`}
                          {ex.restSeconds && ` • ${ex.restSeconds}s rest`}
                        </div>
                        {ex.notes && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
                            💡 {ex.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Nutrition details */}
              {selectedPlan.nutrition && (
                <div className="plan-section">
                  <h4 style={{ color: 'var(--primary-400)', marginBottom: '0.75rem' }}>🥗 Nutrition Plan</h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Daily Calories</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        {selectedPlan.nutrition.dailyCalories}
                      </div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Protein</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        {selectedPlan.nutrition.macros?.proteinG}g
                      </div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Carbs</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        {selectedPlan.nutrition.macros?.carbsG}g
                      </div>
                    </div>
                  </div>

                  {selectedPlan.nutrition.meals?.map((meal, i) => (
                    <div key={i} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: '500' }}>{meal.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                        {meal.items?.join(', ')} • {meal.calories} kcal
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rationale */}
              {selectedPlan.rationale && (
                <div className="plan-section">
                  <h4 style={{ color: 'var(--primary-400)', marginBottom: '0.5rem' }}>💡 Why This Plan</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-300)' }}>
                    {selectedPlan.rationale}
                  </p>
                </div>
              )}

              {/* Warnings */}
              {selectedPlan.warnings?.length > 0 && (
                <div className="alert alert-error" style={{ marginTop: '1rem' }}>
                  <span>⚠️</span>
                  <div>
                    {selectedPlan.warnings.map((w, i) => (
                      <div key={i}>{w}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
