<template lang="pug">
md-app
  md-app-toolbar.md-primary
    .md-toolbar-section-start
      span.md-title 暮光小猿图片管理器2
        span.not-login-hint(v-if="notLogin") &nbsp;&nbsp;[未登录]
    .md-toolbar-section-end
      md-button(@click="upload", v-if="loggedIn") 上传新图片
      md-menu(md-direction="top-end")
        md-button.md-icon-button.menu-trigger(md-menu-trigger): md-icon more_vert
        md-menu-content
          md-menu-item(@click="login", v-if="notLogin") 登录
          md-menu-item(
            @click="$router.push({ path: '/piclib' })",
            v-if="loggedIn"
          ) 图库管理
          md-menu-item(@click="downloadApp") 下载APP
  md-app-content
    .search-bar
      .search-input
        md-field(md-clearable)
          label 输入搜索关键字
          md-input(v-model="keyword", autofocus, @keyup.enter="search")
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
import { Component, Watch, Vue } from "vue-property-decorator";
import * as _ from "lodash";
import Gallery from "@/components/Gallery.vue";
@Component({
  components: {
    Gallery,
  },
})
export default class Home extends Vue {
  private keyword: string = "";
  private showSnackBar: boolean = false;
  private snackMsg: string = "";
  private searchResult: Picman.PictureDetail[] = [];
  private onSearchInputChangeDebounceFunc = _.debounce(this.search, 200);

  get notLogin(): boolean {
    return this.$store.getters.notLogin;
  }

  get loggedIn(): boolean {
    return this.$store.getters.loggedIn;
  }

  login() {
    window.location.href = "/login";
  }

  downloadApp() {
    window.open("https://www.scraft.top/dl/pm/", "_blank");
  }

  upload() {
    this.$router.push("/upload");
  }

  @Watch("keyword")
  onSearchInputChange() {
    this.onSearchInputChangeDebounceFunc();
  }

  search() {
    if (!this.keyword || this.keyword.length <= 0) {
      this.searchResult = [];
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
  }

  snack(msg: string) {
    console.log(msg);
    this.snackMsg = msg;
    this.showSnackBar = true;
  }

  mounted() {
    this.$store.dispatch("checkUser");
  }
}
</script>

<style lang="scss" scoped>
.md-app {
  height: 100vh;
  width: 100vw;
  .not-login-hint {
    font-size: 14px;
  }
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