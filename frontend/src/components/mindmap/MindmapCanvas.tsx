// src/components/mindmap/MindmapCanvas.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'

interface Node {
  id: string
  name: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  completed: boolean
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface Link {
  source: string | Node
  target: string | Node
  type: 'prerequisite' | 'related' | 'advanced'
  strength: number
}

interface MindmapData {
  nodes: Node[]
  links: Link[]
}

interface MindmapCanvasProps {
  data?: MindmapData
  width?: number
  height?: number
  onNodeClick?: (node: Node) => void
  onNodeDoubleClick?: (node: Node) => void
  selectedNodeId?: string
}

// Demo data for initial display
const defaultData: MindmapData = {
  nodes: [
    { id: '1', name: 'JavaScript', category: 'programming', difficulty: 'beginner', completed: true },
    { id: '2', name: 'React', category: 'frontend', difficulty: 'intermediate', completed: false },
    { id: '3', name: 'Node.js', category: 'backend', difficulty: 'intermediate', completed: false },
    { id: '4', name: 'TypeScript', category: 'programming', difficulty: 'advanced', completed: false },
    { id: '5', name: 'Express', category: 'backend', difficulty: 'beginner', completed: false }
  ],
  links: [
    { source: '1', target: '2', type: 'prerequisite', strength: 0.8 },
    { source: '1', target: '3', type: 'prerequisite', strength: 0.7 },
    { source: '1', target: '4', type: 'related', strength: 0.6 },
    { source: '3', target: '5', type: 'prerequisite', strength: 0.9 }
  ]
}

export default function MindmapCanvas({ 
  data = defaultData, 
  width = 800, 
  height = 600, 
  onNodeClick,
  onNodeDoubleClick,
  selectedNodeId 
}: MindmapCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(selectedNodeId || null)
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null)

