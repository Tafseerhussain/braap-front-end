
<template>
  <div class="site-header">
    <v-container>
      <div class="d-flex align-center">
        <router-link class="d-flex align-center mr-3" :to="{ name: 'Home' }">
          <v-icon color="primary" class="braap-logo">$svg-braap-logo</v-icon>
        </router-link>
        <v-fade-transition duration="500">
          <BraapSearch v-model="query" v-if="showSearch" class="header-search" @search="search"></BraapSearch>
        </v-fade-transition>
        <!-- main menu -->
        <div v-if="!isAuth" class="d-flex align-center main-menu ml-auto">
          <span><router-link :to="{ name: 'About' }" :class="getMenuClass('About')">About Us</router-link></span>
          <span><router-link :to="{ name: 'Features' }" :class="getMenuClass('Features')">Features</router-link></span>
          <span><router-link :to="{ name: 'Pricing' }" :class="getMenuClass('Pricing')">Pricing</router-link></span>
        </div>
        <div v-else class="d-flex align-center main-menu ml-auto">
          <span><router-link :to="{ name: 'MyShop' }" :class="getMenuClass('MyShop')">My Shop</router-link></span>
          <span><router-link :to="{ name: 'Cart' }" :class="getMenuClass('Cart')">Cart</router-link></span>
          <span><router-link :to="{ name: 'Reports' }" :class="getMenuClass('Reports')">Reports</router-link></span>
          <span><router-link :to="{ name: 'DataHub' }" :class="getMenuClass('DataHub')">Data Hub</router-link></span>
          <span><router-link :to="{ name: 'Account' }" :class="getMenuClass('Account')">Account</router-link></span>
        </div>
        <!-- main menu -->
        <div class="d-flex align-center ml-4">
          <a v-if="!isAuth" v-ripple class="d-flex align-center shop-link body-0 white--text rounded-10">
            <span class="mr-2" style="padding-top: 2px">My Shop</span>
            <GarageOrangeIcon height="30"></GarageOrangeIcon>
          </a>
          <v-menu offset-y bottom left nudge-top="-20" content-class="elevation-1" open-on-hover close-delay="300">
            <template v-slot:activator="{ on, attrs }">
              <v-avatar v-if="!isAuth" v-ripple size="60" v-bind="attrs" v-on="on" class="ml-7 mr-4">
                <v-icon class="user-account">$svg-user-account-empty</v-icon>
              </v-avatar>
              <v-avatar v-else v-ripple size="60" v-bind="attrs" v-on="on" class="ml-2 mr-4" color="braap_orange">
                <v-img v-if="userAvatar" :src="userAvatar" aspect-ratio="1" class="rounded-10" contain></v-img>
                <span v-else class="text-h5 mt-1 white--text">{{ userLetter }}</span>
              </v-avatar>
            </template>
            <v-list min-width="188" elevation="0">
              <template v-if="!isAuth">
                <v-list-item link @click="openLogin">
                  <v-list-item-content class="subtitle-2 py-2">Login</v-list-item-content>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item link @click="openRegister">
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

                <v-list-item :to="{ path: '/', hash: '#trending-fixes' }">
                  <v-list-item-content class="subtitle-2 py-0">
                    <div class="d-flex align-center py-2">
                      <v-icon>mdi-trending-up</v-icon>
                      <span class="ml-3 body-2 text-wrap">Trending Fixes</span>
                    </div>
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
        </div>
      </div>
    </v-container>
    <LoginDialog ref="dialog" v-model="login"></LoginDialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import GarageOrangeIcon from '../../assets/icons/garage-orange.svg'
  import BraapSearch from '@/components/BraapSearch'
  import LoginDialog from '@/components/User/LoginDialog'

  export default {
    name: 'Header',
    components: {
      BraapSearch,
      GarageOrangeIcon,
      LoginDialog
    },
    data: function() {
      return {
        login: false,
        register: false,
        query: null
      }
    },
    computed: {
      ...mapState({
        isAuth: state => state.userId > 0,
        showSearch: state => state.app.showHeaderSearch
      }),
      ...mapState(['userLetter', 'userAvatar']),
      currentPage() {
        return this.$route.name
      }
    },
    watch: {
      $route(val) {
        const {
          query: { query }
        } = val
        this.query = query
      }
    },
    mounted() {
      this.$root.$braapSearch = this.$refs.braapSearch
      this.$bus.$on('updateSearchQuery', query => {
        this.query = query
      })
    },
    methods: {
      getMenuClass(name) {
        return [
          'mx-4 px-2 py-5 body-0 text-decoration-none',
          { 'active font-weight-medium': this.currentPage === name || this.$route.meta.topMenu === name }
        ]
      },
      openLogin() {
        this.$refs.dialog.openLogin()
      },
      openRegister() {
        this.$refs.dialog.openRegister()
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
      search(query) {
        if (this.$bus._events && this.$bus._events.search && this.$bus._events.search.length > 0)
          this.$bus.$emit('search', query)
        else this.$router.push({ name: 'SearchResult', query: { query } })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .site-header {
    background: #fff;
    box-shadow: var(--theme-shadow);
    position: fixed;
    width: 100%;
    padding: 11px 0;
    z-index: 20;

    .braap-logo {
      svg {
        height: 50px;
        width: 34px;
      }
    }
    .header-search {
      max-width: 35%;
      margin-left: 70px;
    }

    .shop-link {
      background: $braap_orange;
      padding: 10px 26px !important;
      border: 2px solid $braap_orange;
      & > * {
        filter: saturate(0%) brightness(500%);
      }
    }

    .main-menu {
      a {
        letter-spacing: 0.5px;
        color: rgba(0, 0, 0, 0.55) !important;
        &:hover {
          color: rgba(0, 0, 0, 0.7) !important;
        }
        &.active {
          color: $braap_orange !important;
        }
      }
    }

    .user-account {
      svg {
        font-size: 45px !important;
        width: 45px !important;
        height: 45px !important;
      }
    }
  }
</style>
