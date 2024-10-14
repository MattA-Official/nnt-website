<template>
    <div class="content">
        <ContentSlot :use="$slots.default" />
    </div>
</template>

<style scoped>
.content {
    display: flex;
    padding: 2.5rem 3.125rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5em;
    align-self: stretch;
    max-width: var(--page-max-width);
}

@media (max-width: 768px) {
    .content {
        padding: 1.25rem;
        gap: 1em;
    }

}
</style>