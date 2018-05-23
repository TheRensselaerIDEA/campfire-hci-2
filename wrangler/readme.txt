Rebuilding Electron to match compatibility for node modules
npm rebuild --runtime=electron --target=1.8.2 --disturl=https://atom.io/download/atom-shell --abi=48

install python/buildtools
npm install --global --production windows-build-tools
npm install --global node-gyp

