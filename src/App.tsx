import React from "react"
import classes from "./App.module.css"
import Main from "./components/Main"

const App: React.FC = () => {
    return (
        <div className={classes.app}>
            <Main />
        </div>
    )
}

export default App
