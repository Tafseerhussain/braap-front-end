<template>
  <div class="my-shop white">
    <div class="header primary">
      <v-container>
        <v-row>
          <v-col><span class="white--text font-weight-bold text-h4">Machine Assets</span></v-col>
          <v-col class="text-right">
            <v-btn-toggle
              v-if="userType === 'TECH'"
              class="rounded-10"
              v-model="type"
              dense
              background-color="transparent"
              mandatory
            >
              <v-btn
                x-large
                :color="type === 0 ? 'braap_orange' : 'white'"
                :class="{ 'white--text': type === 0 }"
                class="px-6 body-0"
              >
                Machine | Asset
              </v-btn>
              <v-btn
                x-large
                :color="type === 1 ? 'braap_orange' : 'braap_light_grey'"
                :class="{ 'white--text': type === 1 }"
                class="px-7 body-0"
              >
                Customer
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <Charts></Charts>
    <MachineAssets :userType="userType"></MachineAssets>
    <BackTop></BackTop>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Charts from './Charts.vue'
  import MachineAssets from './MachineAssets.vue'
  import BackTop from '@/components/Common/BackTop'

  export default {
    name: 'MyShop',
    props: {},
    components: {
      Charts,
      MachineAssets,
      BackTop
    },
    data: function() {
      return {
        type: 0
      }
    },
    mounted() {},
    computed: {
      ...mapState({
        userType: state => state.userType
      })
    },
    watch: {
      type(val) {
        if (val === 1) this.$router.push({ name: 'Customers' })
      }
    },
    methods: {}
  }
</script>

<style lang="scss">
  .my-shop {
    min-height: 100vh;
    .header {
      padding: 60px 0 50px 0;
      background-color: #212529;
    }
  }
</style>
