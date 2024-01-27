import React, { useState } from "react"
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
}

const presetColors = ["#ff0000", "#ff9100", "#ffff00", "#40ff00", "#00ffea", "#0048ff", "#a100ff", "#ff00ea"]

const Menu: React.FC<Props> = ({
    onAddEdgeClick,
    onChangeColorClick,
    color,
    isPickingColor,
    onColorChange,
    onConfirmColor,
}) => {
    return (
        <div className={classes.menu}>
            <Button title={"Add edge"} onClick={onAddEdgeClick} />
            <div className={classes.colorPickerContainer}>
                <Button title={"Change color"} onClick={onChangeColorClick} />
                {isPickingColor && (
                    <div className={classes.colorPickerSubContainer}>
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
        </div>
    )
}

export default Menu
