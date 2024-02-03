import React, { useEffect, useRef, useState } from "react"
import cytoscape from "cytoscape"
import classes from "./Board.module.css"
import Menu from "../menu/Menu"
// import edgeHandles from "cytoscape-edgehandles"
// import edgeEditing from "cytoscape-edge-editing"
// import jquery from "jquery"
// import konva from "konva"

// edgeEditing(cytoscape, jquery, konva)

const Board = () => {
    const [cy, setCy] = useState<cytoscape.Core>()
    const [isPickingColor, setIsPickingColor] = useState(false)
    const [color, setColor] = useState<string>("999999")
    const [isPickingNodeShape, setIsPickingNodeShape] = useState(false)
    const [isPickingNodeDimensions, setIsPickingNodeDimensions] = useState(false)
    const [dimensions, setDimensions] = useState({ height: 30, width: 30 })

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
                    selector: "node:selected",
                    style: {
                        "border-width": 2,
                        "border-color": "black",
                        "background-color": "#999999",
                        // "background-blacken": 0.3,
                    },
                },
                {
                    selector: "edge",
                    style: {
                        "curve-style": "unbundled-bezier",
                        "line-color": "#999999",
                    },
                },
                {
                    selector: "edge:selected",
                    style: {
                        "overlay-opacity": 0.1,
                        "overlay-padding": 5,
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

        cy?.on("click", (e) => {
            if (e.target === cy) {
                setIsPickingColor(false)
                setIsPickingNodeShape(false)
                setIsPickingNodeDimensions(false)
            }
        })

        // console.log(cy?.edgeEditing())

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
        let opacity = 1
        let currentColor = color
        if (color.length > 7) {
            opacity = Math.round((parseInt(color.slice(-2), 16) / 255) * 100) / 100
            currentColor = currentColor.slice(0, -2)
        }
        cy?.nodes(":selected").style({
            "background-color": currentColor,
            "background-opacity": opacity,
        })
        cy?.edges(":selected").style({
            "line-color": currentColor,
            "line-opacity": opacity,
        })
        setIsPickingColor(false)
    }

    const onShapeChange = (shape: null | string = null) => {
        if (shape) {
            cy?.nodes(":selected").style({
                shape: shape,
            })
        }
        setIsPickingNodeShape(!isPickingNodeShape)
    }

    const onDimensionsChange = (dimensions: { height: number; width: number }) => {
        if (dimensions.height && dimensions.width && dimensions.height >= 30 && dimensions.width >= 30) {
            setDimensions(dimensions)
        }
    }

    const onConfirmDimensions = () => {
        cy?.nodes(":selected").style({
            height: dimensions.height,
            width: dimensions.width,
        })
        setIsPickingNodeDimensions(false)
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
                isPickingNodeShape={isPickingNodeShape}
                onShapeChange={onShapeChange}
                dimensions={dimensions}
                isPickingNodeDimensions={isPickingNodeDimensions}
                onChangeDimensionsClick={() => setIsPickingNodeDimensions(!isPickingNodeDimensions)}
                onDimensionsChange={onDimensionsChange}
                onConfirmDimensions={onConfirmDimensions}
            />
            <div className={classes.board} ref={graphRef} id={"cyBoard"} />
        </React.Fragment>
    )
}

export default Board
