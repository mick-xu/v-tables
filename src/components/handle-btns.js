const btns = {
  edit: (h, params, vm) => {
    return h('span', {
      on: {
        'click': () => {
          vm.$emit('on-edit', params)
        }
      }
    }, [
      h('i', {
        attrs: { title: '编辑', class: 'iconfont icon-edit' },
      }),
      h('em', '编辑')
    ])
  },
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '你确定要删除吗?',
        transfer: true
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params)
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('i', {
        attrs: { class: 'iconfont icon-trash' }
      }),
      h('em', '删除')
    ])
  }
}

export default btns
