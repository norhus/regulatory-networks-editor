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
import NodeMenu from "../nodeMenu/NodeMenu"
import EdgeMenu from "../edgeMenu/EdgeMenu"
import LayoutMenu from "../layoutMenu/LayoutMenu"
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
    concentric: { name: "concentric", equidistant: true, minNodeSpacing: 13 },
    breadthfirst: { name: "breadthfirst", directed: true, spacingFactor: 1 },
    cose: { name: "cose", animate: false, componentSpacing: 100 },
    dagre: { name: "dagre", spacingFactor: 2, rankDir: "TB" },
}

const Board = () => {
    const [cy, setCy] = useState<cytoscape.Core>()
    const [isCustomizingNodes, setIsCustomizingNodes] = useState(false)
    const [isCustomizingEdges, setIsCustomizingEdges] = useState(false)
    const [isApplyingLayout, setIsApplyingLayout] = useState(false)
    const [currentCurveStyle, setCurrentCurveStyle] = useState<string>("unbundled-bezier")
    const [compartmentsMode, setCompartmentsMode] = useState(false)
    const [labelsVisible, setLabelsVisible] = useState(true)
    const [gridEnabled, setGridEnabled] = useState(true)
    const [cdnd, setCdnd] = useState()

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
                        "target-arrow-shape": "triangle",
                        "target-arrow-color": "#999999",
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

        cy.on("mousedown", "node", () => {
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

        cy.on("cdndout", function (event, dropTarget) {
            if (dropTarget.isParent() && dropTarget.children().length === 1) {
                dropTarget.children().move({ parent: null })
                dropTarget.remove()
            }
        })

        // So far, we use the default parameters for edge editing.
        // @ts-ignore
        cy.edgeEditing({
            anchorShapeSizeFactor: 5,
        })
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
        cy.gridGuide({
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
            if (file.type !== "application/json") {
                event.target.value = ""
                return alert(`The file type must be .json`)
            }
            const fileReader = new FileReader()
            fileReader.readAsText(file)
            fileReader.onloadstart = () => {
                cy?.remove(cy?.elements())
            }
            fileReader.onloadend = () => {
                const json = JSON.parse(fileReader.result as string)
                json.map((element: any) =>
                    element.group === "nodes"
                        ? cy?.add(element).style("text-opacity", labelsVisibleRef.current ? 1 : 0)
                        : cy?.add(element).style("curve-style", element.curveStyle),
                )
                event.target.value = ""
                numberOfNodes.current = cy?.nodes().length ?? 0
            }
        }
    }

    const onImportClick = () => {
        inputFile.current?.click()
    }

    const onExportClick = () => {
        const parentNodes = cy?.nodes().filter((node) => node.isParent())
        const nonParentNodes = cy?.nodes().filter((node) => !node.isParent())
        const edges = cy?.edges() ?? []
        let exportNodes: any[] = []
        if (parentNodes) {
            exportNodes = parentNodes.map((element) => ({
                ...(element.json() as Object),
                selected: false,
                style: {
                    "background-color": element.style()["background-color"],
                    "background-opacity": element.style()["background-opacity"],
                    shape: element.style()["shape"],
                    height: element.style()["height"],
                    width: element.style()["width"],
                },
            }))
        }
        if (nonParentNodes) {
            exportNodes = [
                ...exportNodes,
                ...nonParentNodes.map((element) => ({
                    ...(element.json() as Object),
                    selected: false,
                    style: {
                        "background-color": element.style()["background-color"],
                        "background-opacity": element.style()["background-opacity"],
                        shape: element.style()["shape"],
                        height: element.style()["height"],
                        width: element.style()["width"],
                    },
                })),
            ]
        }
        const exportElements = [
            ...exportNodes,
            ...edges.map((element) => ({
                ...(element.json() as Object),
                selected: false,
                style: {
                    "line-color": element.style()["line-color"],
                    "line-opacity": element.style()["line-opacity"],
                    "target-arrow-shape": element.style()["target-arrow-shape"],
                    "target-arrow-color": element.style()["target-arrow-color"],
                },
                curveStyle: element.style()["curve-style"],
            })),
        ]
        const exportJson = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(exportElements))}`
        const link = document.createElement("a")
        link.href = exportJson
        link.download = "data.json"

        link.click()
    }

    const onRemoveSelectedClick = () => {
        cy?.remove(cy?.elements(":selected"))
        selectedNodes.current = []
    }

    const resetBoard = () => {
        cy?.remove(cy?.elements())
        selectedNodes.current = []
        numberOfNodes.current = 0
    }

    const onConfirmNodeCustomization = (
        color: string,
        dimensions: { height: number; width: number },
        shape: string,
    ) => {
        let opacity = 1
        let currentColor = color

        if (color.length > 7) {
            opacity = Math.round((parseInt(color.slice(-2), 16) / 255) * 100) / 100
            currentColor = currentColor.slice(0, -2)
        }

        if (opacity !== 0) {
            cy?.nodes(":selected").style({
                "background-color": currentColor,
                "background-opacity": opacity,
            })
        }

        if (shape !== "") {
            cy?.nodes(":selected").style({
                shape: shape,
            })
        }

        if (dimensions.height && dimensions.height >= 30) {
            cy?.nodes(":selected").style({
                height: dimensions.height,
            })
        }
        if (dimensions.width && dimensions.width >= 30) {
            cy?.nodes(":selected").style({
                width: dimensions.width,
            })
        }

        setIsCustomizingNodes(false)
    }

    const onConfirmEdgeCustomization = (color: string, curveStyle: string, arrowShape: string) => {
        let opacity = 1
        let currentColor = color

        if (color.length > 7) {
            opacity = Math.round((parseInt(color.slice(-2), 16) / 255) * 100) / 100
            currentColor = currentColor.slice(0, -2)
        }

        if (opacity !== 0) {
            cy?.edges(":selected").style({
                "line-color": currentColor,
                "line-opacity": opacity,
                "target-arrow-color": currentColor,
            })
        }

        if (arrowShape !== "") {
            cy?.edges(":selected").style({
                "target-arrow-shape": arrowShape,
            })
        }

        if (curveStyle !== "") {
            cy?.edges(":selected").forEach((edge) => {
                cy
                    ?.add({
                        group: "edges",
                        data: {
                            source: edge.data().source,
                            target: edge.data().target,
                            label: `Edge from ${edge.data().source} to ${edge.data().target}`,
                        },
                        style: {
                            "line-color": edge.style()["line-color"],
                            "line-opacity": edge.style()["line-opacity"],
                            "target-arrow-shape": edge.style()["target-arrow-shape"],
                            "target-arrow-color": edge.style()["target-arrow-color"],
                        },
                        pannable: false,
                    })
                    .style("curve-style", curveStyle)
            })

            cy?.remove(cy?.edges(":selected"))
            setCurrentCurveStyle(curveStyle)
        }
        setIsCustomizingEdges(false)
    }

    const onConfirmLayout = (layout: string) => {
        if (layout !== "") {
            if (cy?.nodes(":selected").length !== 0) {
                if (["dagre", "breadthfirst"].includes(layout)) {
                    const unselectedNodes = cy?.nodes(":unselected")
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
        setIsApplyingLayout(false)
    }

    const onCustomizeNodes = () => {
        setIsCustomizingEdges(false)
        setIsApplyingLayout(false)
        setIsCustomizingNodes(!isCustomizingNodes)
    }

    const onCustomizeEdges = () => {
        setIsCustomizingNodes(false)
        setIsApplyingLayout(false)
        setIsCustomizingEdges(!isCustomizingEdges)
    }

    const onApplyLayout = () => {
        setIsCustomizingNodes(false)
        setIsCustomizingEdges(false)
        setIsApplyingLayout(!isApplyingLayout)
    }

    return (
        <React.Fragment>
            <Menu
                onAddEdgeClick={addEdge}
                onCustomizeNodes={onCustomizeNodes}
                onCustomizeEdges={onCustomizeEdges}
                compartmentsMode={compartmentsMode}
                onCreateCompartmentsClick={onCreateCompartmentsClick}
                labelsVisible={labelsVisible}
                toggleLabelsVisibility={toggleLabelsVisibility}
                onApplyLayout={onApplyLayout}
                gridEnabled={gridEnabled}
                toggleGrid={toggleGrid}
                changeSpacing={changeSpacing}
                onImportClick={onImportClick}
                onExportClick={onExportClick}
                onRemoveSelectedClick={onRemoveSelectedClick}
                resetBoard={resetBoard}
                isCustomizingNodes={isCustomizingNodes}
                isCustomizingEdges={isCustomizingEdges}
                isApplyingLayout={isApplyingLayout}
            />
            {isCustomizingNodes && <NodeMenu onConfirm={onConfirmNodeCustomization} />}
            {isCustomizingEdges && <EdgeMenu onConfirm={onConfirmEdgeCustomization} />}
            {isApplyingLayout && <LayoutMenu onConfirm={onConfirmLayout} />}
            <div className={classes.board} ref={graphRef} id={"cyBoard"} />
            <input style={{ display: "none" }} accept=".json" ref={inputFile} onChange={handleFileUpload} type="file" />
        </React.Fragment>
    )
}

export default Board
