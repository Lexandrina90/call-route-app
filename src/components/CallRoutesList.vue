<script setup lang="ts">
import {onMounted, computed, ref, watch} from 'vue';
import {useStore} from 'vuex';

import {ICallRoute} from '@/interfaces/call-routes-interfaces';
import CallRoutesItem from './CallRoutesItem.vue';
import {nodataText, checkboxFilters} from '@/constants/index';

const store = useStore();

const checkAll = computed(() => store.state.checkboxStates[checkboxFilters.CHECK_ALL]);
const checkDirect = computed(() => store.state.checkboxStates[checkboxFilters.CHECK_DIRECT]);
const checkOneNode = computed(() => store.state.checkboxStates[checkboxFilters.CHECK_ONE_NODE]);
const checkTwoNodes = computed(() => store.state.checkboxStates[checkboxFilters.CHECK_TWO_NODES]);

const routesData = ref<ICallRoute[]>([]);

onMounted(() => {
    store.dispatch('loadData').then(() => {
        const {data} = store.state;
        
        if (data && data.company) {
            routesData.value = [
                ...data.company.waterTel.map((route: ICallRoute) => ({...route, company: 'waterTel'})),
                ...data.company.airTel.map((route: ICallRoute) => ({...route, company: 'airTel'})),
                ...data.company.earthTel.map((route: ICallRoute) => ({...route, company: 'earthTel'})),
                ...data.company.fireTel.map((route: ICallRoute) => ({...route, company: 'fireTel'})),
            ];
        }
    });
});

const filterDirectRoutes = (routes: ICallRoute[], src: string, des: string) => {
    return routes.filter((route) => route.src === src && route.des === des);
};

const filterOneNodeRoutes = (routes: ICallRoute[], src: string, des: string) => {
    const findRoutes = routes.filter((route) => route.src === src || route.des === des);
    const oneNodeRoutes = [];
    for (let i = 0; i < findRoutes.length; i++) {
        for (let j = i + 1; j < findRoutes.length; j++) {
            if (findRoutes[i].des === findRoutes[j].src) {
                oneNodeRoutes.push([findRoutes[i], findRoutes[j]]);
            }
        }
    }

    return oneNodeRoutes;
};

const filterTwoNodeRoutes = (routes: ICallRoute[], src: string, des: string) => {
    const firstSegments = routes.filter((route) => route.src === src);
    const uniqueRoutes = new Map();
    firstSegments.forEach((firstSegment) => {
        const secondSegments = routes.filter((route) => route.src === firstSegment.des);
        secondSegments.forEach((secondSegment) => {
            const thirdSegments = routes.filter(
                (route) => route.src === secondSegment.des && route.des === des,
            );
            thirdSegments.forEach((thirdSegment) => {
                const routeCombination = [firstSegment, secondSegment, thirdSegment];
                const routeCombinationKey = routeCombination.map((route) => route.src + route.des).join('_');
                if (!uniqueRoutes.has(routeCombinationKey)) {
                    uniqueRoutes.set(routeCombinationKey, routeCombination);
                }
            });
        });
    });
    
    return Array.from(uniqueRoutes.values());
};

const calculateTotalPrice = (route: ICallRoute | ICallRoute[]): number => {
    if (Array.isArray(route)) {
        return route.reduce((total, r) => total + r.price, 0);
    }

    return route.price;
};

const filteredCallRoutes = computed(() => {
    const src = store.state.selectedCallerCountryKey;
    const des = store.state.selectedCalleeCountryKey;
    const routes = routesData.value;
    const isChecked = [checkAll, checkDirect, checkOneNode, checkTwoNodes].some((check) => check.value);

    let directRoutes: ICallRoute[] = [];
    let oneNodeRoutes: ICallRoute[][] = [];
    let twoNodeRoutes: ICallRoute[][] = [];

    if (src && des) {
        if (checkAll.value) {
            directRoutes = filterDirectRoutes(routes, src, des);
            oneNodeRoutes = filterOneNodeRoutes(routes, src, des);
            twoNodeRoutes = filterTwoNodeRoutes(routes, src, des);
        } else {
            if (checkDirect.value) {
                directRoutes = filterDirectRoutes(routes, src, des);
            }
            if (checkOneNode.value) {
                oneNodeRoutes = filterOneNodeRoutes(routes, src, des);
            }
            if (checkTwoNodes.value) {
                twoNodeRoutes = filterTwoNodeRoutes(routes, src, des);
            }
        }
    }

    return (isChecked ? [...directRoutes, ...oneNodeRoutes, ...twoNodeRoutes] : routes)
        .sort((a, b) => calculateTotalPrice(a) - calculateTotalPrice(b));
});

const itemsPerPage = 4;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(filteredCallRoutes.value.length / itemsPerPage));

const paginatedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredCallRoutes.value.slice(startIndex, endIndex);
});

const goToPage = (page: number) => {
    currentPage.value = page;
};

watch([checkAll, checkDirect, checkOneNode, checkTwoNodes], () => {
    currentPage.value = 1;
});


</script>

<template>
    <div class="flex flex-col gap-6">
        <div v-if="paginatedItems.length">
            <template
                v-for="(item, index) in paginatedItems"
                :key="index"
            >
                <CallRoutesItem
                    v-if="Array.isArray(item) && item.length === 2"
                    :key="'route-2' + index"
                    :call-route1="item[0]"
                    :call-route2="item[1]"
                />
                <CallRoutesItem
                    v-else-if="Array.isArray(item) && item.length === 3"
                    :key="'route-3' + index"
                    :call-route1="item[0]"
                    :call-route2="item[1]"
                    :call-route3="item[2]"
                />
                <CallRoutesItem
                    v-else
                    :key="'route-1' + index"
                    :call-route1="Array.isArray(item) ? item[0] : item"
                />
            </template>
        </div>

        <div
            v-else
            class="w-[500px]"
        >
            {{ nodataText.NO_DATA_DISPLAY }}
        </div>
  
        <div  
            class="pagination flex gap-8 justify-center"
        >
            <span
                v-for="page in totalPages"
                :key="page"
            >
                <button 
                    :class="[
                        'px-4 py-2', 
                        page === currentPage ? 'bg-orange-200 text-orange-500' : 'bg-transparent'
                    ]"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </button>
            </span>
        </div>
    </div>
</template>