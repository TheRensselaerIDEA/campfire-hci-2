# Settings file
- Local launcher configuration can be specified in the file `./campfire-hci-2/launcher/settings.json`
- If no file exists, the launcher will use default parameters
- Any parameters missing from the file will be substituted with their default value

## Specification
```javascript
{
    "remote_ip": "127.0.0.1",
    "remote_port": 5000,
    "controller_port": 4000,
    "hci": {
      // Any HCI.js arguments can be set here
    }
}
```
### Parameters
- `remote_ip` - Remote monitor server IP address
- `remote_port` - Remote monitor server port
- `controller_port` - Port that remote controller webserver should bind to
- `hci` - object defining any values to override the default values for the launchers campfire-hci-2.hci.js Object.