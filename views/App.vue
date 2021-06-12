<template>
  <div id="#">
    <keep-alive>
       <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      msg:'',
    }
  },
}
</script>
