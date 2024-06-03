export type CheckFilters = {
    CHECK_ALL: string;
    CHECK_DIRECT: string;
    CHECK_ONE_NODE: string;
    CHECK_TWO_NODES: string;
}

const checkboxFilters: CheckFilters = {
    CHECK_ALL: 'Все',
    CHECK_DIRECT: 'Прямое соединение',   
    CHECK_ONE_NODE: 'Один дополнительный узел',
    CHECK_TWO_NODES: 'Два дополнительных узла',
};

export default checkboxFilters;