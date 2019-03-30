<template>
  <div class="tabs-view-container" ref="scrollCon" @DOMMouseScroll.prevent.stop="handlescroll" @mousewheel.prevent.stop="handlescroll">
    <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
      <transition-group name="taglist-moving-animation">
        <router-link class="tabs-view" v-for="(tag, index) in Array.from(visitedViews)" :to="tag.path" :key="tag.name" :style="{left: tagBodyLeft + 'px'}">
            <h-tag closable :name="tag.name" :color="isActive(tag.path)? 'active' : 'default'" @on-close ='closeViewTabs($event, tag, index)' @click.right.native.stop.prevent="closeChoice($event, tag, index)" ref="tagsPageOpened">
              {{tag.name}}
            </h-tag>
        </router-link>
      </transition-group>
    </div>
    <ul class="h-tag-close-tip" :style="styles" v-clickoutside="handleHide">
      <li class="h-tag-close-tip-item" @click.stop.prevent="handleCloseCurrent()">
        <span>关闭当前选项卡</span>
      </li>
      <li class="h-tag-close-tip-item" @click.stop.prevent="handleCloseAll()">
        <span>关闭全部选项卡</span>
      </li>
      <li class="h-tag-close-tip-item" @click.stop.prevent="handleCloseOther()">
        <span>关闭当前以外选项卡</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import HTag from '@/components/HTag.vue'
  import clickoutside from '@/directive/clickoutside'
  export default {
    data () {
      return {
        menusType: window.sessionStorage.getItem('menusType'),
        limit: this.LOCAL_CONFIG.TABS_VIEW_LIMIT,
        styles: {},
        curTag: {},
        sideWidth: 0,
        topHeight: 0,
        tagBodyLeft: 0,
        refsTag: [],
      }
    },
    directives: {
      clickoutside
    },
    components: {
      HTag
    },
    watch: {
      $route (to) {
        this.addViews()
        this.$nextTick(() => {
          this.refsTag.forEach((item, index) => {
              if (to.name === item.name) {
                let tag = this.refsTag[index].$el
                this.moveToView(tag)
              }
          })
        })
      }
    },
    computed: {
      visitedViews () {
        let arr = this.$store.state.app.visitedViews.slice(1 - this.limit)
        if (arr[0].name !== '首页') {
          arr.unshift(this.$store.state.app.visitedViews[0])
        }
        return arr
      },
      ...mapGetters([
        'rootPath',
        'activeIndex',
        'menusRoot',
        'menusNoRoot',
      ])
    },
    methods: {
      handleHide () {
        this.styles = {}
        this.curTag = {}
      },
      closeViewTabs ($event, view, index) {
        //首页不可被关闭
        this.$store.dispatch('delCurVisitedViews', view)
        $event.preventDefault()
        if (this.isActive(view.path)) { //关闭当前打开页面
          if (index > 0 && this.visitedViews.length < index + 1) {//关闭最后一个标签
            let newPath = this.visitedViews[index - 1].path
            this.$router.push({path: newPath})
          } else if (index > 0) {
            let newPath = this.visitedViews[index].path
            this.$router.push({path: newPath})
          }
        } else {//关闭非当前页面，直接关闭

        }
      },
      addViews () {
        if (this.menusType && this.menusType == '1') {
          this.toggleSidebarm()
        }
        this.$store.dispatch('addVisitedViews', this.$route)
      },
      closeChoice ($event, view, index) {
        if (index > 0) {
          this.styles = {
            display: 'block',
            top: `${$event.clientY}px`,
            left: `${$event.clientX}px`,
          }
          this.curTag =  {
            event: $event,
            view: view,
            index: index
          }
        }
      },
      handleCloseCurrent () {
        this.closeViewTabs(this.curTag.event, this.curTag.view, this.curTag.index)
        this.styles = {}
        this.curTag = {}
      },
      handleCloseAll () {
        this.$store.dispatch('delAllVisitedViews', this.curTag.view)
        // 跳转至首页
        let newPath = this.visitedViews[0].path
        this.$router.push({path: newPath})
        this.styles = {}
        this.curTag = {}
      },
      handleCloseOther() {
        this.$store.dispatch('delOtherVisitedViews', this.curTag.view)
        // 当前页面非激活时，激活
        if (!this.isActive(this.curTag.view.path)) {
          this.$router.push({path: this.curTag.view.path})
        }
        this.styles = {}
        this.curTag = {}
      },
      toggleSidebarm () {
        if (this.$route.path.indexOf(this.menusRoot[this.activeIndex].url) < 0) {
          let urlArr = this.$route.path.split('/')
          let curUrl ='/' + urlArr[1]
          for (let [key, value] of this.menusRoot.entries()) {
            if (curUrl === value.url) {
              this.$store.dispatch('ActiveRootIndex', key)
              return
            }
          }
        }
      },
      isActive (path) {
        return path === this.$route.path
      },
      handlescroll (e) {
        var type = e.type;
        let delta = 0;
        if (type === 'DOMMouseScroll' || type === 'mousewheel') {
            delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
        }
        let left = 0;
        if (delta > 0) {
            left = Math.min(0, this.tagBodyLeft + delta);
        } else {
            if (this.$refs.scrollCon.offsetWidth < this.$refs.scrollBody.offsetWidth) {
                if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth)) {
                  left = this.tagBodyLeft;
                } else {
                  left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth);
                }
            } else {
                this.tagBodyLeft = 0;
            }
        }
        this.tagBodyLeft = left;
      },
      moveToView (tag) {
        if (tag.offsetLeft < -this.tagBodyLeft) {
            // 标签在可视区域左侧
            this.tagBodyLeft = -tag.offsetLeft + 10;
        } else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth) {
            // 标签在可视区域
            this.tagBodyLeft = Math.min(0, this.$refs.scrollCon.offsetWidth - tag.offsetWidth - tag.offsetLeft - 20);
        } else {
            // 标签在可视区域右侧
            this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - tag.offsetWidth) + 20);
        }
      }
    },
    created () {
      this.addViews()
    },
    mounted () {
      // 右击阻止原生浏览器事件
      document.getElementsByClassName("tabs-view-container")[0].oncontextmenu = function(e){
      　return false;
      }
      this.refsTag = this.$refs.tagsPageOpened;
      setTimeout(() => {
        this.refsTag.forEach((item, index) => {
          if (this.$route.name === item.name) {
            let tag = this.refsTag[index].$el;
            this.moveToView(tag);
          }
        });
      }, 1); // 这里不设定时器就会有偏移bug
    }
  }
</script>
