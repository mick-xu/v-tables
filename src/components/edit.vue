<template>
<div class="tables-edit-outer">
    <div v-if="!isEditting" class="tables-edit-con">
        <span class="value-con">{{ value }}</span>
        <span v-if="editable" @click="startEdit" class="tables-edit-btn">
            <Icons type="md-create" />
        </span>
    </div>
    <div v-else class="tables-editting-con">
        <Input :value="value" @input="handleInput" size="small" class="tables-edit-input" />
        <span @click="saveEdit" class="tables-editing-btn">
            <Icons type="md-checkmark" />
        </span>
        <span @click="canceltEdit" class="tables-editing-btn">
            <Icons type="md-close" />
        </span>
    </div>
</div>
</template>

<script>
export default {
    name: "TablesEdit",
    props: {
        value: [String, Number],
        edittingCellId: String,
        params: Object,
        editable: Boolean
    },
    computed: {
        isEditting() {
            return (
                this.edittingCellId ===
                `editting-${this.params.index}-${this.params.column.key}`
            );
        }
    },
    methods: {
        handleInput(val) {
            this.$emit("input", val);
        },
        startEdit() {
            this.$emit("on-start-edit", this.params);
        },
        saveEdit() {
            this.$emit("on-save-edit", this.params);
        },
        canceltEdit() {
            this.$emit("on-cancel-edit", this.params);
        }
    }
};
</script>

<style lang="less">
.tables-edit-outer {
    height: 100%;

    .tables-edit-con {
        position: relative;
        height: 100%;

        .value-con {
            min-height: 22px;
            padding: 2px 0;
            display: inline-block;
            vertical-align: middle;
        }

        .tables-edit-btn {
            position: absolute;
            right: 10px;
            top: 0;
            padding: 2px 5px;
            display: none;
            background: #fff;
            border-radius: 0px;
        }

        &:hover {
            .tables-edit-btn {
                display: inline-block;
            }
        }
    }

    .tables-editting-con {
        .tables-editing-btn {
            padding: 2px 5px;
            margin-left: 3px;
            background: #fff;
            display: inline-block;
            vertical-align: middle;
            border-radius: 3px;
            border:1px solid #eee;
        }

        .tables-edit-input {
            width: ~"calc(100% - 80px)";
        }
    }
}
</style>
