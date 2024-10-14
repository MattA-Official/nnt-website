<template>
    <section :class="type">
        <ContentSlot :use="$slots.default" />
    </section>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        required: false,
        validator: (value) => ['focus'].includes(value)
    }
});
</script>

<style scoped>
section {
    display: flex;
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    align-self: stretch;
}

.focus {
    border-radius: 0.875rem;
    background: #191919;
    box-shadow: 0px 0px 13.7px 0px rgba(0, 0, 0, 0.25) inset;
}
</style>