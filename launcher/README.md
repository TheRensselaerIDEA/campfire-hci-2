# Launcher
The campfire launcher makes interacting with the campfire and its various demos straightforward.

## Installation
Unix-Like platform
```bash
./path/to/campfire-hci-2/launcher/install.sh
```

## Running
```bash
cd ../path/to/campfire-hci-2/launcher/
npm start
```

___

## App Descriptors (For Adding/Changing Launcher Entries)
- App Descriptors are defined in appList.json
- Each entry specifies how an app is display in menu/launched
- All AppDescriptors share some common parameters outlined below
```javascript
"app_id": {
  "name": "MyAppName",
  "description": "My nice app description",
  "group": "default",
  "type": ""
  "remoteURL": "http://myExampleURL.org/page",

  "splashURL": "http://myExampleURL.org/page",
  "controllerURL": "http://myExampleURL.org/controller",
  "demoable": true,
  "args": {}
}
```
### Parameters
- **app_id** - A unique identifer for the app descriptor, should only contain alphanumeric and undersore characters, must be unique
- **name** - The display name of the application
- **description** - A brief description of the application for users
- **group** - The category for the entry, this determines styling in the app display list, the available options are as follows
  - Valid Values:
    - default
    - classic
    - science
    - summer2018
    - hacks
- **type** - The type argument is used by the launcher to decide how to start the app. Each value corresponds to properties that are defined in **args** that specify how the app is loaded
  - Valid Values:
      - simple_app
      - external_app

- **remoteURL** - The URL of a supplimental page to be launched on the campfire context monitor through the remote server, if omitted no URL will be loaded.
- **splashURL** - The URL of a supplimental page to be launched on the campfire splashscreen monitor through the remote server, if omitted no URL will be loaded.
- **controllerURL** - If the app has a controller webpage, providing the link here will make it available on the mobile controller.
- **demoable** - Indicates if the demo should be included in the demo mode applist, if the parameter is ommitted/false, the demo will not appear in the applist while in demo mode
- **args** - Additional parameters that are specific to the **type** of the app.

### Types
- each type requires an **args** object that specifies how the app is launched, the section below details their use

#### Simple App

- Standalone instance of the **campfire-hci-2.ViewController**
- Common Use cases
  - Static HTML, CSS, JS, image, etc.
  - Externally hosted dynamic web applications
- All of the properties defined in the simple_app **args** object below are optional. If omitted, they will fall back to their defaults shown below.

```javascript
{
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

#### Google Slides App

- Standalone instance of the **campfire-hci-2.ViewController** with extensions for slide navigation via campfire input manager
- Use cases
  - Google slides presentation
  - Any application desiring synchronous fwd/backward navigation on the wall and floor via keyboard input
- All of the properties defined in the simple_app **args** object below are accessable. If omitted, they will fall back to their defaults shown below.

```javascript
{
  "type": "google_slides",
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


#### External app
- Any application that can be launched through the command line is supported through this app type

```javascript
{
  "type": "external_app",
  "args": {
    "start_cmd": "./startMyApp.exe arg1 arg2",
    "working_dir": "../path/to/dir"
  }
}
```

- **start_cmd** - Command to launch the app
  - Can use an absolute path or a path relative to `campfire-hci-2/launcher`
- **working_dir** - (Optional) working directory for **start_cmd**. 
  - Equivalent to calling `cd start_dir` before running the command

