<template>
  <v-card class="profile-avatar section-wrapper rounded-10 pa-10 pb-8 mb-5">
    <v-row>
      <v-col cols="9">
        <v-card-title class="text-h5 primary--text font-weight-medium pa-0 mb-3">
          <v-icon color="braap_orange" size="44" style="height: 30px" class="mr-1">mdi-account-outline</v-icon>
          <span class="mt-1">Profile Picture</span>
        </v-card-title>

        <v-card-text class="pa-0 pt-4">
          <v-btn color="braap_orange" class="mr-2 rounded-10 px-6 body-0 mt-4" dark x-large>
            <input
              ref="upload"
              :value="file"
              type="file"
              class="upload-bt"
              accept="image/jpeg,image/png"
              multiple
              @change="uploadFile"
            />
            Upload New Image
          </v-btn>
          <a v-if="userAvatar" class="d-block braap_grey--text text-decoration-underline mt-3 body-1" @click="remove"
            >Remove</a
          >
          <div v-else class="mt-3 body-1">&nbsp;</div>
        </v-card-text>
      </v-col>
      <v-col cols="3">
        <v-responsive aspect-ratio="1" class="d-flex circle align-center pa-1" style="border: 1px solid #dee2e6">
          <template v-if="!loading">
            <v-img v-if="userAvatar" :src="userAvatar" aspect-ratio="1" class="circle" contain></v-img>
            <div class="d-flex align-center justify-center text-h3 braap_orange--text mt-2" v-else>
              {{ userLetter }}
            </div>
          </template>
          <div class="d-flex align-center justify-center" v-else>
            <v-progress-circular indeterminate color="braap_orange"></v-progress-circular>
          </div>
        </v-responsive>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Avatar',
    components: {},
    data: function() {
      return {
        file: null,
        loading: false
      }
    },
    computed: {
      ...mapState({
        userLetter: state => state.userLetter,
        userAvatar: state => state.userAvatar
      })
    },
    created() {},
    methods: {
      uploadFile(e) {
        var file = e.target.files[0]
        // The file content you have provided is not a supported image format. Please try a JPEG, GIF or PNG file.
        if (file && file.size > 250 * 1024) {
          this.$msg.warning('The file you have uploaded is too big. Image sizes are restricted to 250KB.')
          this.$refs.upload.value = null
          return
        }
        var reader = new FileReader()
        reader.onloadend = () => {
          let base64 = reader.result

          this.loading = true
          this.$axios.post('/api/user/profile/avatar/update', { userAvatar: base64 }).then(result => {
            this.loading = false
            if (result.success) {
              this.$store.commit('setUserAvatar', base64)
            }
          })
        }
        reader.readAsDataURL(file)
      },
      remove() {
        this.$axios.post('/api/user/profile/avatar/update', { userAvatar: null }).then(result => {
          if (result.success) {
            this.$store.commit('setUserAvatar', null)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .profile-avatar {
    .upload-bt {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 5;
      cursor: pointer;
    }
    .circle {
      border-radius: 50% !important;
    }
  }
</style>
