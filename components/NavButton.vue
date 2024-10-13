<template>
    <button :class="type" :disabled>
        <slot></slot>
    </button>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'primary',
        validator: value => ['primary', 'secondary'].includes(value)
    },
    disabled: {
        type: Boolean,
        default: false
    }
});
</script>

<style scoped>
.primary {
    background-color: var(--nnt-purple);
    color: var(--primary-text-color);
}

.secondary {
    background-color: var(--nnt-orange);
    color: var(--alt-text-color);
}

button {
    display: flex;
    padding: 0.5rem 0.75rem;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1em;
    width: fit-content;
}

button:disabled {
    background-color: rgba(68, 68, 68, 0.40);
    color: var(--primary-text-color);
    cursor: not-allowed;
}

button:hover,
button:active,
button:focus {
    filter: brightness(1.2);
}
</style>