<template>
  <v-card class="machines section-wrapper rounded-10 pa-10 mb-5">
    <v-card-title class="text-h5 primary--text font-weight-medium pa-0">
      <div class="d-flex align-center mb-3">
        <v-icon color="braap_orange" size="36" class="mr-2">mdi-store-search-outline</v-icon>
        <span class="mt-1">Recent Shop Activity</span>
      </div>

      <v-scale-transition>
        <v-btn
          v-show="machines.length === 0"
          fab
          color="primary"
          style="height: 48px; width: 48px"
          class="ml-auto"
          @click="addNewMachine"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-scale-transition>
    </v-card-title>
    <v-card-text class="pa-0" :class="{ 'pt-4': machines.length > 0 }">
      <v-slide-y-transition group>
        <div class="mb-3" v-for="item in filteredMachines" :key="item.id">
          <div class="d-flex align-center">
            <v-icon>mdi-chevron-right</v-icon>
            <span class="ml-1 flex-grow-1 body-2">{{ item.fullName }}</span>
          </div>
        </div>
      </v-slide-y-transition>
      <v-btn v-if="machines.length > min" icon color="braap_grey" absolute bottom right @click="showAllMachines">
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
    name: 'RecentActivity',
    components: {},
    data: function() {
      return {
        machines: [],
        showAll: false,
        min: 5
      }
    },
    watch: {},
    computed: {
      filteredMachines() {
        var data = this.machines.filter((x, index) => index < 15)
        return this.showAll ? data : data.filter((x, index) => index < this.min)
      }
    },
    created() {
      this.getMachines()
    },
    methods: {
      moment,
      getMachines() {
        this.$axios.post('/api/account/recentActivities').then(result => {
          if (result.success && result.data) {
            this.machines = result.data
          }
        })
      },
      showAllMachines() {
        this.showAll = !this.showAll
      },
      addNewMachine() {
        this.$router.push({ name: 'MyShop' })
      }
    }
  }
</script>

<style lang="scss">
  .machines {
    .v-card__text {
    }
  }
</style>
