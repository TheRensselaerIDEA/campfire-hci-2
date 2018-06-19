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
### JSON Example
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
      "mousewrangler": true,
      "nodeIntegration": true
    }
  }
```

## External app
- Any application that can be launched through the command line is supported through this app type

### Parameters

- **start_cmd** - Command to launch the app
  - Can use an absolute path or a path relative to `campfire-hci-2/launcher`

- **working_dir** - (Optional) working directory for **start_cmd**. 
  - Equivalent to calling `cd start_dir` before running the command

### JSON Example
```javascript
  {
    "name": "External App name goes here",
    "description": "External App description goes here",
    "type": "external_app",
    "start_cmd": "./startMyApp.exe arg1 arg2",
    "working_dir": "../path/to/dir"
  }
```
