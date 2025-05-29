import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi'

function StudyReminders() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      time: '09:00',
      days: ['Mon', 'Wed', 'Fri'],
      active: true,
    },
    {
      id: 2,
      time: '19:30',
      days: ['Tue', 'Thu'],
      active: true,
    },
  ])

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const toggleDay = (reminderId, day) => {
    setReminders(reminders.map(reminder => {
      if (reminder.id === reminderId) {
        const days = reminder.days.includes(day)
          ? reminder.days.filter(d => d !== day)
          : [...reminder.days, day]
        return { ...reminder, days }
      }
      return reminder
    }))
  }

  const toggleReminder = (reminderId) => {
    setReminders(reminders.map(reminder => {
      if (reminder.id === reminderId) {
        return { ...reminder, active: !reminder.active }
      }
      return reminder
    }))
  }

  const deleteReminder = (reminderId) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Study Reminders</h2>
        <button className="btn btn-primary flex items-center">
          <FiPlus className="mr-2" />
          Add Reminder
        </button>
      </div>

      <div className="space-y-4">
        {reminders.map(reminder => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg border ${
              reminder.active ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiClock className={`mr-2 ${
                  reminder.active ? 'text-primary-500' : 'text-gray-400'
                }`} />
                <span className={`text-lg font-medium ${
                  reminder.active ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {reminder.time}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`p-2 rounded-full ${
                    reminder.active
                      ? 'text-primary-500 hover:bg-primary-100'
                      : 'text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <FiBell className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 rounded-full text-gray-400 hover:text-error-500 hover:bg-error-50"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allDays.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(reminder.id, day)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reminder.days.includes(day)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${!reminder.active && 'opacity-50'}`}
                  disabled={!reminder.active}
                >
                  {day}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {reminders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No reminders set. Add one to get started!</p>
        </div>
      )}
    </motion.div>
  )
}

export default StudyReminders