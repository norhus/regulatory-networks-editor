import React, { useState } from "react"
import classes from "./LayoutMenu.module.css"
import classNames from "classnames"

const LAYOUTS = ["random", "preset", "grid", "circle", "concentric", "breadthfirst", "cose", "dagre"]

interface Props {
    onConfirm: (layout: string) => void
}

const LayoutMenu: React.FC<Props> = ({ onConfirm }) => {
    const [selectedLayout, setSelectedLayout] = useState("")

    return (
        <div className={classes.container}>
            <div className={classes.dropdownContainer}>
                {LAYOUTS.map((layout) => {
                    const shapeButtonStyles = classNames(classes.layoutButton, {
                        [classes.active]: layout === selectedLayout,
                    })
                    return (
                        <button
                            onClick={() =>
                                layout === selectedLayout ? setSelectedLayout("") : setSelectedLayout(layout)
                            }
                            className={shapeButtonStyles}
                            id={layout}
                            key={layout}
                        >
                            {layout}
                        </button>
                    )
                })}
            </div>
            <button onClick={() => onConfirm(selectedLayout)} className={classes.confirmButton}>
                Confirm
            </button>
        </div>
    )
}

export default LayoutMenu
