import React from "react"
import classes from "./ColorPicker.module.css"
import { HexAlphaColorPicker, HexColorInput } from "react-colorful"

const PRESETCOLORS = ["#999999", "#ff0000", "#ff9100", "#ffff00", "#40ff00", "#00ffea", "#0048ff", "#a100ff", "#ff00ea"]

interface Props {
    onChange: (color: string) => void
    color: string
}

const ColorPicker: React.FC<Props> = ({ onChange, color }) => {
    return (
        <>
            <HexAlphaColorPicker
                className={classes.colorPicker}
                onChange={(newColor) => onChange(newColor)}
                color={color}
            />
            <HexColorInput
                className={classes.colorInput}
                onChange={(newColor) => onChange(newColor)}
                color={color}
                prefixed
                alpha
            />
            <div className={classes.colorPickerSwatches}>
                {PRESETCOLORS.map((presetColor) => (
                    <button
                        key={presetColor}
                        className={classes.swatch}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => onChange(presetColor)}
                    />
                ))}
            </div>
        </>
    )
}

export default ColorPicker
