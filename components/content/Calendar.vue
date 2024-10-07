<template>
    <div>
        <iframe
            src="https://calendar.google.com/calendar/u/0/embed?height=500&wkst=2&bgcolor=%23ffffff&ctz=Europe/London&hl=en&title&src=Y19hNDE3MjcxNzA1MDE0MzFlNjIwZTE0MjVlNTRmZDYxZjkwZmQ4MjM0OGFiNTlhZjQ5NWM5OTViNWEzNjYwNTljQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23F09300" />
    </div>
</template>

<style scoped>
div {
    max-width: var(--page-max-width);
    width: 100%;
    margin: 0 auto;
    padding: 1rem 5rem;
}

iframe {
    width: 100%;
    height: 500px;
    border: none;
}

/* Can be modified as needed for different screen sizes */
@media (max-width: 768px) {
    div {
        padding: 1rem 2rem;
    }
}
</style>