<template>
    <header>
        <nav class="wide">
            <NuxtLink to="/" aria-label="Home | The Nottingham New Theatre">
                <Logo />
            </NuxtLink>
            <ul :class="{ open: isOpen }">
                <li v-for="link in data.links" :key="link.url">
                    <NuxtLink :to="link.url">
                        <template v-if="link.button">
                            <NavButton :type="link.type">
                                {{ link.text }}
                            </NavButton>
                        </template>
                        <template v-else>
                            {{ link.text }}
                        </template>
                    </NuxtLink>
                </li>
                <li class="user-menu">
                    <button class="user-button" @click="toggleUserMenu">
                        <Icon name="icon:arrow" />
                    </button>
                    <ul class="dropdown-menu" v-show="isUserMenuOpen">
                        <template v-if="!currentUser">
                            <li>
                                <NuxtLink to="/login">Login</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/register">Register</NuxtLink>
                            </li>
                        </template>
                        <template v-else>
                            <li><button @click="logout">Logout</button></li>
                        </template>
                    </ul>
                </li>
            </ul>
        </nav>
        <nav class="narrow">
            <div>
                <NuxtLink to="/" aria-label="Home | The Nottingham New Theatre">
                    <Logo />
                </NuxtLink>
                <button class="icon" @click="isOpen = !isOpen">
                    <span v-if="isOpen">
                        <Icon name="icon:clear" />
                    </span>
                    <span v-else>
                        <Icon name="icon:menu" />
                    </span>
                </button>
            </div>
            <ul :class="{ open: isOpen }" class="menu">
                <li v-for="link in data.links" :key="link.url">
                    <NuxtLink :to="link.url">
                        <template v-if="link.button">
                            <NavButton :type="link.type">
                                {{ link.text }}
                            </NavButton>
                        </template>
                        <template v-else>
                            {{ link.text }}
                        </template>
                    </NuxtLink>
                </li>
                <li class="user-menu">
                    <template v-if="!currentUser">
                        <NuxtLink to="/login">Login</NuxtLink>
                        <NuxtLink to="/register">Register</NuxtLink>
                    </template>
                    <template v-else>
                        <button @click="logout">Logout</button>
                    </template>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup>
const { data } = await useAsyncData('header', () => queryContent('/_nav/header').findOne());
const isOpen = ref(false);
const isUserMenuOpen = ref(false);
const { currentUser, logout } = useAuth();

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};
</script>

<style scoped>
header {
    background-color: var(--header-bg-color);
    border-bottom: 1px solid #232323;
}

nav {
    max-width: var(--page-max-width);
    display: flex;
    padding: 1.2rem 3rem;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
}

nav ul {
    list-style: none;
    display: flex;
    justify-content: right;
    gap: 1rem;
    padding: 0;
    align-items: center;
}

a {
    color: var(--primary-text-color);
}

a:hover,
a:active,
a:focus {
    color: var(--link-color);
    text-decoration: none;
}

.narrow {
    display: none;
}

/* Can be modified as needed for different screen sizes */
@media (max-width: 768px) {
    .wide {
        display: none;
    }

    .narrow {
        display: flex;
        flex-direction: column;
    }

    .narrow div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .narrow .icon {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--primary-text-color);
        font-size: 2rem;
    }

    .narrow ul {
        display: none;
        flex-direction: column;
        gap: 1rem;
        padding: 4rem 0;
        width: 100%;
    }

    .narrow ul.open {
        display: flex;
    }
}

/* TODO: make this actually look nice */
/* This is mostly just for testing */

.user-menu {
    position: relative;
    z-index: 5;
}

.user-button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 1.5rem;
    padding: 0.5rem;
}

.dropdown-menu {
    position: absolute;
    top: 200%;
    right: 0;
    background-color: var(--header-bg-color);
    border: 1px solid #232323;
    border-radius: 4px;
    padding: 0.5rem;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.dropdown-menu li {
    width: 100%;
}

.dropdown-menu a,
.dropdown-menu button {
    display: block;
    width: 100%;
    padding: 0.5rem;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--primary-text-color);
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
    color: var(--link-color);
    background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
    .user-menu {
        display: flex;
        gap: 1rem;
    }
}
</style>