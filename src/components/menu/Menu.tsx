import React from "react";
import "./Menu.css";
import Button from "./Button";

interface Props {
  addEdge: () => void;
  changeColor: () => void;
}

const Menu: React.FC<Props> = ({ addEdge, changeColor }) => {
  return (
    <div className={"menu"}>
      <Button title={"Add edge"} onClick={addEdge} />
      {/*<Button title={"Change color"} onClick={changeColor} />*/}
    </div>
  );
};

export default Menu;
