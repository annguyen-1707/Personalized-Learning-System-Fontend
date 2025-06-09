import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBook, FiLayers, FiMessageCircle, FiActivity } from 'react-icons/fi'
import FeatureCard from './components/FeatureCard'
import HeroSection from './components/HeroSection'
import TestimonialSection from './components/TestimonialSection'


function HomePage() {
  const features = [
    {
      icon: FiBook,
      title: 'Comprehensive Lessons',
      description: 'Learn Japanese vocabulary, grammar, and cultural nuances through structured, easy-to-follow lessons.',
      color: 'bg-primary-500',
      link: '/learning'
    },
    {
      icon: FiLayers,
      title: 'Interactive Flashcards',
      description: 'Master vocabulary with our spaced repetition flashcard system with audio pronunciation.',
      color: 'bg-accent-500',
      link: '/flashcards'
    },
    {
      icon: FiMessageCircle,
      title: 'AI Conversation',
      description: 'Practice speaking Japanese with our AI conversation partner and get real-time feedback.',
      color: 'bg-secondary-500',
      link: '/ai-conversation'
    },
    {
      icon: FiActivity,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed progress statistics and achievement badges.',
      color: 'bg-success-500',
      link: '/profile'
    }
  ]

  return (
    <div className="space-y-16">
      <HeroSection />
      
      {/* Key Features */}
      <section className="py-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4"
          >
            Learn Japanese the Smart Way
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-xl text-gray-600"
          >
            Everything you need to master Japanese in one platform
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Get Started */}
      <section className="py-12 bg-primary-50 rounded-xl">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to start your Japanese journey?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Begin with a structured learning path tailored to your goals and level.
          </p>
          <div className="mt-8 flex justify-center">
            <Link 
              to="/learning"
              className="btn btn-primary px-6 py-3 text-lg"
            >
              Start Learning Now
            </Link>
          </div>
        </div>
      </section>
      
      <TestimonialSection />
    </div>
  )
}

export default HomePage