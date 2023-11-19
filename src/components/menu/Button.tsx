import React from "react"
import "./Menu.css"

interface Props {
    title: string
    onClick: () => void
}

const Button: React.FC<Props> = ({title, onClick}) => {

    return (
        <button className={"button"} onClick={onClick}>
            {title}
        </button>
    )
};

export default Button