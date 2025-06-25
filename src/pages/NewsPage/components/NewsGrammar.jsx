function NewsGrammar({ grammar = [], onClose }) {
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
        <h1 className="text-2xl font-bold mb-6 text-primary-700 text-center">Grammar Points</h1>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {grammar && grammar.length > 0 ? (
            grammar.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="text-lg font-medium text-primary-600 mb-2">{item.pattern}</div>
                <div className="text-gray-700 mb-2">{item.usage}</div>
                <div className="bg-white rounded p-3">
                  <div className="text-primary-600">{item.example?.japanese}</div>
                  <div className="text-gray-600 text-sm">{item.example?.english}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No grammar points available.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsGrammar