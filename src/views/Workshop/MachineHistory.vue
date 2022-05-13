<template>
  <v-card flat class="machine-history" color="transparent">
    <v-card-text class="pa-0 pt-5">
      <perfect-scrollbar
        ref="ps"
        class="work-container flex-grow-1 px-2 mx-n2 pb-4"
        :options="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <div ref="psContent" class="d-flex flex-column pt-1">
          <template v-if="!loading">
            <template v-if="histories.length > 0">
              <v-card v-for="h in histories" :key="h.workId" class="pa-2 pl-4 mb-4 rounded-10">
                <div class="d-flex align-center justify-space-between body-2">
                  <span>{{ h.workDecription }} on {{ moment(h.createdDate).format('MMMM DD, YYYY hh:mm A') }}</span>
                  <v-btn icon color="#C4C4C4" @click="openHistory(h.workId)">
                    <v-icon>mdi-calendar-month-outline</v-icon>
                  </v-btn>
                </div>
              </v-card>
            </template>
            <template v-else>
              <div class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4">
                <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
                <p class="mb-0">The machine has no interactive builds.</p>
              </div>
            </template>
          </template>
        </div>
      </perfect-scrollbar>
    </v-card-text>
  </v-card>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'MachineHistory',
    components: {},
    props: {
      vehicleId: {
        type: String,
        required: true
      }
    },
    data: function() {
      return {
        histories: [],
        loading: true
      }
    },
    computed: {},
    created() {},
    mounted() {
      if (this.vehicleId) this.getHistories()
    },
    methods: {
      moment,
      getHistories() {
        this.$axios.post(`/api/vehicle/${this.vehicleId}/histories/list`).then(result => {
          if (result.success && result.data) {
            this.histories = result.data
          }
          this.loading = false
        })
      },
      openHistory(workId) {
        this.$router.push({ name: 'WorkHistory', params: { id: this.vehicleId, workId } })
      }
    }
  }
</script>

<style lang="scss">
  .machine-history {
    .work-container {
      min-height: 300px;
      max-height: 550px;
      overflow: auto;
      overscroll-behavior: contain;

      a {
        text-decoration: underline;
      }

      & > div {
        min-height: 100%;
      }
    }
  }
</style>
