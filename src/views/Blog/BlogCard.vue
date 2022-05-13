<template>
  <v-card class="blog-card d-flex flex-column justify-space-between rounded-10"   height="100%">
    <img :src="imgsrc" alt="img" />
    <v-spacer></v-spacer>
    <div class="px-5 pt-2 pb-8">
      <div class="blog-author text-caption">
        Mechanic.
        <span>1 Month Ago</span>
      </div>
      <div class="font-weight-bold pt-1 pb-2 body-0 primary--text">
        Lorem Ipsum
      </div>
      <div class="blog-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non, maiores.
        Incidunt corrupti qui culpa impedit hekdfjlsfjdlskfjlaskdf
        dsfjldsafjldsjflskf
      </div>
      <div class="read-full-btn text-right braap_orange--text body-0 mt-5" @click="onReadFullClicked">
        Read Full <v-icon class="braap_orange--text">mdi-arrow-right</v-icon>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "BlogCard",
  props: ["imgsrc"],
  methods:{
    onReadFullClicked(){
      this.$router.push({name: 'SingleBlog'})
    }
  }
};
</script>

<style lang="scss">
.blog-card {
  img {
    width: 100%;
  }
  .blog-author {
    font-style: italic;
    color: #bfbfbf;
  }
  .blog-text {
    color: #696969;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  .read-full-btn{
    cursor: pointer;
  }
}
</style>
