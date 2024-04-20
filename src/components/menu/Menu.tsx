import React from "react"
import classes from "./Menu.module.css"
import Button from "./Button"

interface Props {
    onAddEdgeClick: () => void
    onCustomizeNodes: () => void
    onCustomizeEdges: () => void
    onCreateCompartmentsClick: (enable: boolean) => void
    compartmentsMode: boolean
    labelsVisible: boolean
    toggleLabelsVisibility: () => void
    onApplyLayout: () => void
    gridEnabled: boolean
    toggleGrid: () => void
    changeSpacing: (increase: boolean) => void
    onImportClick: () => void
    onExportClick: () => void
    onRemoveSelectedClick: () => void
    resetBoard: () => void
}

const Menu: React.FC<Props> = ({
    onAddEdgeClick,
    onCustomizeNodes,
    onCustomizeEdges,
    onCreateCompartmentsClick,
    compartmentsMode,
    labelsVisible,
    toggleLabelsVisibility,
    onApplyLayout,
    gridEnabled,
    toggleGrid,
    changeSpacing,
    onImportClick,
    onExportClick,
    onRemoveSelectedClick,
    resetBoard,
}) => {
    return (
        <div className={classes.menu}>
            <Button title={"Add edge"} onClick={onAddEdgeClick} />
            <Button title={"Remove selected"} onClick={onRemoveSelectedClick} />
            <Button title={"Reset"} onClick={resetBoard} />
            <Button title={"Customize nodes"} onClick={onCustomizeNodes} />
            <Button title={"Customize edges"} onClick={onCustomizeEdges} />
            <Button title={"Apply layout"} onClick={onApplyLayout} />
            <Button title={"Increase spacing"} onClick={() => changeSpacing(true)} />
            <Button title={"Decrease spacing"} onClick={() => changeSpacing(false)} />
            <Button title={"Labels"} onClick={toggleLabelsVisibility} active={labelsVisible} />
            <Button
                title={"Compartments"}
                onClick={() => onCreateCompartmentsClick(!compartmentsMode)}
                active={compartmentsMode}
            />
            <Button title={"Grid"} onClick={toggleGrid} active={gridEnabled} />
            <Button title={"Import"} onClick={onImportClick} />
            <Button title={"Export"} onClick={onExportClick} />
        </div>
    )
}

export default Menu
