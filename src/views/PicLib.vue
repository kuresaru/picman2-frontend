<template lang="pug">
div
  md-app
    md-app-toolbar.md-primary
      .md-toolbar-section-start
        md-button.md-icon-button(@click="$router.go(-1)"): md-icon chevron_left
        span.md-title 图库管理
    md-app-content
      md-list.md-double-line
        md-list-item(
          v-for="l in piclibs",
          :key="l.lid",
          @click="libListClick(l)"
        )
          .md-list-item-text
            span {{ l.name }}
            span 共{{ l.picCount }}张图片
  //- 新建图库对话框
  md-dialog-prompt(
    :md-active.sync="showCreatePrompt",
    md-title="新建图库",
    md-input-maxlength="64",
    :md-input-placeholder="defaultName",
    md-confirm-text="创建",
    md-cancel-text="取消",
    @md-confirm="create"
  )
  //- 图库信息对话框
  piclib-info-dialog(
    v-if="!!infoLib",
    :lib="infoLib",
    :show.sync="showInfoDialog",
    @remove="showDeleteConfirmDialog = !(showInfoDialog = false)"
  )
  //- 删除图库确认框
  md-dialog-confirm(
    :md-active.sync="showDeleteConfirmDialog",
    md-confirm-text="删除",
    md-cancel-text="取消",
    md-title="删除图库",
    :md-content="deleteConfirmText",
    @md-confirm="remove"
  )
  //- 新建按钮
  md-button.md-fab.md-fab-bottom-right(@click="showCreatePrompt = true"): md-icon add
  //- 底部提示栏
  message-alert(:show.sync="showMessageAlert", :msg="msgAlert")
</template>

<script lang="ts">
import MessageAlert from "@/components/MessageAlert.vue";
import PiclibInfoDialog from "@/components/PiclibInfoDialog.vue";
import Vue from "vue";
export default Vue.extend({
  name: "PicLib",
  components: {
    MessageAlert,
    PiclibInfoDialog,
  },
  data() {
    return {
      piclibs: [] as Picman.PicLibDetail[],
      infoLib: undefined as Picman.PicLibDetail | undefined,
      showMessageAlert: false as boolean,
      msgAlert: "" as string,
      showCreatePrompt: false as boolean,
      showDeleteConfirmDialog: false as boolean,
      showInfoDialog: false as boolean,
    };
  },
  methods: {
    msgalt(msg: string) {
      this.msgAlert = msg;
      this.showMessageAlert = true;
    },
    reloadPiclib() {
      this.$axios
        .get("/api/lib/")
        .then((resp) => (this.piclibs = (<Picman.RequestResult>resp.data).data))
        .catch((err) => this.msgalt(err));
    },
    create(name: string) {
      if (!name) {
        name = this.defaultName;
      }
      this.$axios
        .post("/api/lib/?name=" + name)
        .then((resp) => {
          this.msgalt("创建成功");
          this.reloadPiclib();
        })
        .catch((err) => {
          this.msgalt(err);
        });
    },
    remove() {
      this.showDeleteConfirmDialog = false;
      this.$axios
        .delete("/api/lib/" + this.infoLib?.lid)
        .then((resp) => {
          this.msgalt("删除成功");
          this.reloadPiclib();
        })
        .catch((err) => this.msgalt(err));
    },
    libListClick(l: Picman.PicLibDetail) {
      this.infoLib = l;
      this.showInfoDialog = true;
    },
  },
  computed: {
    defaultName() {
      return this.$store.getters.nickname + "的图库";
    },
    deleteConfirmText() {
      let name: string = this.infoLib ? this.infoLib.name : "";
      return "确认删除图库 [" + name + "]?";
    },
  },
  mounted() {
    this.$store.dispatch("checkUser");
    this.reloadPiclib();
  },
});
</script>