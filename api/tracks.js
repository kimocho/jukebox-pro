import express from "express";
import requireUser from "#middleware/requireUser";
const tracksRouter = express.Router();
export default tracksRouter;

import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsByTracksId } from "#db/queries/playlists";

tracksRouter.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

tracksRouter.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

tracksRouter.get("/:id/playlists", requireUser, async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  const playlistsByTrackId = await getPlaylistsByTracksId(req.params.id);
  res.send(playlistsByTrackId);
});