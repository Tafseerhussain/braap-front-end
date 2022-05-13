<template>
  <BraapBg1 class="braap-blogs">
    <v-container class="relative">
      <v-row>
        <v-col cols="12" v-if="isHome">
          <div class="section-title font-weight-bold primary--text">
            Blogs By
            <span class="braap_orange--text">Braap</span>
          </div>
        </v-col>

        <v-col cols="12" v-else>
          <div class="section-title font-weight-bold braap_orange--text">
            More
            <span class="primary--text">Blogs</span>
          </div>
        </v-col>
      </v-row>
      <div class="blogs-info mt-10 body-0" v-if="isHome">
        Learn about why customers and technicians love Braap. In our blogs we talk about our technology, give technician
        tips, provide customer stories, answer questions, and a lot more.
      </div>
      <div class="d-flex justify-space-between mt-8">
        <div class="px-2 mt-4" v-for="(blog, index) in blogList" :key="index">
          <blog-card :imgsrc="blog.src"></blog-card>
        </div>
      </div>
      <div class="text-center mt-16">
        <v-btn
          v-if="isHome"
          @click="onMoreBlogBtnCLicked"
          color="braap_orange"
          x-large
          class="all-blog-btn rounded-10 body-0 text-capitalize px-8"
          dark
          ><span>Learn More</span><v-icon>mdi-arrow-right</v-icon></v-btn
        >
        <v-btn
          v-else
          @click="onSingleAllBlogClicked"
          color="primary"
          x-large
          class="all-blog-btn rounded-10 body-0 text-capitalize px-9"
          dark
          ><v-icon class="single-all-blog relative mr-1" color="white">$svg-arrow-left</v-icon
          ><span>All Blogs</span></v-btn
        >
      </div>
    </v-container>
  </BraapBg1>
</template>

<script>
  import BlogCard from './BlogCard.vue'
  import blogData from './blogData.js'
  import BraapBg1 from '../../components/layouts/BraapBg_1.vue'
  export default {
    name: 'BraapBlogs',
    props: ['isHome'],
    data() {
      return {
        blogList: []
      }
    },
    components: {
      BlogCard,
      BraapBg1
    },
    mounted() {
      this.getBlogsList()
    },
    methods: {
      getBlogsList() {
        this.blogList = blogData
      },
      onMoreBlogBtnCLicked() {
        this.$router.push({ name: 'Blog' })
      },
      onSingleAllBlogClicked() {
        this.$router.push({ name: 'Blog' })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .braap-blogs {
    background-color: $braap_bg_grey;
    padding: 80px 0;
    .blogs-info {
      color: #696969;
    }
    .all-blog-btn {
      box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
    }
    .single-all-blog {
      top: 3px;
    }
  }
</style>
