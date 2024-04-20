import React, { useState } from "react"
import classes from "./EdgeMenu.module.css"
import classNames from "classnames"
import ColorPicker from "../colorPicker/ColorPicker"

const curveStyles = ["unbundled-bezier", "segments"]

interface Props {
    onConfirm: (color: string, curveStyle: string) => void
}

const EdgeMenu: React.FC<Props> = ({ onConfirm }) => {
    const [color, setColor] = useState<string>("#999999")
    const [selectedCurveStyle, setSelectedCurveStyle] = useState("")

    return (
        <div className={classes.container}>
            <ColorPicker color={color} onChange={(color) => setColor(color)} />
            <div className={classes.curveStylesContainer}>
                {curveStyles.map((curveStyle) => {
                    const edgeStyles = classNames(classes.curveStyleButton, {
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
            <button onClick={() => onConfirm(color, selectedCurveStyle)} className={classes.confirmButton}>
                Confirm
            </button>
        </div>
    )
}

export default EdgeMenu
