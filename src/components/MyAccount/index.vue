<template>
  <div data-braap>
    <v-app class="my-account">
      <div class="pa-md-4 pa-2 column-layout">
            <MyProfile :profile="profile" @change="profileChange"></MyProfile>
            <Timezone :value="profile.timezone"></Timezone>
            <ResetPassword :email="profile.email"></ResetPassword>
            <WorkStatistics v-if="userType === 'TECH'"></WorkStatistics>
            <MyAddresses></MyAddresses>
            <Billing v-if="userType === 'CUSTOMER'"></Billing>
            <RecentOrders v-if="userType === 'CUSTOMER'"></RecentOrders>
            <Machines></Machines>
            <WorkSchedule v-if="userType === 'TECH'"></WorkSchedule>
            <Skills v-if="userType === 'TECH'"></Skills>
            <Users></Users>
      </div>
    </v-app>
  </div>
</template>

<script>
  import MyProfile from './Profile.vue'
  import MyAddresses from './Addresses.vue'
  import ResetPassword from './ResetPassword.vue'
  import Timezone from './Timezone.vue'
  import Billing from './Billing.vue'
  import WorkStatistics from './WorkStatistics.vue'
  import RecentOrders from './RecentOrders.vue'
  import Machines from './Machines.vue'
  import Skills from './Skills.vue'
  import WorkSchedule from './WorkSchedule.vue'
  import Users from './Users.vue'

  export default {
    name: 'MyAccount',
    components: {
      MyProfile,
      MyAddresses,
      ResetPassword,
      Timezone,
      Billing,
      WorkStatistics,
      RecentOrders,
      Machines,
      Skills,
      WorkSchedule,
      Users
    },
    data: function() {
      return {
        profile: {},
        userType: 'CUSTOMER'
      }
    },
    computed: {},
    created() {
      this.userType = document.querySelector('#User_Type').value
      this.getProfile()
    },
    methods: {
      getProfile() {
        this.$axios.get('/Account/GetProfileDetail').then(result => {
          if (result && result.status === 200) {
            this.profile = result.data
          }
        })
      },
      profileChange(val) {
        this.profile = val
      }
    }
  }
</script>

<style lang="scss">
  .my-account {
    .theme--light.v-card {
      background-color: #FFF;
      display: inline-block;
      width: 100%;
    }

    .column-layout {
      columns: 2 350px;
      column-gap: 16px;
    }

    .theme--light.v-icon {
      color: #000;
    }
    .theme--light.v-sheet--outlined {
      border: none !important;
    }
  }
</style>
