import React from "react"
import "./Menu.css"
import Button from "./Button"

interface Props {
    addEdge?: () => void
}

const Menu: React.FC<Props> = ({addEdge}) => {

    return (
        <div className={"menu"}>
            <Button title={"Add edge"} onClick={addEdge}/>
        </div>
    )
};

export default Menu