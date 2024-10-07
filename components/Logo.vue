<template>
  <div>
    <NuxtImg id="logo" src="/images/logos/nnt_logo-dark.png" alt="Logo" />
    <NuxtImg id="squares" src="/images/logos/nnt_squares.png" alt="Logo" />
  </div>
</template>

<style>
div {
  width: 100%;
  margin: 0 auto;
}

#logo {
  width: 12rem;
  height: auto;
}

#squares {
  display: none;
}

@media (max-width: 768px) {
  #logo {
    display: none;
  }

  #squares {
    display: block;
    width: 2rem;
    height: 2rem;
  }
}
</style>