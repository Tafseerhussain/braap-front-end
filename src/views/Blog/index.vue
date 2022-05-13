<template>
  <div class="white">
      <blog-header></blog-header>
      <all-blog></all-blog>
  </div>
</template>

<script>
import BlogHeader from './BlogHeader.vue'
import AllBlog from './AllBlog.vue'
export default {
    components: {
        BlogHeader,
        AllBlog
    }
}
</script>

<style>

</style>