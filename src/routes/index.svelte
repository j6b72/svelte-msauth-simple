{#if $state === "authenticated"}
    <p>Logged in!</p>
    <p>{account().name}</p>
    <p>{$token1}</p>
    <button on:click={() => logout()}>Log out</button>
{/if}

{#if $state === "processing"}
    <p>Processing...</p>
{/if}

{#if $state === "unauthenticated"}
    <button on:click={() => authenticate()}>Log in</button>
{/if}

<p>
    svelte-msauth-simple
</p>


<script lang="ts">
    import { writable } from "svelte/store";
    import {state, authenticate, token, logout, account} from "$lib"
    const token1 = writable("")
    state.subscribe(state1 => {
        if(state1 === "authenticated") {
            token().then(token2 => token1.set(token2))
        }
    })
</script>