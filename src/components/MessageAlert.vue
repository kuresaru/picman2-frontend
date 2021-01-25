<template lang="pug">
md-snackbar(
  md-position="center",
  :md-duration="2000",
  :md-active.sync="show_",
  md-persistent
): span {{ msg }}
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "MessageAlert",
  props: ["show", "msg"],
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