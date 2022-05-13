<template>
  <v-card class="card-wrapper px-4 pt-4 pb-14 rounded-10 video-card relative overflow-hidden">
    <v-img
      :src="video.thumbnail"
      aspect-ratio="1.33"
      max-height="260"
      contain
      position="center center"
      class="rounded-10 primary"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="braap_grey"></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-spacer class="pt-5"></v-spacer>
    <v-tooltip top color="primary" content-class="top" max-width="210" :disabled="!showTooltip">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="video-name pb-2 body-1 primary--text">
          <span ref="videoName">{{ video.title }}</span>
        </div>
      </template>
      <div class="text-center">{{ video.title }}</div>
    </v-tooltip>

    <v-btn dark color="primary" class="rounded-10 body-2" large block @click="dialog = true" style="height: 48px"
      >Watch<v-icon size="22" class="ml-1">mdi-play-speed</v-icon></v-btn
    >

    <v-btn
      dark
      color="braap_orange"
      class="rounded-0 body-2 mt-2 ml-n4 mb-n4"
      large
      block
      absolute
      bottom
      @click="$chat.start()"
      >Ask Technician for Help</v-btn
    >

    <v-dialog
      v-model="dialog"
      max-width="1140"
      scrollable
      overlay-color="rgba(0,0,0,0.5)"
      overlay-opacity="1"
      class="elevation-0"
      content-class="border-dialog rounded-10"
    >
      <v-card class="primary rounded-10 overflow-hidden relative">
        <v-btn absolute small right icon dark class="mr-n3 mt-1" style="z-index: 1" @click="closeDialog">
          <v-icon size="28">mdi-close</v-icon>
        </v-btn>
        <v-responsive :aspect-ratio="16 / 9" class="primary">
          <iframe
            v-if="dialog"
            width="100%"
            height="100%"
            frameborder="0"
            allowfullscreen
            :src="'https:' + video.link + '?autoplay=1&mute=1&enablejsapi=1'"
          ></iframe>
        </v-responsive>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  export default {
    name: 'VideoCard',
    props: {
      value: {
        type: Object
      }
    },
    components: {},
    data: function() {
      return {
        video: {},
        showTooltip: false,
        dialog: false
      }
    },
    created() {
      this.video = this.value
    },
    watch: {
      value(val) {
        this.video = val
      },
      dialog(val) {
        if (val) {
          this.$chat.hide()
          this.$scrollbar_hide()
        } else {
          this.$chat.show()
          this.$scrollbar_show()
        }
      }
    },
    mounted() {
      var height = this.$refs.videoName.offsetHeight
      this.showTooltip = height > 48
    },
    methods: {
      closeDialog() {
        this.dialog = false
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  @import './style.scss';

  .video-card {
    .video-name {
      min-height: 48px;
      span {
        display: -webkit-box;
        line-height: 24px;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .v-dialog.border-dialog {
    border: 2px solid $braap_orange;
  }
</style>
