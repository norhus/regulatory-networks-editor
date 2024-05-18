import React, { useState } from "react"
import classes from "./NodeMenu.module.css"
import classNames from "classnames"
import ColorPicker from "../colorPicker/ColorPicker"

const SHAPES = [
    "ellipse",
    "triangle",
    "round-triangle",
    "rectangle",
    "round-rectangle",
    "bottom-round-rectangle",
    "cut-rectangle",
    "barrel",
    "rhomboid",
    "right-rhomboid",
    "diamond",
    "round-diamond",
    "pentagon",
    "round-pentagon",
    "hexagon",
    "round-hexagon",
    "concave-hexagon",
    "heptagon",
    "round-heptagon",
    "octagon",
    "round-octagon",
    "star",
    "tag",
    "round-tag",
    "vee",
]

interface Props {
    onConfirm: (color: string, dimensions: { height: number; width: number }, shape: string) => void
}

const NodeMenu: React.FC<Props> = ({ onConfirm }) => {
    const [color, setColor] = useState<string>("#999999")
    const [dimensions, setDimensions] = useState({ height: 30, width: 30 })
    const [selectedShape, setSelectedShape] = useState("")

    return (
        <div className={classes.container}>
            <ColorPicker
                color={color}
                onChange={(color) => {
                    setColor(color)
                }}
            />
            <div className={classes.dropdownContainer}>
                {SHAPES.map((shape) => {
                    const shapeButtonStyles = classNames(classes.shapeButton, {
                        [classes.active]: shape === selectedShape,
                    })
                    return (
                        <button
                            onClick={() => (shape === selectedShape ? setSelectedShape("") : setSelectedShape(shape))}
                            className={shapeButtonStyles}
                            id={shape}
                            key={shape}
                        >
                            {shape}
                        </button>
                    )
                })}
            </div>
            <div className={classes.dimensionsContainer}>
                <label htmlFor="height" className={classes.dimensionLabel}>
                    Height:
                </label>
                <input
                    type="number"
                    id="height"
                    min={0}
                    className={classNames(classes.dimensionInput, {
                        [classes.dimensionInputLow]: dimensions.height < 30,
                    })}
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ height: parseInt(e.target.value), width: dimensions.width })}
                />
                <label htmlFor="width" className={classes.dimensionLabel}>
                    Width:
                </label>
                <input
                    type="number"
                    id="width"
                    min={0}
                    className={classNames(classes.dimensionInput, {
                        [classes.dimensionInputLow]: dimensions.width < 30,
                    })}
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ height: dimensions.height, width: parseInt(e.target.value) })}
                />
            </div>
            <button onClick={() => onConfirm(color, dimensions, selectedShape)} className={classes.confirmButton}>
                Confirm
            </button>
        </div>
    )
}

export default NodeMenu
