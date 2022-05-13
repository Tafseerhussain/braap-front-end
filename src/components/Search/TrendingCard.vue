<template>
  <v-hover v-slot="{ hover }">
    <div class="relative rounded-10 card-wrapper relative trending-fix-card overflow-hidden">
      <v-card class="px-5 pt-4 pb-12">
        <div class="d-flex align-center justify-space-between">
          <div class="primary white--text px-5 body-0 py-1 mx-n5 rounded rounded-tl-0 rounded-bl-0">
            {{ list.userIconName }}
          </div>
          <div class="hamburger">
            <v-menu offset-y bottom left nudge-top="-5" content-class="elevation-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon elevation="0" dark v-bind="attrs" v-on="on">
                  <v-icon large>$svg-hamburger</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item-group>
                  <v-list-item @click="onCopyBtnClicked">
                    <v-list-item-icon class="mr-1"><v-icon>mdi-clipboard-flow</v-icon></v-list-item-icon>
                    <v-list-item-content color="#212529" class="text-subtitle-2">Save to workspace</v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="onShareBtnClicked">
                    <v-list-item-icon class="mr-1"
                      ><v-icon color="primary">mdi-share-variant-outline</v-icon></v-list-item-icon
                    >
                    <v-list-item-content color="#212529" class="text-subtitle-2"
                      >Share with someone</v-list-item-content
                    >
                  </v-list-item>
                  <v-list-item @click="onReportBtnClicked">
                    <v-list-item-icon class="mr-1"
                      ><v-icon color="primary">mdi-alpha-x-circle-outline</v-icon></v-list-item-icon
                    >
                    <v-list-item-content color="#212529" class="text-subtitle-2"
                      >Inappropriate report</v-list-item-content
                    >
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>
        </div>
        <v-tooltip top color="primary" content-class="top">
          <template v-slot:activator="{ on, attrs }">
            <div
              class="body-0 card-title pt-2 mb-2 font-weight-regular text-left primary--text"
              v-bind="attrs"
              v-on="on"
            >
              {{ list.descriptions }}
            </div>
          </template>
          <span>{{ list.descriptions }}</span>
        </v-tooltip>
        <div class="img-container">
          <v-img
            class="img rounded-10 braap_bg_grey"
            :src="`/api/vehicle/${list.vehicleId}/thumbnail`"
            contain
            aspect-ratio="1.5"
            position="center center"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="braap_light_grey"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-fade-transition v-if="!flag">
            <div
              v-if="hover"
              class="absolute text-center braap_orange--text overlay-btn custom-transform-class rounded text-card px-5"
              @click="onSeePartsBtnClicked"
            >
              Tap to see Parts
            </div>
          </v-fade-transition>
        </div>
        <v-divider></v-divider>
        <div class="d-flex align-center justify-space-between pa-2">
          <div class="d-flex flex-column align-center pl-6">
            <div class="d-flex flex-column align-center pl-6" v-if="list.isLiked" @click="onLikeBtnClicked()">
              <v-btn icon small>
                <v-icon class="likeBtn" color="#e58a00">$svg-like</v-icon>
              </v-btn>
              <div class="likeBtn mt-n1 text-caption braap_orange--text">
                {{ list.likeCount }} {{ list.likeCount === 1 ? 'Like' : 'Likes' }}
              </div>
            </div>
            <div class="d-flex flex-column align-center pl-6" v-else @click="onLikeBtnClicked()">
              <v-btn icon small>
                <v-icon class="likeBtn" color="#000">$svg-like</v-icon>
              </v-btn>
              <div class="likeBtn mt-n1 text-caption primary--text">Like</div>
            </div>
          </div>

          <v-btn dark color="#000" class="likeBtn text-capitalize rounded-button6"> Engine </v-btn>
        </div>
        <v-divider></v-divider>
        <v-card-text class="text-center px-0 py-3 full-name">
          <div class="body-2">{{ list.fullName }}</div>
        </v-card-text>
        <v-btn
          dark
          height="48"
          block
          color="braap_orange"
          absolute
          class="text-capitalize rounded-0 mx-n5"
          @click="$chat.start()"
          >Ask Technician for Help</v-btn
        >
        <v-expand-transition>
          <div class="card-overlay d-flex flex-column align-center px-4" v-if="flag">
            <a href="javascript:;" @click="onBackBtnClicked" class="my-6">
              <img src="/icons/cross.svg" />
            </a>
            <div
              class="d-flex pt-5 pb-3 align-self-start"
              v-for="r in list.recommendedParts"
              :key="r.braap_PartNumber"
              @click="openProductDialog(r)"
            >
              <div>
                <v-img max-width="60px" contain :src="r.partImage" @error="r.partImage = '/img/no-image.svg'">
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0 grey lighten-2 rounded" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </div>
              <div class="ml-2">
                <a href="javascript:;" class="text-subtitle-2"> {{ r.partName }}</a>
              </div>
            </div>
          </div>
        </v-expand-transition>
      </v-card>

      <product-dialog ref="productDialog"></product-dialog>
    </div>
  </v-hover>
