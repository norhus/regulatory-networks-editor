import React, {useEffect, useState} from "react"
import CytoscapeComponent from "react-cytoscapejs"
import cytoscape from "cytoscape"
import "./Board.css"

interface Props {
    nodes: cytoscape.NodeDefinition[]
    edges: cytoscape.EdgeDefinition[]
    setNodes: React.Dispatch<React.SetStateAction<cytoscape.NodeDefinition[]>>,
    setEdges: React.Dispatch<React.SetStateAction<cytoscape.EdgeDefinition[]>>,
    onSelectNode: (id: string, selected: boolean) => void,
    resetSelected: () => void,
}

const Board: React.FC<Props> = ({
    nodes,
    edges,
    setNodes,
    setEdges,
    onSelectNode,
    resetSelected
}) => {
    const [cyBoard, setCyBoard] = useState<cytoscape.Core | null>(null)

    useEffect(() => {
        cyBoard?.selectionType("additive")
        cyBoard?.on("dblclick", (e) => {
            if (e.target === cyBoard) {
                const id: string = (cyBoard?.nodes().length ? cyBoard.nodes().length + 1 : 1).toString()
                setNodes([...nodes, { data: { id: id, label: `Node${id}` }, position: e.position }])
            }
        })

        cyBoard?.on("click", (e) => {
            if (e.target === cyBoard) {
                resetSelected()
            } else if (e.target.isNode()) {
                if (e.target.selected()) {
                    onSelectNode(e.target.data().id, false)
                } else {
                    onSelectNode(e.target.data().id, true)
                }
            }
        })
        return () => {
            cyBoard?.removeAllListeners()
        }
    }, [cyBoard, nodes, onSelectNode, resetSelected, setNodes])

    return (
        <CytoscapeComponent
            key={"cyBoard"}
            id={"cyBoard"}
            cy={(cy) => {setCyBoard(cy)}}
            className={"board"}
            elements={
                CytoscapeComponent.normalizeElements({nodes, edges})
            }
        />
    )
};

export default Board
