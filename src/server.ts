import * as http from "http";

import InvalidStringPropertyError from "../error/InvalidStringPropertyError";
import NullPropertyError from "../error/NullPropertyError";
import Person from "./api/models/Person/Person";
import { app } from "./app";

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port);
