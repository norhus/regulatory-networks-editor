import React from "react"
import classes from "./App.module.css"
import Board from "./components/board/Board"

const App: React.FC = () => {
    return (
        <div className={classes.app}>
            <Board />
        </div>
    )
}

export default App
