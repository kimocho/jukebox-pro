import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser('username1', 'password1');
  const user2 = await createUser('username2', 'password2');
  for (let i = 1; i <= 20; i++) {
    await createPlaylist("Playlist " + i, "lorem ipsum playlist description", i % 2 === 1 ? user1.id : user2.id);
    await createTrack("Track " + i, i * 50000);
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(i / 2);
    await createPlaylistTrack(playlistId, i);
  }
}

