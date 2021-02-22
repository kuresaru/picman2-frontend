<template lang="pug">
.gallery
  picture-preview(
    v-for="p in pictures",
    :key="p.pid",
    :p="p",
    @click="infop = p; showInfo = true"
  )
  picture-info-dialog(:show.sync="showInfo", :p="infop")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PicturePreview from "./Gallery/PicturePreview.vue";
import PictureInfoDialog from "./Gallery/PictureInfoDialog.vue";
@Component({
  components: {
    PicturePreview,
    PictureInfoDialog,
  },
})
export default class Gallery extends Vue {
  @Prop()
  private pictures!: Picman.PictureDetail[];
  private showInfo: boolean = false;
  private infop: Picman.PictureDetail = {
    pid: "",
    description: "",
    tags: [],
    fileSize: 0,
    width: 0,
    height: 0,
    createTime: 0,
    lastModify: 0,
    valid: false,
    accessLibrary: -1,
  };
}
</script>
