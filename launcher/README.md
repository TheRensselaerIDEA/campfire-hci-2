# appList.json Usage
- appList.json is an array of AppDescriptors
- Below is a description of the formats available and their arguments

___

## Simple electron app
- Simple electron apps are standalone **campfire-hci-2** view controllers

- Common Use cases
  - Static HTML, CSS, JS, Image, etc.

  - Externally Hosted single page application

- All of the properties defined in the **args** object below are optional. If omitted, they will fall back to their defaults shown below.
### JSON Spec
```javascript
  {
    "name": "Simple Electron App name goes here",
    "description": "Simple Electron App description goes here",
    "type": "simple_app",
    "args": {
      "display": true,
      "screenWrap": true,
      "centermode": true,
      "fullscreen": true,
      "floorURL": DEFAULT_FLOOR_URL,
      "wallURL": DEFAULT_WALL_URL,
      "debugEnabled": false,
      "mousewrangler": true,
      "nodeIntegration": true
    }
  }
```

## External app
- Any application that can be launched through the command line is supported through this app type

- ***start_cmd*** - the path to the app. Can be an absolute path or a path relative to `campfire-hci-2/launcher`
### JSON Spec
```javascript
  {
    "name": "External App name goes here",
    "description": "External App description goes here",
    "type": "external_app",
    "start_cmd": "This should contain the command used to start the application"
  }
```
