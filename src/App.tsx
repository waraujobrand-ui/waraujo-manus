import { useState, useEffect } from "react";
import { Landing } from "./pages/Landing";
import { Interview } from "./pages/Interview";
import { Finish } from "./pages/Finish";

type Page = "landing" | "interview" | "finish";

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    // Check if there's a saved interview in progress
    const savedInterview = localStorage.getItem("personality_ai_web_interview");
    if (savedInterview) {
      setCurrentPage("interview");
    }
  }, []);

  const handleStartInterview = () => {
    localStorage.removeItem("personality_ai_web_interview");
    localStorage.removeItem("personality_ai_web_draft");
    setCurrentPage("interview");
  };

  const handleCompleteInterview = (interviewResults: any) => {
    setResults(interviewResults);
    setCurrentPage("finish");
  };

  const handleRestart = () => {
    setResults(null);
    setCurrentPage("landing");
  };

  return (
    <>
      {currentPage === "landing" && <Landing onStart={handleStartInterview} />}
      {currentPage === "interview" && <Interview onComplete={handleCompleteInterview} />}
      {currentPage === "finish" && <Finish results={results} onRestart={handleRestart} />}
    </>
  );
}
