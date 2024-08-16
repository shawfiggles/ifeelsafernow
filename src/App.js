import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Shield, Stethoscope } from 'lucide-react';

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

const ProgressBar = ({ progress }) => {
  const steps = 4; // Number of steps in the progress bar
  const filledSteps = Math.floor(progress * steps);

  return (
    <div className="fixed top-0 left-0 right-0 p-2 bg-white shadow-md z-20">
      <div className="flex justify-between mb-1">
        {[...Array(steps)].map((_, index) => (
          <div key={index} className="text-xs font-semibold">
            Step {index + 1}
          </div>
        ))}
      </div>
      <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
        {[...Array(steps)].map((_, index) => (
          <motion.div
            key={index}
            className="h-full"
            style={{
              background: index < filledSteps ? 
                `linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)` : 
                (index === filledSteps ? `linear-gradient(90deg, #3B82F6 0%, #8B5CF6 ${progress * 100}%, #E5E7EB ${progress * 100}%)` : '#E5E7EB'),
              flexGrow: 1
            }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

const SafeTalkApp = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [showAnswers, setShowAnswers] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const scrollPosition = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        setScrollProgress(scrollPosition / scrollHeight);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const currentSection = sections.find(s => s.id === activeSection);

  const formatAnswer = (answer) => {
    return answer.split('\n').map((line, index) => (
      <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    ));
  };

  return (
    <div className="h-screen overflow-hidden">
      <ProgressBar progress={scrollProgress} />
      <div 
        className="h-full overflow-y-auto pt-16 pb-24 px-4 bg-gray-100"
        ref={containerRef}
      >
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Safe Talk Interactive Learning</h1>
          <p className="text-center text-gray-600 mb-6">August Edition Version 1 - 15 August 2024</p>
          
          <motion.div 
            className="flex justify-between mb-6 sticky top-0 bg-white p-2 z-10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  className={`p-2 ${section.color} ${section.bgColor} ${activeSection === section.id ? 'font-bold ring-2 ring-offset-2 ring-gray-400' : ''} flex flex-col items-center rounded-lg transition-all duration-200`}
                  onClick={() => setActiveSection(section.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  <span className="mt-1 text-xs">{section.title}</span>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <label className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={() => setShowAnswers(!showAnswers)}
                className="mr-2"
              />
              Show Answers
            </label>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSection}
              className={`border p-4 rounded-lg ${currentSection.bgColor}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={`text-xl font-bold mb-4 ${currentSection.color}`}>{currentSection.title}</h2>
              {currentSection.questions.map((question, index) => (
                <motion.div 
                  key={index}
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <p className="text-lg font-semibold mb-2">{question.q}</p>
                  {showAnswers && (
                    <motion.div 
                      className="bg-white p-3 rounded-md shadow-inner"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatAnswer(question.a)}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SafeTalkApp;