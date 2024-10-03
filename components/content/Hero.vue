<template>
    <div class="hero" :style="{ backgroundImage: `url(${img})` }">
        <div class="hero-content">
            <ContentSlot :use="$slots.default" />
        </div>
    </div>
</template>

<script setup>
defineProps(['img']);
</script>

<style scoped>
.hero {
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    position: relative;
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
</style>