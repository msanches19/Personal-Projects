import express from "express";
import { Dummy, createDraft, makePick, viewDraft, viewIds } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.get("/api/dummy", Dummy);
app.post("/api/createDraft", createDraft);
app.post("/api/makePick", makePick)
app.post("/api/loadDraft", viewDraft);
app.get("/api/viewIds", viewIds);
app.listen(port, () => console.log(`Server listening on ${port}`));
