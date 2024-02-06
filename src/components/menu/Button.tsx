import React from "react"
import classes from "./Menu.module.css"
import classNames from "classnames"

interface Props {
    title: string
    onClick?: () => void | undefined
    disabled?: boolean
    active?: boolean
}

const Button: React.FC<Props> = ({ title, onClick = undefined, disabled = false, active }) => {
    const buttonStyles = classNames(classes.button, {
        [classes.activeButton]: active,
        [classes.unactiveButton]: active === false,
    })

    return (
        <button className={buttonStyles} onClick={onClick} disabled={disabled}>
            {title}
        </button>
    )
}

export default Button
