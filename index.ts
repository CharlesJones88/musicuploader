import nconf from "nconf";
import { basePath } from "./types";
import { runFileServer } from "./Server";
import { addLocalMusicFilesToDB } from "./LocalFileUploader";

process.title = 'musicUploader';

nconf.argv({
  u: {
    alias: "update",
    describe: "Update the music database file",
  },
});

if (nconf.get("u")) {
  addLocalMusicFilesToDB(basePath);
} else {
  runFileServer();
}
