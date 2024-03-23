import React, { useEffect, useRef, useState } from "react"
import cytoscape from "cytoscape"
import classes from "./Board.module.css"
import Menu from "../menu/Menu"
import compoundDragAndDrop from "cytoscape-compound-drag-and-drop"
import noOverlap from "cytoscape-no-overlap"
import edgeEditing from "cytoscape-edge-editing"
import jquery from "jquery"
import konva from "konva"
import gridGuide from "cytoscape-grid-guide"
import cytoscapeDagre from "cytoscape-dagre"
import panzoom from "cytoscape-panzoom"
import "../../../node_modules/cytoscape-panzoom/cytoscape.js-panzoom.css"
import navigator from "cytoscape-navigator"
import "../../../node_modules/cytoscape-navigator/cytoscape.js-navigator.css"
import "../../../node_modules/cytoscape-panzoom/font-awesome-4.0.3/css/font-awesome.css"

// Make jquery globally available. This is required for
// cytoscape-edge-editing to work.
;(global as any).$ = (global as any).jQuery = jquery
// Types seem to work poorly for this module, so we register it
// like this to avoid issues.
;(edgeEditing as any)(cytoscape, jquery, konva)
cytoscape.use(compoundDragAndDrop)
cytoscape.use(noOverlap)
gridGuide(cytoscape)
cytoscape.use(cytoscapeDagre)
panzoom(cytoscape)
navigator(cytoscape)

const layouts: any = {
    random: { name: "random" },
    preset: { name: "preset" },
    grid: { name: "grid" },
    circle: { name: "circle" },
    concentric: { name: "concentric" },
    breadthfirst: { name: "breadthfirst", directed: true },
    cose: { name: "cose", animate: false },
    dagre: { name: "dagre" },
}

