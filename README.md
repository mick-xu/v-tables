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

Vue.use(Tables, { baseUrl: 'http://api.host.com', token: 'xxx' })
```

