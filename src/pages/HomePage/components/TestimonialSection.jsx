import { motion } from 'framer-motion'
import { useEffect } from 'react'

function TestimonialSection() {

  useEffect(() => {
    // const feedBack = [];
  }, []);
  const testimonials = [
    {
      content: "I've tried many language apps, but NihonGo's personalized approach helped me progress faster than ever before.",
      author: "Emily Chen",
      role: "Business Professional"
    },
    {
      content: "The AI conversation feature is incredible. It's like having a patient Japanese tutor available 24/7.",
      author: "David Kim",
      role: "University Student"
    },
    {
      content: "The flashcard system with SRS helped me memorize kanji in half the time it would have taken otherwise.",
      author: "Sarah Johnson",
      role: "Language Enthusiast"
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Are Saying
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Join thousands of satisfied learners on their Japanese language journey
          </p>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-accent-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-4 text-base text-gray-600">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection