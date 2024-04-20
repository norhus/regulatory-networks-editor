import React from "react"
import classes from "./Menu.module.css"
import classNames from "classnames"

interface Props {
    title: string
    onClick?: () => void | undefined
    active?: boolean
}

const Button: React.FC<Props> = ({ title, onClick = undefined, active }) => {
    const buttonStyles = classNames(classes.button, {
        [classes.activeButton]: active,
        [classes.unactiveButton]: active === false,
    })

    return (
        <button className={buttonStyles} onClick={onClick}>
            {title}
        </button>
    )
}

export default Button
