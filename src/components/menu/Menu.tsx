import React from "react"
import classes from "./Menu.module.css"
import Button from "./Button"
import { HexAlphaColorPicker, HexColorInput } from "react-colorful"

interface Props {
    onAddEdgeClick: () => void
    onChangeColorClick: () => void
    color: string
    isPickingColor: boolean
    onColorChange: (color: string) => void
    onConfirmColor: () => void
    isPickingNodeShape: boolean
    onShapeChange: (shape?: string | null) => void
    dimensions: { height: number; width: number }
    isPickingNodeDimensions: boolean
    onChangeDimensionsClick: () => void
    onDimensionsChange: (dimensions: { height: number; width: number }) => void
    onConfirmDimensions: () => void
    onCreateCompartmentsClick: (enable: boolean) => void
    compartmentsMode: boolean
    isPickingCurveStyle: boolean
    onCurveStyleChange: (curveStyle?: string | null) => void
    labelsVisible: boolean
    toggleLabelsVisibility: () => void
    onApplyLayout: (layout?: string | null) => void
    isPickingLayout: boolean
    gridEnabled: boolean
    toggleGrid: () => void
    changeSpacing: (increase: boolean) => void
    onImportClick: () => void
    onExportClick: () => void
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
const curveStyles = ["unbundled-bezier", "segments"]
const layouts = ["random", "preset", "grid", "circle", "concentric", "breadthfirst", "cose", "dagre"]

const Menu: React.FC<Props> = ({
    onAddEdgeClick,
    onChangeColorClick,
    color,
    isPickingColor,
    onColorChange,
    onConfirmColor,
    isPickingNodeShape,
    onShapeChange,
    isPickingNodeDimensions,
    dimensions,
    onChangeDimensionsClick,
    onDimensionsChange,
    onConfirmDimensions,
    onCreateCompartmentsClick,
    compartmentsMode,
    isPickingCurveStyle,
    onCurveStyleChange,
    labelsVisible,
    toggleLabelsVisibility,
    onApplyLayout,
    isPickingLayout,
    gridEnabled,
    toggleGrid,
    changeSpacing,
    onImportClick,
    onExportClick,
}) => {
    return (
        <div className={classes.menu}>
            <Button title={"Add edge"} onClick={onAddEdgeClick} />
            <div className={classes.contentContainer}>
                <Button title={"Change color"} onClick={onChangeColorClick} />
                {isPickingColor && (
                    <div className={classes.contentSubContainer}>
                        <HexAlphaColorPicker className={classes.colorPicker} onChange={onColorChange} color={color} />
                        <HexColorInput className={classes.dimensionInput} onChange={onColorChange} color={color} />
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
                        <button onClick={onConfirmColor} className={classes.confirmButton}>
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
                                className={classes.confirmButton}
                                id={shape}
                                key={shape}
                            >
                                {shape}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className={classes.contentContainer}>
                <Button title={"Change node dimensions"} onClick={onChangeDimensionsClick} />
                {isPickingNodeDimensions && (
                    <div className={classes.contentSubContainer}>
                        <label htmlFor="height"> Height </label>
                        <input
                            type="number"
                            id="height"
                            min={30}
                            className={classes.dimensionInput}
                            value={dimensions.height}
                            onChange={(e) =>
                                onDimensionsChange({ height: parseInt(e.target.value), width: dimensions.width })
                            }
                        />
                        <label htmlFor="width"> Width </label>
                        <input
                            type="number"
                            id="width"
                            min={30}
                            className={classes.dimensionInput}
                            value={dimensions.width}
                            onChange={(e) =>
                                onDimensionsChange({ height: dimensions.height, width: parseInt(e.target.value) })
                            }
                        />
                        <button onClick={onConfirmDimensions} className={classes.confirmButton}>
                            Confirm
                        </button>
                    </div>
                )}
            </div>
            <div className={classes.contentContainer}>
                <Button title={"Select edge curve style"} onClick={() => onCurveStyleChange()} />
                {isPickingCurveStyle && (
                    <div className={classes.dropdownContainer}>
                        {curveStyles.map((curveStyle) => (
                            <button
                                onClick={(e) => onCurveStyleChange(e.currentTarget.id)}
                                className={classes.confirmButton}
                                id={curveStyle}
                                key={curveStyle}
                            >
                                {curveStyle}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className={classes.contentContainer}>
                <Button title={"Apply layout"} onClick={() => onApplyLayout()} />
                {isPickingLayout && (
                    <div className={classes.dropdownContainer}>
                        {layouts.map((layout) => (
                            <button
                                onClick={(e) => onApplyLayout(e.currentTarget.id)}
                                className={classes.confirmButton}
                                id={layout}
                                key={layout}
                            >
                                {layout}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <Button
                title={labelsVisible ? "Hide labels" : "Show labels"}
                onClick={toggleLabelsVisibility}
                active={labelsVisible}
            />
            <Button
                title={"Create compartments"}
                onClick={() => onCreateCompartmentsClick(!compartmentsMode)}
                active={compartmentsMode}
            />
            <Button title={gridEnabled ? "Disable grid" : "Enable grid"} onClick={toggleGrid} active={gridEnabled} />
            <Button title={"Increase spacing"} onClick={() => changeSpacing(true)} />
            <Button title={"Decrease spacing"} onClick={() => changeSpacing(false)} />
            <Button title={"Import graph"} onClick={onImportClick} />
            <Button title={"Export graph"} onClick={onExportClick} />
        </div>
    )
}

export default Menu
