<template>
  <div class="card">
    <img v-if="member.image" :src="member.image" alt="Member Photo" class="card-img">
    <!-- TODO: Update placeholder image -->
    <img v-else src="https://via.placeholder.com/150" alt="Placeholder Image" class="card-img">
    <div class="card-body">
      <h3 class="card-title">{{ member.name }}</h3>
      <div class="role-container">
        <p class="card-role">{{ member.role }}</p>
        <a v-if="member.email" :href="'mailto:' + member.email + '@newtheatre.org.uk'" class="email" target="_blank">
          <Icon class="icon" name="icon:email" />
          <!-- TODO: Make this accessible to screenreaders -->
          <span class="popover">{{ member.email }}@newtheatre.org.uk</span>
        </a>
      </div>
      <!-- <p class="card-description">{{ member.description }}</p> -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  member: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 300px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.card-img {
  width: 150px;
  height: 150px;
  margin: 3rem auto 0;
  border-radius: 50%;
}

.card-body {
  padding: 1rem;
  text-align: center;
}

.card-title {
  font-size: 1.5rem;
  padding: 0;
}

.card-role {
  font-size: 1rem;
  padding: 0.5rem 0;
  width: auto;
  max-width: 22ch;
  margin: 0;
}

.icon {
  font-size: 1.5rem;
}

.email {
  display: flex;
  align-items: center;
  position: relative;
}

.role-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.popover {
  display: none;
  position: absolute;
  background-color: #333;
  color: var(--primary-text-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  z-index: 1;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-160%);
}

.email:hover .popover {
  display: block;
}
</style>