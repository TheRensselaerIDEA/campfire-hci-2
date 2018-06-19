# campfire-hci-2
	Extensions to campfire-hci (starting Summer 2018)

___

## Getting Started with campfire-hci-2
	-Before proceeding, ensure NPM is installed, see the Additional Dependencies section for more detailed information
	-Below is a description of the packages included in this project

### campfire-hci-2
	-Source code for the framework/library
	-Does not run as a standalone application
	-See demo_target for a simple example of its usage

### launcher
	This application is build on campfire-hci-2 and provides an elegant way
	to switch between various applications and demos available on the campfire.
	To Install/Run:
		1. `cd ./../path/to/campfire-hci/launcher`
		2. `./install.sh`
		3. `npm start`

### demo_target
- This package is used for testing/development of the campfire-hci-2 framework.

- It displays 2 specified pages on the floor and wall of the campfire

- To Install/Run:
```bash
# move to demo_target direcrory
cd ./../path/to/campfire-hci/demo_target
# run installation script
./install.sh
# start electron application via NPM
npm start
```

- If errors exist after installation, try running the following command to rebuild Electron to match compatibility with node modules

```bash
npm rebuild --runtime=electron --target=1.8.2 --disturl=https://atom.io/download/atom-shell --abi=48
```


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