</template>

<script>
  import { mapState } from 'vuex'
  import ProductDialog from './ProductDialog'
  export default {
    name: 'TrendingCard',
    props: ['trendingList'],
    data() {
      return {
        flag: false,
        list: {}
      }
    },
    components: {
      ProductDialog
    },
    computed: {
      ...mapState({
        isAuth: state => state.userId > 0
      })
    },
    mounted() {},
    created() {
      this.list = this.trendingList
    },
    watch: {
      trendingList(val) {
        this.list = val
      }
    },
    methods: {
      onSeePartsBtnClicked() {
        this.flag = true
      },
      onBackBtnClicked() {
        this.flag = false
      },
      onLikeBtnClicked() {
        if (this.isAuth) {
          this.$axios.post(`/api/vehicle/like?workId=${this.list.workId}`).then(result => {
            if (result && result.success) {
              this.list.likeCount = this.list.isLiked ? this.list.likeCount - 1 : this.list.likeCount + 1
              this.list.isLiked = !this.list.isLiked
            }
          })
        } else {
          this.$router.push({ name: 'Login' })
        }
      },
      onCopyBtnClicked() {
        if (this.isAuth) {
          this.$axios.post('/api/vehicle/copy').then(result => {
            if (result && result.success) {
              this.$msg.success('jump route')
              // this.$router.push({})
            } else {
              this.$msg.error('failed')
            }
          })
        } else {
          this.$router.push({ name: 'Login' })
        }
      },
      onShareBtnClicked() {
        const input = document.createElement('input')
        document.body.appendChild(input)
        input.setAttribute('value', this.list.shareURL)
        input.select()
        if (document.execCommand('copy')) {
          document.execCommand('copy')
          this.$msg.success('success')
        }
        document.body.removeChild(input)
      },
      onReportBtnClicked() {
        if (this.isAuth) {
          this.$axios
            .post('/api/vehicle/report', { vehicleId: this.list.vehicleId, workId: this.list.workId })
            .then(result => {
              if (result && result.success) {
                this.$msg.success('The content has been reported to Braap. Thank you.')
              }
            })
        } else {
          this.$router.push({ name: 'Login' })
        }
      },
      openProductDialog(part) {
        console.log('trendingCard', part)
        this.$refs.productDialog.openProduct({ braap_part_number: part.braap_PartNumber, price: part.partPrice })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/components/Search/style.scss';
  .trending-fix-card {
    .card-title {
      height: 55px;
      overflow: hidden;
      padding-right: 30%;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .overlay-btn {
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #e58a00;
      padding-top: 10px;
      padding-bottom: 10px;
      cursor: pointer;
      display: inline-block;
      width: 70%;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .img-container {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .likeBtn {
      cursor: pointer;
    }
    .card-overlay {
      position: absolute;
      background: rgba(255, 255, 255, 0.9);
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .full-name {
      height: 60px;
    }
  }
</style>