const Board = () => {
    const [cy, setCy] = useState<cytoscape.Core>()
    const [isPickingColor, setIsPickingColor] = useState(false)
    const [color, setColor] = useState<string>("999999")
    const [isPickingNodeShape, setIsPickingNodeShape] = useState(false)
    const [isPickingNodeDimensions, setIsPickingNodeDimensions] = useState(false)
    const [dimensions, setDimensions] = useState({ height: 30, width: 30 })
    const [isPickingCurveStyle, setIsPickingCurveStyle] = useState(false)
    const [currentCurveStyle, setCurrentCurveStyle] = useState<string>("unbundled-bezier")
    const [compartmentsMode, setCompartmentsMode] = useState(false)
    const [labelsVisible, setLabelsVisible] = useState(true)
    const [isPickingLayout, setIsPickingLayout] = useState(false)
    const [gridEnabled, setGridEnabled] = useState(true)
    const [cdnd, setCdnd] = useState()
    const [ee, setEe] = useState()
    const [gg, setGg] = useState()

    const graphRef = useRef(null)
    const selectedNodes = useRef<string[]>([])
    const numberOfNodes = useRef<number>(0)
    const labelsVisibleRef = useRef(true)
    const inputFile = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        labelsVisibleRef.current = labelsVisible
    }, [labelsVisible])

    const initCytoscape = () => {
        const cy = cytoscape({
            layout: layouts.preset,
            container: graphRef.current,
            maxZoom: 10,
            minZoom: 0.1,
            selectionType: "additive",
            wheelSensitivity: 0.1,

            style: [
                {
                    selector: "node[label]",
                    style: {
                        label: "data(label)",
                        "text-valign": "top",
                        "text-wrap": "ellipsis",
                        "text-max-width": "80",
                        "font-size": 12,
                        "text-background-color": "#FFFFFF",
                        "text-background-opacity": 0.8,
                        "text-background-shape": "roundrectangle",
                    },
                },
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
                    selector: "node:active",
                    style: {
                        "border-width": 2,
                        "border-color": "black",
                        "background-color": "#999999",
                        "overlay-opacity": 0.1,
                        "overlay-padding": 5,
                    },
                },
                {
                    selector: "node:parent:selected",
                    style: {
                        "border-width": 2,
                        "border-color": "black",
                        "background-color": "#DDDDDD",
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
                {
                    selector: "edge:active",
                    style: {
                        "overlay-opacity": 0.1,
                        "overlay-padding": 5,
                    },
                },
            ],
        })

        cy.on("mousedown", "node", (e) => {
            // @ts-ignore
            cy.nodes().noOverlap({ padding: 2.5 })
        })

        cy.on("dblclick", (e) => {
            if (e.target === cy) {
                const nodeNumber = numberOfNodes.current + 1
                cy.add({
                    group: "nodes",
                    data: { label: `Node_${nodeNumber}` },
                    position: e.position,
                    style: {
                        "text-opacity": labelsVisibleRef.current ? 1 : 0,
                    },
                })
                numberOfNodes.current = nodeNumber
            }
        })

        cy.on("select", "node", (e) => {
            selectedNodes.current = [...selectedNodes.current, e.target.data().id]
        })

        cy.on("unselect", "node", (e) => {
            selectedNodes.current = selectedNodes.current.filter((node) => node !== e.target.data().id)
        })

        cy.on("click", (e) => {
            if (e.target === cy) {
                setIsPickingColor(false)
                setIsPickingNodeShape(false)
                setIsPickingNodeDimensions(false)
                setIsPickingCurveStyle(false)
                setIsPickingLayout(false)
            }
        })

        // So far, we use the default parameters for edge editing.
        const ee = (cy as any).edgeEditing({})
        // Edge editing *always* registers a context-tap listener
        // and calls the context menu from there, even if the context
        // menu extension is not present (I believe this is a bug, but
        // it could also be a change in cytoscape behaviour; maybe this
        // even was previously not triggered at all if the extension
        // was not present).
        //
        // This removes said listener completely. Fortunately, we don't
        // use any other functionality that requires this event, so we
        // can go a little "overboard" here and remove all listeners.
        cy.off("cxttap")

        // @ts-ignore
        const cdnd = cy.compoundDragAndDrop()
        // @ts-ignore
        cdnd.disable()

        // @ts-ignore
        const gg = cy.gridGuide({
            snapToGridOnRelease: true,
            snapToGridDuringDrag: false,
            geometricGuideline: true,
            gridSpacing: 40,
            drawGrid: true,
            panGrid: true,
            snapToGridCenter: false,
        })

        // @ts-ignore
        cy.panzoom()

        // @ts-ignore
        cy.navigator()

        setGg(gg)
        setEe(ee)
        setCdnd(cdnd)
        setCy(cy)
    }

    useEffect(() => {
        initCytoscape()
    }, [])

    const addEdgeToCy = (source: string, target: string, curveStyle: string) => {
        if (
            !cy
                ?.edges()
                .toArray()
                .find((edge) => {
                    return edge.data().source === source && edge.data().target === target
                })
        ) {
            cy
                ?.add({
                    group: "edges",
                    data: {
                        source: source,
                        target: target,
                        label: `Edge from ${source} to ${target}`,
                    },
                    pannable: false,
                })
                .style("curve-style", curveStyle)
        }
    }

    const addEdge = () => {
        const source = selectedNodes.current[0]
        if (selectedNodes.current.length === 1) {
            addEdgeToCy(source, source, currentCurveStyle)
        } else if (selectedNodes.current.length === 2) {
            const target = selectedNodes.current[1]
            addEdgeToCy(source, target, currentCurveStyle)
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

    const onCurveStyleChange = (curveStyle: null | string = null) => {
        if (curveStyle) {
            const edgesToChange = cy?.edges(":selected").clone()

            cy?.remove(cy?.edges(":selected"))
            edgesToChange?.forEach((edge) => addEdgeToCy(edge.data().source, edge.data().target, curveStyle))

            setCurrentCurveStyle(curveStyle)
        }
        setIsPickingCurveStyle(!isPickingCurveStyle)
    }

    const onCreateCompartmentsClick = (enable: boolean) => {
        // @ts-ignore
        enable ? cdnd?.enable() : cdnd?.disable()
        setCompartmentsMode(enable)
    }

    const toggleLabelsVisibility = () => {
        labelsVisible ? cy?.nodes().style("text-opacity", 0) : cy?.nodes().style("text-opacity", 1)
        setLabelsVisible(!labelsVisible)
    }

    const toggleGrid = () => {
        if (gridEnabled) {
            // @ts-ignore
            cy?.gridGuide({
                snapToGridOnRelease: false,
                geometricGuideline: false,
                drawGrid: false,
            })
        } else {
            // @ts-ignore
            cy?.gridGuide({
                snapToGridOnRelease: true,
                geometricGuideline: true,
                drawGrid: true,
            })
        }

        setGridEnabled(!gridEnabled)
    }

    const onApplyLayout = (layout: null | string = null) => {
        if (layout) {
            if (cy?.nodes(":selected").length !== 0) {
                if (["dagre", "breadthfirst"].includes(layout)) {
                    const unselectedNodes = cy?.nodes(":unselected").clone()
                    const unselectedConnectedEdges = cy?.nodes(":unselected").connectedEdges()

                    cy?.remove(cy?.nodes(":unselected"))
                    cy?.layout(layouts[layout]).run()

                    cy?.add(unselectedNodes as cytoscape.NodeCollection)
                    cy?.add(unselectedConnectedEdges as cytoscape.EdgeCollection)
                } else {
                    cy?.nodes(":selected").layout(layouts[layout]).run()
                }
            } else {
                cy?.layout(layouts[layout]).run()
            }

            if (gridEnabled) {
                // @ts-ignore
                cy?.gridGuide({
                    snapToGridOnRelease: false,
                })

                // @ts-ignore
                cy?.gridGuide({
                    snapToGridOnRelease: true,
                })
            }
        }
        setIsPickingLayout(!isPickingLayout)
    }

    const changeSpacing = (increase: boolean = false) => {
        if (cy?.nodes(":selected").length !== 0) {
            cy
                ?.nodes(":selected")
                .layout({
                    name: "preset",
                    spacingFactor: increase ? 2 : 0.5,
                })
                .run()
        } else {
            cy
                ?.layout({
                    name: "preset",
                    spacingFactor: increase ? 2 : 0.5,
                })
                .run()
        }

        if (gridEnabled) {
            // @ts-ignore
            cy?.gridGuide({
                snapToGridOnRelease: false,
            })

            // @ts-ignore
            cy?.gridGuide({
                snapToGridOnRelease: true,
            })
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target

        if (files && files.length !== 0) {
            const file = files[0]
            const fileReader = new FileReader()
            fileReader.readAsText(file)
            fileReader.onloadstart = (event: ProgressEvent<FileReader>) => {
                cy?.remove(cy?.elements())
            }
            fileReader.onloadend = (ev: ProgressEvent<FileReader>) => {
                JSON.parse(fileReader.result as string).map((element: any) => {
                    element.group === "nodes"
                        ? cy?.add(element)
                        : cy?.add(element).style("curve-style", element.curveStyle)
                })
                event.target.value = ""
            }
        }
    }

    const onImportClick = () => {
        inputFile.current?.click()
    }

    const onExportClick = () => {
        const exportJson = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(
                cy?.elements().map((element) => {
                    return {
                        ...(element.json() as Object),
                        style:
                            element.group() === "nodes"
                                ? { ...element.style() }
                                : {
                                      "line-color": element.style()["line-color"],
                                  },
                        curveStyle: element.style()["curve-style"],
                    }
                }),
            ),
        )}`
        const link = document.createElement("a")
        link.href = exportJson
        link.download = "data.json"

        link.click()
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
                compartmentsMode={compartmentsMode}
                onCreateCompartmentsClick={onCreateCompartmentsClick}
                isPickingCurveStyle={isPickingCurveStyle}
                onCurveStyleChange={onCurveStyleChange}
                labelsVisible={labelsVisible}
                toggleLabelsVisibility={toggleLabelsVisibility}
                onApplyLayout={onApplyLayout}
                isPickingLayout={isPickingLayout}
                gridEnabled={gridEnabled}
                toggleGrid={toggleGrid}
                changeSpacing={changeSpacing}
                onImportClick={onImportClick}
                onExportClick={onExportClick}
            />
            <div className={classes.board} ref={graphRef} id={"cyBoard"} />
            <input
                style={{ display: "none" }}
                accept=".json,.txt"
                ref={inputFile}
                onChange={handleFileUpload}
                type="file"
            />
        </React.Fragment>
    )
}

export default Board
