import React, { useEffect, useRef, useState } from "react"
import cytoscape from "cytoscape"
import classes from "./Board.module.css"
// import edgeHandles from "cytoscape-edgehandles";
import Menu from "../menu/Menu"
import { Simulate } from "react-dom/test-utils"

// cytoscape.use(edgeHandles);

const Board = () => {
    const [cy, setCy] = useState<cytoscape.Core>()
    const [isPickingColor, setIsPickingColor] = useState(false)
    const [color, setColor] = useState<string>("999999")

    const graphRef = useRef(null)
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

        cy?.on("mousedown", (e) => {
            setIsPickingColor(false)
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

    const onColorChange = (color: string) => {
        setColor(color)
    }

    const onConfirmColor = () => {
        console.log(cy?.nodes().style())
        cy?.nodes(":selected").style({
            "background-color": color,
        })
        cy?.edges(":selected").style({
            "line-color": color,
        })
        setIsPickingColor(false)
    }

    return (
        <React.Fragment>
            <Menu
                onAddEdgeClick={addEdge}
                isPickingColor={isPickingColor}
                color={color}
                onChangeColorClick={() => setIsPickingColor(!isPickingColor)}
                onColorChange={onColorChange}
                onConfirmColor={onConfirmColor}
            />
            <div className={classes.board} ref={graphRef} id={"cyBoard"} />
        </React.Fragment>
    )
}

export default Board
