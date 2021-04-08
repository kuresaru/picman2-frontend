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
          md-option(
            v-for="piclib in piclibs",
            :key="piclib.lid",
            :value="piclib.lid",
            :disabled="piclib.readonly"
          ) {{ piclib.name + ' (' + piclib.picCount + ')' }}
        span.md-helper-text 图片要上传到哪个图库呢
      md-field
        label pid
        md-input(v-model="pid", readonly)
        span.md-helper-text 自动生成的图片ID
      md-progress-spinner(
        v-if="uploading",
        :md-diameter="50",
        :md-stroke="4",
        md-mode="indeterminate"
      )
      md-button.md-accent.md-raised.upload-btn(
        @click="upload",
        :disabled="uploading || !formValid"
      ) 上传
  message-alert(:show.sync="showMessageAlert", :msg="msgAlert")
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import filemd5 from "@/plugins/filemd5";
import MessageAlert from "@/components/MessageAlert.vue";
@Component({
  components: {
    MessageAlert,
  },
})
export default class Upload extends Vue {
  private fileInput: HTMLInputElement | null = null;
  private readOnly = false;
  private desc = "";
  private tags: string[] = [];
  private pid = "";
  private piclibs: Picman.PicLibDetail[] = [];
  private piclibSelect = -1;
  private uploading = false;
  private file: File | null = null;
  private showMessageAlert = false;
  private msgAlert = "";

  // 检查输入的内容是否满足上传
  get formValid(): boolean {
    return (
      !!this.file &&
      !!this.pid &&
      this.pid.length > 0 &&
      this.piclibSelect > 0 &&
      !!this.desc &&
      this.desc.length > 0
    );
  }

  // 上传图片
  async upload() {
    if (this.formValid) {
      this.uploading = true;
      try {
        // 更新图片信息
        let updateMetaReq: Picman.UpdatePictureMetaRequest = {
          description: this.desc,
          tags: this.tags,
        };
        let updateMetaResp = await this.$axios.put(
          `/api/lib/${this.piclibSelect}/gallery/${this.pid}`,
          updateMetaReq
        );
        let updateMetaResult: Picman.UpdatePictureMetaResult =
          updateMetaResp.data.data;
        if (updateMetaResult.valid) {
          this.uploading = false;
          this.msg("上传完成");
          return;
        }
        // 上传图片
        let uploadPictureReq = new FormData();
        uploadPictureReq.append("file", <Blob>this.file);
        await this.$axios.post(
          `/api/lib/${this.piclibSelect}/gallery/${this.pid}/img`,
          uploadPictureReq
        );
        this.msg("上传完成");
        this.uploading = false;
      } catch (err) {
        console.log(err);
        this.msg("上传出错");
        this.uploading = false;
      }
    } else {
      this.msg("填写信息不完整");
    }
  }

  // 选择图片时生成图片pid
  async onFileChange(fileList: File[]) {
    this.file = fileList[0];
    let md5 = await filemd5(this.file);
    let array = this.file.name.split(".");
    if (array && array.length > 1) {
      let ext = array[array.length - 1];
      this.pid = md5 + "." + ext;
      this.checkPicture(this.pid);
    }
  }

  // 选择图片后查询是否已存在图片
  checkPicture(pid: string) {
    this.$axios
      .get("/api/pic/" + pid)
      .then((resp) => {
        let detail: Picman.PictureDetail = resp.data.data;
        this.desc = detail.description;
        this.tags = detail.tags;
      })
      .catch((err) => {});
  }

  // 获取图库信息
  loadPiclib() {
    this.$axios
      .get("/api/lib/")
      .then((resp) => {
        this.piclibs = (<Picman.RequestResult>resp.data).data;
        if (this.piclibs.length > 0) {
          this.piclibSelect = this.piclibs[0].lid;
        }
      })
      .catch((err) => console.log(err));
  }

  msg(m: string) {
    this.msgAlert = m;
    this.showMessageAlert = true;
  }

  mounted() {
    this.loadPiclib();
  }
}
</script>

<style lang="scss" scoped>
.upload-btn {
  float: right;
}
</style>