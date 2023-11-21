import React, { ChangeEvent, Component, ReactElement } from "react";
import { Draft, parseDraft, Pick } from "./draft";
import { DraftScreen } from "./draftScreen";

type Page = "home" | {kind: "draft", user: string, draft: Draft} | {kind: "done", draft: Draft};

interface AppState {

  /** the app's current page */
  page: Page;

  /** the text inside the id text field */
  idText: string;

  /** the text inside the name text field */
  nameText: string;

  /** the text inside the options text field */
  optionsText: string;

  /** the text inside the drafters text field */
  draftersText: string;

  /** the text inside the rounds text field */
  roundsText: string;

  /** all the draft ids representing created drafts */
  ids: string[]


}


export class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {page: "home", idText: "", nameText: "", optionsText: "", draftersText: "", roundsText: "", ids: []};
  }
  
  render = (): JSX.Element => {

    if (this.state.page == "home") {
      return (
        <div>
          <div>
            <label htmlFor = "nameTextField">Drafter: </label>
            <input type = "text" id = "nameTextField" value = {this.state.nameText} 
            onChange = {this.nameTextChange}></input>
          </div>
          <div>
            <h2>Join Existing Draft</h2>
          </div>
          <div>
            <label htmlFor = "idTextField">Draft ID: </label>
            <input type = "text" id = "idTextField" value = {this.state.idText}
            onChange = {this.idTextChange}></input>
            <button onClick = {this.joinDraft}>Join</button>
          </div>
          <div>
            <h2>Create New Draft</h2>
          </div>
          <div>
            <label htmlFor = "roundsTextField">Rounds: </label>
            <input type = "text" id = "roundsTextField" value = {this.state.roundsText}
            onChange = {this.roundsTextChange} size = {10}></input>
          </div>
          <div style = {{display: "flex"}}>
            <div style = {{width: "15%"}}>
              <label htmlFor = "optionsTextField">Options (one per line)</label>
              <textarea style = {{height:"300px", width: "100%"}} id = "optionsTextField" onChange={this.optionsTextChange}>
              </textarea>
            </div>
            <div style = {{width : "15%", marginLeft : "15px"}}>
              <label htmlFor = "draftersTextField">Drafters (one per line)</label>
              <textarea style = {{height: "300px", width: "100%"}} id = "draftersTextField" onChange = {this.draftersTextChange}></textarea>
            </div>
          </div>
          <div>
            <button onClick = {this.newDraft}>Create</button>
          </div>
        </div>
        )
    }

    if (this.state.page.kind === "done") {
      const list = (
      <table>
          <tbody key = "body">
            <tr key = "heading">
              <th key = "num">Num</th>
              <th key = "pick">Pick</th>
              <th key = "drafter">Drafter</th>
            </tr>
            {this.state.page.draft.picks.map(this.makeList)}
          </tbody>
      </table>
      )
      return(
        <div>
          <h2>Congratulations! The draft has finished.</h2>
          <h2>Final Draft Standings:</h2>
          <div>
            {list}
          </div>
          <button onClick = {this.returnHome}>Return to Home Screen</button>
        </div>
      )
    }
    return <DraftScreen user = {this.state.page.user} id = {this.state.page.draft.id} draft = {this.state.page.draft} done = {this.doneDraft}></DraftScreen>
  };

  componentDidMount = (): void  => {
      const url = "/api/viewIds";
      fetch(url)
        .then(this.handleIds)
        .catch(this.handleServerError);
  }

  /** called with a response  from a request to /viewIds */
  handleIds = (res: Response) => {
    if (res.status === 200) {
      res.json().then(this.handleIdsJson).catch(this.handleServerError);
    }
    else {
      this.handleServerError;
    }
  }

  /** called with the JSON of the response from /viewIds
   * updates ids to represent the draft ids of all the drafts in the server
   */
  handleIdsJson = (input: any) => {
    if (typeof input !== "object" || input === null || !('files' in input) || !Array.isArray(input.files)) {
      console.error("bad data from server");
      return;
    }
    const ids = input.files.slice(0);
    this.setState({ids: ids});
  }

  /** updates the nameText state to represent the current text in the name text field */
  nameTextChange = (evt: ChangeEvent<HTMLInputElement>) : void => {
    this.setState({nameText: evt.target.value});  
  }
  /** updates the idText state to represent the current text in the id text field */
  idTextChange = (evt: ChangeEvent<HTMLInputElement>) : void => {
    this.setState({idText: evt.target.value});
  }

  /** updates the roundsText state to represent the current text in the rounds text field */
  roundsTextChange = (evt: ChangeEvent<HTMLInputElement>) : void => {
    this.setState({roundsText: evt.target.value})
  }

  /** updates the optionsText state to represent the current text in the options text field */
  optionsTextChange = (evt: ChangeEvent<HTMLTextAreaElement>) : void => {
    this.setState({optionsText: evt.target.value});
  }

  /** updates the draftersText state to represent the current text in the drafters text field */
  draftersTextChange = (evt: ChangeEvent<HTMLTextAreaElement>) : void => {
    this.setState({draftersText: evt.target.value});
  }

  /** specifies what happens when the user chooses to make a new draft.
   * alerts the user if they do not have a drafter name. 
   * alerts the user if there is no text in the rounds, drafters or options textFields.
   * alerts the user if options does not have enough entries.
   * alerts the user if there are multiple drafters with the same name.
   * alerts the user if the text in the rounds field is not a number.
   */
  newDraft = () : void => {
    if (this.state.nameText.trim() === "") {
      alert("you must have a name");
      return;
    }
    const options: string[] = this.state.optionsText.split("\n");
    if (options[options.length - 1].trim() === "") {
      options.pop();
    }
    const drafters: string[] = this.state.draftersText.split("\n");
    if (drafters[drafters.length - 1].trim() === "") {
      drafters.pop();
    }
    if (!this.usersCheck(drafters)) {
      alert("there cannot be any duplicate drafters");
      return;
    }
    const roundsStr = this.state.roundsText;
    if (roundsStr.trim() === "" || isNaN(parseInt(roundsStr))) {
      alert("rounds must be a number");
      return;
    }
    if (parseInt(roundsStr) === 0) {
      alert("there must be at least one round");
      return;
    }
    const rounds: number = parseInt(roundsStr);
    if (drafters.length === 0) {
      alert("there must be at least one drafter");
      return;
    }
    if (options.length < drafters.length * rounds) {
      alert("there must be at least " + drafters.length * rounds + " options for a valid draft");
      return;
    }
    const id : string = this.generateId();
    const url = "/api/createDraft";
    fetch(url, {method: "POST", body: JSON.stringify({id: id, rounds: Math.floor(rounds), drafters: drafters, options: options}), headers: {'Content-Type' : 'application/json'}})
      .then(this.handleNewDraft)
      .catch(this.handleServerError);
  }

  /** called with a response from a request to /createDraft */
  handleNewDraft = (res: Response) => {
    if (res.status == 200) {
      res.json().then(this.handleNewDraftJson).catch(this.handleServerError);
    }
    else {
      this.handleServerError(res);
    }
  }

  /** calld with the JSON of the response from /createDraft 
   * updates the page to reflect a draft screen.
   * updates all the text field states to represent empty strings.
   * updates the draft id state to represent the randomly generated id of the newly created draft. 
  */
  handleNewDraftJson = (input: any) => {
    if (typeof input !== "object" || input == null) {
      console.error("bad data from server");
      return;
    }
    const draft = parseDraft(input);
    if (draft !== undefined) {
      const newIds = this.state.ids;
      newIds.push(draft.id);
      this.setState({page: {kind: "draft", user: this.state.nameText, draft: draft}, idText: "", nameText: "", optionsText: "", draftersText: "", roundsText: "", ids: newIds});
    }
    else {
      console.error("bad data from server");
    }
  }

  /** specifies what happens when a user chooses to join a draft.
   * alerts the user if they do not have a drafter name.
   * alerts the user if the draft id they have entered is invalid/
   */
  joinDraft = () : void => {
    const id = this.state.idText;
    if (id.trim() === "") {
      alert("draft id must contain at least one character");
      return;
    }
    const name = this.state.nameText;
    if (name.trim() === "") {
      alert("you must have a name");
      return;
    }
    if (this.state.ids.indexOf(id) === -1) {
      alert("this draft does not exist");
      return;
    }
    const url = "/api/loadDraft";
    fetch(url, {method: "POST", body: JSON.stringify({id: id}), headers: {'Content-Type' : 'application/json'}})
      .then(this.handleViewDraft)
      .catch(this.handleServerError);
  }

  /** called with a response from a request to /loadDraft */
  handleViewDraft = (res: Response) => {
    if (res.status === 200) {
      res.json().then(this.handleDraftJson).catch(this.handleServerError);
    }
    else {
      this.handleServerError;
    }
  }

  /** callid with the JSON of a response from /loadDraft
   * updates the page to reflect a draft screen with the draft the user has selected
   * updates all the text field states to represent empty strings.
   * updates the draft id state to represent the randomly generated id of the newly created draft. 
   */
  handleDraftJson = (input: any) => {
    if (typeof input !== "object" || input === null) {
      console.error("bad data from server");
      return;
    }
    const draft = parseDraft(input);
    if (draft !== undefined) {
      this.setState({page: {kind: "draft", user: this.state.nameText, draft: draft}, idText: "", nameText: "", optionsText: "", draftersText: "", roundsText: ""});
    }
    else {
      console.error("bad data from server");
    }
  }

  /** alerts the user when a server error has occurred */
  handleServerError = (_res: Response) : void => {
    alert(_res.statusText);
    console.error("unknown error talking to server");
  }

  /** returns true if there are no repeat drafters in the drafter text field, and false if there are repeat drafters.  */
  usersCheck = (options: string[]) : boolean => {
    const temp : string[] = [];
    let i = 0; 
    while (i !== options.length) {
      if (temp.indexOf(options[i]) !== -1) {
        return false;
      }
      temp.push(options[i]);
      i = i + 1;
    }
    return true;
  }

  /** updates the page to show a completed draft */
  doneDraft = (draft: Draft) : void => {
    this.setState({page : {kind: "done", draft: draft}});
  }

  /** updates the page to show the home screen */
  returnHome = () : void => {
    this.setState({page: "home"});
  }

  /** helps makes a table of draft picks */
  makeList = (p: Pick) : ReactElement<any, any> => {
    return (
      <tr key = {"entry + p.num"}>
        <td key = {p.num}>{p.num}</td>
        <td key = {p.name}>{p.name}</td>
        <td key = {p.drafter}>{p.drafter}</td>
      </tr>
    )
  }

  /** generates a random id for a draft and ensures that a draft does not already exist with that id */
  generateId = () : string => {
    const random = Math.random().toString(20);
    if (this.state.ids.indexOf(random) !== -1) {
      return this.generateId();
    }
    return random;
  }
}
