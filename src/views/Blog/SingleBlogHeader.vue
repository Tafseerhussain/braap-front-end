<template>
  <div class="single-blog-header">
    <div class="single-blog-top relative">
      <div class="header-overlay absolute"></div>
      <img src="/img/home/slides/slide-1.jpg" alt="slides" class="slide-img" />
      <div class="header-title absolute white--text font-weight-bold">Lorem Ipsum Dolor Sit Amet</div>
    </div>
    <v-container class="single-blog-title d-flex align-center justify-space-between rounded-10 relative white">
      <div class="d-flex align-center">
        <img src="/icons/user-account-empty.svg" alt="user" class="relative" />
        <div class="body-0 ml-1">Braap Admin</div>
      </div>
      <div class="d-flex align-center">
        <img src="/icons/category.svg" alt="user" class="relative" />
        <div class="body-0 ml-1">Category Name</div>
      </div>
      <div class="d-flex align-center">
        <img src="/icons/calender.svg" alt="user" class="relative" />
        <div class="body-0 ml-1">March 01, 2022</div>
      </div>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'SingleBlogHeader'
  }
</script>

<style lang="scss">
  .single-blog-header {
    .single-blog-top {
      height: 500px;
      .header-title {
        font-size: 40px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .slide-img {
        object-fit: cover;
        object-position: 90%;
        width: 100%;
        height: 100%;
      }

      .header-overlay {
        background: linear-gradient(119deg, rgba(0, 0, 0, 0.5), rgba(229, 138, 0, 0.5));
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .single-blog-title {
        box-shadow: var(--theme-shadow);
        margin-top: -46px;
        padding: 30px;
        img{
            top: -3px;
            max-height: 30px;
        }
    }
  }
</style>