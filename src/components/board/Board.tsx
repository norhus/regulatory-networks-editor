import React from "react"
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

    return (
        <CytoscapeComponent
            key={"cyBoard"}
            id={"cyBoard"}
            cy={(cy) => {
                cy.selectionType("additive")
                cy?.on("dblclick", (e) => {
                    if (e.target === cy) {
                        const id: string = (cy.nodes().length + 1).toString()
                        // cy.add({
                        //     group: "nodes",
                        //     data: { id: id, label: `Node ${id}` },
                        //     position: e.position
                        // })
                        setNodes([...nodes, { data: { id: id, label: `Node ${id}` }, position: e.position }])
                    }
                })

                cy?.on("click", (e) => {
                    if (e.target === cy) {
                        resetSelected()
                    } else if (e.target.isNode()) {
                        if (e.target.selected()) {
                            onSelectNode(e.target.data().id, false)
                        } else {
                            onSelectNode(e.target.data().id, true)
                        }
                    }
                })
            }}
            className={"board"}
            elements={
                CytoscapeComponent.normalizeElements({nodes, edges})
            }
        />
    )
};

export default Board
