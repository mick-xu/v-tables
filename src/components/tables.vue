<template>
<div class="tables">
    <div class="topbar">
        <div class="actions float-left">
            <Button v-if="editable" type="info" :size="size" @click="handleEdit">创建</Button>
            <Button v-if="editable" type="error" :size="size">删除</Button>
            <Button type="success" :size="size" @click="exportCsv">导出</Button>
            <slot name="actions"></slot>
        </div>
        <div v-if="searchable && searchPlace === 'topRight'" class="search-con float-right">
            <Select v-model="searchKey" class="search-col" :size="size">
                <Option v-for="item in searchColumns" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
            </Select>
            <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" :size="size" v-model="searchValue" />
            <Button @click="handleSearch" class="search-btn" type="info" :size="size">
                <ico type="ios-search" />&nbsp;搜索
            </Button>
        </div>
    </div>
    <Table ref="tablesMain" :data="insideTableData" :columns="insideColumns" :stripe="stripe" :border="border" :show-header="showHeader" :width="width" :height="height" :loading="loading" :disabled-hover="disabledHover" :highlight-row="highlightRow" :row-class-name="rowClassName" :size="size" :row-key="rowKey" :no-data-text="noDataText" :no-filtered-data-text="noFilteredDataText" @on-current-change="onCurrentChange" @on-select="onSelect" @on-select-cancel="onSelectCancel" @on-select-all="onSelectAll" @on-selection-change="onSelectionChange" @on-sort-change="onSortChange" @on-filter-change="onFilterChange" @on-row-click="onRowClick" @on-row-dblclick="onRowDblclick" @on-expand="onExpand">
        <slot name="header" slot="header"></slot>
        <slot name="footer" slot="footer"></slot>
        <slot name="loading" slot="loading"></slot>
    </Table>
    <div class="footer" v-show="showPage">
        <Page :total="page.total" :current="page.current" :page-size="page.pageSize" :size="size" show-elevator show-sizer show-total class-name="float-right" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
    </div>
    <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
    <Modal v-model="modal.visible" :title="modal.title" draggable footer-hide @on-cancel="close">
        <component :is="form" ref="form" v-model="formData" :form-items="formItems" :rules="formRules" @on-save="handleSave"></component>
    </Modal>
</div>
</template>

