[![Icon](https://addons.mozilla.org/user-media/addon_icons/2655/2655859-64.png?modified=71a2c23d)](https://addons.mozilla.org/en-US/firefox/addon/netflix-rewind-1-sec/)

[![Mozilla Add-on Version](https://img.shields.io/amo/v/netflix-rewind-1-sec)](https://addons.mozilla.org/en-US/firefox/addon/netflix-rewind-1-sec/)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/netflix-rewind-1-sec)](https://addons.mozilla.org/en-US/firefox/addon/netflix-rewind-1-sec/)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/inpbafoldolmpeiebppjbckdpnkkhlej)](https://chromewebstore.google.com/detail/netflix-rewind-1-sec/inpbafoldolmpeiebppjbckdpnkkhlej)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/inpbafoldolmpeiebppjbckdpnkkhlej)](https://chromewebstore.google.com/detail/netflix-rewind-1-sec/inpbafoldolmpeiebppjbckdpnkkhlej)
[![GitHub release (with filter)](https://img.shields.io/github/v/release/laurens94/netflix-rewind-browser-extension)](https://github.com/laurens94/netflix-rewind-browser-extension/releases)
[![GitHub License](https://img.shields.io/github/license/laurens94/netflix-rewind-browser-extension)](https://github.com/laurens94/netflix-rewind-browser-extension/blob/master/LICENSE)
[![Translation status](https://hosted.weblate.org/widget/netflix-rewind-browser-extension/svg-badge.svg)](https://hosted.weblate.org/engage/netflix-rewind-browser-extension/)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L3L0BR8QG)

# Netflix Rewind 1 sec
**A [Firefox](https://addons.mozilla.org/en-US/firefox/addon/netflix-rewind-1-sec/) and [Chrome](https://chrome.google.com/webstore/detail/netflix-rewind-1-sec/inpbafoldolmpeiebppjbckdpnkkhlej) extension that allows you to rewind the video for 1 second each time you press the <kbd><</kbd> key.**

_I made this extension because it annoys me that the default is 10 seconds._
The following are key bindings to control custom rewind and fast forward duration.  The duration and key bindings are adjustable in the Options page of this extension.
- Use <kbd>,</kbd> to rewind with 1 second (can be changed in Options)
- Use <kbd>.</kbd> to fast forward with 5 seconds (can be changed in Options)

Additionally, the following YouTube-style keybindings are implemented:
- Use <kbd>j</kbd> to rewind 10 seconds
- Use <kbd>l</kbd> to fast forward 10 seconds
- Use <kbd>k</kbd> to toggle pause/play
- Use <kbd><</kbd> to decrease the playback speed
- Use <kbd>></kbd> to increase the playback speed

## 🫶 Contributing

### 💬 Translating
[![Translation status](https://hosted.weblate.org/widget/netflix-rewind-browser-extension/multi-auto.svg)](https://hosted.weblate.org/engage/netflix-rewind-browser-extension/)

Please help by adding your language / translations! The extension can be easily translated using [Weblate](https://hosted.weblate.org/engage/netflix-rewind-browser-extension/).

### 💻 Development
Please feel free to contribute by sending a Pull Request.

#### Dependencies
You can either use `npm` or `pnpm` with the commands below or run `web-ext` directly:

#### Running the extension

`pnpx web-ext run`

#### Building for Firefox

`pnpx web-ext build`

#### Building for Chrome

Pack the extension as a `.zip` file and upload it to the Chrome Web Store.

#### Reference

See https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/ for information about the `web-ext` command.

https://stackoverflow.com/questions/42105028/netflix-video-player-in-chrome-how-to-seek/47786376#47786376
