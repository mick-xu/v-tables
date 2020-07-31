# v-tables
一个完整的数据表格组件，包含头部按钮，搜索框，底部分页等。

### Installation
```
npm install v-tables
# or
yarn add v-tables
```
### Usage
```
import Tables from 'v-tables'
import 'v-tables/lib/v-tables.css'

components: {
    Tables
},
data() {
    return {
        date: {
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
```

```
<template>
  <Tables :columns="columns" :value="tableData"></Tables>
</template>
```

### or main.js
```
import Tables from 'v-tables'
import 'v-tables/lib/v-tables.css'

Vue.use(Tables, { baseUrl: 'http://api.host.com', token: 'xxx' })
```

### API

#### 表格属性

属性        | 类型   | 默认值    | 说明
------------|--------|----------|------
value       | Array  | []       | 表格数据，对应 columns
resource    | String | null     | api，比如一个完整的 API 是 https://localhost:5001/api/user?page=1&size=10&isDeleted=false, 这里填写 user
editable    | Boolen | false    | 是否启用编辑功能
editMode    | String | popup    | 编辑方式，"popup" 表示使用弹窗的形式编辑，"inline" 表示使用行内编辑
searchable  | Boolen | false    | 是否支持搜索
searchPlace | String | topRight | 搜索框位置，可选值：'topRight','leftBottom'
rules       | Object | {}       | 编辑时 Form 的验证规则

#### 表格事件

事件名      | 说明             | 返回值
-----------|------------------|--------
on-view    | 点击查看按钮时触发 | row 当前行数据
on-edit    | 点击编辑按钮时触发 | row 当前行数据
on-delete  | 点击删除按钮时触发 | row 当前行数据
on-select  |                  |

#### 表格 slot

名称    | 说明
--------|------
actions | 添加表格左上角按钮


#### column 属性，是 columns 中的一项

属性       | 类型    | 默认值  | 说明
-----------|--------|---------|-----
editable   | Boolen | false   | 是否可编辑
required   | Boolen | false   | 编辑时是否必填
searchable | Boolen | false   | 是否可搜索
type       | String | text    | 编辑数据的类型，决定了控件类型 <br> 文本框类型：text,number,email,phoneNumber,idCardNo<br>Switch 类型：bool,binary <br>单选按钮：enum 复选框：array 列表框：list<br> 滑块：slider 评分：rate<br>日期：date,,daterange 时间：time,datetime,timerange<br>图标选择：icon 颜色选择：color
options   | Array   | []      | 选择项，当 type 是 bool,binary,enum,array,list 的时候必须设置选择项；当 key 为 handle 时，options 的项表示按钮，值为 "view","edit", "delete"
multiple  | Boolen  | false   | type 是 list 时，表示下拉框是否多选
readonly  | Boolen  | false   | 编辑时，控件是否为只读属性




