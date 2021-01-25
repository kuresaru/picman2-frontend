<template lang="pug">
md-dialog(:md-active.sync="show_")
  md-dialog-title {{ lib.name }}
  md-tabs.md-transparent(md-alignment="fixed")
    md-tab#tab-info(md-label="信息")
      md-list
        md-list-item ID
          code {{ lib.lid }}
        md-list-item 图库名
          code {{ lib.name }}
        md-list-item 图片数
          code {{ lib.picCount }}
    md-tab#tab-browse(md-label="浏览")
      | TODO
    md-tab#tab-share(md-label="共享")
      | TODO
    md-tab#tab-action(md-label="操作")
      md-list
        md-list-item(@click="$emit('remove')")
          span(style="color: red") 删除
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "PiclibInfoDialog",
  props: ["lib", "show"],
  computed: {
    show_: {
      get() {
        return (<any>this).show;
      },
      set(val) {
        (<any>this).$emit("update:show", val);
      },
    },
  },
});
</script>