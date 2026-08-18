#!/usr/bin/env bash
# Build an UPLOADABLE signed Google Play App Bundle (AAB) from the BSDS PWA
# using Google Bubblewrap (Trusted Web Activity).
set -euo pipefail
cd "$(dirname "$0")/.."

DOMAIN="${DOMAIN:-bsds.app}"
PACKAGE="${PACKAGE:-app.bsds.twa}"
OUT="./play-store"
KEYSTORE="$OUT/android.keystore"

echo "==> Building production app"
npm run build

if [ ! -f "$KEYSTORE" ]; then
  echo "==> Generating signing keystore (store these passwords securely!)"
  keytool -genkeypair -v -keystore "$KEYSTORE" -alias android \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=BSDS, OU=Engineering, O=BSDS, L=Karachi, ST=Sindh, C=PK"
fi

echo "==> SHA-256 fingerprint (add this to public/.well-known/assetlinks.json):"
keytool -list -v -keystore "$KEYSTORE" -alias android -storepass "${KEYPASS:-android}" 2>/dev/null \
  | grep SHA256 | awk '{print $2}' | tee "$OUT/sha256.txt"

echo "==> Initializing TWA project"
npx --yes @bubblewrap/cli@latest init \
  --manifest "https://$DOMAIN/manifest.webmanifest" \
  --directory "$OUT/twa-project" \
  --packageId "$PACKAGE" \
  --name "BSDS"

echo "==> Building signed release AAB"
( cd "$OUT/twa-project" && npx --yes @bubblewrap/cli@latest build --skipPwaValidation )

echo
echo "Upload to Play Console:"
echo "  $OUT/twa-project/app/build/outputs/bundle/release/app-release-bundle.aab"
