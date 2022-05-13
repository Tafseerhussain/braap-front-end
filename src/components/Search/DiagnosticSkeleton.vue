<template>
  <v-card class="card-wrapper px-4 pt-3 pb-5 rounded-10 diagnostic-card d-flex flex-column relative skeleton">
    <div>
      <!-- <v-skeleton-loader class="ml-auto my-1" type="text" width="150"></v-skeleton-loader>
      <v-skeleton-loader type="image" height="75"></v-skeleton-loader> -->
      <div class="d-flex justify-space-between align-center">
        <v-skeleton-loader class="" type="button" width="60"></v-skeleton-loader>
        <v-skeleton-loader class="" type="text" width="150"></v-skeleton-loader>
      </div>

      <div class="d-flex mt-4 mb-7">
        <v-skeleton-loader class="mr-4" type="avatar" width="60"></v-skeleton-loader>
        <v-skeleton-loader class="mt-2 flex-grow-1" type="paragraph"></v-skeleton-loader>
      </div>
      <v-skeleton-loader class="mx-auto pt-10 mb-5" type="text" width="150"></v-skeleton-loader>
      <v-skeleton-loader type="image" height="44" class="rounded-10 mb-2"></v-skeleton-loader>
      <v-skeleton-loader type="image" height="44" class="rounded-10"></v-skeleton-loader>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'DiagnosticSkeleton'
  }
</script>

<style lang="scss">
</style>
