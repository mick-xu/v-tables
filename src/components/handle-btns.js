const btns = {
  view: (h, params, vm) => {
    return h('span', {
      on: {
        'click': () => {
          vm.handleView(params);
          vm.$emit('on-view', params)
        }
      }
    }, [
      h('ico', {
        attrs: { title: '查看' },
        props: {
          type: 'icon-view',
          size: 18,
          color: '#999',
        },
      })
    ])
  },
  edit: (h, params, vm) => {
    return h('span', {
      on: {
        'click': () => {
          vm.handleEdit(params);
          vm.$emit('on-edit', params)
        }
      }
    }, [
      h('ico', {
        attrs: { title: '编辑' },
        props: {
          type: 'icon-edit',
          size: 18,
          color: '#999',
        },
      })
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
          vm.handleDelete(params);
          vm.$emit('on-delete', params)
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('ico', {
        props: {
          type: 'icon-delete',
          size: 18,
          color: '#ff3311'
        },
      })
    ])
  }
}

export default btns
