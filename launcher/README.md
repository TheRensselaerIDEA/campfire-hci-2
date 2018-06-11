# appList.json Usage
- appList.json is an array of AppDescriptors
- Below is a description of the AppDescriptors available and their parameters

___

## Simple electron app
- Simple electron apps are JSON defined standalone instances of the **campfire-hci-2.ViewController**

- Common Use cases
  - Static HTML, CSS, JS, image, etc.

  - Externally hosted dynamic web applications

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

## Batch cmd
- Any application that is launched through a .bat file can be run with this script, simply point start_cmd to the desired .bat file

- ***start_cmd*** - the path to the batch script. Can be an absolute path or a path relative to `campfire-hci-2/launcher`
### JSON Spec
```javascript
  {
    "name": "External App name goes here",
    "description": "External App description goes here",
    "type": "batch_cmd",
    "start_cmd": "..\\Path\\To\\my\\BatchScript.bat"
  }
```
