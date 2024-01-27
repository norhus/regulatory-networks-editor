import React, { useEffect, useState } from "react"
import cytoscape from "cytoscape"
import "./Board.css"

interface Props {
    nodes: cytoscape.NodeDefinition[]
    edges: cytoscape.EdgeDefinition[]
    setNodes: React.Dispatch<React.SetStateAction<cytoscape.NodeDefinition[]>>
    setEdges: React.Dispatch<React.SetStateAction<cytoscape.EdgeDefinition[]>>
    onSelectNode: (id: string, selected: boolean) => void
    resetSelected: () => void
}

const Board: React.FC<Props> = ({ nodes, edges, setNodes, setEdges, onSelectNode, resetSelected }) => {
    const [cy, setCy] = useState<cytoscape.Core | null>(null)
    console.log(nodes)

    useEffect(() => {
        setCy(
            cytoscape({
                container: document.getElementById("cy"),

                maxZoom: 1,

                selectionType: "additive",

                elements: {
                    nodes: nodes,
                    edges: edges,
                },

                layout: { name: "preset" },

                style: [
                    {
                        selector: "edge",
                        style: {
                            "curve-style": "segments",
                        },
                    },
                ],
            }),
        )
    }, [edges, nodes])

    useEffect(() => {
        cy?.on("dblclick", (e) => {
            if (e.target === cy) {
                const id: string = (cy?.nodes().length ? cy.nodes().length + 1 : 1).toString()
                setNodes([...nodes, { data: { id: id, label: `Node${id}` }, position: e.position }])
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

        return () => {
            cy?.removeAllListeners()
        }
    }, [cy, nodes, onSelectNode, resetSelected, setNodes])

    return <div className={"board"} id={"cy"} />
}

export default Board
