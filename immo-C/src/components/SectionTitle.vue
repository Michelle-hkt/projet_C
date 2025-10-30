<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  h3Title: {
    type: String,
    default: 'N/A',
    required: true,
  },
  h2Title: {
    type: String,
    default: 'N/A',
    required: true,
  },
})
</script>

<template>
  <div class="contain_top">
    <span></span>
    <div class="contain_top_text">
      <h3>{{ props.h3Title }}</h3>
      <h2>{{ props.h2Title }}</h2>
    </div>
  </div>
</template>
<style>
.contain_top {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}
.contain_top span {
  width: 15px;
  height: 63px;
  background-color: #274abb;
  display: block;
  border-radius: 4px;
}
.contain_top_text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-left: 18px;
}
.contain_top_text h3 {
  font-size: 18px;
  font-family: 'Monserrat', 'sans-serif';
  color: #111;
  font-weight: 500;
}
.contain_top_text h2 {
  font-size: 28px;
  color: #274abb;
  font-family: 'Monserrat', 'sans-serif';
  font-weight: bold;
}
</style>
