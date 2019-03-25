<template>
  <div class="selfMenu">
    <template v-for="(item, index) in routes">
      <router-link v-if="!item.hidden && !item.children"  :to="item.path">
        <h-menu-item :name = "item.path">
          <h-icon :name="item.icon"></h-icon>  
          <span>{{ item.name }}</span>
        </h-menu-item>
      </router-link> 
      <router-link v-else-if="!item.hidden && item.children && item.children.length == 0"  :to="item.path+'/'+item.children[0].path">
        <h-menu-item :name = "item.path+'/'+item.children[0].path">
          <h-icon :name="item.icon"></h-icon>  
          <span>{{ item.name }}</span>
        </h-menu-item>
      </router-link> 
      <h-submenu :name="item.path" v-else-if="!item.hidden && item.children.length > 0">
        <template slot="title">
          <h-icon :name="item.icon || 'manage'"></h-icon>
          <span>{{ item.name }}</span>
        </template>
        <template v-for="(child, i) in item.children" v-if="!child.hidden" >
          <sidebar-item v-if="child.children && child.children.length > 0" class="menu-indent nest-menu"  :routes="[child]"></sidebar-item>
          <router-link v-else class="menu-indent" :to="item.path+'/'+child.path">
            <h-menu-item :name = "item.path+'/'+child.path">
              <h-icon name="ios-circle-outline"></h-icon>
              <span>{{ child.name }}</span>
            </h-menu-item>
          </router-link>
        </template>
      </h-submenu>
    </template>
  </div>
</template>
<script>
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      }
    }
  }
</script>