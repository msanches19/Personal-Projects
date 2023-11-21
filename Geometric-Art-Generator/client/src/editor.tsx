import React, { ChangeEvent, Component, MouseEvent } from "react";
import { Square, Path, set, Color, solid, split, Dir, retrieve  } from './square';
import { SquareElem } from "./square_draw";
import { List, len, nil, prefix } from "./list";


interface EditorProps {
  /** Initial state of the file. */
  initialState: Square;


  /** the square's file name */
  fileName: string;

  /** lets the square be saved to a file */
  onSave: (s: Square) => void;

  /** lets the user return to the home page */
  onBack: () => void;

}


interface EditorState {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;


}


export class Editor extends Component<EditorProps, EditorState> {

  constructor(props: any) {
    super(props);

    this.state = { root: props.initialState };
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h2>Editor</h2>
        <div>
          <button onClick = {this.handleSplit}>Split</button>
        </div>
        <div>
          <button onClick = {this.handleMerge}>Merge</button>
        </div>
        <div>
          <select onChange = {this.handleColorChange}>
            <option value = "white">White</option>
            <option value = "blue">Blue</option>
            <option value = "red">Red</option>
            <option value = "yellow">Yellow</option>
            <option value = "purple">Purple</option>
            <option value = "green">Green</option>
            <option value = "orange">Orange</option>
          </select>
        </div>
        <div>
          <button onClick = {this.handleSave}>Save</button>
        </div>
        <div>
          <button onClick = {this.handleBack}>Back</button>
        </div>
        <SquareElem width={600} height={600}
                    square={this.state.root} selected={this.state.selected}
                    onClick={this.handleClick}></SquareElem> 
      </div>
    );
  };

  /** specifies what happens when a user clicks on a square. 
   * updates path to reflect the square the user has clicked on.
   * if the user clicks on a square that was already clicked, the square 
   * is deselected.  */
  handleClick = (path: Path): void => {
    if (path === nil && this.state.selected !== nil) {
      this.setState({selected: nil});
      return;
    }
    if (equals(path, this.state.selected)) {
      this.setState({selected: undefined});
      return;
    }
    this.setState({selected: path});
  }

  /** specifies what happens when a user chooses to split a square. 
   * alerts user if no square is selected before clicking split
   * updates root square to reflect the newly split square. 
   * updates path so that no square is selected after the split is executed
   */
  handleSplit = (): void => {
    if (this.state.selected === undefined) {
      alert("no square is selected");
      return;
    }
    const s: Square = retrieve(this.state.root, this.state.selected);
    if (s.kind === "solid") {
      const newS: Square = split(s, s, s, s);
      const newRoot: Square = set(this.state.root, this.state.selected, newS);
      this.setState({root: newRoot, selected: undefined});
    }
  };

  /** specifies what happens when a user chooses to merge a square. 
   * alerts user if no square is selected before clicking split
   * updates root square to reflect the newly merged square.
   * updates path so that no square is selected after the merge is executed
   */
  handleMerge = (): void => {
    if (this.state.selected === undefined) {
      alert("no square is selected");
      return;
    }
    const s: Square = retrieve(this.state.root, this.state.selected);
    if (s.kind === "solid") {
      const c: Color = s.color;
      const p: Path = prefix(len(this.state.selected) - 1, this.state.selected);
      const newRoot: Square = set(this.state.root, p, solid(c));
      this.setState({root: newRoot, selected: undefined});
    }
  };

  /** specifies what happens a user chooses to change a square's color.
   * updates root square to represent the newly updated square.
   * updates path so that no square is selected after the color change is executed.
   */
  handleColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => { 
    if (this.state.selected === undefined) {
      alert("no square is selected");
      return;
    }
    const str: string = evt.target.value;
    if (str !== "blue" &&  str !== "green" && str !== "white" && str !== "yellow" && str !== "orange" 
        && str !== "purple" && str !== "red") {
      return;
    }
    const newRoot: Square = set(this.state.root, this.state.selected, solid(str));
    this.setState({root: newRoot, selected: undefined});
  };

  /** specifies what happens when a user chooses to save their square. */
  handleSave = (evt: MouseEvent<HTMLButtonElement>): void => {
    evt.preventDefault();
    this.props.onSave(this.state.root);
  }
  /** specifies what happens when a user chooses to close their square and return to the home page */
  handleBack = (evt: MouseEvent<HTMLButtonElement>): void => {
    evt.preventDefault();
    this.props.onBack();
  }


}

/**
 * returns whether or not two lists of directions are equal.
 * @param l1 the first list of directions
 * @param l2 the second list of directions
 * @returns true if they lists are equal or false if they are not. 
 */
function equals(l1: List<Dir>, l2?: List<Dir>): boolean {
  if (l2 === undefined) {
    if (l1 === nil) {
      return true;
    }
    return false;
  }
  if (l1 == nil && l2 == nil) {
    return true;
  }
  if (l1 === nil) {
    return false;
  }
  if (l2 === nil) {
    return false;
  }
  if (l1.hd !== l2.hd) {
    return false;
  }
  return equals(l1.tl, l2.tl);
}