  // Memoize callbacks to prevent recreation
  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node.id)
    onNodeClick?.(node)
  }, [onNodeClick])

  const handleNodeDoubleClick = useCallback((node: Node) => {
    onNodeDoubleClick?.(node)
  }, [onNodeDoubleClick])

  // Stable color scale
  const colorScale = useCallback((category: string) => {
    const colors: Record<string, string> = {
      'programming': '#3B82F6',
      'frontend': '#10B981', 
      'backend': '#F59E0B',
      'devops': '#EF4444',
      'design': '#8B5CF6'
    }
    return colors[category] || '#6B7280'
  }, [])

  // Reset view function
  const resetView = useCallback(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.transition().duration(750).call(
      d3.zoom<SVGSVGElement, unknown>().transform,
      d3.zoomIdentity.scale(1).translate(0, 0)
    )
  }, [])

  const fitAll = useCallback(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.transition().duration(750).call(
      d3.zoom<SVGSVGElement, unknown>().transform,
      d3.zoomIdentity.scale(0.8)
    )
  }, [])

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])

    // Create container for zoom/pan
    const container = svg.append("g")

    // Setup zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform)
      })

    svg.call(zoom)

    // Create force simulation
    const simulation = d3.forceSimulation<Node>(data.nodes)
      .force("link", d3.forceLink<Node, Link>(data.links)
        .id(d => d.id)
        .distance(d => d.type === 'prerequisite' ? 100 : 80)
        .strength(d => d.strength)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(35))

    // Store simulation reference
    simulationRef.current = simulation

    // Create arrow markers for directed links
    const defs = container.append("defs")
    
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#6B7280")

    // Create links
    const links = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", d => {
        switch (d.type) {
          case 'prerequisite': return '#EF4444'
          case 'related': return '#6B7280'
          case 'advanced': return '#8B5CF6'
          default: return '#6B7280'
        }
      })
      .attr("stroke-width", d => d.strength * 3)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", d => d.type === 'prerequisite' ? "url(#arrowhead)" : "")

    // Create node groups
    const nodeGroups = container.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")

    // Add circles for nodes
    const circles = nodeGroups.append("circle")
      .attr("r", d => {
        switch (d.difficulty) {
          case 'beginner': return 20
          case 'intermediate': return 25
          case 'advanced': return 30
          default: return 25
        }
      })
      .attr("fill", d => {
        if (d.completed) {
          return '#10B981'
        }
        return colorScale(d.category)
      })
      .attr("stroke", d => selectedNode === d.id ? "#1F2937" : "#FFFFFF")
      .attr("stroke-width", d => selectedNode === d.id ? 3 : 2)
      .attr("opacity", d => d.completed ? 0.9 : 0.7)

    // Add text labels
    nodeGroups.append("text")
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", "#FFFFFF")
      .attr("pointer-events", "none")

    // Add difficulty indicators
    nodeGroups.append("circle")
      .attr("r", 4)
      .attr("cx", 15)
      .attr("cy", -15)
      .attr("fill", d => {
        switch (d.difficulty) {
          case 'beginner': return '#10B981'
          case 'intermediate': return '#F59E0B'
          case 'advanced': return '#EF4444'
          default: return '#6B7280'
        }
      })
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 1)

    // Add completion checkmark
    nodeGroups.filter(d => d.completed)
      .append("text")
      .attr("x", -15)
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#10B981")
      .text("✓")

    // Node interactions
    nodeGroups
      .on("click", function(event, d) {
        event.stopPropagation()
        handleNodeClick(d)
        
        // Update stroke for selection
        circles.attr("stroke", node => node.id === d.id ? "#1F2937" : "#FFFFFF")
          .attr("stroke-width", node => node.id === d.id ? 3 : 2)
      })
      .on("dblclick", function(event, d) {
        event.stopPropagation()
        handleNodeDoubleClick(d)
      })
      .on("mouseover", function(event, d) {
        // Highlight connected nodes
        const connectedNodeIds = new Set<string>()
        
        data.links.forEach(link => {
          if (typeof link.source === 'object' && typeof link.target === 'object') {
            if (link.source.id === d.id) connectedNodeIds.add(link.target.id)
            if (link.target.id === d.id) connectedNodeIds.add(link.source.id)
          }
        })
        
        circles.attr("opacity", node => 
          node.id === d.id || connectedNodeIds.has(node.id) ? 1 : 0.3
        )
        
        links.attr("opacity", link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source
          const targetId = typeof link.target === 'object' ? link.target.id : link.target
          return sourceId === d.id || targetId === d.id ? 0.8 : 0.1
        })
      })
      .on("mouseout", function() {
        circles.attr("opacity", d => d.completed ? 0.9 : 0.7)
        links.attr("opacity", 0.6)
      })

    // Drag behavior
    const drag = d3.drag<SVGGElement, Node>()
      .on("start", function(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on("drag", function(event, d) {
        d.fx = event.x
        d.fy = event.y
      })
      .on("end", function(event, d) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeGroups.call(drag as any)

    // Update positions on simulation tick
    simulation.on("tick", () => {
      links
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!)

      nodeGroups.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    // Click on background to deselect
    svg.on("click", function(event) {
      if (event.target === svgRef.current) {
        setSelectedNode(null)
        circles.attr("stroke", "#FFFFFF").attr("stroke-width", 2)
      }
    })

    // Cleanup function
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
        simulationRef.current = null
      }
    }

  }, [data, width, height, selectedNode, handleNodeClick, handleNodeDoubleClick, colorScale])

  // Update selected node when prop changes
  useEffect(() => {
    setSelectedNode(selectedNodeId || null)
  }, [selectedNodeId])

  return (
    <div className="relative w-full h-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: height }}
      />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Programming</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Frontend</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Backend</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>🔴 → Prerequisites</div>
            <div>⚫ → Related Topics</div>
            <div>🟣 → Advanced Topics</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        <div className="flex flex-col space-y-2">
          <button 
            onClick={resetView}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reset View
          </button>
          <button 
            onClick={fitAll}
            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Fit All
          </button>
        </div>
      </div>
    </div>
  )
}
