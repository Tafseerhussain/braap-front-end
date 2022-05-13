<template>
  <v-card class="recent-orders section-wrapper rounded-10 pa-10 mb-5">
    <v-card-title class="text-h5 primary--text font-weight-medium pa-0 align-start">
      <div class="d-flex align-center mb-3">
        <v-icon color="braap_orange" size="32" class="ml-1 mr-2">$svg-briefcase-clock</v-icon>
        <span class="mt-1">Recent Service & Orders</span>
      </div>

      <v-scale-transition>
        <v-btn
          v-show="orders.length === 0"
          fab
          color="primary"
          style="height: 48px; width: 48px"
          class="ml-auto"
          @click="addNewOrder"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-scale-transition>
    </v-card-title>

    <v-card-text class="pa-0" :class="{ 'pt-4': orders.length > 0 }">
      <v-slide-y-transition group>
        <div class="mb-4" v-for="item in listByDate" :key="item.date">
          <div class="d-flex align-center mb-1">
            <v-icon>mdi-chevron-right</v-icon>
            <span class="ml-1 flex-grow-1 body-2">{{ item.date }}</span>
          </div>
          <v-slide-y-transition group>
            <div class="d-flex align-center mb-1 ml-1" v-for="service in item.services" :key="service.id">
              <v-icon size="20">$svg-gear</v-icon>
              <span class="ml-1 flex-grow-1 body-2">{{ service.service }}</span>
            </div>
          </v-slide-y-transition>
        </div>
      </v-slide-y-transition>
      <v-btn v-if="orders.length > min" icon color="braap_grey" absolute bottom right @click="showAllOrders">
        <v-icon color="braap_grey" size="30" class="down-arrow" :class="{ 'up-arrow': showAll }"
          >mdi-arrow-down-drop-circle-outline
        </v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'RecentOrders',
    components: {},
    data: function() {
      return {
        orders: [],
        showAll: false,
        min: 5
      }
    },
    watch: {},
    computed: {
      listByDate() {
        let data = this.orders.map(x => {
          return {
            date: moment(x.addedInOrderLineOnDate).format('MMMM D, YYYY'),
            service: x.type === 'PART' ? x.partName : x.workName,
            id: x.id
          }
        })
        data = this.showAll ? data : data.filter((x, index) => index < this.min)

        var date = ''
        data = data
          .map(x => {
            if (x.date === date) return null
            else {
              date = x.date
              return {
                date,
                services: data.filter(x => x.date === date)
              }
            }
          })
          .filter(x => x)
        return data
      }
    },
    created() {
      this.getOrders()
    },
    methods: {
      moment,
      getOrders() {
        this.$axios.post('/api/account/recentOrders').then(result => {
          if (result.success && result.data) {
            this.orders = result.data
          }
        })
      },
      showAllOrders() {
        this.showAll = !this.showAll
      },
      addNewOrder() {
        this.$router.push({ name: 'Search' })
      }
    }
  }
</script>

<style lang="scss">
  .recent-orders {
    .v-card__text {
    }
  }
</style>
