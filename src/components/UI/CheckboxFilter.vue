<script lang="ts">
import {defineComponent} from 'vue';
import 'vuetify/dist/vuetify.min.css';
import {VCheckbox} from 'vuetify/components';

export default defineComponent({
    name: 'CheckboxFilter', 
    components: {
        VCheckbox,
    },
    props: {
        label: {
            type: String,
            default: '',
        },
    },
});

</script>

<template>
    <v-checkbox 
        :label="$props.label" 
        color="orange"
    />
</template>
