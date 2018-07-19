# Demo Application
This package provides a minimal example of an application built with campfire-hci-2

## Installation
```bash
cd ../path/to/campfire-hci/demo_target
./install.sh
```
If errors after installation exist, try running the following
```bash
npm rebuild --runtime=electron --target=1.8.2 --disturl=https://atom.io/download/atom-shell --abi=48
```

## Running Application
```bash
cd ../path/to/campfire-hci/demo_target
npm start
```

## Common Issues
If errors exist after installation, try running the following command to rebuild Electron to match compatibility with node modules
