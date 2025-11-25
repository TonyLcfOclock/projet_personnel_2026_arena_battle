<script>
    import { world } from '../assets/data/maps/world.data.js';

    let { gameState = $bindable() } = $props();
    let playerPos = $state('refuge');
    let destination = $state('');

    let pathIconEl = $state(null);

    let travelAnimation = null;

    function changeGameState(name) {
        if (!name || name === playerPos) return;
        destination = name;
    }

    function getAsset(id) {
        return world.find((a) => a.id === id);
    }

    function computePathData(fromId, toId) {
        const from = getAsset(fromId);
        const to = getAsset(toId);
        if (!from || !to) return null;

        const fromCenterX = from.x + from.w / 2;
        const fromCenterY = from.y + from.h / 2;
        const toCenterX = to.x + to.w / 2;
        const toCenterY = to.y + to.h / 2;

        const dx = toCenterX - fromCenterX;
        const dy = toCenterY - fromCenterY;

        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const speed = 20;
        const duration = length / speed;

        return {
            style: `
                left: ${fromCenterX}px;
                top: ${fromCenterY}px;
                width: ${length}px;
                transform: rotate(${angle}deg);
                transform-origin: left center;
            `,
            duration,
            fromCenterX,
            fromCenterY,
            toCenterX,
            toCenterY
        };
    }

    const pathData = $derived.by(() => {
        if (!playerPos || !destination || playerPos === destination) return null;
        return computePathData(playerPos, destination);
    });

    function startPositionLogger(data) {
        if (!travelAnimation) return;

        function loop() {
            if (!travelAnimation) return;

            const timing = travelAnimation.effect.getComputedTiming();
            const progress = timing ? timing.progress : 0;

            const x = data.fromCenterX + (data.toCenterX - data.fromCenterX) * progress;
            const y = data.fromCenterY + (data.toCenterY - data.fromCenterY) * progress;

            console.log('Position:', { x, y, progress });

            if (timing.progress !== null && timing.progress < 1) {
                requestAnimationFrame(loop);
            }
        }

        requestAnimationFrame(loop);
    }

    $effect(() => {
        const data = pathData;
        const icon = pathIconEl;

        if (!data || !icon) return;

        const durationMs = data.duration * 1000;
        if (!Number.isFinite(durationMs) || durationMs < 0) return;

        if (travelAnimation) {
            travelAnimation.cancel();
            travelAnimation = null;
        }

        travelAnimation = icon.animate(
            [
                { left: '0%' },
                { left: '100%' }
            ],
            {
                duration: durationMs,
                easing: 'linear',
                fill: 'forwards'
            }
        );

        startPositionLogger(data);

        travelAnimation.onfinish = () => {
            playerPos = destination;
        };
    });
</script>

<div class="map">
    <div class="map_background">
        <div class="paper_background">
            <div class="topography"></div>
            <div class="line_background"></div>
            <div class="water"></div>
            <div class="ground"></div>
             {#if pathData}
                {#key `${playerPos}-${destination}`}
                    <div class="path" style={pathData.style}>
                        <div class="path-line"></div>
                        <div
                            class="path-icon"
                            bind:this={pathIconEl}
                        ></div>
                    </div>
                {/key}
            {/if}

            {#each world as asset}
                <button onclick={() => { changeGameState(asset.id) }} class='asset' style={ `background: center / cover no-repeat url("${asset.image}"); left: ${asset.x}px; top: ${asset.y}px; width: ${asset.w}px; height: ${asset.h}px` }>
                    <p style={ `position: absolute; top: ${asset.p_top}px; right: ${asset.p_right}px; color: #8F242B; font-size: 1.2rem; font-weight: bold; -webkit-text-stroke: 0.3px white;` }>{ asset.name }</p>
                </button>
            {/each}
        </div>
        <div class="map_border"></div>
        <div class="compass"></div>
        <div class="legend"></div>
    </div>
</div>

<style>
    .map {
        height: 100%;
        width: 100%;
    }

    .map_background {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: center / cover no-repeat url('./src/assets/art/tilesets/worldmap/map_background.png');
        height: 100%;
        width: 100%;
    }

    .map_border {
        position: absolute;
        background: center / contain no-repeat url('./src/assets/art/tilesets/worldmap/border.png');
        height: 100%;
        width: 85%;
    }

     .compass {
        opacity: 0.8;
        position: absolute;
        top: 900px;
        left: 150px;
        background: center / contain no-repeat url('./src/assets/art/tilesets/worldmap/compass.png');
        height: 20%;
        width: 20%;
    }

    .paper_background {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background: center / cover no-repeat url('./src/assets/art/tilesets/worldmap/paper_background.png');
        height: 100%;
        width: 85%;
    }

    .topography {
        position: absolute;
        opacity: 0.10;
        background: center / cover no-repeat url('./src/assets/art/tilesets/worldmap/topography.png');
        height: 90%;
        width: 85%;
    }

    .line_background {
        position: absolute;

        background: center / cover no-repeat url('./src/assets/art/tilesets/worldmap/lines.png');
        height: 90%;
        width: 85%;
    }

    .water {
        position: absolute;
        opacity: 0.8;
        background: center / cover no-repeat url('./src/assets/art/tilesets/worldmap/water.png');
        height: 90%;
        width: 90%;
    }

    .ground {
        position: absolute;
        opacity: 0.8;
        background: center / cover no-repeat url('./src/assets/art/tilesets/worldmap/ground.png');
        height: 100%;
        width: 100%;
    }

    .legend {
        position: absolute;
        top: 150px;
        left: -200px;
        background: center / contain no-repeat url('./src/assets/art/tilesets/worldmap/legend_background.png');
        height: 50%;
        width: 50%;
    }

    .asset {
        position: absolute;
        z-index: 1000;
        padding: 0;
        cursor: pointer;
        border: none;
    }

    .asset p {
        position: absolute;
        color: #8F242B;
        font-size: 1.2rem;
        font-weight: bold;
        -webkit-text-stroke: 0.3px white;
    }

    .path {
        position: absolute;
        z-index: 950;
        pointer-events: none;
    }

    .path-line {
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 4px;
        background: #8F242B;
        transform: translateY(-50%);
        opacity: 0.8;
    }

    .path-icon {
        position: absolute;
        top: 50%;
        left: 0%;
        width: 32px;
        height: 32px;
        transform: translate(-50%, -50%) rotate(65deg);
        background: center / contain no-repeat url('./src/assets/art/tilesets/worldmap/player_pos.png');
        z-index: 960;
    }
</style>