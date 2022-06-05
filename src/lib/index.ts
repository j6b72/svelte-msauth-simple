import * as msal from "@azure/msal-browser"
import {writable} from "svelte/store"

export let msalInstance : msal.PublicClientApplication|null = null
export const state = writable<"processing"|"unauthenticated"|"authenticated">("processing")

let redirectUri : string = ""
let defaultScopes : string[] = []

export async function init(authority: string, clientId: string, newRedirectUri: string, newDefaultScopes: string[]) {
    [redirectUri, defaultScopes] = [newRedirectUri, newDefaultScopes]
    msalInstance = new msal.PublicClientApplication({
        auth: {
            clientId: clientId,
            authority: authority,
            navigateToLoginRequestUrl: false
        },
        cache: {
            cacheLocation: "localStorage"
        }
    })

    const success = await msalInstance.handleRedirectPromise()
    if(success) {
        // An authentication was already in progress and is now finished. Some data is available in the "success" variable
        msalInstance.setActiveAccount(success.account)
        state.set("authenticated")
    } else {
        // No authentication was in progress (or it failed)
        // From here on, continue with checking other ways to find out whether the user is authenticated.

        // If an account was set ever at all, using this library (as this library always sets an active account)
        if(msalInstance.getActiveAccount()) {
            // An active account was found, check if you're able to get hold of an access token
            const request = {scopes: defaultScopes, redirectUri}
            try {
                await msalInstance.acquireTokenSilent(request)
                state.set("authenticated")
            } catch (e) {
                try {
                    await msalInstance.ssoSilent(request)
                    state.set("authenticated")
                } catch(e) {
                    // All ways to get hold of a token failed, authentication most probably is invalid.
                    state.set("unauthenticated")
                }
            }
        } else {
            state.set("unauthenticated")
        }
    }
}

export async function authenticate(scopes?: string[], state?: string) {
    await msalInstance?.loginRedirect({scopes: scopes ? scopes : defaultScopes, state: state ? state : undefined})
}

export async function token(scopes?: string[]): Promise<string> {
    try {
        const resp = await msalInstance?.acquireTokenSilent({scopes: scopes ? scopes : defaultScopes})
        if(!resp?.accessToken) return Promise.reject("svelte-msauth-simple: accessToken is undefined")
        return Promise.resolve(resp?.accessToken)
    } catch(e) {
        return Promise.reject(e)
    }
}

export function account(): msal.AccountInfo {
    const acc = msalInstance?.getActiveAccount();
    if(!acc) throw new Error("svelte-msauth-simple: active account is null")
    return acc
}

export async function logout() {
    await msalInstance?.logoutRedirect()
}