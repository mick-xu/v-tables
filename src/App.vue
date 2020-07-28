<template>
<div id="app">
    <Tables border editable searchable :columns="columns" resource="role" @on-edit="handleEdit" @on-delete="handleDelete"></Tables>
</div>
</template>

<script>
export default {
    name: 'home',
    components: {

    },
    data() {
        return {
            columns: [{
                    title: "名称",
                    key: "name",
                    width: 300,
                    editable: true,
                    resizable: true
                },
                {
                    title: "别名",
                    key: "alias",
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'handle',
                    width: 180,
                    align: 'center',
                    options: ["edit", "delete"],
                }
            ],
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

<style lang="less">
#app {
    margin: 16px;
}
</style>
