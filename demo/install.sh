#!/bin/bash

# Ensure current directory is set to the location of this script
script_dir=$(dirname $0)
cd $script_dir

# Install
echo "Installing and configuring demo dependencies..."
npm install
# This resolves some electron version compatibility issues that commonly arise
npm rebuild --runtime=electron --target=1.8.2 --disturl=https://atom.io/download/atom-shell --abi=48
echo "demo Installation complete!"
exit 0
