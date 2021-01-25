<template lang="pug">
md-app
  md-app-toolbar.md-primary
    .md-toolbar-section-start: span.md-title title
    .md-toolbar-section-end
      md-menu(md-direction="top-end")
        md-button.md-icon-button.menu-trigger(md-menu-trigger): md-icon more_vert
        md-menu-content
          md-menu-item(@click="login", v-if="!$store.getters.nickname") 登录
          md-menu-item(
            @click="$router.push({ path: '/piclib' })",
            v-if="!!$store.getters.nickname"
          ) 图库管理
  md-app-content
    p TODO
      | 未完成
</template>

<script>
export default {
  name: "Home",
  components: {},
  methods: {
    login() {
      window.location.href = "/login";
    },
  },
  mounted() {
    this.$store.dispatch("checkUser");
  },
};
</script>
