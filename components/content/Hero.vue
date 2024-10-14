<template>
    <section class="hero" :style="{ backgroundImage: `url(${img})` }">
        <div class="hero-content">
            <h1>
                <ContentSlot :use="$slots.default" unwrap="h1" />
            </h1>
            <p>
                <ContentSlot :use="$slots.subtitle" unwrap="h1" />
            </p>
        </div>
    </section>
</template>

<script setup>
defineProps({
    img: String
});
</script>

<style scoped>
.hero {
    width: 100%;
    height: 80vh;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding: 2.5rem 3.125rem;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    /* Dark overlay for better text visibility */
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
}

h1 {
    font-weight: 800;
    line-height: 5.4rem;
    text-shadow: 0px 0px 21.2px rgba(0, 0, 0, 0.80);
    font-size: 4.5rem;
}

p {
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 2.4rem;
    text-shadow: 0px 0px 21.2px rgba(0, 0, 0, 0.80);
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .hero {
        padding: 2.5rem 1.25rem;
    }

    h1 {
        font-size: 3rem;
        line-height: 3.6rem;
    }

    p {
        line-height: 2rem;
    }
}
</style>