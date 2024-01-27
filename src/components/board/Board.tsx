import React, { useEffect, useRef, useState } from "react"
import cytoscape from "cytoscape"
import "./Board.css"
// import edgeHandles from "cytoscape-edgehandles";
import Menu from "../menu/Menu"

// cytoscape.use(edgeHandles);

const Board = () => {
    const graphRef = useRef(null)
    const [cy, setCy] = useState<cytoscape.Core>()
    const selectedNodes = useRef<string[]>([])

    const initCytoscape = () => {
        const cy = cytoscape({
            container: graphRef.current,
            maxZoom: 1,

            selectionType: "additive",

            layout: { name: "preset" },

            style: [
                {
                    selector: "edge",
                    style: {
                        "curve-style": "unbundled-bezier",
                    },
                },
            ],
        })

        cy?.on("dblclick", (e) => {
            if (e.target === cy) {
                cy?.add({
                    group: "nodes",
                    data: { label: `Node${cy.nodes().length}` },
                    position: e.position,
                })
            }
        })

        cy?.on("select", "node", (e) => {
            selectedNodes.current = [...selectedNodes.current, e.target.data().id]
        })

        cy?.on("unselect", "node", (e) => {
            selectedNodes.current = selectedNodes.current.filter((node) => node !== e.target.data().id)
        })

        setCy(cy)
    }

    useEffect(() => {
        initCytoscape()
    }, [])

    const addEdge = () => {
        const source = selectedNodes.current[0]
        if (selectedNodes.current.length === 1) {
            const target = source
            if (
                !cy
                    ?.edges()
                    .toArray()
                    .find((edge) => {
                        return edge.data().source === source && edge.data().target === target
                    })
            ) {
                cy?.add({
                    group: "edges",
                    data: {
                        source: source,
                        target: target,
                        label: `Edge from ${source} to ${target}`,
                    },
                    pannable: false,
                })
            }
        } else if (selectedNodes.current.length === 2) {
            const target = selectedNodes.current[1]
            if (
                !cy
                    ?.edges()
                    .toArray()
                    .find((edge) => {
                        return edge.data().source === source && edge.data().target === target
                    })
            ) {
                cy?.add({
                    group: "edges",
                    data: {
                        source: source,
                        target: target,
                        label: `Edge from ${source} to ${target}`,
                    },
                    pannable: false,
                })
            }
        }
    }

    const changeColor = () => {
        cy?.elements(":selected").style({
            "background-color": "red",
            "line-color": "red",
        })
    }

    return (
        <>
            <Menu addEdge={addEdge} changeColor={changeColor} />
            <div className={"board"} ref={graphRef} id={"cyBoard"} />
        </>
    )
}

export default Board
