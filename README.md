# campfire-hci-2
Extensions to campfire-hci (starting Summer 2018)


###														###
### campfire-hci-instructions ###
###														###

# How to run
1. cd ./../path/to/campfire-hci
2. cd wrangler
3. npm install
4. npm start
If there are compatibility errors with electron, run this command in the directory of package.json.
```
npm rebuild --runtime=electron --target=1.8.2 --disturl=https://atom.io/download/atom-shell --abi=48
```

# How to include mouse utils
1. ```npm install @campfirehci/mouseutil```
2. include in app.js
```javascript
var mouseutil = require('campfirehci/mouseutill')({ "arguments": values });
```

# Additional dependencies:
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
