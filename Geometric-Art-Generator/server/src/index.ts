import express from "express";
import { Dummy, list, load, save } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.get("/api/dummy", Dummy);
app.post("/api/save", save);
app.get("/api/load", load);
app.get("/api/list", list);

app.listen(port, () => console.log(`Server listening on ${port}`));
