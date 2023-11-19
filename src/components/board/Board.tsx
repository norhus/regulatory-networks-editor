import React, {useState} from "react"
import CytoscapeComponent from "react-cytoscapejs"
import cytoscape from "cytoscape"
import "./Board.css"

interface Props {
    nodes: cytoscape.NodeDefinition[],
    edges: cytoscape.EdgeDefinition[],
    setNodes: React.Dispatch<React.SetStateAction<cytoscape.NodeDefinition[]>>,
    setEdges: React.Dispatch<React.SetStateAction<cytoscape.EdgeDefinition[]>>,
    mode: string
}

const Board: React.FC<Props> = ({
    nodes,
    edges,
    setNodes,
    setEdges,
}) => {
    const [cy, setCy] = useState<cytoscape.Core|null>(null)
    console.log("yes")

    cy?.on("dblclick", (e) => {
        if (e.target === cy) {
            const id: string = (nodes.length + 1).toString()
            setNodes([...nodes, { data: { id: id, label: `Node ${id}` }, position: e.position }])
        }
    })

    // cy?.on("click", "node", (e) => {
    //     if (cy?.nodes(":selected").length === 2) {
    //         console.log(cy?.nodes(":selected").jsons())
    //         setEdges([...edges, { data: { source: "1", target: "2", label: `Edge from Node1 to Node2` }}])
    //     }
    // })

    return (
        <CytoscapeComponent
            cy={setCy}
            className={"board"}
            elements={
                CytoscapeComponent.normalizeElements({nodes, edges})
            }
        />
    )
};

export default Board
