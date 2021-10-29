import WebSocket from "ws";
import express from "express";
import { Song } from "./types";
import { router } from "./Routes";
import { getSongsByTitle } from "./db";

export const runFileServer = (): void => {
  const wss: WebSocket.Server = new WebSocket.Server({
    port: 8222,
  });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", async (message: WebSocket.Data) => {
      const songsToSend: Array<string> = await getFilesToSend(
        JSON.parse(message.toString())
      );
      ws.send(JSON.stringify(songsToSend ?? []));
    });
  });

  const getFilesToSend = async (
    songsRequest: Array<string>
  ): Promise<Array<string>> => {
    const filteredTitles: Array<Song> = await getSongsByTitle(songsRequest);

    return songsRequest.filter(
      (song: string) =>
        filteredTitles.find(({ title }: Song) => song === title) == void 0
    );
  };

  const PORT: number = 8200;
  const app = express();
  app.use(router);
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
};
