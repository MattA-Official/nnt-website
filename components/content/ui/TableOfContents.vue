<template>
  <div class="table-of-contents">
    <TableOfContentsItem :links="page.body.toc.links" :activeId="activeId" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  page: Object
})

const activeId = ref('')
let observer = null
let visibleHeadings = new Set()

const setupObserver = () => {
  // Cleanup existing observer if any
  if (observer) {
    observer.disconnect()
  }

  // Reset state
  visibleHeadings.clear()
  activeId.value = ''

  observer = new IntersectionObserver((entries) => {
    // Update our set of visible headings based on intersection changes
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visibleHeadings.add(entry.target.id)
      } else {
        visibleHeadings.delete(entry.target.id)
      }
    })

    // Get positions of all currently visible headings
    const headingsWithPosition = Array.from(visibleHeadings)
      .map(id => {
        const element = document.getElementById(id)
        return {
          id,
          top: element.getBoundingClientRect().top
        }
      })
      .filter(heading => heading.top <= window.innerHeight * 0.2)
      .sort((a, b) => a.top - b.top)

    if (headingsWithPosition.length > 0) {
      // Take the topmost visible heading
      activeId.value = headingsWithPosition[0].id
    } else {
      // If no headings are in view, find the closest one above
      const headingsAbove = Array.from(document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]'))
        .map(el => ({
          id: el.id,
          top: el.getBoundingClientRect().top
        }))
        .filter(heading => heading.top < 0)
        .sort((a, b) => b.top - a.top)

      activeId.value = headingsAbove[0]?.id || ''
    }
  }, {
    // Observe headings with a bit more margin to ensure we catch them early
    rootMargin: '0px 0px -90% 0px',
    threshold: [0, 1]
  })

  // Wait for next tick to ensure DOM is updated
  setTimeout(() => {
    document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]').forEach(heading => {
      observer.observe(heading)
    })
  }, 0)
}

onMounted(setupObserver)

// Watch for page changes
watch(() => props.page, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    setupObserver()
  }
}, { deep: true })

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.table-of-contents {
  padding: 1.5rem;
  background: var(--header-bg-color);
  border: 1px solid var(--nnt-orange);
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.table-of-contents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.table-of-contents ul ul {
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.table-of-contents li {
  margin-bottom: 0.75rem;
}

.table-of-contents li:last-child {
  margin-bottom: 0;
}

.table-of-contents a {
  color: var(--primary-text-color);
  text-decoration: none;
  transition: color 0.2s;
  display: inline-block;
}

.table-of-contents a:hover {
  color: var(--nnt-orange);
  text-decoration: none;
}

.table-of-contents>ul>li>a {
  font-weight: 500;
}
</style>