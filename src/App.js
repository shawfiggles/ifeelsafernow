import React, { useState } from 'react';
import { Plane, Shield, Stethoscope, ChevronRight, ChevronLeft } from 'lucide-react';

// Import question sets (assuming they're in separate files)
import B777Questions from './B777Questions';
import A380Questions from './A380Questions';
import AviationSecurityQuestions from './AviationSecurityQuestions';
import GMTQuestions from './GMTQuestions';

const sections = [
  { 
    id: 'b777', 
    title: 'B777', 
    icon: Plane,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    questions: B777Questions
  },
  { 
    id: 'a380', 
    title: 'A380', 
    icon: Plane,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    questions: A380Questions
  },
  { 
    id: 'security', 
    title: 'Security', 
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    questions: AviationSecurityQuestions
  },
  { 
    id: 'gmt', 
    title: 'GMT', 
    icon: Stethoscope,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    questions: GMTQuestions
  },
];

const SafeTalkApp = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentSection = sections.find(s => s.id === activeSection);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
    }
  };

  const formatAnswer = (answer) => {
    return answer.split('\n').map((line, index) => (
      <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Safe Talk Interactive Learning</h1>
        <p className="text-center text-gray-600 mb-6">August Edition Version 1 - 15 August 2024</p>
        <div className="flex justify-between mb-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                className={`p-4 ${section.color} ${section.bgColor} ${activeSection === section.id ? 'font-bold ring-2 ring-offset-2 ring-gray-400' : ''} flex flex-col items-center rounded-lg transition-all duration-200 hover:shadow-md`}
                onClick={() => {
                  setActiveSection(section.id);
                  setCurrentQuestionIndex(0);
                  setShowAnswer(false);
                }}
              >
                <Icon size={24} />
                <span className="mt-2">{section.title}</span>
              </button>
            );
          })}
        </div>
        <div className={`border p-6 rounded-lg ${currentSection.bgColor}`}>
          <h2 className={`text-2xl font-bold mb-4 ${currentSection.color}`}>{currentSection.title}</h2>
          <p className="mb-2 text-gray-600">Question {currentQuestionIndex + 1} of {currentSection.questions.length}</p>
          <p className="text-lg font-semibold mb-4 text-gray-800">{currentSection.questions[currentQuestionIndex].q}</p>
          {showAnswer && (
            <div className="bg-white p-4 rounded-md mb-4 shadow-inner">
              {formatAnswer(currentSection.questions[currentQuestionIndex].a)}
            </div>
          )}
          <div className="flex justify-between mt-6">
            <button
              className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded-full flex items-center hover:bg-gray-300 transition-colors duration-200"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft size={12} className="mr-1" /> Previous
            </button>
            <button
              className={`px-2 py-1 text-sm ${showAnswer ? 'bg-yellow-500' : 'bg-blue-500'} text-white rounded-full hover:opacity-90 transition-colors duration-200`}
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            <button
              className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded-full flex items-center hover:bg-gray-300 transition-colors duration-200"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === currentSection.questions.length - 1}
            >
              Next <ChevronRight size={12} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeTalkApp;