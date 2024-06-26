![banner](.github/github-banner.png)

# PACE - Private Fitness App

PACE is an end-to-end encrypted fitness app that allows to record, track and analyse your trainings without compromising your privacy.

The app is available on Android and iOS.

### Android

<a href="https://play.google.com/store/apps/details?id=io.withpace.pace">
  <img width="185" alt="Get it on Google Play" src=".github/google-play-badge.png">
</a>

### iOS

<a href="https://apps.apple.com/app/pace-privacy/id6444367013">
  <img width="185" alt="Get it on the App Store" src=".github/apple-app-store-badge.png">
</a>

## Features

- **End-to-end encryption**: All your data is encrypted on your device before it is sent to the server. The server never sees your data in plain text.
- **Running and bike rides**: Record your running and bike rides with GPS tracking.
- **Offline mode**: Record your trainings without an internet connection. The app will sync your data with the server once you are online again.
- **Anaylsis**: Analyse your trainings with detailed statistics and graphs.
- **Weekly and monthly summaries**: Get a weekly and monthly summary of your trainings with the number of activities, distance and duration.
- **Anonymous**: No email or personal information is required to use the app.
- **No ads or tracking**: The app does not contain any ads.

## Building from source

PACE is built with [Expo](https://expo.io/), written in TypeScript.

1. Setup Expo following the official [documentation](https://docs.expo.io/get-started/installation/)
2. Clone this repository `git clone git@github.com:withpaceio/pace-app.git`
3. Copy the `.env.example` file to `.env` and fill in the required values
4. Install dependencies using `npm install`
5. Start the app (add `--device` to start on a physical device):
   - Android: `npm run android`
   - iOS: `npm run ios`

## Security

You can read our whitepaper [here](https://withpace.io/pace-whitepaper.pdf).

## Community

Follow us on [Twitter](https://twitter.com/withpaceio) for updates and announcements.
