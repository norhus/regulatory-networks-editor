import React, { useState } from "react"
// import OldBoard from "./board/OldBoard"
// import Menu from "./menu/Menu"
import cytoscape from "cytoscape"
import Board from "./board/Board"

const Main: React.FC = () => {
    const [nodes, setNodes] = useState<cytoscape.NodeDefinition[]>([
        { data: { id: "1", label: "Node1" }, position: { x: 0, y: 0 } },
        { data: { id: "2", label: "Node2" }, position: { x: 100, y: 0 } },
    ])
    const [edges, setEdges] = useState<cytoscape.EdgeDefinition[]>([
        {
            data: { source: "1", target: "2", label: "Edge from Node1 to Node2" },
            pannable: false,
        },
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
            const newEdge: cytoscape.EdgeDefinition = {
                data: {
                    source: selectedNodes[0],
                    target: selectedNodes[1],
                    label: `Edge from Node${selectedNodes[0]} to Node${selectedNodes[1]}`,
                },
            }
            setEdges([...edges, newEdge])
        }
    }

    return (
        <>
            {/*<Menu addEdge={addEdge} />*/}
            {/*<OldBoard*/}
            {/*  nodes={nodes}*/}
            {/*  edges={edges}*/}
            {/*  setNodes={setNodes}*/}
            {/*  setEdges={setEdges}*/}
            {/*  onSelectNode={handleSelectNode}*/}
            {/*  resetSelected={resetSelected}*/}
            {/*/>*/}
            <Board />
        </>
    )
}

export default Main
