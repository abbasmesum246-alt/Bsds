# 📱 Publishing BSDS to Google Play

BSDS ships as an installable **PWA**. To publish on Google Play, wrap it in a
signed **Android App Bundle (AAB)** using Google's
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) (Trusted Web Activity).

## Steps

1. **Deploy** the app to an HTTPS origin (e.g. `https://bsds.app`):
   ```bash
   npm install && npm run build && npm start
   ```

2. **Build the AAB**:
   ```bash
   cd play-store
   DOMAIN=bsds.app ./build-android.sh
   ```
   This generates a signing keystore, runs Bubblewrap `init` + `build`, and
   produces `play-store/twa-project/app/build/outputs/bundle/release/app-release-bundle.aab`.

3. **Verify domain ownership** — put the SHA-256 fingerprint printed by the script
   into [`public/.well-known/assetlinks.json`](../public/.well-known/assetlinks.json)
   and redeploy.

4. **Upload** the `.aab` to the Google Play Console (Production track), complete
   the privacy policy, data-safety and content-rating forms, and submit.

## What's included

| Requirement | File |
|---|---|
| Package id | `app.bsds.twa` (twa-manifest.json) |
| Adaptive/maskable icons | `public/icons/maskable-512.png` |
| Theme / splash color | `#1d40f5` |
| App shortcuts | Dashboard, Products, Orders |
| Offline shell | `public/sw.js` |
| Digital Asset Links | `public/.well-known/assetlinks.json` |
| Privacy policy URL | `/privacy` |

The PWA is also directly installable from Chrome/Edge on Android and desktop
without Play Store distribution.
