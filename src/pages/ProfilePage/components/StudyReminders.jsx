import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi'
import { getStudyReminderFromAPI, handleCreateStudyReminderFromAPI, handleDeleteStudyReminderFromAPI, handleUpdateStudyReminderFromAPI } from '../../../services/ProfileService'
import { handleUpdateContent } from '../../../services/ContentListeningService'

function StudyReminders() {
  const [reminders, setReminders] = useState([])
  const [newReminder, setNewReminder] = useState({
    time: '',
    note: '',
    daysOfWeek: [],
    isActive: 'true'
  });
  const [showForm, setShowForm] = useState(false);
  const allDaysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

  useEffect(() => {
    getStudyReminder();
  }, [])

  const getStudyReminder = async () => {
    var res = await getStudyReminderFromAPI();
    console.log("study reminder", res)
    if (res && res.data) {
      setReminders(res.data)
    }
  }

  const createReminder = async () => {
    // Gọi API ở đây nếu có (giả sử: await createStudyReminderAPI(newReminder))
    console.log('Creating reminder:', newReminder);
    setShowForm(false);
    handleCreateStudyReminderFromAPI(newReminder)
    setNewReminder({ time: '', note: '', daysOfWeek: [], isActive: 'true' });
    getStudyReminder(); // refresh danh sách
  };


  const toggleNewReminderDay = (day) => {
    setNewReminder(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek?.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };
  const toggleDay = (reminderId, day) => {
    const updatedReminders = reminders.map(reminder => {
      if (reminder.studyReminderId === reminderId) {
        const daysOfWeek = reminder.daysOfWeek.includes(day)
          ? reminder.daysOfWeek.filter(d => d !== day)
          : [...reminder.daysOfWeek, day];
        return { ...reminder, daysOfWeek };
      }
      return reminder;
    });

    setReminders(updatedReminders);
    getStudyReminder();
    const updated = updatedReminders.find(r => r.studyReminderId === reminderId);
    handleUpdateStudyReminderFromAPI(reminderId, {
      time: updated.time,
      note: updated.note,
      daysOfWeek: updated.daysOfWeek,
      isActive: updated.isActive,
    });
  };

  const toggleReminder = (reminderId) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.studyReminderId === reminderId
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    );
    setReminders(updatedReminders);

    const updated = updatedReminders.find(r => r.studyReminderId === reminderId);
    handleUpdateStudyReminderFromAPI(reminderId, {
      time: updated.time,
      note: updated.note,
      daysOfWeek: updated.daysOfWeek,
      isActive: updated.isActive,
    });
  };


  const deleteReminder = (reminderId) => {
    handleDeleteStudyReminderFromAPI(reminderId)
    getStudyReminder();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      {showForm && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-lg border border-primary-200 bg-primary-50 space-y-4 mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FiClock className="mr-2 text-primary-500" />
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, time: e.target.value })
                }
                className="text-lg font-medium text-gray-900 bg-transparent focus:outline-none"
              />
            </div>

            <button
              onClick={createReminder}
              className="btn btn-success px-4 py-2 text-sm"
              disabled={!newReminder.time || newReminder.daysOfWeek.length === 0}
            >
              Save
            </button>
          </div>

          <div>
            <input
              type="text"
              value={newReminder.note}
              onChange={(e) =>
                setNewReminder({ ...newReminder, note: e.target.value })
              }
              placeholder="Enter a note (optional)"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allDaysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => toggleNewReminderDay(day)}
                type="button"
                className={`px-3 py-1 rounded-full text-sm font-medium ${newReminder.daysOfWeek?.includes(day)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </motion.div>
      )}


      <div className="flex items-center justify-between mb-6 mt-3">
        <h2 className="text-lg font-medium text-gray-900">Study Reminders</h2>
        <button className="btn btn-primary flex items-center"
          onClick={() => setShowForm(!showForm)}>
          <FiPlus className="mr-2" />
          Add Reminder
        </button>
      </div>

      <div className="space-y-4">
        {reminders.map(reminder => (
          <motion.div
            key={reminder.studyReminderId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg border ${reminder.isActive ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-gray-50'
              }`}
          >
            <div className="flex items-center">
              <span className={`text-lg font-medium ${reminder.isActive ? 'text-gray-900' : 'text-gray-500'
                }`}>
                Note: {reminder.note}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center">
                <FiClock className={`mr-2 ${reminder.isActive ? 'text-primary-500' : 'text-gray-400'
                  }`} />
                <span className={`text-lg font-medium ${reminder.isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                  {reminder.time}
                </span>
              </div>


              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleReminder(reminder.studyReminderId)}
                  className={`p-2 rounded-full ${reminder.isActive
                    ? 'text-primary-500 hover:bg-primary-100'
                    : 'text-gray-400 hover:bg-gray-200'
                    }`}
                >
                  <FiBell className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteReminder(reminder.studyReminderId)}
                  className="p-2 rounded-full text-gray-400 hover:text-error-500 hover:bg-error-50"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allDaysOfWeek.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(reminder.studyReminderId, day)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${reminder.daysOfWeek?.includes(day)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${!reminder.isActive && 'opacity-50'}`}
                  disabled={!reminder.isActive}
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