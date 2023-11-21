import React from "react"
import "./Menu.css"

interface Props {
    title: string
    onClick?: () => void | undefined
    disabled?: boolean
}

const Button: React.FC<Props> = ({title, onClick = undefined, disabled = false}) => {

    return (
        <button className={"button"} onClick={onClick} disabled={disabled}>
            {title}
        </button>
    )
};

export default Button