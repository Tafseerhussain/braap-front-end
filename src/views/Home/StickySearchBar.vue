<template>
  <v-slide-y-transition>
    <div v-show="show" class="sticky-search-bar" v-scroll="onScroll" v-intersect="{ handler: onIntersect }">
      <v-container>
        <v-row align="center">
          <v-col cols="2">
            <router-link :to="{ name: 'Home' }">
              <v-icon dark class="braap-logo">$svg-braap-logo</v-icon>
            </router-link>
          </v-col>
          <v-col cols="8">
            <div class="sticky-search">
              <BraapSearch ref="braapSearch" large class="white" @search="goToSearch"></BraapSearch>
            </div>
          </v-col>
          <v-col cols="2" class="text-end">
            <v-menu
              ref="userMenu"
              offset-y
              bottom
              left
              nudge-top="-20"
              content-class="elevation-2"
              open-on-hover
              close-delay="300"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-avatar v-if="!isAuth" v-ripple size="60" v-bind="attrs" v-on="on" class="ml-7 mr-4">
                  <v-icon class="user-account">$svg-user-account</v-icon>
                </v-avatar>
                <v-avatar
                  v-else
                  v-ripple
                  size="50"
                  v-bind="attrs"
                  v-on="on"
                  class="ml-7 mr-4 avatar-icon"
                  color="primary"
                >
                  <v-img v-if="userAvatar" :src="userAvatar" aspect-ratio="1" class="rounded-10" contain></v-img>
                  <span v-else class="text-h6 mt-1 white--text">{{ userLetter }}</span>
                </v-avatar>
              </template>
              <v-list min-width="180" elevation="0">
                <template v-if="!isAuth">
                  <v-list-item :to="{ name: 'Login' }">
                    <v-list-item-content class="subtitle-2 py-2">Login</v-list-item-content>
                  </v-list-item>
                  <v-divider class="my-2"></v-divider>
                  <v-list-item :to="{ name: 'Registration' }">
                    <v-list-item-content class="subtitle-2 py-2">Register</v-list-item-content>
                  </v-list-item>
                </template>
                <template v-else>
                  <v-list-item :to="{ name: 'MyShop' }">
                    <v-list-item-content class="subtitle-2 py-0">
                      <div class="d-flex align-center py-2">
                        <v-icon>mdi-hammer-wrench</v-icon>
                        <span class="ml-3 body-2 text-wrap">My Shop</span>
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="my-1"></v-divider>
                  <v-list-item :to="{ name: 'Account' }">
                    <v-list-item-content class="subtitle-2 py-0">
                      <div class="d-flex align-center py-2">
                        <v-icon>mdi-account-check-outline</v-icon>
                        <span class="ml-3 body-2 text-wrap">Account</span>
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="my-1"></v-divider>

                  <v-list-item>
                    <v-list-item-content class="subtitle-2 py-0">
                      <anchor-link href="#trending-fixes" class="d-flex align-center py-2 braap_grey--text">
                        <v-icon>mdi-trending-up</v-icon>
                        <span class="ml-3 body-2 text-wrap">Trending Fixes</span>
                      </anchor-link>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="my-1"></v-divider>
                  <v-list-item :to="{ name: 'Cart' }">
                    <v-list-item-content class="subtitle-2 py-0">
                      <div class="d-flex align-center py-2">
                        <v-icon>mdi-cart-outline</v-icon>
                        <span class="ml-3 body-2 text-wrap">Shopping Cart</span>
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="my-1"></v-divider>
                  <v-list-item link @click="logout">
                    <v-list-item-content class="subtitle-2 py-0">
                      <div class="d-flex align-center py-2">
                        <v-icon>mdi-logout-variant</v-icon>
                        <span class="ml-3 body-2 text-wrap">Logout</span>
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-slide-y-transition>
</template>

<script>
  import BraapSearch from '@/components/BraapSearch'
  import { mapState } from 'vuex'
  import AnchorLink from '@/components/Common/AnchorLink'

  export default {
    name: 'StickySearchBar',
    components: {
      BraapSearch,
      AnchorLink
    },
    data() {
      return {
        show: false
      }
    },
    computed: {
      ...mapState({
        isAuth: state => state.userId > 0
      }),
      ...mapState(['userLetter', 'userAvatar'])
    },
    methods: {
      onScroll() {
        var scrollTop = document.documentElement.scrollTop
        var heroSliderHeight = document.querySelector('.hero-slider').offsetHeight + 270
        if (scrollTop > heroSliderHeight) {
          this.show = true
        } else {
          this.show = false
        }
      },
      onIntersect(entries) {
        if (!entries[0].isIntersecting) {
          this.$refs.braapSearch.hideMenu()
          this.$refs.userMenu.isActive = false
        }
      },
      logout() {
        this.$axios.post('/api/user/logout').then(result => {
          if (result && result.success) {
            this.$store.dispatch('logout', result.data)
            this.$router.push({ name: 'Home' })
          } else {
            this.$ls.remove('Access-Token')
            window.location.reload()
          }
        })
      },
      goToSearch(query) {
        this.$router.push({ name: 'SearchResult', query: { query } })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .sticky-search-bar {
    z-index: 5;
    position: fixed;
    width: 96%;
    height: auto;
    top: 0px;
    transition: 0.5s;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(6px);
    left: 2%;
    padding: 6px 0;

    .braap-logo {
      svg {
        height: 50px;
        width: 34.5px;
      }
    }

    .avatar-icon {
      border: 2px solid #fff !important;
    }

    .braap-search {
      &.large {
        .v-input__slot {
          min-height: 61px !important;
        }
        .v-input__prepend-inner {
          margin-top: 18px;
        }
        .v-input__append-inner {
          margin-top: 8px;
        }
      }
    }
  }
</style>
