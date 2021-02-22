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
    .search-bar
      .search-input
        md-field
          label 输入搜索关键字
          md-input(v-model="keyword")
          span.md-helper-text 描述和Tag都可以呀
      .search-btn
        md-button.md-accent.md-raised(@click="search") 搜索
    gallery(:pictures="searchResult")
    md-snackbar(
      md-position="center",
      :md-duration="2000",
      :md-active.sync="showSnackBar",
      md-persistent
    ): span {{ snackMsg }}
</template>

<script lang="ts">
import Vue from "vue";
import Gallery from "@/components/Gallery.vue";
export default Vue.extend({
  name: "Home",
  components: {
    Gallery,
  },
  data() {
    return {
      keyword: undefined as string | undefined,
      showSnackBar: false as boolean,
      snackMsg: "" as string,
      searchResult: [] as Picman.PictureDetail[],
    };
  },
  methods: {
    login() {
      window.location.href = "/login";
    },
    search() {
      if (!this.keyword || this.keyword.length <= 0) {
        this.snack("搜索关键字不能为空");
      } else {
        this.$axios
          .get("/api/lib/finder?search=" + this.keyword)
          .then((response) => {
            let result: Picman.RequestResult = response.data;
            let details: Picman.PictureDetail[] = result.data;
            this.searchResult = details;
            console.log(details);
            if (details.length == 0) {
              this.snack("搜索结果为空");
            }
          })
          .catch((err) => this.snack(err));
      }
    },
    snack(msg: string) {
      console.log(msg);
      this.snackMsg = msg;
      this.showSnackBar = true;
    },
  },
  mounted() {
    this.$store.dispatch("checkUser");
  },
});
</script>

<style lang="scss" scoped>
.md-app {
  height: 100vh;
  width: 100vw;
  .md-app-content {
    .search-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;
      .search-input {
        flex-grow: 1;
      }
    }
  }
}
</style>