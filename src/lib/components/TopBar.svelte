<script lang="ts">
    import { Button } from "m3-svelte";
</script>

<div class="mt-4 ml-5 justify-between flex mr-5">
    <div class="big-button">
        <Button variant="filled" iconType="left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...$$props}>
                <path fill="currentColor" d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062" />
            </svg>
            <span class="text-2xl font-bold button-text">
                do it!
            </span>
        </Button>
    </div>
    <div class="big-button-2">
        <Button variant="filled" iconType="full">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" {...$$props}>
                <path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z" />
            </svg>
        </Button>
    </div>
</div>
<style>
    .big-button :global(button) {
        border-radius: 4rem;
        width: 12rem;
        height: 4rem;
    }
    .big-button :global(button svg) {
        width: 2.4rem;
        height: 2.4rem;
    }
    .big-button-2 :global(button) {
        border-radius: 4rem;
        width: 4rem;
        height: 4rem;
    }
    .big-button-2 :global(button svg) {
        width: 2rem;
        height: 2rem;
    }
    .button-text {
        font-family: "Roboto Flex", sans-serif;
        font-optical-sizing: 41;
        font-weight: 820;
        font-style: normal;
        text-align: right;
        font-variation-settings:
            "slnt" -10,
            "wdth" 151,
            "GRAD" 0,
            "XOPQ" 96,
            "XTRA" 603,
            "YOPQ" 79,
            "YTAS" 750,
            "YTDE" -203,
            "YTFI" 738,
            "YTLC" 514,
            "YTUC" 712;
    }
</style>