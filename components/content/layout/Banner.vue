<template>
    <section class="banner">
        <NuxtImg :src="img" class="banner-image" format="webp" fit="cover" loading="lazy" placeholder />
        <div class="overlay"></div>
        <div class="banner-content">
            <h1>
                <slot :use="$slots.default" mdc-unwrap="h1" />
            </h1>
        </div>
    </section>
</template>

<script setup>
defineProps({
    img: String
});
</script>

<style scoped>
.banner {
    width: 100%;
    height: 40vh;
    position: relative;
    padding: 2.5rem 3.125rem;
    overflow: hidden;
}

.banner-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.banner-content {
    max-width: var(--page-max-width);
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

h1 {
    font-weight: 800;
    text-shadow: 0px 0px 21.2px rgba(0, 0, 0, 0.80);
    font-size: 3.5rem;
}

@media (max-width: 768px) {
    .banner {
        padding: 2.5rem 1.25rem;
    }

    h1 {
        font-size: 2.8rem;
        line-height: 3.2rem;
    }
}
</style>