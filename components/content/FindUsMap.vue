<template>
  <div>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11111.217311914259!2d-1.1956004128766895!3d52.94318334458196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4879c2097f1223b1%3A0xe8be99eb87708496!2sNew%20Theatre!5e0!3m2!1sen!2suk!4v1727996885988!5m2!1sen!2suk"
      style="border:0;" allowfullscreen="false" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
  height: 350px;
  border: none;
}

/* Can be modified as needed for different screen sizes */
@media (max-width: 768px) {
  div {
    padding: 1rem 2rem;
  }
}
</style>