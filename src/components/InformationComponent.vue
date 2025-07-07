<script setup>
const props = defineProps({
  message: {
    type: String,
    default: "",
  },
})
</script>

<template>
  <div>
    <v-tooltip :text="message" location="bottom">
      <template #activator="{ props }">
        <v-icon
          v-bind="props"
          class="mx-2"
          color="grey-darken-1"
        >
          mdi-information
        </v-icon>
      </template>
    </v-tooltip>
  </div>
</template>
