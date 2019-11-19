<template>
<div id="app">
    <v-tables :columns="columns" :value="tableData" @on-edit="handleEdit" @on-delete="handleDelete"></v-tables>
</div>
</template>

<script>
import VTables from "./components";

export default {
    name: 'home',
    components: {
        VTables
    },
    data() {
        return {
            columns: [{
                    title: 'ID',
                    key: 'id',
                    sortable: true
                }, {
                    title: '姓名',
                    key: 'name',
                    editable: true,
                    searchable: true
                },
                {
                    title: '手机号',
                    key: 'phoneNumber',
                    editable: true,
                    searchable: true
                },
                {
                    title: '操作',
                    key: 'handle',
                    width: 180,
                    align: 'center',
                    options: ['edit', 'delete'],
                }
            ],
            tableData: [{
                id: 1,
                name: '小王',
                phoneNumber: '15012005678'
            }]
        }
    },
    methods: {
        handleEdit(params) {
            console.log(params)
        },
        handleDelete(params) {
            console.log(params);
        },
    },
}
</script>

<style lang="scss">
#app {
    margin: 16px;
}
</style>
