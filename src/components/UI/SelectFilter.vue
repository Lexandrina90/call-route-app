<script lang="ts">
import {defineComponent} from 'vue';
import 'vuetify/dist/vuetify.min.css';
import {VSelect} from 'vuetify/components';

export default defineComponent({
    name: 'SelectFilter', 
    components: {
        VSelect,
    },
    props: {
        label: {
            type: String,
            default: '',
        },
        countries: {
            type: Array as () => Array<string>,
            default: () => [],
        },
    },
});


</script>

<template>
    <v-select
        :label="$props.label"
        :items="$props.countries"
        variant="underlined"
    />
</template>
