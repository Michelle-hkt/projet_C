<script setup>
import HeaderPublic from '@/components/HeaderPublic.vue'
import FooterPublic from '@/components/FooterPublic.vue'
</script>

<template>
  <HeaderPublic />
  <main class="main">
    <RouterView />
  </main>

  <FooterPublic />
</template>

<style scoped>
.main {
  min-height: calc(100vh - 160px);
}
</style>
