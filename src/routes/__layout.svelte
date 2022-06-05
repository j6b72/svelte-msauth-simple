<script lang="ts">
    import { onMount } from "svelte";
    import { init } from "$lib"

    onMount(() => {
        init(import.meta.env.VITE_AUTHORITY, import.meta.env.VITE_CLIENT_ID, "/", ["User.Read"])
    })
</script>
<slot />