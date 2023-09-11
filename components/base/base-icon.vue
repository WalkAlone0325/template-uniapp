<script setup>
defineProps({
  type: String,
  color: String,
  custom: {
    type: Boolean,
    default: false
  },
  customPrefix: {
    type: String,
    default: 'iconfont'
  },
  size: {
    type: Number,
    default: 24
  }
})
defineEmits(['click'])
</script>

<template>
  <uni-icons :type="type" :custom-prefix="custom && customPrefix" :size="size" :color="color" @click="$emit('click')" />
</template>
