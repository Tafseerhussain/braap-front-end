<template>
  <BraapBg1 class="who-use braap_bg_grey">
    <v-container class="relative py-0">
      <div class="d-flex justify-center">
        <div class="section-title primary--text text-center font-weight-bold">
          Who
          <span class="braap_orange--text">Use</span>
          Braap
        </div>
      </div>
      <div class="who-content d-flex justify-space-between">
        <div class="flex-item pr-3">
          <v-expansion-panels class="rounded-10" accordion>
            <v-expansion-panel v-for="l in list1" :key="l.title" class="mb-5 rounded-10">
              <v-expansion-panel-header>
                <div class="d-flex flex-column">
                  <span class="text-h5 primary--text font-weight-medium">{{ l.title }}</span>
                  <span class="text-subtitle-1 mt-3">{{ l.subTitle }}</span>
                </div>
                <template v-slot:actions>
                  <v-icon color="braap_orange" size="30" class="mr-n2"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-divider class="mb-4"></v-divider>
                <div>
                  <p v-for="(c, index) in l.list" :key="index">
                    <img src="/icons/green-tick.svg" />
                    <span class="ml-2 text-subtitle-2">{{ c }}</span>
                  </p>
                  <p class="mt-5 mb-0">
                    {{l.text}}
                  </p>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <div class="flex-item pl-3">
          <div class="d-flex justify-center">
            <img src="/img/user/who-use-braap.png" class="mb-7">
          </div>
          <v-expansion-panels class="rounded-10" accordion>
            <v-expansion-panel v-for="l in list2" :key="l.title" class="mb-5 rounded-10">
              <v-expansion-panel-header>
                <div class="d-flex flex-column">
                  <span class="text-h5 primary--text font-weight-medium">{{ l.title }}</span>
                  <span class="text-subtitle-1 mt-3">{{ l.subTitle }}</span>
                </div>
                <template v-slot:actions>
                  <v-icon color="braap_orange" size="30" class="mr-n2"> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-divider class="mb-4"></v-divider>
                <div>
                  <p v-for="(c, index) in l.list" :key="index">
                    <img src="/icons/green-tick.svg" />
                    <span class="ml-2 text-subtitle-2">{{ c }}</span>
                  </p>
                  <p class="mt-5 mb-0">
                    {{l.text}}
                  </p>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </v-container>
  </BraapBg1>
</template>

<script>
  import BraapBg1 from '../../components/layouts/BraapBg_1.vue'
  import BraapUserData from './BraapUserData.js'
  export default {
    name: 'WhoUse',
    data() {
      return {
        list1: [],
        list2: []
      }
    },
    components: {
      BraapBg1
    },
    created() {
      this.list1 = BraapUserData.slice(0, 10)
      this.list2 = BraapUserData.slice(10)
    }
  }
</script>

<style lang="scss">
  .who-use {
    padding: 100px 0;

    .who-content {
      margin-top: 70px;
      .flex-item {
        flex-basis: 50%;
      }
    }
  }
</style>