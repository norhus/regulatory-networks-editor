import React from "react"
import "./Menu.css"
import Button from "./Button"

const addMode = {
    NODE: "node",
    EDGE: "edge"
}

interface Props {
    setMode:  React.Dispatch<React.SetStateAction<string>>
}

const Menu: React.FC<Props> = ({setMode}) => {

    return (
        <div className={"menu"}>
            <Button title={"Node"} onClick={() => setMode(addMode.NODE)}/>
            <Button title={"Edge"} onClick={() => setMode(addMode.EDGE)}/>
        </div>
    )
};

export default Menu