import React from "react"
import classes from "./Menu.module.css"

interface Props {
    title: string
    onClick?: () => void | undefined
    disabled?: boolean
}

const Button: React.FC<Props> = ({ title, onClick = undefined, disabled = false }) => {
    return (
        <button className={classes.button} onClick={onClick} disabled={disabled}>
            {title}
        </button>
    )
}

export default Button
