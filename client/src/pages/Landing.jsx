import heroImage from '../assets/hero-image.png'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Plans',
      description: 'Get personalized workout and nutrition plans from our advanced AI coach'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your weight, workouts, and calories with beautiful charts'
    },
    {
      icon: '💬',
      title: 'Chat Interface',
      description: 'Simply tell the AI what you want and get instant results'
    },
    {
      icon: '🏋️',
      title: 'Workout Logging',
      description: 'Log your exercises with sets, reps, and weights easily'
    }
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Workouts Logged' },
    { value: '98%', label: 'Satisfaction' }
  ]

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${isVisible ? 'visible' : ''}`}>
        <div className="landing-nav-content">
          <div className="landing-logo">
            <span className="landing-logo-icon">💪</span>
            <span className="landing-logo-text">FitGenie</span>
          </div>
          <div className="landing-nav-links">
            <Link to="/login" className="btn btn-secondary">Log In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-orbs">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-orb orb-3"></div>
        </div>

        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Powered by Google Gemini AI
          </div>

          <h1 className="hero-title">
            Your Personal
            <span className="hero-title-gradient"> AI Fitness Coach</span>
          </h1>

          <p className="hero-description">
            Get customized workout plans, nutrition advice, and track your progress —
            all powered by advanced AI that understands your unique fitness goals.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg hero-btn">
              <span>Start Your Journey</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              I have an account
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div key={i} className="hero-stat" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>


        {/* Floating mockup - Moved to left */}
        <div className={`hero-mockup ${isVisible ? 'visible' : ''}`}>
          <div className="mockup-window">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="mockup-title">AI Coach</span>
            </div>
            <div className="mockup-chat">
              <div className="mockup-message user">
                Create a 4-week beginner strength plan
              </div>
              <div className="mockup-message assistant">
                <div className="mockup-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div className="mockup-message assistant fade-in">
                Here's your personalized plan! 💪
                <div className="mockup-plan-card">
                  <div className="plan-mini-header">4-Week Strength Plan</div>
                  <div className="plan-mini-item">Day 1: Push (Chest, Shoulders)</div>
                  <div className="plan-mini-item">Day 2: Pull (Back, Biceps)</div>
                  <div className="plan-mini-item">Day 3: Legs & Core</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visuals Container */}
        <div className={`hero-visuals ${isVisible ? 'visible' : ''}`}>
          {/* Animated Hero Image */}
          <div className="hero-image-container">
            <img src={heroImage} alt="Fitness Trainer" className="hero-image-img" />
            <div className="hero-image-glow"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything you need to <span className="text-gradient">crush your goals</span></h2>
            <p className="section-description">
              FitGenie combines cutting-edge AI with intuitive design to make your fitness journey effortless
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to transform your fitness?</h2>
            <p className="cta-description">
              Join thousands of users who are already achieving their goals with FitGenie
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-accent btn-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span>💪</span> FitGenie
          </div>
          <p className="footer-text">
            Built with ❤️ using MERN Stack & Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
