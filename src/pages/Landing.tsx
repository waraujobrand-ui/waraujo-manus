export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PersonalityAI</h1>
          <p className="text-lg text-gray-600">
            Discover your true personality through AI-powered interviews
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-semibold text-gray-900">Deep Analysis</h3>
              <p className="text-sm text-gray-600">AI-powered questions that adapt to your responses</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">💼</div>
            <div>
              <h3 className="font-semibold text-gray-900">Career Guidance</h3>
              <p className="text-sm text-gray-600">Personalized recommendations based on your personality</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="font-semibold text-gray-900">Quick & Easy</h3>
              <p className="text-sm text-gray-600">Takes 5-10 minutes, no signup required</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
        >
          Start Interview
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          No signup. No email. Just honest answers.
        </p>
      </div>
    </div>
  );
}
