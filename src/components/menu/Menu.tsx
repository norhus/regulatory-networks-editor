import React from "react"
import classes from "./Menu.module.css"
import Button from "./Button"
import { HexColorPicker } from "react-colorful"

interface Props {
    onAddEdgeClick: () => void
    onChangeColorClick: () => void
    color: string
    isPickingColor: boolean
    onColorChange: (color: string) => void
    onConfirmColor: () => void
    isPickingNodeShape: boolean
    onShapeChange: (shape?: string | null) => void
}

const presetColors = ["#999999", "#ff0000", "#ff9100", "#ffff00", "#40ff00", "#00ffea", "#0048ff", "#a100ff", "#ff00ea"]
const shapes = [
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

const Menu: React.FC<Props> = ({
    onAddEdgeClick,
    onChangeColorClick,
    color,
    isPickingColor,
    onColorChange,
    onConfirmColor,
    isPickingNodeShape,
    onShapeChange,
}) => {
    return (
        <div className={classes.menu}>
            <Button title={"Add edge"} onClick={onAddEdgeClick} />
            <div className={classes.contentContainer}>
                <Button title={"Change color"} onClick={onChangeColorClick} />
                {isPickingColor && (
                    <div className={classes.contentSubContainer}>
                        <HexColorPicker className={classes.colorPicker} onChange={onColorChange} color={color} />
                        <div className={classes.colorPickerSwatches}>
                            {presetColors.map((presetColor) => (
                                <button
                                    key={presetColor}
                                    className={classes.swatch}
                                    style={{ backgroundColor: presetColor }}
                                    onClick={() => onColorChange(presetColor)}
                                />
                            ))}
                        </div>
                        <button onClick={onConfirmColor} className={classes.colorPickerConfirmButton}>
                            Confirm
                        </button>
                    </div>
                )}
            </div>
            <div className={classes.contentContainer}>
                <Button title={"Select node shape"} onClick={() => onShapeChange()} />
                {isPickingNodeShape && (
                    <div className={classes.dropdownContainer}>
                        {shapes.map((shape) => (
                            <button
                                onClick={(e) => onShapeChange(e.currentTarget.id)}
                                className={classes.colorPickerConfirmButton}
                                id={shape}
                                key={shape}
                            >
                                {shape}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Menu
