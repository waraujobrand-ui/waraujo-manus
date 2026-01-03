export function Finish({
  results,
  onRestart,
}: {
  results: any;
  onRestart: () => void;
}) {
  const personality = results?.personality || "ENTJ";
  const reasoning = results?.reasoning || "Your personality analysis is complete.";
  const careerRecommendations = results?.careerRecommendations || [];
  const traits = results?.traits || [];

  const handleExport = () => {
    const exportData = {
      personality,
      reasoning,
      careerRecommendations,
      traits,
      completedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `personality-results-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-lg text-gray-600">Here's your personality analysis</p>
        </div>

        {/* Personality Type */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-8 text-center">
          <p className="text-sm font-semibold text-indigo-600 mb-2">Your Personality Type</p>
          <p className="text-5xl font-bold text-indigo-900 mb-2">{personality}</p>
          <p className="text-gray-700">{reasoning}</p>
        </div>

        {/* Traits */}
        {traits && traits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Traits</h2>
            <div className="grid grid-cols-2 gap-3">
              {traits.map((trait: any, idx: number) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="font-semibold text-gray-900">{trait.name}</p>
                  <p className="text-sm text-gray-600">{trait.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Recommendations */}
        {careerRecommendations && careerRecommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Careers</h2>
            <div className="space-y-3">
              {careerRecommendations.map((career: any, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900">{career.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{career.description}</p>
                  {career.actionSteps && career.actionSteps.length > 0 && (
                    <div className="mt-3 text-sm">
                      <p className="font-semibold text-gray-700 mb-2">Next Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-600">
                        {career.actionSteps.map((step: string, stepIdx: number) => (
                          <li key={stepIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Export Results
          </button>
          <button
            onClick={onRestart}
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Start New Interview
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Your results are saved locally. Refresh the page to continue later.
        </p>
      </div>
    </div>
  );
}
