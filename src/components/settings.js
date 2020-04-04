import dayjs from 'dayjs';

const widget = {
    text: 'Input',
    password: 'Input',
    number: 'InputNumber',
    email: 'Input',
    phoneNumber: 'Input',
    idCardNo: 'Input',
    list: 'Select',
    binary: 'Switch',
    enum: 'RadioGroup',
    array: 'Checkbox',
    remind: 'AutoComplete',
    slider: 'Slider',
    date: 'DatePicker',
    time: 'TimePicker',
    datetime: 'DatePicker',
    cascader: 'Cascader',
    rate: 'Rate',
    color: 'ColorPicker',
    icon: 'IconSelector',
}

const validPattern = {
    phoneNumber: (item) => {
        return {
            pattern: /^1[3456789]\d{9}$/,
            message: `请输入正确的${item.name}`,
            trigger: 'blur'
        }
    },
    idCardNo: (item) => {
        return {
            pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/,
            message: `请输入正确的${item.name}`,
            trigger: 'blur'
        }
    },
    linePhone: (item) => {
        return {
            pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
            message: `请输入正确的${item.name}`,
            trigger: 'blur'
        }
    }
}

const validTrigger = {
    text: 'blur',
    number: 'blur',
    bool: 'blur',
    binary: 'change',
    enum: 'change',
    list: 'change',
    date: 'change',
    time: 'change',
    datetime: 'change',
    daterange: 'change',
    timerange: 'change',
}

const defaultValue = {
    text: () => { return '' },
    number: () => 0,
    bool: () => false,
    binary: () => 0,
    enum: (item) => { return item.options && item.options.length > 0 ? item.options[0].value : 0 },
    list: (item) => { return item.options && item.options.length > 0 ? item.options[0].value : 0 },
    date: () => { return dayjs().format('YYYY-MM-DD') },
    time: () => { return dayjs().format('HH:mm') },
    datetime: () => { return dayjs().format('YYYY-MM-DD HH:mm') },
    daterange: () => { return `${dayjs().format('YYYY-MM-DD')}-${dayjs().add(30, 'day').format('YYYY-MM-DD')}` },
    timerange: () => { return `${dayjs().format('HH:mm')}-${dayjs().add(30, 'second').format('HH:mm')}` },
}

export { widget, validPattern, defaultValue, validTrigger }
