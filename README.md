# svelte-msauth-simple
Library to help you guard your application with microsoft's oauth2. Powered by `@azure/msal-browser`.

## Idea

1. Supply the application with your client id & authority
2. Add one function at the root of the webpage (for example __layout.svelte) `init(authority, clientId, redirectUri, defaultScopes)`
3. Initiate the login/logout process via `authenticate()` or `logout()`
4. Access authentication-relevant information from all over the app (`state, token(), account()`)

## Example
An example is included in this repository. To run it, rename the .env.example to .env and fill in the authority & client id.

## Troubleshooting
### When loading the page, it briefly shows as unauthenticated, even though it didn't even start processing (and the processing even results in me already being logged in!)
Make sure the init() function isn't being server-side-rendered (e.g. using the onMount function). For this to take effect, you might need to restart your dev server.