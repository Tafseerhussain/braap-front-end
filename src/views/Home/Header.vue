<template>
  <div class="absolute home-header py-2">
    <v-container class="py-2">
      <v-app-bar color="transparent" elevation="0">
        <!-- main menu -->
        <div v-if="!isAuth" class="d-flex align-center main-menu ml-n3">
          <!-- <span><router-link :to="{ name: 'Home' }" :class="getMenuClass('Home')">Home</router-link></span> -->
          <span><router-link :to="{ name: 'About' }" :class="getMenuClass('About')">About Us</router-link></span>
          <span><router-link :to="{ name: 'Features' }" :class="getMenuClass('Features')">Features</router-link></span>
          <span><router-link :to="{ name: 'Pricing' }" :class="getMenuClass('Pricing')">Pricing</router-link></span>
          <span
            ><router-link :to="{ name: 'Technician' }" :class="getMenuClass('Home')">Tech Sign Up</router-link></span
          >
        </div>
        <div v-else class="d-flex align-center main-menu ml-n3">
          <span><router-link :to="{ name: 'Home' }" :class="getMenuClass('Home')">Home</router-link></span>
          <span><router-link :to="{ name: 'MyShop' }" :class="getMenuClass('MyShop')">My Shop</router-link></span>
          <span><router-link :to="{ name: 'Cart' }" :class="getMenuClass('Cart')">Cart</router-link></span>
          <span><router-link :to="{ name: 'Account' }" :class="getMenuClass('Account')">Account</router-link></span>
        </div>
        <!-- main menu -->

        <router-link class="d-flex align-center mx-auto" :to="{ name: 'Home' }">
          <v-icon dark class="braap-logo">$svg-braap-logo</v-icon>
        </router-link>
        <div class="d-flex align-center ml-auto">
          <a v-ripple class="d-flex align-center braap_orange--text shop-link body-0 rounded-10">
            <span class="mr-2" style="padding-top: 2px">My Shop</span>
            <GarageOrangeIcon height="41"></GarageOrangeIcon>
          </a>
          <v-menu offset-y bottom left nudge-top="-20" content-class="elevation-1" open-on-hover close-delay="300">
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
            <v-list min-width="188" elevation="0">
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
        </div>
      </v-app-bar>
    </v-container>
  </div>
</template>

<script>
  import GarageOrangeIcon from '../../assets/icons/garage-orange.svg'
  import { mapState } from 'vuex'
  import AnchorLink from '@/components/Common/AnchorLink'

  export default {
    components: {
      GarageOrangeIcon,
      AnchorLink
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        isAuth: state => state.userId > 0
      }),
      ...mapState(['userLetter', 'userAvatar']),
      currentPage() {
        return this.$route.name
      }
    },
    methods: {
      getMenuClass(name) {
        return [
          'mx-5 px-2 py-4 body-0 white--text text-decoration-none',
          { 'active font-weight-medium': this.currentPage === name }
        ]
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
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .home-header {
    width: 100%;
    z-index: 1;

    .braap-logo {
      svg {
        width: 41px;
        height: 60px;
      }
    }

    .main-menu {
      a {
        letter-spacing: 0.5px;
        &.active {
          color: $braap_orange !important;
        }
      }
    }

    .shop-link {
      background: rgba(0, 0, 0, 0.8);
      padding: 10px 30px !important;
      border: 2px solid $braap_orange;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;

      &:hover {
        color: #fff;
        background: $braap_orange;
        & > * {
          filter: saturate(0%) brightness(500%);
        }
      }
    }

    .avatar-icon {
      border: 2px solid #fff !important;
    }
    .user-account {
      svg {
        font-size: 60px !important;
        width: 60px !important;
        height: 60px !important;
      }
    }
  }
</style>
