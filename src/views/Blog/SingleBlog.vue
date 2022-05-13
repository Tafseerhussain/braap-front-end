<template>
  <div class="single-blog white">
    <single-blog-header></single-blog-header>
    <single-blog-content></single-blog-content>
    <braap-blogs></braap-blogs>
  </div>
</template>

<script>
  import SingleBlogHeader from './SingleBlogHeader'
  import SingleBlogContent from './SingleBlogContent'
  import BraapBlogs from './BraapBlogs'

  export default {
    name: 'SingleBlog',
    components: {
      SingleBlogHeader,
      SingleBlogContent,
      BraapBlogs
    }
  }
</script>

<style lang="scss">
</style>