<template>
    <div class="columns">
        <ContentSlot :use="$slots.default" />
    </div>
</template>

<style scoped>
.columns {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .columns {
        flex-direction: column;
    }
}
</style>