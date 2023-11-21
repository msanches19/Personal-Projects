import React, { ChangeEvent, Component, ReactElement, MouseEvent } from "react";
import { fromJson, solid, Square, toJson } from './square';
import { Editor } from "./editor";

type Page = "home" | "newSquare" | {kind: "editSquare", sq: Square};

interface AppState {
  /** the app's current page */  
  page: Page;

  /** the user's text inside the textField */
  text?: string;

  /** the name of the file the user is currently working on */
  fileName: string;

  /** the files that the user has saved */
  files: Array<string>;

}


export class App extends Component<{}, AppState> {


  constructor(props: any) {
    super(props);

    this.state = {page: "home", text : "", fileName : "", files : []};
  }
  
  componentDidMount = () : void => {
    const url = "/api/list";
    fetch(url)
      .then(this.handleList)
      .catch(this.handleServerError);
  }

  render = (): JSX.Element => {
  
    const vals = this.state.files.map(this.makeArr);
    if (this.state.page === "home") {
      return (
        <div>
          <div>
            <h2>Files</h2>
          </div>
          <div>
          <label htmlFor = "textField">Name: </label>
          <input type = "text" id = "textField" value = {this.state.text}
          onChange = {this.textChange}></input>
          <button onClick = {this.newSquare}>Create</button>
          </div>
          <div>
            <ul>
              {vals}
            </ul>
          </div>
        </div>
      )
    }
    if (this.state.page === "newSquare") {
      const sq = solid("blue")
      return <Editor initialState={sq} fileName={this.state.fileName} onSave = {this.clickSave} onBack = {this.handleBack}/>
    }
    return <Editor initialState = {this.state.page.sq} fileName = {this.state.fileName} onSave = {this.clickSave} onBack = {this.handleBack}/>
  };

 
  /** updates the text state to represent the current text in the textField */
  textChange = (evt: ChangeEvent<HTMLInputElement>) : void => {
    this.setState({text: evt.target.value});
  }
  /** creates the list of links that appear on the home page */
  makeArr = (x: string) : ReactElement<any, any> => {
    return (<li key = {x}>
      <a onClick = {(evt) => this.handleLinkClick(evt, x)} href = "#">{x}</a>
    </li>)
  }

  /** specifies what happens when the user chooses to make a new square file.
   * alert the user if the file name does not have at least one character. 
   * updates page to be a new square editor.
   * updates the file name to be the name the user has typed into the textField.
   */
  newSquare = () : void => {
    const name = this.state.text;
    if (name === undefined || name.trim() === "") {
      alert("file name must contain at least one character");
      return;
    }
    this.setState({page: "newSquare", text: "", fileName: name});
  }

  /** specifies what happens when the user chooses to save a square file while in a square editor. */
  clickSave = (s: Square) : void => {
    const url = '/api/save';
    const json = toJson(s);
    const name = this.state.fileName;
    fetch(url, {method: 'POST', body: JSON.stringify({name, content: JSON.stringify(json)}), headers: {'Content-Type': 'application/json'}})
      .then(this.handleSave)
      .catch(this.handleServerError);
  }
  /** called with a response from a request to /save */
  handleSave = (res: Response) => {
    if (res.status === 200) {
      const url = "/api/list";
      fetch(url)
        .then(this.handleList)
        .catch(this.handleServerError);
    }
    else {
      this.handleServerError(res);
    }
  }

  /** specifies what happens when a user chooses to go back to the home page.
   * updates page to represent the home page.
   * updates the file name to represent no file.
   */
  handleBack = () : void => {
    this.setState({page: "home", fileName: ""});
  }

  /** called with a request from a response to /list  */
  handleList = (res: Response) => {
    if (res.status === 200) {
      res.json().then(this.handleListJson).catch(this.handleServerError);
    }
    else {
      this.handleServerError(res);
    }
  }

  /** called with the JSON of the response from /list.
   * updates files to represent the current files the user has saved. 
   */
  handleListJson = (input: any) => {
    if (typeof input !== 'object' || input === null || !('files' in input) || !Array.isArray(input.files)) {
      console.error("no list has been received");
      return;
    }
    const names = input.files.slice(0);
    this.setState({files: names})
  }

  /** alerts the user when a server error has occurred. */
  handleServerError = (_res : Response) : void => {
    alert(_res.statusText);
    console.error("unknown error talking to server");
  }

  /** specifies what occurs when a user clicks a file link.
   * updates file name to represent the name of the file the user has selected. 
   */
  handleLinkClick = (evt: MouseEvent<HTMLAnchorElement>, s: string) : void => {
    evt.preventDefault();
    const url = "/api/load" + "?name=" + encodeURIComponent(s);
    this.setState({fileName: s})
    fetch(url)
      .then(this.handleLoad)
      .catch(this.handleServerError);
  }
  
  /** called with a response from a request to /load  */
  handleLoad = (res: Response) => {
    if (res.status === 200) {
      res.json().then(this.handleLoadJson).catch(this.handleServerError)
    }
    else {
      this.handleServerError(res);
    }
  }

  /** called with the JSON of the response from /load.
   * updates page to represent an existing square editor. 
   */
  handleLoadJson = (input : any) => {
    if (typeof input !== 'object' || input === null || !('name' in input) || typeof input.name !== 'string') {
      console.error("no square string has been received");
      return;
    } 
    const newSq = fromJson(JSON.parse(input.name));
    this.setState({page: {kind: "editSquare", sq: newSq}})
  }





}