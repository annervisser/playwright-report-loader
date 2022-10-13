#!/usr/bin/env bash
set -euv

MY_DIR="$(dirname "$(readlink -f "$0")")"
cd "$MY_DIR"

TEMPD=$(mktemp -d)
cd "$TEMPD"
git clone --depth 1 git@github.com:microsoft/playwright.git
cd playwright
git apply "$MY_DIR/patches/allow-blob-urls-in-trace-viewer.patch"
npm ci
npm exec --workspace trace-viewer vite build -- --outDir "$MY_DIR/dist/trace"

function cleanup {
  echo "cleaning up"
  rm -rf "$TEMPD"
}
trap cleanup EXIT
