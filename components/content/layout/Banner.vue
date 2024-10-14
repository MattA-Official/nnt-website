<template>
    <section class="banner" :style="{ backgroundImage: `url(${img})` }">
        <div class="banner-content">
            <h1>
                <ContentSlot :use="$slots.default" unwrap="h1" />
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
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding: 2.5rem 3.125rem;
}

.banner::before {
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

.banner-content {
    max-width: var(--page-max-width);
    position: relative;
    z-index: 2;
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