<template>
  <v-card outlined elevation="2" class="users mb-3 mt-1 pa-3 pt-1 pb-2 rounded-lg" v-if="users.length > 0">
    <v-card-title class="text-h6 font-weight-bold pa-0 pb-2 justify-space-between">
      USERS
      <v-icon class="icon-card">$svg-users</v-icon>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-slide-y-transition group>
        <v-hover open-delay="100" v-slot="{}" v-for="item in filteredUsers" :key="item.id">
          <div class="mb-3">
            <div class="d-flex align-center pr-2">
              <v-icon>$svg-person</v-icon>
              <span class="ml-1 flex-grow-1 black--text">{{ item.firstName + ' ' + item.lastName }}</span>
              <v-btn
                v-show="false"
                icon
                color="#404040"
                elevation="0"
                small
                class="black--text mr-1"
                title="Coming soon"
                @click="reject(item.id)"
              >
                <v-icon color="error">mdi-cancel</v-icon>
              </v-btn>
              <v-btn
                v-show="false"
                icon
                color="#404040"
                elevation="0"
                small
                class="black--text"
                title="Coming soon"
                @click="approve(item.id)"
              >
                <v-icon color="success">mdi-check-circle</v-icon>
              </v-btn>
            </div>
            <div class="d-flex">
              <div class="d-flex align-center mr-2" style="flex-basis: 50%">
                <v-icon>$svg-email</v-icon>
                <span class="ml-1 flex-grow-1 black--text">{{ item.email }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon>$svg-phone</v-icon>
                <span class="ml-1 flex-grow-1 black--text">{{
                  item.phoneNumber && item.phoneNumber.valid ? item.phoneNumber.number.international : item.phone
                }}</span>
              </div>
            </div>
          </div>
        </v-hover>
      </v-slide-y-transition>
      <div class="d-flex justify-end" v-if="users.length > min">
        <v-btn small icon color="#404040" elevation="0" class="black--text" @click="showAllUsers">
          <v-icon color="#000" style="font-size: 26px" class="down-arrow" :class="{ 'up-arrow': showAll }"
            >mdi-arrow-down-drop-circle-outline
          </v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import moment from 'moment'
  import PhoneNumber from '../../plugins/awesome-phonenumber'

  export default {
    name: 'Users',
    components: {},
    data: function() {
      return {
        users: [],
        showAll: false,
        min: 5
      }
    },
    watch: {},
    computed: {
      filteredUsers() {
        var data = this.users.map(x => {
          return {
            ...x,
            phoneNumber: PhoneNumber(x.phone).toJSON()
          }
        })
        return this.showAll ? data : data.filter((x, index) => index < this.min)
      }
    },
    created() {
      this.getUsers()
    },
    methods: {
      moment,
      getUsers() {
        this.$axios.post('/Account/GetCompanyUsers').then(result => {
          if (result && result.status === 200) {
            this.users = result.data
          }
        })
      },
      PhoneNumber,
      showAllUsers() {
        this.showAll = !this.showAll
      },
      reject() {},
      approve() {}
    }
  }
</script>

<style lang="scss">
  .users {
    .v-card__text {
      .v-icon {
        font-size: 20px;

        svg {
          color: #000;
          width: 20px;
          height: 20px;
        }
      }

      span {
        font-size: 14px;
        @media (max-width: 450px) {
          font-size: 12px;
        }
      }

      .down-arrow {
        transition: transform 350ms;
        svg {
          width: 24px;
          height: 24px;
        }
      }
      .up-arrow {
        transform: rotate(180deg);
      }
    }

    .v-btn--icon.v-size--small {
      height: 20px;
      width: 20px;
      .v-icon {
        height: 16px;
        width: 16px;
      }
    }
  }
</style>
