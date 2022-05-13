<template>
  <div class="all-blog">
    <v-container class="py-0">
      <v-row>
        <v-col cols="5" class="body-0 py-0">Showing 8 out of 20 Results</v-col>
        <v-col cols="7" class="d-flex justify-end align-stretch py-0">
          <blog-search></blog-search>
        </v-col>
      </v-row>
      <div class="d-flex justify-space-between mt-8">
        <div class="px-2 mt-4" v-for="(blog, index) in blogList" :key="index">
          <blog-card :imgsrc="blog.src"></blog-card>
        </div>
      </div>
      <div class="d-flex justify-space-between">
        <div class="px-2 mt-4" v-for="(blog, index) in blogList" :key="index">
          <blog-card :imgsrc="blog.src"></blog-card>
        </div>
      </div>
      <v-row class="mt-12">
        <v-col cols="12" class="text-center">
          <v-btn large depressed dark class="all-blog-btn braap_orange px-8 rounded-10"> Load More </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import blogData from './blogData'
  import BlogCard from './BlogCard.vue'
  import BlogSearch from './BlogSearch.vue'
  export default {
    name: 'AllBlog',
    data() {
      return {
        blogList: []
      }
    },
    components: {
      BlogCard,
      BlogSearch
    },
    created() {
      this.blogList = blogData
    }
  }
</script>

<style lang="scss">
  .all-blog {
    padding: 50px 0 120px;
    .blog-search{
        width: 50%;
    }
    .all-blog-btn {
      box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
    }
  }
</style>