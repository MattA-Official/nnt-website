<template>
    <div class="container">
        <ContentSlot :use="$slots.default" />
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
}
</style>
