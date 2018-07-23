# campfire-hci-2
Author: Antonio Fiol-Mahon

Extensions to campfire-hci (starting Summer 2018) Contains Several Utilities developed to make using the campfire better
___

## Getting Started with campfire-hci-2
The campfire-hci-2 repository consists of several related software packages for working with the campfire, each project has its own README, this document provides a general outline of each package.
- Ensure NPM is installed before continuing
- See Additional Dependencies for other required software if issues arise

## Package Descriptions

### campfire-hci-2
- Source code for the framework/library
- Does not run as a standalone application
- See demo_target for a simple example of its usage

### launcher
- This application is build on campfire-hci-2 and provides a convenient way to switch between various applications and demos available on the campfire.

### demo
- This package is a minimal example of an application built with campfire-hci-2
- Displays an alignment/calibration target on the campfire

### remote_server
- Simple server that displays URLS that clients request.
- Allows the campfire launcher to take advantage of displays on remote machines
___

## Additional dependencies:
1. Node.js
	- https://nodejs.org/en/
2. Electron.js
	- https://electronjs.org/

FOR FRESH INSTALLS ONLY
-------------------
2. MSBuildTools
	- http://landinghub.visualstudio.com/visual-cpp-build-tools
2. Python 2.7
	- set PYTHON path variable to C:/../path/to/Python27.exe
	- OR npm install --global --production windows-build-tools
3. Node-Gyp
	- npm install --global node-gyp
	- see building robotjs
		- https://www.npmjs.com/package/robotjs
--------------------
