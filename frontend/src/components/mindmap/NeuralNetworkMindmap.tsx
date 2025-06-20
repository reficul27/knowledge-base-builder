'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, BookOpen, Code, Database, Palette, Users, Cloud, ArrowLeft, Settings, Share } from 'lucide-react';
import Link from 'next/link';

interface NeuralNode {
  id: string;
  title: string;
  type: 'brain' | 'category' | 'topic';
  category?: string;
  position: { x: number; y: number };
  size: number;
  color: string;
  completedTopics?: number;
  totalTopics?: number;
  xp: number;
  connections: string[];
  lastActivity?: Date;
}

interface NeuralConnection {
  id: string;
  from: string;
  to: string;
  strength: number; // 0-1, affects line thickness
  activity: number; // 0-1, recent activity level
}

interface HoverFiring {
  id: string;
  connectionId: string;
  fromNodeId: string;
  toNodeId: string;
  progress: number; // 0-1 along the connection
  startTime: number;
  intensity: number;
}

const KnowledgeMapMindmap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoverFirings, setHoverFirings] = useState<HoverFiring[]>([]);
  const [reachedNodes, setReachedNodes] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Knowledge Map Data - Complete Learning Archive
  const nodes: NeuralNode[] = [
    // Central Brain Node
    {
      id: 'my-brain',
      title: 'My Knowledge',
      type: 'brain',
      position: { x: 400, y: 300 }, // Slightly off-center
      size: 100,
      color: '#8B5CF6', // Purple
      xp: 2850,
      connections: ['programming', 'web-dev', 'data-science', 'devops', 'design', 'soft-skills']
    },

    // Category Nodes (Primary Dendrites)
    {
      id: 'programming',
      title: 'Programming Languages',
      type: 'category',
      position: { x: 200, y: 150 },
      size: 70,
      color: '#3B82F6', // Blue
      completedTopics: 8,
      totalTopics: 12,
      xp: 650,
      connections: ['javascript', 'python', 'typescript'],
      lastActivity: new Date(2025, 5, 19)
    },
    {
      id: 'web-dev',
      title: 'Web Development',
      type: 'category',
      position: { x: 600, y: 120 },
      size: 75,
      color: '#10B981', // Green
      completedTopics: 12,
      totalTopics: 15,
      xp: 890,
      connections: ['react', 'nextjs', 'css'],
      lastActivity: new Date(2025, 5, 20)
    },
    {
      id: 'data-science',
      title: 'Data Science',
      type: 'category',
      position: { x: 650, y: 450 },
      size: 60,
      color: '#F59E0B', // Amber
      completedTopics: 4,
      totalTopics: 10,
      xp: 320,
      connections: ['pandas', 'machine-learning'],
      lastActivity: new Date(2025, 5, 15)
    },
    {
      id: 'devops',
      title: 'DevOps & Cloud',
      type: 'category',
      position: { x: 150, y: 480 },
      size: 65,
      color: '#EF4444', // Red
      completedTopics: 6,
      totalTopics: 12,
      xp: 450,
      connections: ['docker', 'kubernetes', 'aws'],
      lastActivity: new Date(2025, 5, 18)
    },
    {
      id: 'design',
      title: 'Design & UX',
      type: 'category',
      position: { x: 120, y: 320 },
      size: 55,
      color: '#8B5CF6', // Purple
      completedTopics: 3,
      totalTopics: 8,
      xp: 240,
      connections: ['figma', 'user-research'],
      lastActivity: new Date(2025, 5, 10)
    },
    {
      id: 'soft-skills',
      title: 'Soft Skills',
      type: 'category',
      position: { x: 580, y: 520 },
      size: 50,
      color: '#F97316', // Orange
      completedTopics: 5,
      totalTopics: 6,
      xp: 300,
      connections: ['communication', 'leadership'],
      lastActivity: new Date(2025, 5, 12)
    },

    // Topic Nodes (Secondary Neurons)
    {
      id: 'javascript',
      title: 'JavaScript',
      type: 'topic',
      category: 'programming',
      position: { x: 80, y: 100 },
      size: 40,
      color: '#F7DF1E',
      xp: 180,
      connections: []
    },
    {
      id: 'python',
      title: 'Python',
      type: 'topic',
      category: 'programming',
      position: { x: 150, y: 80 },
      size: 35,
      color: '#3776AB',
      xp: 140,
      connections: []
    },
    {
      id: 'typescript',
      title: 'TypeScript',
      type: 'topic',
      category: 'programming',
      position: { x: 250, y: 70 },
      size: 38,
      color: '#3178C6',
      xp: 160,
      connections: []
    },
    {
      id: 'react',
      title: 'React',
      type: 'topic',
      category: 'web-dev',
      position: { x: 700, y: 80 },
      size: 45,
      color: '#61DAFB',
      xp: 220,
      connections: []
    },
    {
      id: 'nextjs',
      title: 'Next.js',
      type: 'topic',
      category: 'web-dev',
      position: { x: 750, y: 150 },
      size: 40,
      color: '#000000',
      xp: 190,
      connections: []
    },
    {
      id: 'docker',
      title: 'Docker',
      type: 'topic',
      category: 'devops',
      position: { x: 80, y: 550 },
      size: 42,
      color: '#2496ED',
      xp: 170,
      connections: []
    }
  ];

  // Neural Connections (Synapses)
  const connections: NeuralConnection[] = [
    // Brain to Categories
    { id: 'brain-prog', from: 'my-brain', to: 'programming', strength: 0.9, activity: 0.7 },
    { id: 'brain-web', from: 'my-brain', to: 'web-dev', strength: 0.95, activity: 0.8 },
    { id: 'brain-data', from: 'my-brain', to: 'data-science', strength: 0.6, activity: 0.3 },
    { id: 'brain-devops', from: 'my-brain', to: 'devops', strength: 0.7, activity: 0.5 },
    { id: 'brain-design', from: 'my-brain', to: 'design', strength: 0.5, activity: 0.2 },
    { id: 'brain-soft', from: 'my-brain', to: 'soft-skills', strength: 0.8, activity: 0.4 },

    // Categories to Topics
    { id: 'prog-js', from: 'programming', to: 'javascript', strength: 0.9, activity: 0.6 },
    { id: 'prog-py', from: 'programming', to: 'python', strength: 0.7, activity: 0.4 },
    { id: 'prog-ts', from: 'programming', to: 'typescript', strength: 0.8, activity: 0.5 },
    { id: 'web-react', from: 'web-dev', to: 'react', strength: 0.95, activity: 0.8 },
    { id: 'web-next', from: 'web-dev', to: 'nextjs', strength: 0.8, activity: 0.6 },
    { id: 'devops-docker', from: 'devops', to: 'docker', strength: 0.85, activity: 0.7 },

    // Cross-connections (Knowledge Links)
    { id: 'js-react', from: 'javascript', to: 'react', strength: 0.9, activity: 0.5 },
    { id: 'ts-react', from: 'typescript', to: 'react', strength: 0.8, activity: 0.4 },
    { id: 'react-next', from: 'react', to: 'nextjs', strength: 0.9, activity: 0.6 }
  ];

  // Calculate curved path for organic synapses
  const getConnectionPath = (from: NeuralNode, to: NeuralNode): string => {
    const dx = to.position.x - from.position.x;
    const dy = to.position.y - from.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Create organic curve with control points
    const curvature = 0.3;
    const midX = (from.position.x + to.position.x) / 2;
    const midY = (from.position.y + to.position.y) / 2;
    
    // Perpendicular offset for curve
    const offsetX = -dy * curvature * (distance / 400);
    const offsetY = dx * curvature * (distance / 400);
    
    const controlX = midX + offsetX;
    const controlY = midY + offsetY;
    
    return `M ${from.position.x} ${from.position.y} Q ${controlX} ${controlY} ${to.position.x} ${to.position.y}`;
  };

  // Get point along curved path for elegant firing animation
  const getPointAlongPath = (pathString: string, progress: number): { x: number; y: number } => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    // Create temporary path element to calculate point
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', pathString);
    svgRef.current.appendChild(tempPath);
    
    try {
      const pathLength = tempPath.getTotalLength();
      const point = tempPath.getPointAtLength(pathLength * progress);
      svgRef.current.removeChild(tempPath);
      return { x: point.x, y: point.y };
    } catch (e) {
      svgRef.current.removeChild(tempPath);
      return { x: 0, y: 0 };
    }
  };

  // Get node by ID
  const getNode = (id: string) => nodes.find(n => n.id === id);

  // Get category icon
  const getCategoryIcon = (nodeId: string) => {
    const icons = {
      'my-brain': Brain,
      'programming': Code,
      'web-dev': BookOpen,
      'data-science': Database,
      'devops': Cloud,
      'design': Palette,
      'soft-skills': Users
    };
    return icons[nodeId as keyof typeof icons] || BookOpen;
  };

  // Handle elegant node hover with neural firing
  const handleNodeHover = (node: NeuralNode) => {
    setHoveredNode(node.id);
    setReachedNodes(new Set());
    
    // Find all connections pointing TO this node (incoming connections)
    const incomingConnections = connections.filter(conn => conn.to === node.id);
    
    // Create elegant firing animations from connected nodes TO the hovered node
    const newFirings: HoverFiring[] = incomingConnections.map((conn, index) => ({
      id: `firing-${conn.id}-${Date.now()}-${index}`,
      connectionId: conn.id,
      fromNodeId: conn.from,
      toNodeId: conn.to,
      progress: 0,
      startTime: Date.now() + (index * 200), // Staggered start for elegance
      intensity: conn.activity
    }));
    
    setHoverFirings(newFirings);
  };

  // Handle node leave
  const handleNodeLeave = () => {
    setHoveredNode(null);
    setHoverFirings([]);
    setReachedNodes(new Set());
  };

  // Handle node click
  const handleNodeClick = (node: NeuralNode) => {
    setSelectedNode(node.id);
  };

  // Elegant slower neural firing animation
  useEffect(() => {
    if (!mounted || hoverFirings.length === 0) return;

    const animateElegantFirings = () => {
      const now = Date.now();
      
      setHoverFirings(prev => {
        const updated = prev.map(firing => {
          // Check if firing should start (staggered timing)
          if (now < firing.startTime) {
            return firing;
          }
          
          const elapsed = now - firing.startTime;
          const duration = 2000; // 2 seconds for very elegant, slow animation
          let progress = Math.min(elapsed / duration, 1);
          
          // Use ease-out cubic for very smooth deceleration
          progress = 1 - Math.pow(1 - progress, 3);
          
          // Check if firing reached target (95% to account for curve endpoints)
          if (progress >= 0.95 && !reachedNodes.has(firing.toNodeId)) {
            setReachedNodes(prev => new Set([...prev, firing.toNodeId]));
          }
          
          return {
            ...firing,
            progress: progress
          };
        });

        // Keep firings until they complete and a bit longer for smooth transition
        return updated.filter(firing => {
          const elapsed = now - firing.startTime;
          return elapsed < 2500; // Keep for 2.5 seconds total
        });
      });

      if (hoveredNode && hoverFirings.some(f => now >= f.startTime)) {
        animationRef.current = requestAnimationFrame(animateElegantFirings);
      }
    };

    animationRef.current = requestAnimationFrame(animateElegantFirings);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, hoveredNode, hoverFirings.length]);

  // Calculate total brain stats
  const totalXP = nodes.reduce((sum, node) => sum + node.xp, 0);
  const completedTopics = nodes.filter(n => n.type === 'category').reduce((sum, n) => sum + (n.completedTopics || 0), 0);
  const totalTopics = nodes.filter(n => n.type === 'category').reduce((sum, n) => sum + (n.totalTopics || 0), 0);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>

        <div className="flex items-center space-x-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-4 py-2">
            <div className="flex items-center space-x-4 text-white text-sm">
              <span className="flex items-center">
                <Brain className="w-4 h-4 mr-1" />
                Knowledge Map
              </span>
              <span className="text-white/70">|</span>
              <span>{completedTopics}/{totalTopics} Topics</span>
              <span className="text-white/70">|</span>
              <span>{totalXP} XP</span>
            </div>
          </div>

          <button className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 text-white hover:bg-white/20 transition-all">
            <Settings className="h-4 w-4" />
          </button>
          <button className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 text-white hover:bg-white/20 transition-all">
            <Share className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Knowledge Map Canvas */}
      <div className="flex-1 relative overflow-hidden pt-20">
        <svg 
          ref={svgRef}
          viewBox="0 0 800 600" 
          className="w-full h-full"
          style={{ background: 'transparent' }}
        >
          {/* Definitions for gradients and effects */}
          <defs>
            <radialGradient id="brainGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
            </radialGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="neuralGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="brightGlow">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="firingGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Neural Connections (Synapses) */}
          {connections.map(connection => {
            const fromNode = getNode(connection.from);
            const toNode = getNode(connection.to);
            if (!fromNode || !toNode) return null;

            const isActive = hoveredNode === connection.to;
            const pathString = getConnectionPath(fromNode, toNode);

            return (
              <g key={connection.id}>
                {/* Main synaptic path */}
                <path
                  d={pathString}
                  stroke={isActive ? 
                    `rgba(139, 92, 246, 0.9)` : 
                    `rgba(139, 92, 246, ${0.25 + connection.activity * 0.25})`
                  }
                  strokeWidth={isActive ? 
                    4 + connection.strength * 4 : 
                    2 + connection.strength * 2
                  }
                  fill="none"
                  filter={isActive ? "url(#brightGlow)" : "url(#neuralGlow)"}
                  className="transition-all duration-700"
                />
                
                {/* Elegant hover-based neural firing */}
                {hoverFirings
                  .filter(firing => firing.connectionId === connection.id && Date.now() >= firing.startTime)
                  .map(firing => {
                    const point = getPointAlongPath(pathString, firing.progress);
                    
                    // Calculate opacity based on progress (fade out near end)
                    const opacity = firing.progress < 0.9 ? 
                      0.8 + firing.intensity * 0.2 : 
                      (1 - firing.progress) * 8; // Fade out in last 10%
                    
                    return (
                      <circle
                        key={firing.id}
                        cx={point.x}
                        cy={point.y}
                        r={3 + firing.intensity * 2}
                        fill={`rgba(255, 255, 255, ${Math.max(0, opacity)})`}
                        filter="url(#firingGlow)"
                        className="transition-opacity duration-300"
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* Neural Nodes */}
          {nodes.map(node => {
            const Icon = getCategoryIcon(node.id);
            const isSelected = selectedNode === node.id;
            const isBrainCenter = node.type === 'brain';
            const isHovered = hoveredNode === node.id;
            const isFiringTarget = reachedNodes.has(node.id);
            
            // Enhanced intensity for firing targets
            const nodeIntensity = isFiringTarget ? 1.3 : (isHovered ? 1.15 : 1);
            
            return (
              <g 
                key={node.id} 
                className="cursor-pointer" 
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => handleNodeHover(node)}
                onMouseLeave={handleNodeLeave}
              >
                {/* Enhanced glow ring for firing targets */}
                {isFiringTarget && (
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.size / 2 + 12}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="2"
                    opacity="0.8"
                    filter="url(#brightGlow)"
                    className="animate-pulse"
                  />
                )}

                {/* Node background */}
                <circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r={(node.size / 2) * nodeIntensity}
                  fill={isBrainCenter ? 'url(#brainGradient)' : node.color}
                  opacity={isFiringTarget ? 1 : (isBrainCenter ? 0.9 : 0.8)}
                  stroke={isSelected ? '#FFFFFF' : (isFiringTarget ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)')}
                  strokeWidth={isSelected || isFiringTarget ? 3 : 1}
                  filter={isFiringTarget ? 'url(#brightGlow)' : (isBrainCenter ? 'url(#glow)' : 'url(#neuralGlow)')}
                  className={`transition-all duration-500 ${isBrainCenter ? 'animate-pulse' : ''}`}
                />

                {/* Node icon */}
                <foreignObject
                  x={node.position.x - 12}
                  y={node.position.y - 12}
                  width="24"
                  height="24"
                >
                  <Icon className={`w-6 h-6 text-white drop-shadow-lg ${isFiringTarget ? 'filter brightness-125' : ''}`} />
                </foreignObject>

                {/* Node label */}
                <text
                  x={node.position.x}
                  y={node.position.y + node.size / 2 + 20}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight={isFiringTarget ? "600" : "500"}
                  className="drop-shadow-lg transition-all duration-500"
                >
                  {node.title}
                </text>

                {/* Progress indicator for categories */}
                {node.type === 'category' && node.completedTopics && node.totalTopics && (
                  <text
                    x={node.position.x}
                    y={node.position.y + node.size / 2 + 35}
                    textAnchor="middle"
                    fill="rgba(255, 255, 255, 0.7)"
                    fontSize="10"
                  >
                    {node.completedTopics}/{node.totalTopics}
                  </text>
                )}

                {/* REMOVED: Activity indicator - no more annoying animations! */}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedNode(null)}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const node = getNode(selectedNode);
              if (!node) return null;

              const Icon = getCategoryIcon(node.id);

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center`} style={{ backgroundColor: node.color }}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{node.title}</h2>
                        <p className="text-sm text-gray-500 capitalize">{node.type}</p>
                      </div>
                    </div>
                  </div>

                  {node.type === 'category' && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-gray-900">{node.completedTopics}</div>
                        <div className="text-sm text-gray-600">Completed Topics</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">{node.xp}</div>
                        <div className="text-sm text-gray-600">XP Earned</div>
                      </div>
                    </div>
                  )}

                  {node.type === 'brain' && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-gray-900">{completedTopics}</div>
                        <div className="text-sm text-gray-600">Total Topics</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">{totalXP}</div>
                        <div className="text-sm text-gray-600">Total XP</div>
                      </div>
                    </div>
                  )}

                  {node.lastActivity && (
                    <div className="mb-6">
                      <div className="text-sm text-gray-600 mb-2">Last Activity</div>
                      <div className="text-gray-900">{node.lastActivity.toLocaleDateString()}</div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all">
                      {node.type === 'brain' ? 'View Overview' : node.type === 'category' ? 'Explore Category' : 'Review Topic'}
                    </button>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
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

export default KnowledgeMapMindmap;