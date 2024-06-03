<script setup lang="ts">
import {computed} from 'vue';

import ArrowIcon from '@/components/icons/ArrowIcon.vue';
import {ICallRoute} from '@/interfaces/call-routes-interfaces';

const props = defineProps<{
    callRoute1: ICallRoute;
    callRoute2?: ICallRoute;
    callRoute3?: ICallRoute;
}>();

const totalPrice = computed(() => {
    let total = props.callRoute1.price;
    if (props.callRoute2) total += props.callRoute2.price;
    if (props.callRoute3) total += props.callRoute3.price;

    return total;
});

</script>

<template>
    <div class="flex shadow shadow-gray-300 p-6 rounded-md justify-between text-white gap-4 min-w-[500px]">  
        <div 
            class="rounded-full w-12 h-12 flex items-center justify-center bg-orange-400 font-sans"
        >
            {{ totalPrice }}$
        </div>
        <div class="flex flex-col gap-4">
            <div 
                :class="['flex text-xs items-center justify-center', props.callRoute3 ? 'gap-3' : 'gap-8']"
            >
                <div 
                    class="bg-orange-400 rounded-full px-3 py-1"
                >
                    {{ props.callRoute1.company }} {{ props.callRoute1.price }}$
                </div>
                <div 
                    v-if="callRoute2"
                    class="bg-orange-400 rounded-full px-3 py-1"
                >
                    {{ props.callRoute2?.company }} {{ props.callRoute2?.price }}$
                </div>
                <div 
                    v-if="callRoute3"
                    class="bg-orange-400 rounded-full px-3 py-1"
                >
                    {{ props.callRoute3?.company }} {{ props.callRoute3?.price }}$
                </div>
            </div>
            <div class="flex gap-6 text-sm justify-center items-center">
                <div class="bg-gray-500 rounded px-2 flex items-center justify-center p-1">
                    {{ props.callRoute1.src }}
                </div>
                <ArrowIcon class="text-gray-500" />
                <div class="bg-gray-500 rounded px-2 flex items-center justify-center p-1">
                    {{ props.callRoute1.des }}
                </div>
                <ArrowIcon 
                    v-if="props.callRoute2 || props.callRoute3"
                    class="text-gray-500" 
                />
                <div 
                    v-if="props.callRoute2"
                    class="bg-gray-500 rounded px-2 flex items-center justify-center p-1" 
                >
                    {{ props.callRoute2?.des }}
                </div>
                <ArrowIcon 
                    v-if="props.callRoute3"
                    class="text-gray-500" 
                />
                <div 
                    v-if="props.callRoute3"
                    class="bg-gray-500 rounded px-2 flex items-center justify-center p-1" 
                >
                    {{ props.callRoute3?.des }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.roboto-font {
  font-family: 'Roboto', sans-serif;
}
</style>
