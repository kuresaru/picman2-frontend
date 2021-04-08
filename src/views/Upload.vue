<template lang="pug">
div
  md-app
    md-app-toolbar.md-primary
      .md-toolbar-section-start
        md-button.md-icon-button(@click="$router.go(-1)"): md-icon chevron_left
        span.md-title 上传图片
    md-app-content
      md-field
        label 图片
        md-file(
          v-model="fileInput",
          accept="image/*",
          @md-change="onFileChange"
        )
        span.md-helper-text 选择一张图片上传吧
      md-field
        label 描述
        md-input(v-model="desc", :readonly="readOnly")
        span.md-helper-text 这张图片表达了什么呢
      md-chips(
        v-model="tags",
        md-placeholder="添加标签",
        :md-check-duplicated="true",
        :md-static="readOnly"
      )
        .md-helper-text 这张图片包含了什么元素呢
      md-field
        md-select(v-model="piclibSelect", placeholder="图库")
        span.md-helper-text 图片要上传到哪个图库呢
      md-field
        label pid
        md-input(v-model="pid", readonly)
        span.md-helper-text 自动生成的图片ID
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import filemd5 from "@/plugins/filemd5";
@Component
export default class Upload extends Vue {
  private fileInput: HTMLInputElement | null = null;
  private readOnly = false;
  private desc = "";
  private tags: string[] = [];
  private pid = "";
  private piclibSelect = "";
  private uploading = false;
  private file: File | null = null;

  async onFileChange(fileList: File[]) {
    this.file = fileList[0];
    console.log(this.file);
    let md5 = await filemd5(this.file);
    console.log(md5);
    let array = this.file.name.split(".");
    if (array && array.length > 1) {
      let ext = array[array.length - 1];
      this.pid = md5 + "." + ext;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>