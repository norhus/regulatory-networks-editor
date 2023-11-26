import React, {useState} from "react"
import Board from "./board/Board"
import Menu from "./menu/Menu"
import cytoscape from "cytoscape"

const Main: React.FC = () => {
	const [nodes, setNodes] = useState<cytoscape.NodeDefinition[]>([
		{ data: { id: "1", label: "Node1" }, position: { x: 0, y: 0 } },
		{ data: { id: "2", label: "Node2" }, position: { x: 100, y: 0 } }
	])
	const [edges, setEdges] = useState<cytoscape.EdgeDefinition[]>([
		{ data: { source: "1", target: "2", label: "Edge from Node1 to Node2" }}
	])
	const [selectedNodes, setSelectedNodes] = useState<string[]>([])

	const handleSelectNode = (id: string, selected: boolean) => {
		if (selected) {
			setSelectedNodes([...selectedNodes, id])
		} else {
			setSelectedNodes(selectedNodes.filter((node) => node !== id))
		}
	}

	const resetSelected = () => {
		setSelectedNodes([])
	}

	const addEdge = () => {
        if (selectedNodes.length === 2) {
			const newEdge: cytoscape.EdgeDefinition = { data: { source: selectedNodes[0], target: selectedNodes[1],
					label: `Edge from Node${selectedNodes[0]} to Node${selectedNodes[1]}` }}
			setEdges([...edges, newEdge])
		}
	}

	return (
        <>
          <Menu
			addEdge={addEdge}
          />
          <Board
			  nodes={nodes}
			  edges={edges}
			  setNodes={setNodes}
			  setEdges={setEdges}
			  onSelectNode={handleSelectNode}
			  resetSelected={resetSelected}
		  />
	    </>
    )
};

export default Main
