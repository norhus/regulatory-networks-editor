import React, {useState} from "react"
import Board from "./board/Board"
import Menu from "./menu/Menu"
import cytoscape from "cytoscape"

const addMode = {
    NODE: "node",
    EDGE: "edge"
}

const Main: React.FC = () => {
    const [nodes, setNodes] = useState<cytoscape.NodeDefinition[]>([
        { data: { id: "1", label: "Node 1" }, position: { x: 0, y: 0 } },
        { data: { id: "2", label: "Node 2" }, position: { x: 100, y: 0 } }
    ])
    const [edges, setEdges] = useState<cytoscape.EdgeDefinition[]>([
        { data: { source: "1", target: "2", label: "Edge from Node1 to Node2" }}
    ])
    const [mode, setMode] = useState<string>(addMode.NODE)

    return (
      <>
        <Menu setMode={setMode}/>
        <Board nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} mode={mode}/>
      </>
  )
};

export default Main
