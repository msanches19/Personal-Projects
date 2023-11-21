import React, { ChangeEvent } from "react";
import { Component, ReactElement} from "react";
import { Draft, Pick, parseDraft } from "./draft";

interface DraftScreenProps {
    id: string;
    user: string;
    draft: Draft;
    done: (draft: Draft) => void
}

interface DraftScreenState {

    /** the draft the user sees */    
    draft: Draft;
    
    /** the option the yser has selected from the drop down menu */
    currOption: string;
}

export class DraftScreen extends Component<DraftScreenProps, DraftScreenState> {
    
    constructor(props: any) {
        super(props);

        this.state = {draft: this.props.draft, currOption: ""};

    }

    render = (): JSX.Element => {

        let vals = undefined;
        if (this.state.draft.picks.length === 0) {
            vals = <p>No picks made yet</p>
        }
        else {
            vals = (
                <table>
                    <tbody key = "body">
                    <tr key = "heading">
                        <th key = "num">Num</th>
                        <th key = "pick">Pick</th>
                        <th key = "drafter">Drafter</th>
                    </tr>
                    {this.state.draft.picks.map(this.makeList)}
                    </tbody>
                </table>
            );
        }
        let message = <>Waiting for {this.state.draft.currPick} to pick.</>
        if (this.props.user === this.state.draft.currPick && this.state.draft.options.length !== 0) {
            message = <div>
                <div>
                    <p>It's your pick!</p>
                </div>
                <div>
                    <select id = "draft-options" onChange = {this.handleOption} defaultValue = "default">
                        <option value = "default" key = "default">Select an option</option>
                        {this.state.draft.options.map(this.makeOptions)}
                    </select>
                    <button onClick = {this.makePick}>Draft</button>
                </div>
            </div>
        }
        return(
        <div>
            <h2>Status of Draft "{this.props.id}"</h2>
            <div>
                {vals}
            </div>
            <div>
                {message}
            </div>
            <div>
                <button onClick = {this.refreshPage}>Refresh</button>
            </div>

        </div>);
    }

    /** helps makes a table of draft picks */
    makeList = (p : Pick) : ReactElement<any, any> => {
        return (
        <tr key = {"entry" + p.num}>
            <td key = {p.num}>{p.num}</td>
            <td key = {p.name}>{p.name}</td>
            <td key = {p.drafter}>{p.drafter}</td>
        </tr>
        )
    }

    /** helps make a drop down menu with the options a drafter has at their disposal */
    makeOptions = (s : string) : ReactElement<any, any> => {
        return(
            <option value = {s} key = {s}>{s}</option>
        )
    }
    /** specifies what occurs when a user finalizes their pick.
     * alerts the user if they have not selected an option from the drop down menu.
     */
   makePick = () : void => {
    if (this.state.currOption === "") {
        alert("You must select an option");
        return;
    }
    const url = "/api/makePick";
    fetch(url, {method: "POST", body: JSON.stringify({id: this.props.id, option: this.state.currOption}), headers: {'Content-Type' : 'application/json'}})
        .then(this.handlePick)
        .catch(this.handleServerError)
   }

   /** updates the current option state to reflect the user's current choice from the drop down menu */
   handleOption = (evt: ChangeEvent<HTMLSelectElement>) : void => {
        if (evt.target.value === "default") {
            alert("please select a draft option");
            return;
        }
        this.setState({currOption: evt.target.value});
   }

   /** accepts a response from a reques to /makePick */
   handlePick = (res: Response) => {
    if (res.status === 200) {
        res.json().then(this.handlePickJson).catch(this.handleServerError);
    }
    else {
        this.handleServerError
    }
   }

   /** accepts the JSON of a response from /makePick
    * updates the page to show a completed draft if the latest pick means that draft has finished. 
    * otherwise, updates the draft to reflect the newly made pick. 
    */
   handlePickJson = (input: any) => {
    if (typeof input !== "object" || input === null) {
        console.error("bad data from server");
        return;
    }
    const draft = parseDraft(input);
    if (draft !== undefined) {
        if(draft.start === false) {
            this.props.done(draft);
            return;
        }
        this.setState({currOption: "", draft: draft});
    }
   }

   /** specifies what happens when a user chooses to refresh the draft page */
   refreshPage = () : void => {
    const url = "/api/loadDraft";
    fetch(url, {method: "POST", body: JSON.stringify({id: this.props.id}), headers: {'Content-Type' : 'application/json'}})
        .then(this.handleRefresh)
        .catch(this.handleServerError)
   }

   /** accepts as response from a reuqest to /loadDraft */
   handleRefresh = (res: Response)  => {
    if (res.status === 200) {
        res.json().then(this.handleRefreshJson).catch(this.handleServerError);
    }
    else {
        this.handleServerError
    }
   }

   /** accepts the JSON of a respnose from /loadDraft.
    * updates the draft screen to reflect and show the most recent version of the draft. 
    */
   handleRefreshJson = (input: any) => {
    if (typeof input !== "object" || input === null) {
        console.error("bad data from server");
        return;
    }
    const draft = parseDraft(input);
    if (draft !== undefined) {
        this.setState({draft: draft});
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

}