<script lang="ts">
    // bro. lemme rant for a sec.
    // why the FUCK IS SVELTE GIVING ME RANDOM ERRORS
    // WHY... do I have to add this completely random button that is from a random project, does nothing, can even be HIDDEN, just to get a random error to go away?
    // literally, WHY does causing a random hydration mismatch fix this?
    // who knows bro
    import { Button } from "m3-svelte";
</script>

<div class="mt-4 ml-5 justify-between flex mr-5">
    <Button class="hidden" variant="tonal" iconType="none" onclick={() => {}}> <!-- said random button bruh -->
        <svg width="16" height="16" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_845_2368)">
            <path d="M45.0613 10.244C44.5229 9.8236 43.8223 9.6761 43.1659 9.83835L19.5659 15.7383C18.5776 15.9817 17.8918 16.8667 17.8918 17.8845V36.9415C14.16 35.3116 9.81613 37.0152 8.18626 40.7543C6.55639 44.4861 8.26001 48.83 11.9991 50.4599C15.7309 52.0897 20.0748 50.3861 21.7046 46.647C22.1103 45.7177 22.3168 44.7147 22.3168 43.697V19.6102L41.4918 14.8165V31.0415C37.76 29.4116 33.4161 31.1152 31.7863 34.8543C30.1564 38.5861 31.86 42.93 35.5991 44.5598C39.3309 46.1897 43.6748 44.4861 45.3046 40.747C45.7103 39.8177 45.9168 38.8147 45.9168 37.797V11.9845C45.9168 11.306 45.5996 10.657 45.0686 10.244H45.0613ZM14.9344 46.647C13.3045 46.647 11.9844 45.3268 11.9844 43.697C11.9844 42.0671 13.3045 40.747 14.9344 40.747C16.5643 40.747 17.8844 42.0671 17.8844 43.697C17.8844 45.3268 16.5643 46.647 14.9344 46.647ZM38.5344 40.747C36.9045 40.747 35.5844 39.4268 35.5844 37.797C35.5844 36.1671 36.9045 34.847 38.5344 34.847C40.1643 34.847 41.4844 36.1671 41.4844 37.797C41.4844 39.4268 40.1643 40.747 38.5344 40.747Z" fill="currentColor"/>
            </g>
            <defs>
            <clipPath id="clip0_845_2368">
            <rect width="59" height="59" fill="white"/>
            </clipPath>
            </defs>
        </svg>
        <span class="text-on-secondary-container roboto-flex-home-text text-xs">/ home</span>
    </Button>
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
        <Button variant="filled">
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
        gap: 0;
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