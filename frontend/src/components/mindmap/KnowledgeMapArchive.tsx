'use client'

import React, { useState, useEffect } from 'react';
import { Brain, BookOpen, CheckCircle, Star, Clock, Trophy, ArrowRight, ExternalLink, Search, Filter, Eye, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KnowledgeTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 1 | 2 | 3;
  completedAt: string;
  timeSpent: number;
  connections: string[];
  xpEarned: number;
  rating: number;
  position: { x: number; y: number };
}

interface KnowledgeConnection {
  from: string;
  to: string;
  strength: number;
  type: 'prerequisite' | 'related' | 'advanced';
}

const KnowledgeMapArchive: React.FC = () => {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);
  const [firingNeurons, setFiringNeurons] = useState<string[]>([]);

  // Knowledge Archive Data - Read-Only representation of learned topics
  const knowledgeTopics: KnowledgeTopic[] = [
    {
      id: 'html-basics',
      title: 'HTML Basics',
      description: 'Mastered HTML markup fundamentals',
      category: 'Frontend',
      difficulty: 1,
      completedAt: '2025-05-15',
      timeSpent: 8,
      connections: ['css-fundamentals'],
      xpEarned: 150,
      rating: 5,
      position: { x: 200, y: 300 }
    },
    {
      id: 'css-fundamentals',
      title: 'CSS Fundamentals',
      description: 'Expert in styling and responsive layouts',
      category: 'Frontend',
      difficulty: 2,
      completedAt: '2025-05-28',
      timeSpent: 12,
      connections: ['html-basics', 'javascript-basics'],
      xpEarned: 200,
      rating: 4,
      position: { x: 400, y: 250 }
    },
    {
      id: 'javascript-basics',
      title: 'JavaScript Basics',
      description: 'Proficient in JS programming and DOM manipulation',
      category: 'Programming',
      difficulty: 2,
      completedAt: '2025-06-10',
      timeSpent: 20,
      connections: ['css-fundamentals', 'react-fundamentals', 'nodejs-basics'],
      xpEarned: 300,
      rating: 5,
      position: { x: 600, y: 200 }
    },
    {
      id: 'react-fundamentals',
      title: 'React Fundamentals',
      description: 'Advanced component-based development skills',
      category: 'Framework',
      difficulty: 3,
      completedAt: '2025-06-18',
      timeSpent: 25,
      connections: ['javascript-basics'],
      xpEarned: 400,
      rating: 5,
      position: { x: 800, y: 150 }
    },
    {
      id: 'nodejs-basics',
      title: 'Node.js Basics',
      description: 'Server-side JavaScript development expertise',
      category: 'Backend',
      difficulty: 2,
      completedAt: '2025-06-05',
      timeSpent: 18,
      connections: ['javascript-basics'],
      xpEarned: 280,
      rating: 4,
      position: { x: 600, y: 400 }
    }
  ];

  // Knowledge connections (synapses in the neural network)
  const knowledgeConnections: KnowledgeConnection[] = [
    { from: 'html-basics', to: 'css-fundamentals', strength: 0.9, type: 'prerequisite' },
    { from: 'css-fundamentals', to: 'javascript-basics', strength: 0.8, type: 'prerequisite' },
    { from: 'javascript-basics', to: 'react-fundamentals', strength: 0.9, type: 'prerequisite' },
    { from: 'javascript-basics', to: 'nodejs-basics', strength: 0.7, type: 'related' },
  ];

  // Neural firing animation on hover
  useEffect(() => {
    if (hoveredTopic) {
      const topic = knowledgeTopics.find(t => t.id === hoveredTopic);
      if (topic) {
        setFiringNeurons([hoveredTopic, ...topic.connections]);
        setTimeout(() => setFiringNeurons([]), 2000);
      }
    }
  }, [hoveredTopic]);

  // Filter topics based on search and category
  const filteredTopics = knowledgeTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate knowledge stats
  const totalXP = knowledgeTopics.reduce((sum, topic) => sum + topic.xpEarned, 0);
  const totalTimeSpent = knowledgeTopics.reduce((sum, topic) => sum + topic.timeSpent, 0);
  const averageRating = knowledgeTopics.reduce((sum, topic) => sum + topic.rating, 0) / knowledgeTopics.length;
  const categories = Array.from(new Set(knowledgeTopics.map(topic => topic.category)));

  // Navigation functions
  const exploreInLearningBoard = (topicId: string) => {
    router.push(`/mindmap?topic=${topicId}&mode=explore`);
  };

  const reviewTopic = (topicId: string) => {
    router.push(`/mindmap?topic=${topicId}&mode=review`);
  };

  const findRelatedTopics = (topicId: string) => {
    router.push(`/mindmap?related=${topicId}&mode=discovery`);
  };

  // Get topic styling (all completed = green theme)
  const getTopicStyling = (topic: KnowledgeTopic) => {
    const isFiring = firingNeurons.includes(topic.id);
    
    return {
      bg: isFiring 
        ? 'bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse' 
        : 'bg-gradient-to-br from-green-500 to-emerald-600',
      border: 'border-green-300',
      shadow: isFiring ? 'shadow-blue-500/50 shadow-xl' : 'shadow-green-500/25',
      text: 'text-white'
    };
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] bg-[length:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,white_1px,transparent_1px)] bg-[length:30px_30px]" />
      </div>

      {/* Header - Archive Title & Stats */}
      <div className="absolute top-6 left-6 right-6 z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">Knowledge Archive</h1>
              <p className="text-white/70 text-sm">Your mastered learning journey</p>
            </div>
          </div>

          <button
            onClick={() => setShowStats(!showStats)}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-3 text-white hover:bg-white/20 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your knowledge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Knowledge Stats Panel */}
        {showStats && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{knowledgeTopics.length}</div>
              <div className="text-white/70 text-sm">Topics Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalXP}</div>
              <div className="text-white/70 text-sm">Total XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalTimeSpent}h</div>
              <div className="text-white/70 text-sm">Time Invested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</div>
              <div className="text-white/70 text-sm">Avg Rating</div>
            </div>
          </div>
        )}
      </div>

      {/* Neural Network Canvas */}
      <div className="relative w-full h-full pt-40 pb-8">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {/* Draw synaptic connections */}
          {knowledgeConnections.map((connection, index) => {
            const fromTopic = knowledgeTopics.find(t => t.id === connection.from);
            const toTopic = knowledgeTopics.find(t => t.id === connection.to);
            
            if (!fromTopic || !toTopic) return null;

            const isFiring = firingNeurons.includes(connection.from) && firingNeurons.includes(connection.to);

            return (
              <g key={index}>
                {/* Synaptic pathway */}
                <path
                  d={`M ${fromTopic.position.x + 60} ${fromTopic.position.y + 30} 
                      Q ${(fromTopic.position.x + toTopic.position.x) / 2} ${fromTopic.position.y - 50} 
                      ${toTopic.position.x + 60} ${toTopic.position.y + 30}`}
                  stroke={isFiring ? '#3B82F6' : '#10B981'}
                  strokeWidth={isFiring ? '4' : '2'}
                  fill="none"
                  opacity={connection.strength}
                  className={`transition-all duration-500 ${isFiring ? 'animate-pulse' : ''}`}
                />
                
                {/* Neural impulse animation */}
                {isFiring && (
                  <circle r="4" fill="#60A5FA" className="animate-ping">
                    <animateMotion dur="2s" repeatCount="indefinite">
                      <mpath href={`#path-${index}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Knowledge Nodes (Neurons) */}
        {filteredTopics.map((topic) => {
          const styling = getTopicStyling(topic);
          const isSelected = selectedTopic === topic.id;
          const isFiring = firingNeurons.includes(topic.id);

          return (
            <div
              key={topic.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer ${
                isSelected ? 'scale-110 z-20' : 'z-10 hover:scale-105'
              }`}
              style={{
                left: topic.position.x,
                top: topic.position.y
              }}
              onMouseEnter={() => setHoveredTopic(topic.id)}
              onMouseLeave={() => setHoveredTopic(null)}
              onClick={() => setSelectedTopic(topic.id)}
            >
              {/* Neuron Node */}
              <div
                className={`
                  w-32 h-24 rounded-2xl border-2 ${styling.bg} ${styling.border} 
                  shadow-xl ${styling.shadow} p-3 relative overflow-hidden
                  ${isFiring ? 'animate-pulse' : ''}
                `}
              >
                {/* Completion indicator */}
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-4 h-4 text-white drop-shadow-lg" />
                </div>

                {/* Content */}
                <div className="text-white relative z-10">
                  <h3 className="font-bold text-xs truncate">{topic.title}</h3>
                  <div className="flex items-center mt-1 text-xs opacity-90">
                    <Star className="w-3 h-3 mr-1" />
                    {topic.rating}/5
                  </div>
                  <div className="flex justify-between items-center mt-1 text-xs">
                    <span>{topic.xpEarned} XP</span>
                    <span>{topic.timeSpent}h</span>
                  </div>
                </div>

                {/* Neural firing effect */}
                {isFiring && (
                  <div className="absolute inset-0 bg-blue-400/30 rounded-2xl animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Topic Detail Modal - READ ONLY with Navigation */}
      {selectedTopic && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30" onClick={() => setSelectedTopic(null)}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const topic = knowledgeTopics.find(t => t.id === selectedTopic);
              if (!topic) return null;

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{topic.title}</h2>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-500 rounded-full px-3 py-1 text-sm font-medium text-white flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mastered
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{topic.description}</p>

                  {/* Achievement Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">{topic.timeSpent} hours invested</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center text-gray-700">
                        <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="text-sm font-medium">{topic.xpEarned} XP earned</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center text-gray-700">
                        <Star className="w-4 h-4 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">Rated {topic.rating}/5</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center text-gray-700">
                        <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                        <span className="text-sm font-medium">Completed {topic.completedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Actions - Bridge to Learning Board */}
                  <div className="space-y-3">
                    <button
                      onClick={() => exploreInLearningBoard(topic.id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Explore Further in Learning Board
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => reviewTopic(topic.id)}
                        className="bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-all flex items-center justify-center"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Review
                      </button>
                      
                      <button
                        onClick={() => findRelatedTopics(topic.id)}
                        className="bg-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-600 transition-all flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Related
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="w-full px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeMapArchive;