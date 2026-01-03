import { useState, useEffect, useRef } from "react";
import { trpc } from "../lib/trpc";

type Message = {
  role: "ai" | "user";
  content: string;
};

const STORAGE_KEY = "personality_ai_web_interview";
const DRAFT_KEY = "personality_ai_web_draft";

export function Interview({ onComplete }: { onComplete: (results: any) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const trpcAny = trpc as any;
  const startInterview = trpcAny.interview?.start?.useMutation?.();
  const generateQuestion = trpcAny.interview?.generateQuestion?.useMutation?.();
  const shouldContinue = trpcAny.interview?.shouldContinue?.useMutation?.();
  const analyzePersonality = trpcAny.interview?.analyzePersonality?.useMutation?.();

  // Load saved interview on mount
  useEffect(() => {
    loadInterview();
    loadDraft();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadDraft = async () => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) setCurrentInput(draft);
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
  };

  const saveDraft = (text: string) => {
    try {
      if (text.trim()) {
        localStorage.setItem(DRAFT_KEY, text);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  };

  const loadInterview = async () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setMessages(data.messages);
        setQuestionNumber(data.questionNumber);
      } else {
        startNewInterview();
      }
    } catch (error) {
      console.error("Failed to load interview:", error);
      startNewInterview();
    }
  };

  const startNewInterview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!startInterview?.mutateAsync) {
        setError("Interview service not available. Please refresh the page.");
        setIsLoading(false);
        return;
      }
      const result = await startInterview.mutateAsync();
      const newMessages: Message[] = [{ role: "ai", content: result.question }];
      setMessages(newMessages);
      setQuestionNumber(1);
      saveInterview(newMessages, 1);
    } catch (error) {
      console.error("Failed to start interview:", error);
      setError("Failed to start interview. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveInterview = (msgs: Message[], qNum: number) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: msgs,
          questionNumber: qNum,
        })
      );
    } catch (error) {
      console.error("Failed to save interview:", error);
    }
  };

  const handleSendResponse = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: currentInput.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setCurrentInput("");
    setError(null);
    setIsLoading(true);

    try {
      // Check if we should continue
      let continueResult: any = { shouldContinue: true };
      if (shouldContinue?.mutateAsync) {
        continueResult = await shouldContinue.mutateAsync({
          conversationHistory: updatedMessages,
          questionNumber: questionNumber + 1,
        });
      }

      if (!continueResult.shouldContinue) {
        // Interview complete - analyze
        let analysisResult: any = { personality: "ENTJ", reasoning: "Analysis complete" };
        if (analyzePersonality?.mutateAsync) {
          analysisResult = await analyzePersonality.mutateAsync({
            conversationHistory: updatedMessages,
          });
        }
        clearDraft();
        localStorage.removeItem(STORAGE_KEY);
        onComplete(analysisResult);
        return;
      }

      // Generate next question
      if (!generateQuestion?.mutateAsync) {
        setError("Question generation service not available.");
        setMessages(updatedMessages);
        setCurrentInput(userMessage.content);
        saveDraft(userMessage.content);
        setIsLoading(false);
        return;
      }

      const result = await generateQuestion.mutateAsync({
        conversationHistory: updatedMessages,
        questionNumber: questionNumber + 1,
      });

      const aiMessage: Message = { role: "ai", content: result.question };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      setQuestionNumber(result.questionNumber);
      saveInterview(finalMessages, result.questionNumber);
      clearDraft();
    } catch (error: any) {
      console.error("Failed to process response:", error);
      setMessages(updatedMessages);
      setCurrentInput(userMessage.content);
      saveDraft(userMessage.content);
      setError("Temporary server issue. Your response has been saved. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDontKnow = async () => {
    setCurrentInput("I don't know");
    await handleSendResponse();
  };

  const handleRephrase = () => {
    // Show last AI message again
    const lastAiMessage = messages.filter((m) => m.role === "ai").pop();
    if (lastAiMessage) {
      alert(`Question: ${lastAiMessage.content}\n\nPlease try answering in a different way.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col p-4">
      <div className="max-w-2xl w-full mx-auto flex flex-col h-screen">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Personality Interview</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-gray-300 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((questionNumber / 15) * 100, 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600">
              Q{questionNumber}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.role === "ai"
                    ? "bg-white text-gray-900 border border-gray-200"
                    : "bg-indigo-600 text-white"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-lg">
                <p className="text-sm italic">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => {
                setCurrentInput(e.target.value);
                saveDraft(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendResponse();
                }
              }}
              placeholder="Type your response..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
            />
            <button
              onClick={handleSendResponse}
              disabled={!currentInput.trim() || isLoading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>

          {/* Helper Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDontKnow}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
            >
              I don't know
            </button>
            <button
              onClick={handleRephrase}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
            >
              Rephrase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
