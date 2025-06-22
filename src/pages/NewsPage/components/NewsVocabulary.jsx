function NewsVocabulary({ vocabulary = [], onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-primary-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h1 className="text-2xl font-bold mb-6 text-primary-700 text-center">Key Vocabulary</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {vocabulary?.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <div className="text-lg font-medium text-primary-600">{item.word}</div>
              <div className="text-sm text-gray-500">{item.reading}</div>
              <div className="text-gray-700 mt-1">{item.meaning}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NewsVocabulary