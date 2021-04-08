<template lang="pug">
.pagediv(ref="pagediv")
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
        span.md-helper-text 选择,粘贴,或拖动一张图片上传吧
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
import { Vue, Ref, Component } from "vue-property-decorator";
import filemd5 from "@/plugins/filemd5";
import MessageAlert from "@/components/MessageAlert.vue";
@Component({
  components: {
    MessageAlert,
  },
})
export default class Upload extends Vue {
  @Ref("pagediv")
  private pagediv!: HTMLDivElement;
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

  async onFileChange(fileList: File[]) {
    await this.selectFile(fileList[0]);
  }

  // 选择图片时生成图片pid
  async selectFile(file: File) {
    let array = file.name.split(".");
    let ext = array[array.length - 1];
    const support = ["jpg", "jpeg", "png", "gif"];
    if (support.indexOf(ext) != -1) {
      this.file = file;
      let md5 = await filemd5(this.file);
      if (array && array.length > 1) {
        this.pid = md5 + "." + ext;
        this.checkPicture(this.pid);
      }
    } else {
      this.msg("文件格式错误");
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

  onDrag(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
  }

  async onDrop(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    const data = e.dataTransfer?.files[0];
    if (data) {
      await this.selectFile(data);
    }
  }

  async onPaste(event: ClipboardEvent) {
    let items = event.clipboardData?.items;
    let file: File | null = null;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
    }
    if (!file) {
      this.msg("粘贴内容不包含图片");
    } else {
      await this.selectFile(file);
    }
  }

  mounted() {
    this.pagediv.addEventListener("dragenter", this.onDrag, false);
    this.pagediv.addEventListener("dragover", this.onDrag, false);
    this.pagediv.addEventListener("drop", this.onDrop, false);
    document.addEventListener("paste", this.onPaste);
    this.loadPiclib();
  }
}
</script>

<style lang="scss" scoped>
.pagediv {
  width: 100vw;
  height: 100vh;
  .upload-btn {
    float: right;
  }
}
</style>