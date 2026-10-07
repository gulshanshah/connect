# Connect

A college-focused social networking platform: phone number + OTP sign-in, rich
usernames, stories and posts, real-time chat with voice and media messages,
groups and clubs, and a marketplace with payments — as a React Native app
talking to a Node.js backend over Socket.IO.

## Repository layout

| Path | What it is |
| --- | --- |
| `connect v1/` | React Native app snapshot — most recent `src/` (April 2025) |
| `connect v2/` | React Native app snapshot — earlier `src/` |
| `connect v3/app/` | React Native app snapshot — older layout plus a local `Backup/` folder |
| `connect v3/server new/` | Current backend — Express, Socket.IO, MongoDB |
| `connect v3/server old/` | Earlier backend, kept for reference (includes sample `uploads/`) |

The three app folders are snapshots of the same codebase at different points;
each launches as **Connect v1**, **Connect v2** or **Connect v3** on the home
screen. The backend lives in `connect v3/server new`.

## Getting started

### App

```
cd "connect v1"
npm install
npx react-native run-android      # or run-ios
npm start                         # metro bundler
```

Node 18 or newer is required. To work on another snapshot, run the same steps
inside `connect v2/` or `connect v3/app/`.

### Server

```
cd "connect v3/server new"
npm install
node server.js
```

The server reads `MONGO_URI` and `PORT` from the environment.

## Not committed on purpose

`.env`, `firebase-service-account.json`, `google-services.json`, Android
keystores and `local.properties` are excluded by `.gitignore`. Add your own
before building or signing a release.

## License

MIT — see [LICENSE](LICENSE).
