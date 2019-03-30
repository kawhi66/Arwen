export default {
  data () {
    return  {
      message: 'nihao',
      formItem: {
        input: '',
        select: '',
        radio: ''
      },
      list: [
        {value:'beijing', label:'北京市'},
        {value: 'shanghai', label: '上海市'},
        {value: 'hangzhou', label: '杭州市'}
      ],
      isShowRadio: true,
      isShowButton: true
    }
  }
}