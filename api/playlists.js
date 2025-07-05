import express from "express";
const playlistsRouter = express.Router();
export default playlistsRouter;

import { createPlaylist, getPlaylistById, getPlaylists, getPlaylistsByUserId } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
playlistsRouter.use(requireUser);

playlistsRouter.route("/").get(async (req, res) => {
  const playlists = await getPlaylistsByUserId(req.user.id);
  res.send(playlists);
})
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { name, description } = req.body;
    if (!name || !description) return res.status(400).send("Request body requires: name, description");

    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  });

playlistsRouter.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

playlistsRouter.route("/:id").get((req, res) => {
  if (req.user.id !== req.playlist.user_id) return res.status(403).send("forbidden");
  res.send(req.playlist);
});

playlistsRouter.route("/:id/tracks").get(async (req, res) => {
  if (req.user.id !== req.playlist.user_id) return res.status(403).send("forbidden");
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
})
  .post(async (req, res) => {
    if (req.user.id !== req.playlist.user_id) return res.status(403).send("forbidden");
    if (!req.body) return res.status(400).send("Request body is required.");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Request body requires: trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });
