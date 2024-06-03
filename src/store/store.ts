import {createStore, Commit} from 'vuex';

import json from '@/call-paths.json';
import {checkboxFilters} from '@/constants/index';
import {IData, IState} from '@/interfaces/store-interfaces';

const state: IState = {
    data: json.data,
    countries: json.data.country,
    selectedCallerCountryKey: null,
    selectedCalleeCountryKey: null,
    selectedCheckboxes: [],
    checkboxStates: {
        [checkboxFilters.CHECK_ALL]: false,
        [checkboxFilters.CHECK_DIRECT]: false,
        [checkboxFilters.CHECK_ONE_NODE]: false,
        [checkboxFilters.CHECK_TWO_NODES]: false,
    },
};

const mutations = {
    setData(state: IState, payload: IData) {
        state.data = payload;
    },
    setSelectedCallerCountryKey(state: IState, countryKey: string) {
        state.selectedCallerCountryKey = countryKey;
    },
    setSelectedCalleeCountryKey(state: IState, countryKey: string) {
        state.selectedCalleeCountryKey = countryKey;
    },
    toggleCheckbox(state: IState, checkboxValue: string) {
        state.checkboxStates[checkboxValue] = !state.checkboxStates[checkboxValue];

        if (checkboxValue === checkboxFilters.CHECK_ALL) {
            Object.keys(state.checkboxStates).forEach((key) => {
                state.checkboxStates[key] = state.checkboxStates[checkboxValue];
            });
        }
    },
};

const actions = {
    loadData({commit}: { commit: Commit }) {
        commit('setData', json.data);
    },
    setSelectedCallerCountryKey({commit}: { commit: Commit }, countryKey: string) {
        commit('setSelectedCallerCountryKey', countryKey);
    },
    setSelectedCalleeCountryKey({commit}: { commit: Commit }, countryKey: string) {
        commit('setSelectedCalleeCountryKey', countryKey);
    },
    updateCheckbox({commit}: { commit: Commit }, checkboxValue: string) {
        commit('toggleCheckbox', checkboxValue);
    },
};

export const store = createStore({
    state,
    mutations,
    actions,
});
 