<script>
import TablesEdit from "./edit.vue";
import TablesForm from "./form.vue";
import handleBtns from "./handle-btns";
import "./index.less";
import {
    getList,
    get,
    create,
    update,
    remove,
    excute
} from "@/api/table";
import {
    stringify
} from 'querystring';
import dayjs from 'dayjs';
import {
    validPattern,
    defaultValue,
    validTrigger
} from "./settings";
import {
    mapObject
} from "@/libs/util";
export default {
    name: "Tables",
    props: {
        value: {
            type: Array,
            default: () => []
        },
        resource: {
            type: String,
            default: null
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
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        rowKey: {
            type: [Boolean, String],
            default: false
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
        editMode: {
            type: String,
            default: 'popup'
        },
        /**
         * @description 是否可搜索
         */
        searchable: {
            type: Boolean,
            default: false
        },
        /**
         * @description 搜索控件所在位置，'top' / 'bottom'
         */
        searchPlace: {
            type: String,
            default: "topRight"
        },
        totalCount: {
            type: Number,
            default: 0
        },
        rules: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        TablesForm,
    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同view design中render函数中的params对象 { row, index, column }
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
            page: {
                pageSize: 10,
                current: 1,
                total: 0
            },
            modal: {
                visible: false,
                title: '编辑'
            },
            form: null,
            formData: {},
            formItems: [],
            formRules: {},
            formTempData: {},
            formTempItems: [],
        };
    },
    computed: {
        total() {
            return this.value.length;
        },
        showPage() {
            return this.page.total / this.page.pageSize > 1 ? true : false;
        },
        searchColumns() {
            return this.insideColumns.filter(item => item.searchable && "text,phoneNumber,email,url,idCardNo".indexOf(item.type) > -1);
        }
    },
    methods: {
        suportInlineEdit(item, index) {
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
        suportPopupEdit(item, index) {
            let res = {
                name: item.title,
                key: item.key,
                type: item.type ? item.type : 'text',
            };
            if (item.options) {
                this.$set(res, 'options', item.options)
            }
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    if (typeof (item[key]) === 'boolean') {
                        this.$set(res, key, item[key])
                    }
                }
            }
            if (item.format) {
                res.format = item.foramt;
            }
            this.formTempItems.push(res)
            this.initFormValue(item)
            this.initRule(res);
        },
        initFormValue(item) {
            this.formTempData.id = 0;
            if (item.editable) {
                if (item.default) {
                    this.formTempData[item.key] = item.default
                    return;
                }
                this.formTempData[item.key] = defaultValue[item.type] ? defaultValue[item.type](item) : null;
            }
        },
        initRule(item) {
            if (this.rules) {
                this.formRules = this.rules;
                return;
            }
            if (item.required) {
                this.formRules[item.key] = [];
                this.formRules[item.key].push({
                    required: true,
                    message: `${item.name}不能为空`,
                    trigger: validTrigger[item.type]
                })
                if (validPattern.hasOwnProperty(item.type)) {
                    this.formRules[item.key].push(validPattern[item.type](item))
                }
            }
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
            this.formTempItems = [];
            this.insideColumns = columns.map((item, index) => {
                let res = item;
                if (this.editMode === 'inline' && res.editable) res = this.suportInlineEdit(res, index);
                if (this.editMode === 'popup' && res.editable)
                    this.suportPopupEdit(res, index);
                if (res.key === "handle") res = this.surportHandle(res);
                this.initColumnValue(item)
                return res;
            }).filter(item => !item.hidden);
        },
        initColumnValue(column) {
            switch (column.type) {
                case 'enum':
                    column.render = (h, params) => {
                        if (Array.isArray(column.options)) {
                            let options = column.options.filter(item => item.value === params.row[column.key]);
                            let label = options.length > 0 ? options[0].label : '';
                            return h('Tag', label)
                        }
                    }
                    break;
                case 'array':
                case 'list':
                    column.render = (h, params) => {
                        let tags = []
                        if (Array.isArray(column.options)) {
                            let options = column.multiple ?
                                column.options.filter(item => params.row[column.key].some(e => e === item.value)) :
                                column.options.filter(item => item.value === params.row[column.key]);
                            tags = options.map(item => {
                                return h('Tag', item.label)
                            })
                            return h('div', {
                                attrs: {
                                    'class': 'tags'
                                }
                            }, tags)
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        handleSearchColumns() {

        },
        setDefaultSearchKey() {
            let searchColumns = this.columns.filter(item => item.searchable && item.key !== 'handle');
            this.searchKey =
                searchColumns.length > 0 ? searchColumns[0].key :
                this.columns.length === 0 ? "" :
                this.columns[0].key !== "handle" ?
                this.columns[0].key :
                this.columns.length > 1 ?
                this.columns[1].key :
                "";
        },
        handleClear(e) {
            if (e.target.value === "") this.insideTableData = this.value;
        },
        handleSearch() {
            if (this.searchKey && this.searchValue) {
                this.insideTableData = this.value.filter(
                    item => item[this.searchKey].indexOf(this.searchValue) > -1
                );
            }
        },
        handleTableData() {
            if (this.value && this.value.length > 0) {
                this.insideTableData = this.value.map((item, index) => {
                    let res = item;
                    res.initRowIndex = index;
                    return res;
                });

                this.page.total = this.totalCount;
            } else if (this.resource) {
                getList(this.resource, this.page.current, this.page.pageSize).then(res => {
                    this.insideTableData = res.items.map((item, index) => {
                        item.initRowIndex = index;
                        return item;
                    });
                    this.page.total = res.totalCount;
                });
            }
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
        },
        handleView(params) {

        },
        handleEdit(params) {
            if (this.value && this.value.length > 0) {
                return;
            }
            if (params.row) {
                this.modal.title = "编辑"
                this.formItems = this.formTempItems.filter(item => !item.readonly);
                this.formData = mapObject(params.row, Object.assign({}, this.formTempData));
                this.formData.id = params.row.id;
                this.columns.filter(item => item.readonly || item.disabled).forEach(item => {
                    delete this.formData[item.key]
                })
                console.log(this.formData)
            } else {
                this.modal.title = "新建"
                this.formItems = this.formTempItems;
                this.formData = Object.assign({}, this.formTempData);
                console.log(this.formData)
            }
            this.form = TablesForm;
            this.modal.visible = true;
        },
        handleSave() {
            console.log(this.formData)
            let method = this.formData.id > 0 ? 'put' : 'post';
            excute(this.resource, this.formData, method).then(res => {
                this.form = null;
                this.modal.visible = false;
                this.handleTableData();
                this.$Message.success(res.message);
            })
        },
        handleDelete(params) {
            if (this.value && this.value.length > 0) {
                return;
            }
            remove(this.resource, params.row.id).then(res => {
                this.$Message.info(res.message);
            })
        },
        close() {
            this.form = null;
        },
        pageChange(page) {
            this.page.current = page;
            this.handleTableData();
        },
        pageSizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.handleTableData();
        },
        refresh() {
            this.handleTableData();
        }
    },
    watch: {
        columns: {
            deep: true,
            handler: function (newValue, oldValue) {
                this.handleColumns(newValue);
            }
        },
        value(val) {
            this.handleTableData();
            if (this.searchable) this.handleSearch();
        }
    },
    mounted() {
        this.setDefaultSearchKey();
        this.handleTableData();
    },
    created() {
        this.handleColumns(this.columns);
    },
};
</script>
