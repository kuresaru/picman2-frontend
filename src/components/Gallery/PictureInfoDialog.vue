<template lang="pug">
.picture-info-dialog
  md-dialog(:md-fullscreen="false", :md-active.sync="show_")
    md-dialog-title {{ p.description }}
    .content
      img(:src="src", :alt="alt")
      br
      span
        md-chip.md-primary(v-for="t in p.tags", :key="t") {{ t }}
    md-dialog-actions
      md-button.md-primary(@click="download") 下载
      md-button.md-primary(@click="edit") 编辑
      md-button.md-primary(@click="show_ = false") 关闭
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";
import PicturePreview from "./PicturePreview.vue";
@Component({
  components: {
    PicturePreview,
  },
})
export default class PictureInfoDialog extends Vue {
  @PropSync("show")
  private show_!: boolean;
  @Prop()
  private p!: Picman.PictureDetail;

  download() {
    let a = <any>document.createElement("a");
    a.href = this.src;
    a.click();
  }

  edit() {
    this.$store.commit("setEditingPic", this.p);
    this.$router.push("/edit");
  }

  get src(): string | undefined {
    if (this.p) {
      return (
        "/api/lib/" + this.p.accessLibrary + "/gallery/" + this.p.pid + "/img"
      );
    }
  }

  get alt(): string | undefined {
    if (this.p) {
      return this.p.description;
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
  img {
    max-height: 42vh;
    padding: 0px 32px 8px 32px;
  }
}
</style>
