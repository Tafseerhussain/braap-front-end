<template>
  <div class="tech-customer white">
    <div class="header primary">
      <v-container>
        <v-row>
          <v-col><span class="white--text font-weight-bold text-h4">Customers</span></v-col>
          <v-col class="text-right">
            <v-btn-toggle class="rounded-10" v-model="type" dense background-color="transparent" mandatory>
              <v-btn
                x-large
                :color="type === 0 ? 'braap_orange' : 'white'"
                :class="{ 'white--text': type === 0 }"
                class="px-6 body-0"
              >
                Machine Assets
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
    <CustomerList></CustomerList>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import CustomerList from './CustomerList.vue'
  export default {
    data() {
      return {
        type: 1
      }
    },
    components: {
      CustomerList
    },
    created() {
      if (this.userType !== 'TECH') {
        this.$router.push({ name: 'NotFound' })
      }
    },
    computed: {
      ...mapState({
        userType: state => state.userType
      })
    },
    watch: {
      type(val) {
        if (val === 0) this.$router.push({ name: 'MyShop' })
      }
    }
  }
</script>

<style lang="scss">
  .tech-customer {
    // min-height: 100vh;
    .header {
      padding: 60px 0 50px 0;
      background-color: #212529 !important;
    }
  }
</style>