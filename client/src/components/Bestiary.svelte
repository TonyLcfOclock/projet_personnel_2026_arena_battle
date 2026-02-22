<script>
    import { onMount } from "svelte";
    import Utilities from "../assets/scripts/utils/Utilities.svelte.js";
    import pieIcon from "../assets/image/pie.png";
    import swordIcon from "../assets/image/sword.png";

    let { gameState = $bindable() } = $props();

    const categories = [
        { id: "characters", label: "Personnages" },
        { id: "items", label: "Objets" },
    ];

    const characters = [
        {
            name: "DeathKnight",
            className: "DeathKnight",
            typeName: "Humain",
            image: "/images/characters/humans/classes/death_knight/death_knight1.png",
            avatar: "/images/characters/humans/classes/death_knight/avatars/deathknight_avatar.png",
            description: "Chevalier maudit qui gagne en puissance à chaque âme récoltée.",
            baseStatistics: {
                hp: 800,
                str: 150,
                arm: 60,
                speed: 50,
                critChance: 0.2,
                critDamage: 1.5,
            },
            passives: [
                { name: "Âmes", display: true, description: "Accumule des Âmes pour renforcer ses statistiques.", stacks: 1 },
                { name: "Contre-attaque", display: true, description: "Peut contre-attaquer après avoir subi un coup.", stacks: 0 },
            ],
            spells: [
                {
                    name: "Frappe perforante",
                    image: "/images/characters/humans/classes/death_knight/spells_icons/piercing_strike.png",
                    description: "Frappe précise orientée dégâts monocible.",
                    cooldown: 2,
                    damageType: "physical",
                    type: "enemy",
                },
                {
                    name: "Frappe spectrale",
                    image: "/images/characters/humans/classes/death_knight/spells_icons/spectral_strike.png",
                    description: "Attaque spirituelle qui accentue la pression offensive.",
                    cooldown: 1,
                    damageType: "physical",
                    type: "enemy",
                },
                {
                    name: "Revers fantomatique",
                    image: "/images/characters/humans/classes/death_knight/spells_icons/phantom_backlash.png",
                    description: "Riposte agressive contre l'ennemi.",
                    cooldown: 3,
                    damageType: "physical",
                    type: "enemy",
                },
                {
                    name: "Écrasement",
                    image: "/images/characters/humans/classes/death_knight/spells_icons/overpower.png",
                    description: "Exécution lourde basée sur la force brute.",
                    cooldown: 4,
                    damageType: "physical",
                    type: "enemy",
                },
                {
                    name: "Moisson d'Âmes",
                    image: "/images/characters/humans/classes/death_knight/spells_icons/soul_harvest.png",
                    description: "Convertit les Âmes en avantage de combat.",
                    cooldown: 4,
                    damageType: "utility",
                    type: "self",
                },
            ],
        },
        {
            name: "Baron",
            className: "Baron",
            typeName: "Monstre",
            image: "/images/characters/monsters/boss/baron/baron.png",
            avatar: "/images/characters/monsters/boss/baron/avatars/baron_avatar.png",
            description: "Boss sanguinaire spécialisé dans l'usure et les saignements.",
            baseStatistics: {
                hp: 4500,
                str: 240,
                arm: 50,
                speed: 30,
                critChance: 0.2,
                critDamage: 1.5,
            },
            passives: [],
            spells: [
                {
                    name: "Entaille profane",
                    image: "/images/characters/monsters/boss/baron/spells_icon/profane_rake.png",
                    description: "Balafre lourde qui entame la défense ennemie.",
                    cooldown: 2,
                    damageType: "physical",
                    type: "enemy",
                },
                {
                    name: "Morsure sanguine",
                    image: "/images/characters/monsters/boss/baron/spells_icon/sanguine_bite.png",
                    description: "Morsure qui draine la vitalité de la cible.",
                    cooldown: 2,
                    damageType: "physical",
                    type: "enemy",
                },
                {
                    name: "Offrande sanguine",
                    image: "/images/characters/monsters/boss/baron/spells_icon/sanguine_offering.png",
                    description: "Sacrifie une part de sang pour amplifier la menace.",
                    cooldown: 4,
                    damageType: "utility",
                    type: "self",
                },
                {
                    name: "Exsanguination",
                    image: "/images/characters/monsters/boss/baron/spells_icon/exsanguinate.png",
                    description: "Technique de finition orientée burst.",
                    cooldown: 5,
                    damageType: "physical",
                    type: "enemy",
                },
            ],
        },
        {
            name: "Dimensional Devourer",
            className: "Dimensional Devourer",
            typeName: "Monstre",
            image: "/images/characters/monsters/boss/dimensional_devourer/dimensional_devourer.png",
            avatar: "/images/characters/monsters/boss/dimensional_devourer/avatars/dimensional_devourer.png",
            description: "Aberration cosmique qui manipule le rythme du combat.",
            baseStatistics: {
                hp: 2400,
                str: 220,
                arm: 85,
                speed: 62,
                critChance: 0.1,
                critDamage: 1.8,
            },
            passives: [
                {
                    name: "Charge de faille",
                    display: true,
                    description: "Empile des charges de faille pour réduire les dégâts subis.",
                    stacks: 0,
                },
            ],
            spells: [
                {
                    name: "Cisaille spatiale",
                    image: "/images/characters/monsters/boss/dimensional_devourer/spells_icon/spatial_shear.png",
                    description: "Entaille spatiale avec pression continue.",
                    cooldown: 2,
                    damageType: "physical",
                    type: "enemy",
                },
                {
                    name: "Serre de faille",
                    image: "/images/characters/monsters/boss/dimensional_devourer/spells_icon/rift_talon.png",
                    description: "Projection rapide qui perturbe la cible.",
                    cooldown: 3,
                    damageType: "physical",
                    type: "enemy",
                },
                {
                    name: "Assaut du pas du vide",
                    image: "/images/characters/monsters/boss/dimensional_devourer/spells_icon/voidstep_assault.png",
                    description: "Assaut en rupture dimensionnelle.",
                    cooldown: 4,
                    damageType: "physical",
                    type: "enemy",
                },
            ],
        },
    ];

    const items = [
        {
            id: "aegide-damnos",
            name: "Égide des Damnos",
            category: "Équipement",
            rarity: "Légendaire",
            image: swordIcon,
            value: 6500,
            description: "Bouclier antique forgé pour encaisser les duels les plus longs.",
            stats: [
                "+140 ARM",
                "+350 HP",
                "10% de réduction des dégâts critiques",
            ],
            usage: "Idéal contre les archétypes burst physiques.",
        },
        {
            id: "tranchoir",
            name: "Tranchoir de Boucher",
            category: "Équipement",
            rarity: "Rare",
            image: swordIcon,
            value: 4200,
            description: "Lame brutale orientée pression mêlée.",
            stats: [
                "+95 STR",
                "+8% de critique",
                "Applique un saignement léger (1 tour)",
            ],
            usage: "Bon choix offensif pour finir rapidement un duel.",
        },
        {
            id: "fiole-bile",
            name: "Fiole de Bile",
            category: "Consommable",
            rarity: "Commun",
            image: pieIcon,
            value: 250,
            description: "Concoction instable utilisée en urgence en plein combat.",
            stats: [
                "Soigne 14% des HP max",
                "Nettoie 1 effet négatif",
                "Usage unique",
            ],
            usage: "Utile pour rebasculer un tour critique.",
        },
        {
            id: "tonique-cendre",
            name: "Tonique de Cendre",
            category: "Consommable",
            rarity: "Rare",
            image: pieIcon,
            value: 750,
            description: "Stimulant alchimique qui accélère les réactions.",
            stats: [
                "+20 VITESSE pendant 2 tours",
                "+6% d'esquive temporaire",
                "Usage unique",
            ],
            usage: "Parfait pour reprendre l'initiative.",
        },
    ];

    let selectedCategory = $state("characters");
    let selectedCharacter = $state("");
    let selectedItem = $state(items[0].id);

    onMount(async () => {
        loadCharacters();
    });

    function loadCharacters() {
        if (!selectedCharacter && characters.length > 0) {
            selectedCharacter = characters[0].className;
        }
    }

    function selectCategory(categoryId) {
        selectedCategory = categoryId;
    }

    function selectCharacter(className) {
        selectedCharacter = className;
    }

    function selectItem(itemId) {
        selectedItem = itemId;
    }

    function formatPercent(value) {
        return `${Math.round(value * 100)}%`;
    }

    let activeCharacter = $derived(
        characters.find((character) => character.className === selectedCharacter) ||
            characters[0],
    );

    let activeItem = $derived(
        items.find((item) => item.id === selectedItem) || items[0],
    );
