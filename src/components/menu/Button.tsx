import React from "react"
import classes from "./Menu.module.css"
import classNames from "classnames"

interface Props {
    title: string
    onClick?: () => void | undefined
    active?: boolean
    menuOpened?: boolean
}

const Button: React.FC<Props> = ({ title, onClick = undefined, active, menuOpened }) => {
    const buttonStyles = classNames(classes.button, {
        [classes.activeButton]: active,
        [classes.unactiveButton]: active === false,
        [classes.menuOpenedButton]: menuOpened,
    })

    return (
        <button className={buttonStyles} onClick={onClick}>
            {title}
        </button>
    )
}

export default Button
