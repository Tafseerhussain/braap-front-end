<template>
  <div class="blog-header primary">
      <v-container>
          <v-row>
              <v-col cols="12" class="py-0">
                  <div class="header-title white--text text-center font-weight-bold">
                      <img src="/icons/blog.svg" alt="blog" class="mr-2">
                      Blogs By
                      <span class="braap_orange--text">Braap</span>
                  </div>
              </v-col>
          </v-row>
      </v-container>
  </div>
</template>

<script>
export default {
    name: 'BlogHeader'
}
</script>

<style lang="scss">
.blog-header {
    padding: 70px 0;
    .header-title {
        font-size: 60px;
    }
}
</style>