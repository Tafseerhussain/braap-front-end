<template>
  <div class="my-account braap_bg_grey">
    <v-container>
      <v-row>
        <v-col cols="6">
          <Avatar></Avatar>
          <Profile :profile="profile" @change="profileChange"></Profile>
          <Timezone :value="profile.timezone"></Timezone>
          <ResetPassword></ResetPassword>
          <RecentOrders v-if="userType === 'CUSTOMER'"></RecentOrders>
          <Addresses v-if="userType === 'TECH'"></Addresses>
        </v-col>
        <v-col cols="6">
          <Addresses v-if="userType === 'CUSTOMER'"></Addresses>
          <Billing v-if="userType === 'CUSTOMER'"></Billing>
          <RecentActivity></RecentActivity>
          <WorkStatistics v-if="userType === 'TECH'"></WorkStatistics>
          <WorkSchedule v-if="userType === 'TECH'"></WorkSchedule>
          <Skills v-if="userType === 'TECH'"></Skills>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Timezone from './Timezone.vue'
  import ResetPassword from './ResetPassword.vue'
  import Addresses from './Addresses.vue'
  import RecentActivity from './RecentActivity.vue'
  import RecentOrders from './RecentOrders.vue'
  import Billing from './Billing.vue'
  import Skills from './Skills.vue'
  import WorkSchedule from './WorkSchedule.vue'
  import WorkStatistics from './WorkStatistics.vue'
  import Profile from './Profile.vue'
  import Avatar from './Avatar'

  export default {
    name: 'Account',
    components: {
      Timezone,
      ResetPassword,
      Addresses,
      RecentActivity,
      RecentOrders,
      Billing,
      Skills,
      WorkSchedule,
      WorkStatistics,
      Profile,
      Avatar
    },
    data: function() {
      return {
        profile: {}
      }
    },
    created() {
      this.getProfile()
    },
    computed: {
      ...mapState({
        userType: state => state.userType
      })
    },
    methods: {
      getProfile() {
        this.$axios.post('/api/user/profile').then(result => {
          if (result.success) {
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
  @import '@/styles/color.scss';
  .my-account {
    min-height: 100vh;
    padding: 70px 0 100px;

    .section-wrapper {
      border: 2px solid transparent;
      transition: 0.3s;

      &:hover {
        border-color: $braap_orange;
      }

      .body-2 {
        font-size: 14px !important;
        line-height: 26px !important;
        padding-top: 2px;
        @media (max-width: 450px) {
          font-size: 12px;
        }
      }

      .down-arrow {
        transition: transform 350ms;
      }
      .up-arrow {
        transform: rotate(180deg);
      }
    }
  }
</style>
