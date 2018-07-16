# campfire-hci-2 framework
- This document outlines usage of the framework for building campfire apps

## Creating a new project
To use campfire-hci-2 to develop applications, you should have some familiarity with javascript, nodejs, npm, and command line.

- Create a package for the project and install dependencies
```bash
# Change to project directory
cd ../my/project/dir
# Create an npm package for the project, customize fields as needed
npm init
# Install the campfire-hci-2 library and add it to project dependencies
npm install --save campfire-hci-2
```
- Add the following to index.js:
```javascript
// Include the framework code
const HCI = require('campfire-hci-2');
```

- The library is ready to be used! See the following sections for usage and descriptions of the available modules

# Modules
- The following components makeup the campfire-hci-2 library. They are organized by functionality, and break down the framework into loosely coupled components

## HCI.js
- Top Level Library Object, foundation of library
- Control access/creation of library components, provides a global context for accessing them

## InputManager.js
- Provides simple interface for binding keypresses to handlers

## MouseListener.js
- Modular version of MouseWrangler by Tommy Fang
- Allows more seamless mouse use on the campfire via:
    - Cursor continuous wrap around on wall
    - Cursor transitions from floor/wall
- Depends on ViewController.js to provide display context

## ViewController.js
- Easy management for the Floor and Wall views on the campfire
- Highly paramatized to allow for customization as needed