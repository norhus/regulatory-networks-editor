import React, { useState } from "react"
import classes from "./EdgeMenu.module.css"
import classNames from "classnames"
import ColorPicker from "../colorPicker/ColorPicker"

const CURVESTYLES = ["unbundled-bezier", "segments"]
const ARROWSHAPES = [
    "triangle",
    "triangle-tee",
    "circle-triangle",
    "triangle-backcurve",
    "vee",
    "tee",
    "square",
    "circle",
    "diamond",
    "chevron",
    "none",
]

interface Props {
    onConfirm: (color: string, curveStyle: string, arrowShape: string) => void
}

const EdgeMenu: React.FC<Props> = ({ onConfirm }) => {
    const [color, setColor] = useState<string>("#999999")
    const [selectedCurveStyle, setSelectedCurveStyle] = useState("")
    const [selectedArrowShape, setSelectedArrowShape] = useState("")

    return (
        <div className={classes.container}>
            <ColorPicker color={color} onChange={(color) => setColor(color)} />
            <div className={classes.dropdownContainer}>
                {ARROWSHAPES.map((arrowShape) => {
                    const shapeButtonStyles = classNames(classes.optionButton, {
                        [classes.active]: arrowShape === selectedArrowShape,
                    })
                    return (
                        <button
                            onClick={() =>
                                arrowShape === selectedArrowShape
                                    ? setSelectedArrowShape("")
                                    : setSelectedArrowShape(arrowShape)
                            }
                            className={shapeButtonStyles}
                            id={arrowShape}
                            key={arrowShape}
                        >
                            {arrowShape}
                        </button>
                    )
                })}
            </div>
            <div className={classes.curveStylesContainer}>
                {CURVESTYLES.map((curveStyle) => {
                    const edgeStyles = classNames(classes.optionButton, {
                        [classes.active]: curveStyle === selectedCurveStyle,
                    })
                    return (
                        <button
                            onClick={() =>
                                curveStyle === selectedCurveStyle
                                    ? setSelectedCurveStyle("")
                                    : setSelectedCurveStyle(curveStyle)
                            }
                            className={edgeStyles}
                            id={curveStyle}
                            key={curveStyle}
                        >
                            {curveStyle}
                        </button>
                    )
                })}
            </div>
            <button
                onClick={() => onConfirm(color, selectedCurveStyle, selectedArrowShape)}
                className={classes.confirmButton}
            >
                Confirm
            </button>
        </div>
    )
}

export default EdgeMenu
