<script>
import {
    widget
} from "./settings";
export default {
    name: "TablesForm",
    props: {
        value: {
            type: Object,
            default: () => {}
        },
        formItems: {
            type: Array,
            default: () => []
        },
        rules: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            widget
        };
    },
    render(h) {
        let formItems = this.createFormItems(h)
        return h(
            "Form", {
                ref: "formValidate",
                class: {
                    "form-box": true
                },
                props: {
                    model: this.value,
                    rules: this.rules,
                    "label-width": 80
                }
            },
            formItems
        );
    },
    methods: {
        createFormItems(h) {
            let formItems = this.formItems.map(item => {
                let props = {
                    value: this.value[item.key]
                };
                let options = [];
                switch (item.type) {
                    case "number":
                        break;
                    case "password":
                        props.type = item.type;
                        props.password = true;
                        break;
                    case "enum":
                        options = item.options.map(el =>
                            h(
                                "Radio", {
                                    props: {
                                        label: el.value
                                    }
                                },
                                el.label
                            )
                        );
                        break;
                    case "binary":
                        break;
                    case "array":
                        break;
                    case "list":
                        props.multiple = item.multiple;
                        if (item.options && item.options.length > 0) {
                            options = item.options.map(el =>
                                h("Option", {
                                    props: {
                                        label: el.label,
                                        value: el.value,
                                        key: el.value
                                    }
                                })
                            );
                        }
                        break;
                    case "bool":
                        break;
                    case "slider":
                        break;
                    case "rate":
                        break;
                    case "color":
                        break;
                    case "icon":
                        break;
                    case "date":
                    case "time":
                    case "datetime":
                    case "daterange":
                    case "timerange":
                        props.type = item.type;
                        props.editable = false;
                        props.format = item.format;
                        break;
                    case "cascader":
                        break;
                    default:
                        break;
                }
                return h(
                    "FormItem", {
                        props: {
                            label: item.name,
                            prop: item.key
                        }
                    },
                    [
                        h(
                            this.widget[item.type], {
                                props: props,
                                on: {
                                    input: val => {
                                        this.value[item.key] = val;
                                    },
                                }
                            },
                            options
                        )
                    ]
                );
            });
            formItems.push(
                h("FormItem", {}, [
                    h(
                        "Button", {
                            attrs: {
                                type: "info"
                            },
                            on: {
                                click: () => {
                                    this.$refs.formValidate.validate(valid => {
                                        console.log(this.rules, this.value, valid)
                                        if (valid) {
                                            this.$emit("on-save");
                                        }
                                    });
                                }
                            }
                        },
                        "保存"
                    ),
                    h(
                        "Button", {
                            attrs: {
                                style: "margin-left:10px"
                            },
                            on: {
                                'click': () => {
                                    this.$refs.formValidate.resetFields();
                                }
                            }
                        },
                        "重置"
                    )
                ])
            );
            return formItems;
        }
    },
    created() {},
    mounted() {},
    watch: {}
};
</script>

<style lang="less" scoped>
</style>
