<template>
<div>
    <div class="topbar">
        <div class="actions float-left">
            <slot name="actions">
                <Button type="info" :size="size">创建</Button>
                <Button type="error" :size="size">删除</Button>
                <Button type="success" :size="size">导出</Button>
            </slot>
        </div>
        <div v-if="searchable && searchPlace === 'topRight'" class="search-con float-right">
            <Select v-model="searchKey" class="search-col" :size="size">
                <Option v-for="item in filterColumns" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
            </Select>
            <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" :size="size" v-model="searchValue" />
            <Button @click="handleSearch" class="search-btn" type="info" :size="size">
                <Icon type="search" />&nbsp;&nbsp;搜索
            </Button>
        </div>
    </div>
    <Table ref="tablesMain" :data="insideTableData" :columns="insideColumns" :stripe="stripe" :border="border" :show-header="showHeader" :width="width" :height="height" :loading="loading" :disabled-hover="disabledHover" :highlight-row="highlightRow" :row-class-name="rowClassName" :size="size" :no-data-text="noDataText" :no-filtered-data-text="noFilteredDataText" @on-current-change="onCurrentChange" @on-select="onSelect" @on-select-cancel="onSelectCancel" @on-select-all="onSelectAll" @on-selection-change="onSelectionChange" @on-sort-change="onSortChange" @on-filter-change="onFilterChange" @on-row-click="onRowClick" @on-row-dblclick="onRowDblclick" @on-expand="onExpand">
        <slot name="header" slot="header"></slot>
        <slot name="footer" slot="footer"></slot>
        <slot name="loading" slot="loading"></slot>
    </Table>
    <div class="footer" v-if="showPage">
        <Page :total="total" :page-size="pageSize" :size="size" show-elevator show-sizer class-name="float-right" />
    </div>
    <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
</div>
</template>

<script>
import TablesEdit from "./edit.vue";
import handleBtns from "./handle-btns";
import "./index.scss";
export default {
    name: "Tables",
    props: {
        value: {
            type: Array,
            default () {
                return [];
            }
        },
        columns: {
            type: Array,
            default () {
                return [];
            }
        },
        size: {
            type: String,
            default: "small"
        },
        width: {
            type: [Number, String]
        },
        height: {
            type: [Number, String]
        },
        stripe: {
            type: Boolean,
            default: true
        },
        border: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        highlightRow: {
            type: Boolean,
            default: false
        },
        rowClassName: {
            type: Function,
            default () {
                return "";
            }
        },
        context: {
            type: Object
        },
        noDataText: {
            type: String
        },
        noFilteredDataText: {
            type: String
        },
        disabledHover: {
            type: Boolean
        },
        loading: {
            type: Boolean,
            default: false
        },
        /**
         * @description 全局设置是否可编辑
         */
        editable: {
            type: Boolean,
            default: false
        },
        /**
         * @description 是否可搜索
         */
        searchable: {
            type: Boolean,
            default: true
        },
        /**
         * @description 搜索控件所在位置，'top' / 'bottom'
         */
        searchPlace: {
            type: String,
            default: "topRight"
        }
    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
     * @on-cancel-edit 返回值 {Object} 同上
     * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
     */
    data() {
        return {
            insideColumns: [],
            insideTableData: [],
            edittingCellId: "",
            edittingText: "",
            searchValue: "",
            searchKey: "",
            pageSize: 10
        };
    },
    computed: {
        total() {
            return this.value.length;
        },
        showPage() {
            return this.total / this.pageSize > 1 ? true : false;
        },
        filterColumns() {
            return this.columns.filter(item => item.searchable);
        }
    },
    methods: {
        suportEdit(item, index) {
            item.render = (h, params) => {
                return h(TablesEdit, {
                    props: {
                        params: params,
                        value: this.insideTableData[params.index][params.column.key],
                        edittingCellId: this.edittingCellId,
                        editable: this.editable
                    },
                    on: {
                        input: val => {
                            this.edittingText = val;
                        },
                        "on-start-edit": params => {
                            this.edittingCellId = `editting-${params.index}-${params.column.key}`;
                            this.$emit("on-start-edit", params);
                        },
                        "on-cancel-edit": params => {
                            this.edittingCellId = "";
                            this.$emit("on-cancel-edit", params);
                        },
                        "on-save-edit": params => {
                            this.value[params.row.initRowIndex][
                                params.column.key
                            ] = this.edittingText;
                            this.$emit("input", this.value);
                            this.$emit(
                                "on-save-edit",
                                Object.assign(params, {
                                    value: this.edittingText
                                })
                            );
                            this.edittingCellId = "";
                        }
                    }
                });
            };
            return item;
        },
        surportHandle(item) {
            let options = item.options || [];
            let insideBtns = [];
            options.forEach(item => {
                if (handleBtns[item]) insideBtns.push(handleBtns[item]);
            });
            let btns = item.button ? [].concat(item.button, insideBtns) : insideBtns;
            item.render = (h, params) => {
                params.tableData = this.value;
                return h(
                    "div", {
                        attrs: {
                            class: "actions"
                        }
                    },
                    btns.map(item => item(h, params, this))
                );
            };
            return item;
        },
        handleColumns(columns) {
            this.insideColumns = columns.map((item, index) => {
                let res = item;
                if (res.editable) res = this.suportEdit(res, index);
                if (res.key === "handle") res = this.surportHandle(res);
                return res;
            });
        },
        setDefaultSearchKey() {
            if (!this.filterColumns || this.filterColumns.length == 0) {
                this.searchKey = ""
                return;
            }
            this.searchKey =
                this.filterColumns[0].key !== "handle" ?
                this.filterColumns[0].key :
                this.filterColumns.length > 1 ?
                this.filterColumns[1].key :
                "";
        },
        handleClear(e) {
            if (e.target.value === "") this.insideTableData = this.value;
        },
        handleSearch() {
            this.insideTableData = this.value.filter(
                item => item[this.searchKey].indexOf(this.searchValue) > -1
            );
        },
        handleTableData() {
            this.insideTableData = this.value.map((item, index) => {
                let res = item;
                res.initRowIndex = index;
                return res;
            });
        },
        exportCsv(params) {
            this.$refs.tablesMain.exportCsv(params);
        },
        clearCurrentRow() {
            this.$refs.talbesMain.clearCurrentRow();
        },
        onCurrentChange(currentRow, oldCurrentRow) {
            this.$emit("on-current-change", currentRow, oldCurrentRow);
        },
        onSelect(selection, row) {
            this.$emit("on-select", selection, row);
        },
        onSelectCancel(selection, row) {
            this.$emit("on-select-cancel", selection, row);
        },
        onSelectAll(selection) {
            this.$emit("on-select-all", selection);
        },
        onSelectionChange(selection) {
            this.$emit("on-selection-change", selection);
        },
        onSortChange(column, key, order) {
            this.$emit("on-sort-change", column, key, order);
        },
        onFilterChange(row) {
            this.$emit("on-filter-change", row);
        },
        onRowClick(row, index) {
            this.$emit("on-row-click", row, index);
        },
        onRowDblclick(row, index) {
            this.$emit("on-row-dblclick", row, index);
        },
        onExpand(row, status) {
            this.$emit("on-expand", row, status);
        }
    },
    watch: {
        columns(columns) {
            this.handleColumns(columns);
            this.setDefaultSearchKey();
        },
        value(val) {
            this.handleTableData();
            if (this.searchable) this.handleSearch();
        }
    },
    mounted() {
        this.handleColumns(this.columns);
        this.setDefaultSearchKey();
        this.handleTableData();
    }
};
</script>
