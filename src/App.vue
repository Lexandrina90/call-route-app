<script setup lang="ts">
import CallRoutesList from '@/components/CallRoutesList.vue';
import FilterList from '@/components/FilterList.vue';

</script>

<template>
    <div class="flex gap-6">
        <FilterList />
        <CallRoutesList />
    </div>
</template>
