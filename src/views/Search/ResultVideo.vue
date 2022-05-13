<template>
  <div class="result-videos white pt-15 pb-13">
    <v-container class="py-0">
      <v-row>
        <v-col col="5">
          <div class="section-title font-weight-bold primary--text">Videos</div>
        </v-col>
        <v-col col="7">
          <div class="showing-results braap_orange--text body-0">
            <span class="primary--text font-weight-bold">Showing Results for</span> {{ filter.query }}.
          </div>
        </v-col>
      </v-row>

      <div ref="container" class="d-flex flex-wrap card-container mt-16">
        <template v-if="loading">
          <VideoSkeleton v-for="index in pageSize" :key="index"> </VideoSkeleton>
        </template>
        <template v-else-if="videos.length == 0">
          <div class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4">
            <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
            <p class="mb-0">No videos were found for your search.</p>
          </div>
        </template>
        <template v-else>
          <VideoCard :value="v" v-for="v in videos" :key="v.id"> </VideoCard>
        </template>
      </div>
    </v-container>
  </div>
</template>

<script>
  import VideoCard from '@/components/Search/VideoCard.vue'
  import VideoSkeleton from '@/components/Search/VideoSkeleton.vue'
  import mixins from '@/components/Search/mixins'

  export default {
    name: 'ResultVideos',
    props: {
      filter: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    components: {
      VideoCard,
      VideoSkeleton
    },
    mixins: [mixins],
    data: function() {
      return {
        loading: false,
        videos: []
      }
    },
    watch: {
      'filter.timestamp'() {
        if (this.filter.query) this.loadVideos()
      }
    },
    created() {
      if (this.filter.query) {
        this.loadVideos()
      }
    },
    methods: {
      loadVideos() {
        this.loading = true
        this.$axios.post('/api/search/getVideos', { ...this.filter }).then(result => {
          if (result && result.success) {
            this.videos = result.data
          }
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss">
  .result-videos {
    .showing-results {
      text-align: right;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
