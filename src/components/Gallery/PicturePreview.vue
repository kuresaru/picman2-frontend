<template lang="pug">
img(:src="thumbSrc", :alt="alt", @click="click")
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
@Component
export default class PicturePreview extends Vue {
  @Prop()
  private p!: Picman.PictureDetail;

  get thumbSrc(): string {
    return (
      "/api/lib/" + this.p.accessLibrary + "/gallery/" + this.p.pid + "/thumb"
    );
  }

  get alt(): string {
    return this.p.description;
  }

  @Emit("click")
  click(): Picman.PictureDetail {
    return this.p;
  }
}
</script>

<style lang="scss" scoped>
div {
  display: inline-block;
  img {
    float: left;
    width: 160px;
    height: 160px;
    padding: 0;
    margin: 2px;
    border-radius: 4px;
    object-fit: cover;
  }
}
</style>
