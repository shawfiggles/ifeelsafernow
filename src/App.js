import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Shield, Stethoscope, Search, Moon, Sun, Star } from 'lucide-react';

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
  return (
    <div className="h-1 bg-gray-200">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        style={{ width: `${progress * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />
    </div>
  );
};

const SafeTalkApp = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [showAnswers, setShowAnswers] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
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

  useEffect(() => {
    // Scroll to top when changing categories
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [activeSection]);

  const currentSection = sections.find(s => s.id === activeSection);

  const formatAnswer = (answer) => {
    return answer.split('\n').map((line, index) => (
      <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    ));
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className={`fixed top-0 left-0 right-0 z-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <ProgressBar progress={scrollProgress} />
        <motion.div 
          className={`flex justify-between ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-2`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`mr-2 p-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            />
            <Search size={20} className={darkMode ? 'text-white' : 'text-gray-600'} />
          </div>
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
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400' : 'bg-gray-800'}`}
          >
            {darkMode ? <Sun size={20} color="black" /> : <Moon size={20} color="white" />}
          </button>
        </motion.div>
      </div>
      
      <div 
        className={`h-full overflow-y-auto pt-20 pb-24 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        ref={containerRef}
      >
        <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h1 className={`text-2xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Safe Talk Interactive Learning</h1>
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>August Edition Version 1 - 15 August 2024</p>
          
          <motion.div 
            className="mb-4 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <label className="flex items-center mr-4">
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
              className={`border p-4 rounded-lg ${darkMode ? 'bg-gray-700' : currentSection.bgColor}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : currentSection.color}`}>{currentSection.title}</h2>
              {currentSection.questions.filter(question => 
                question.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                question.a.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((question, index) => (
                <motion.div 
                  key={index}
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{question.q}</p>
                    <button
                      onClick={() => {
                        const newFavorites = favorites.includes(question.q)
                          ? favorites.filter(fav => fav !== question.q)
                          : [...favorites, question.q];
                        setFavorites(newFavorites);
                      }}
                      className={`ml-2 ${favorites.includes(question.q) ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      <Star size={20} />
                    </button>
                  </div>
                  {showAnswers && (
                    <motion.div 
                      className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-3 rounded-md shadow-inner`}
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
