<script setup>
const props = defineProps({
	selectedAccoms: Object,
	accommodations: Object
})
const selectedDisplay = props.accommodations
	.map((accom) => {
		if (props.selectedAccoms[accom.accomId]) {
			return `${accom.categoryName}: ${accom.title}`;
		}
		return null;
	})
	.filter(Boolean); // removes nulls
</script>

<template>
	<v-card elevation="5" rounded="lg">
		<v-container>
			<v-card-title>Are you sure you want to save?</v-card-title>
			<v-card-text>
				<div>You are about to add these accommodations:</div>
				<div v-for="item in selectedDisplay" :key="item" class="ml-4">{{ item }}</div>
				<div>Are you sure you want to close it? This action is permanent.</div>
			</v-card-text>
			<v-card-actions>
				<v-btn class="ml-4" color="blue" style="float: right" elevation="5" @click="$emit('save')">
					Add
				</v-btn>
				<v-btn flat @click="$emit('cancel')">
					Cancel
				</v-btn>
			</v-card-actions>
		</v-container>
	</v-card>
</template>
