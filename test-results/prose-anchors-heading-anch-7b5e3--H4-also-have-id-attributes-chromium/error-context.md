# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: prose-anchors.spec.ts >> heading anchors >> H3 and H4 also have id attributes
- Location: tests/e2e/prose-anchors.spec.ts:11:2

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /home/skkylimits/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --enable-automation --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/tmp/playwright_chromiumdev_profile-8SovdP --remote-debugging-pipe --no-startup-window
<launched> pid=2116
[pid=2116][err] /home/skkylimits/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell: error while loading shared libraries: libasound.so.2: cannot open shared object file: No such file or directory
Call log:
  - <launching> /home/skkylimits/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --enable-automation --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/tmp/playwright_chromiumdev_profile-8SovdP --remote-debugging-pipe --no-startup-window
  - <launched> pid=2116
  - [pid=2116][err] /home/skkylimits/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell: error while loading shared libraries: libasound.so.2: cannot open shared object file: No such file or directory
  - [pid=2116] <gracefully close start>
  - [pid=2116] <kill>
  - [pid=2116] <will force kill>
  - [pid=2116] exception while trying to kill process: Error: kill ESRCH
  - [pid=2116] <process did exit: exitCode=127, signal=null>
  - [pid=2116] starting temporary directories cleanup
  - [pid=2116] finished temporary directories cleanup
  - [pid=2116] <gracefully close end>

```