</script>

<section class="bestiary-page">
    <header class="bestiary-header">
        <p class="bestiary-kicker">Codex de l'arène</p>
        <h1>Bestiaire et Arsenal</h1>
        <p class="bestiary-subtitle">
            Sélectionne une entrée pour consulter son profil complet : image,
            statistiques, passifs, sorts et détails d'Équipement.
        </p>
    </header>

    <div class="bestiary-shell">
        <aside class="bestiary-panel nav-panel">
            <div class="panel-head">
                <h2>Navigation</h2>
            </div>

            <div class="category-switch" role="tablist">
                {#each categories as category}
                    <button
                        class="category-button"
                        class:is-active={ selectedCategory === category.id }
                        role="tab"
                        onclick={() => selectCategory(category.id)}
                    >
                        { category.label }
                    </button>
                {/each}
            </div>

            {#if selectedCategory === "characters"}
                <div class="entry-list">
                    {#each characters as character}
                        <button
                            class="entry-button"
                            class:is-active={ activeCharacter?.className === character.className }
                            onclick={ () => selectCharacter(character.className) }
                        >
                            <img src={ character.avatar } alt={ character.className } />
                            <span>
                                <strong>{ character.className }</strong>
                                <small>{ character.typeName }</small>
                            </span>
                        </button>
                    {/each}
                </div>
            {:else}
                <div class="entry-list">
                    {#each items as item}
                        <button
                            class="entry-button"
                            class:is-active={ activeItem?.id === item.id }
                            onclick={ () => selectItem(item.id) }
                        >
                            <img src={ item.image } alt={ item.name } />
                            <span>
                                <strong>{ item.name }</strong>
                                <small>{ item.category }</small>
                            </span>
                        </button>
                    {/each}
                </div>
            {/if}
        </aside>

        <section class="detail-panel">
            {#if selectedCategory === "characters" && activeCharacter}
                <div class="detail-hero">
                    <div class="detail-portrait">
                        <img src={ activeCharacter.image } alt={ activeCharacter.className } />
                    </div>
                    <div class="detail-title">
                        <p class="entry-kind">Personnage</p>
                        <h2>{ activeCharacter.className }</h2>
                        <p class="detail-description">{ activeCharacter.description }</p>
                        <div class="meta-row">
                            <span class="meta-pill">{ activeCharacter.typeName }</span>
                            <span class="meta-pill">{ activeCharacter.spells?.length } sorts</span>
                            <span class="meta-pill">{ activeCharacter.passives?.filter((passive) => passive.display).length } passifs</span>
                        </div>
                    </div>
                </div>

                <div class="detail-grid">
                    <article class="info-card">
                        <h3>Statistiques</h3>
                        <div class="stats-grid">
                            <div><span>HP</span><strong>{ activeCharacter.baseStatistics.hp }</strong></div>
                            <div><span>STR</span><strong>{ activeCharacter.baseStatistics.str }</strong></div>
                            <div><span>ARM</span><strong>{ activeCharacter.baseStatistics.arm }</strong></div>
                            <div><span>VITESSE</span><strong>{ activeCharacter.baseStatistics.speed }</strong></div>
                            <div><span>CRIT%</span><strong>{ formatPercent(activeCharacter.baseStatistics.critChance) }</strong></div>
                            <div><span>DÉGÂTS CRIT</span><strong>x{ activeCharacter.baseStatistics.critDamage }</strong></div>
                        </div>
                    </article>

                    <article class="info-card">
                        <h3>Passifs</h3>
                        {#if activeCharacter.passives?.filter((passive) => passive.display).length > 0}
                            <div class="chip-list">
                                {#each activeCharacter.passives.filter((passive) => passive.display) as passive}
                                    <div class="chip-entry">
                                        <p>{ passive.name }</p>
                                        <small>{ passive.description }</small>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="empty-text">Ce personnage n'a pas de passif affiché.</p>
                        {/if}
                    </article>
                </div>

                <article class="info-card spells-card">
                    <h3>Sorts</h3>
                    <div class="spell-grid">
                        {#each activeCharacter.spells || [] as spell}
                            <div class="spell-card">
                                <div class="spell-card-head">
                                    <img src={ spell.image } alt={ spell.name } />
                                    <div>
                                        <p>{ spell.name }</p>
                                        <small>{ spell.damageType === "physical" ? "Physique" : "Utilitaire" } | Recharge { spell.cooldown }</small>
                                    </div>
                                </div>
                                <p class="spell-description">{ spell.description }</p>
                            </div>
                        {/each}
                    </div>
                </article>
            {/if}

            {#if selectedCategory === "items" && activeItem}
                <div class="detail-hero detail-hero-item">
                    <div class="detail-portrait">
                        <img src={ activeItem.image } alt={ activeItem.name } />
                    </div>
                    <div class="detail-title">
                        <p class="entry-kind">Objet</p>
                        <h2>{ activeItem.name }</h2>
                        <p class="detail-description">{ activeItem.description }</p>
                        <div class="meta-row">
                            <span class="meta-pill">{ activeItem.category }</span>
                            <span class="meta-pill rarity">{ activeItem.rarity }</span>
                            <span class="meta-pill">{ activeItem.value } or</span>
                        </div>
                    </div>
                </div>

                <div class="detail-grid">
                    <article class="info-card">
                        <h3>Effets</h3>
                        <div class="chip-list">
                            {#each activeItem.stats as stat}
                                <div class="chip-entry">
                                    <p>{ stat }</p>
                                </div>
                            {/each}
                        </div>
                    </article>

                    <article class="info-card">
                        <h3>Conseil d'usage</h3>
                        <p class="usage-text">{ activeItem.usage }</p>
                    </article>
                </div>

                <article class="info-card spells-card">
                    <h3>Détails de l'objet</h3>
                    <div class="spell-grid">
                        {#each activeItem.stats as stat}
                            <div class="spell-card">
                                <div class="spell-card-head">
                                    <img src={ activeItem.image} alt={ activeItem.name} />
                                    <div>
                                        <p>{ activeItem.name }</p>
                                        <small>{ activeItem.category } | { activeItem.rarity }</small>
                                    </div>
                                </div>
                                <p class="spell-description">{ stat }</p>
                            </div>
                        {/each}
                    </div>
                </article>
            {/if}
        </section>
    </div>
</section>

<style>
    .bestiary-page {
        --surface-main: var(--surface-1);
        --surface-soft: var(--color-surface-base);
        --red-line: var(--ui-border);
        --panel-depth: var(--shadow-soft-color);
        --detail-panel-width: 65rem;
        max-width: 1600px;
        margin: 0 auto;
        padding: 6.2rem var(--page-gutter) 4rem;
        color: var(--color-white);
        font-family: "Crimson Pro", "Times New Roman", serif;
        position: relative;
        isolation: isolate;
    }

    .bestiary-header {
        margin-bottom: 1rem;
    }

    .bestiary-kicker {
        font-family: "Inter", "Segoe UI", sans-serif;
        font-size: 0.65rem;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--color-accent-strong);
        margin: 0 0 0.45rem;
    }

    .bestiary-header h1 {
        margin: 0;
        font-family: "Pirata One", system-ui;
        font-size: clamp(2.1rem, 4.2vw, 3.5rem);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-primary);
    }

    .bestiary-subtitle {
        margin-top: 0.65rem;
        max-width: 52rem;
        color: var(--color-white);
        font-size: 1rem;
        line-height: 1.45;
    }

    .bestiary-shell {
        display: grid;
        grid-template-columns: 22rem minmax(0, 1fr);
        gap: 1.35rem;
        align-items: stretch;
    }

    .detail-panel {
        min-width: 0;
        width: var(--detail-panel-width);
        max-width: var(--detail-panel-width);
        justify-self: start;
    }

    .detail-panel > * {
        width: 100%;
        max-width: 100%;
        min-width: 0;
    }

    .bestiary-panel {
        background: var(--color-surface-base);
        border: 1px solid var(--color-border-accent);
        box-shadow: 0 10px 22px var(--panel-depth), inset 0 0 0 1px var(--color-white-soft);
        min-width: 0;
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
    }

    .nav-panel {
        position: sticky;
        top: 7rem;
        min-width: 0;
        max-height: calc(100dvh - 8rem);
        overflow-y: auto;
    }

    .panel-head {
        padding: 1rem 1rem 0.75rem;
        border-bottom: 1px solid var(--red-line);
        background: var(--color-surface-base);
    }

    .panel-head h2 {
        margin: 0;
        font-family: "Pirata One", system-ui;
        text-transform: uppercase;
        letter-spacing: 0.09em;
        color: var(--text-primary);
        font-size: 1.3rem;
    }

    .category-switch {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.6rem;
        padding: 0.9rem;
        border-bottom: 1px solid var(--red-line);
    }

    .category-button {
        border: 1px solid transparent;
        background: var(--color-surface-base);
        color: var(--text-muted);
        padding: 0.62rem 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-family: "Pirata One", system-ui;
        cursor: pointer;
        transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        border-bottom: 2px solid transparent;
    }

    .category-button.is-active,
    .category-button:hover {
        color: var(--accent-gold);
        border-color: var(--color-border-accent);
        border-bottom-color: var(--accent-gold);
        background: var(--color-surface-base);
    }

    .entry-list {
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        overflow: visible;
        padding: 0.85rem;
    }

    .entry-button {
        border: 1px solid var(--ui-border-strong);
        background: var(--color-surface-base);
        color: var(--text-body);
        width: 100%;
        text-align: left;
        display: grid;
        grid-template-columns: 3rem minmax(0, 1fr);
        gap: 0.75rem;
        align-items: center;
        padding: 0.5rem;
        cursor: pointer;
        transition: transform 0.14s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .entry-button span {
        min-width: 0;
        display: block;
    }

    .entry-button img {
        width: 3rem;
        height: 3rem;
        object-fit: cover;
        border: 1px solid var(--color-border-muted);
        background: var(--color-black);
    }

    .entry-button strong {
        display: block;
        font-size: 0.95rem;
        font-family: "Pirata One", system-ui;
        letter-spacing: 0.05em;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .entry-button small {
        display: block;
        margin-top: 0.2rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.58rem;
        font-family: "Inter", "Segoe UI", sans-serif;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .entry-button.is-active,
    .entry-button:hover {
        border-color: var(--color-border-accent);
        background: var(--color-surface-soft);
        transform: translateY(-1px);
        box-shadow: inset 0 0 0 1px var(--color-white-soft);
    }

    .detail-hero {
        display: grid;
        grid-template-columns: 19rem minmax(0, 1fr);
        gap: 1rem;
        padding: 0.55rem;
        background: var(--color-surface-base);
        border: 1px solid var(--color-border-accent);
        box-shadow: inset 0 0 0 1px var(--color-white-soft);
        min-height: 15.5rem;
        width: 100%;
        max-width: 100%;
    }

    .detail-title {
        min-width: 0;
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        align-content: start;
    }

    .detail-portrait {
        height: clamp(14rem, 31vw, 21rem);
        background: var(--color-surface-base);
        border: 1px solid var(--ui-border);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        box-shadow: inset 0 0 24px var(--shadow-panel-color);
    }

    .detail-portrait img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center top;
        border: 3px solid var(--ui-border); 
    }

    .detail-hero-item {
        grid-template-columns: 15.5rem minmax(0, 1fr);
        min-height: 14.2rem;
    }

    .detail-hero-item .detail-portrait {
        height: clamp(11rem, 23vw, 14rem);
        background:
            radial-gradient(circle at 50% 55%, var(--color-overlay-soft) 0%, transparent 68%),
            linear-gradient(160deg, var(--color-surface-soft), var(--color-surface-base));
        border-color: var(--color-border-base);
        position: relative;
    }

    .detail-hero-item .detail-portrait::before {
        content: "";
        position: absolute;
        inset: 0.75rem;
        border: 1px solid var(--color-border-muted);
        box-shadow: inset 0 0 18px var(--shadow-soft-color);
        pointer-events: none;
    }

    .detail-hero-item .detail-portrait img {
        width: auto;
        height: auto;
        max-width: 64%;
        max-height: 64%;
        object-position: center;
        filter: drop-shadow(0 8px 10px var(--shadow-panel-color));
        z-index: 1;
    }

    .entry-kind {
        margin: 0;
        font-size: 0.62rem;
        font-family: "Inter", "Segoe UI", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--color-accent-soft);
    }

    .detail-title h2 {
        margin: 0.4rem 0 0;
        font-family: "Pirata One", system-ui;
        font-size: clamp(1.75rem, 3vw, 2.6rem);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-primary);
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .detail-description {
        margin-top: 0.6rem;
        color: var(--text-body-soft);
        line-height: 1.4;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .meta-row {
        margin-top: 0.8rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
    }

    .meta-pill {
        border: 1px solid var(--color-border-muted);
        background: var(--color-surface-base);
        color: var(--color-white);
        padding: 0.35rem 0.58rem;
        font-size: 0.66rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-family: "Inter", "Segoe UI", sans-serif;
        min-width: 0;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .meta-pill.rarity {
        color: var(--color-accent-strong);
        border-color: var(--color-border-accent);
    }

    .detail-grid {
        margin-top: 0.95rem;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.95rem;
        width: 100%;
        max-width: 100%;
    }

    .info-card {
        background: var(--color-surface-base);
        border: 1px solid var(--color-border-base);
        padding: 0.9rem;
        box-shadow: inset 0 0 0 1px var(--color-white-soft);
        min-height: 13.5rem;
        min-width: 0;
        width: 100%;
        max-width: 100%;
    }

    .info-card h3 {
        margin: 0 0 0.8rem;
        font-family: "Pirata One", system-ui;
        font-size: 1.22rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-primary);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.55rem;
    }

    .stats-grid div {
        border: 1px solid var(--color-border-base);
        background: var(--color-surface-base);
        padding: 0.58rem;
    }

    .stats-grid span {
        display: block;
        color: var(--color-accent-soft);
        font-size: 0.64rem;
        text-transform: uppercase;
        letter-spacing: 0.17em;
        font-family: "Inter", "Segoe UI", sans-serif;
    }

    .stats-grid strong {
        display: block;
        margin-top: 0.26rem;
        font-family: "Pirata One", system-ui;
        color: var(--text-primary);
        font-size: 1.15rem;
    }

    .chip-list {
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
    }

    .chip-entry {
        border: 1px solid var(--ui-border);
        background: var(--color-surface-base);
        padding: 0.58rem 0.7rem;
    }

    .chip-entry p {
        margin: 0;
        color: var(--color-white);
        font-family: "Pirata One", system-ui;
        letter-spacing: 0.05em;
        overflow-wrap: anywhere;
    }

    .chip-entry small {
        display: block;
        margin-top: 0.28rem;
        line-height: 1.35;
        color: var(--text-body-soft);
    }

    .empty-text,
    .usage-text {
        color: var(--text-body-soft);
        line-height: 1.4;
    }

    .spells-card {
        margin-top: 0.95rem;
        min-height: 12rem;
        width: 100%;
        max-width: 100%;
    }

    .spell-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.6rem;
    }

    .spell-card {
        border: 1px solid var(--color-border-base);
        background: var(--color-surface-base);
        padding: 0.62rem;
        min-width: 0;
    }

    .spell-card-head {
        display: grid;
        grid-template-columns: 2.6rem minmax(0, 1fr);
        gap: 0.58rem;
        align-items: center;
    }

    .spell-card-head > div {
        min-width: 0;
    }

    .spell-card-head img {
        width: 2.6rem;
        height: 2.6rem;
        border: 1px solid var(--color-border-muted);
    }

    .spell-card-head p {
        margin: 0;
        color: var(--text-primary);
        font-family: "Pirata One", system-ui;
        letter-spacing: 0.04em;
        overflow-wrap: anywhere;
    }

    .spell-card-head small {
        color: var(--color-accent-strong);
        text-transform: uppercase;
        letter-spacing: 0.11em;
        font-size: 0.58rem;
        font-family: "Inter", "Segoe UI", sans-serif;
    }

    .spell-description {
        margin-top: 0.5rem;
        color: var(--text-body-soft);
        font-size: 0.9rem;
        line-height: 1.3;
        overflow-wrap: anywhere;
    }

    @media (max-width: 1100px) {
        .bestiary-shell {
            grid-template-columns: 1fr;
        }

        .detail-panel {
            width: 100%;
            max-width: 100%;
        }

        .nav-panel {
            position: static;
            max-height: none;
            overflow-y: visible;
        }

        .detail-hero {
            grid-template-columns: 1fr;
            min-height: auto;
        }

        .detail-portrait {
            height: 15rem;
        }

        .detail-grid {
            grid-template-columns: 1fr;
        }

        .info-card,
        .spells-card {
            min-height: auto;
        }

        .spell-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 700px) {
        .bestiary-page {
            padding-top: 6.1rem;
        }

        .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .spell-grid {
            grid-template-columns: 1fr;
        }
    }
</style>