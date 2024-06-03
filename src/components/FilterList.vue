<script setup lang="ts">
import {onMounted, ref, watch, computed} from 'vue';
import {useStore} from 'vuex';

import SelectFilter from '@/components/UI/SelectFilter.vue';
import CheckboxFilter from '@/components/UI/CheckboxFilter.vue';
import {checkboxFilters, selectFilters} from '@/constants/index';

const store = useStore();
const selectedCallerCountry = ref('');
const selectedCalleeCountry = ref('');

const modelRefs = {
    [selectFilters.SELECT_CALLER]: selectedCallerCountry,
    [selectFilters.SELECT_CALLEE]: selectedCalleeCountry,
};

const checkAll = computed(() => store.state.checkboxStates[checkboxFilters.CHECK_ALL]);

const isChecked = (filterKey: string) => {
    return checkAll.value ? true : store.state.checkboxStates[filterKey];
};

const updateCheckbox = (filter: string) => {
    store.dispatch('updateCheckbox', filter); 
};

const findCountryKey = (country: string, mutationType: string) => {
    const {countries} = store.state;
    
    for (const key in countries) {
        if (countries[key] === country) {
            store.dispatch(mutationType, key);

            return key;
        }
    }

    return null;
};

const handleSelectedCountryChange = (newValue: string, mutationType: string) => {
    const [country] = newValue.split(' ');

    findCountryKey(country, mutationType);
};

const formattedCountries = computed(() => {
    const {countries, selectedCallerCountryKey} = store.state;
    const callerCountryKey = selectedCallerCountryKey || '';

    return Object.keys(countries).reduce((acc: string[], key) => {
        if (key !== callerCountryKey) {
            acc.push(`${countries[key]} (${key})`);
        }
        
        return acc;
    }, []);
});


watch(selectedCallerCountry, (newValue) => {
    handleSelectedCountryChange(newValue, 'setSelectedCallerCountryKey');
});

watch(selectedCalleeCountry, (newValue) => {
    handleSelectedCountryChange(newValue, 'setSelectedCalleeCountryKey');
});

onMounted(() => {
    store.dispatch('loadData');
});

</script>

<template>
    <div class="flex flex-col w-[360px] shadow shadow-gray-300 p-6 rounded-md h-full">
        <div class="w-full">
            <div
                v-for="(selectFilter, key) in selectFilters" 
                :key="key" 
            >
                <SelectFilter 
                    v-model="modelRefs[selectFilter].value"
                    class="bg-inherit"
                    :label="selectFilter"
                    :countries="formattedCountries"
                />
            </div>
        </div>
        <div>
            <div 
                v-for="(filter, key) in checkboxFilters" 
                :key="key" 
                class="h-14"
            >
                <CheckboxFilter 
                    :model-value="isChecked(key)"
                    :label="filter" 
                    :disabled="checkAll && filter !== checkboxFilters.CHECK_ALL"
                    @change="updateCheckbox(filter)"
                />
            </div>
        </div>
    </div>
</template>