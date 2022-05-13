<template>
  <div class="shop-dashboard braap_bg_grey">
    <v-container class="charts-section">
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <v-card
            class="dashboard-card braap-content py-6 px-10 d-flex flex-column align-center text-center rounded-10"
          >
            <div class="text-h4 primary--text font-weight-bold">Maintenance</div>
            <p class="body-0 mb-0">Machines due for maintenance</p>
            <v-spacer></v-spacer>
            <div class="donut-chart mt-2 mb-5">
              <div class="donut-value text-h4 font-weight-black primary--text">68%</div>
              <canvas id="maintenanceChart" width="281" height="281"></canvas>
            </div>
            <v-spacer></v-spacer>
            <div class="body-0">68% of your machines are due for mainteance this month</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card
            class="dashboard-card braap-content py-6 px-10 d-flex flex-column align-center text-center rounded-10"
          >
            <div class="text-h4 primary--text font-weight-bold">Jobs</div>
            <p class="body-0 mb-0">Machines getting worked on</p>
            <v-spacer></v-spacer>
            <div class="dashboard-card-img slide-bottom">
              <img src="/img/account/bars.png" alt="bars" />
            </div>
            <div class="total-jobs primary--text d-block rounded-10 font-weight-black align-self-stretch">587</div>
            <v-spacer></v-spacer>
            <div class="body-0">587 of your machines are getting work done now</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="12" lg="4">
          <v-card
            class="dashboard-card braap-content py-6 px-10 d-flex flex-column align-center text-center rounded-10"
          >
            <div class="text-h4 primary--text font-weight-bold">Parts</div>
            <p class="body-0 mb-0">Parts tracking details</p>

            <div class="progress-detail mt-7 mb-2 body-0 primary--text align-self-stretch d-flex justify-space-between">
              <div>Ordered</div>
              <div>{{ getPercent(parts.totalOrdered, parts.totalPartOrder) }}%</div>
            </div>
            <v-progress-linear
              :value="getPercent(parts.totalOrdered, parts.totalPartOrder)"
              color="braap_orange"
              background-color="#e9ecef"
              height="20"
              class="rounded-pill"
            >
            </v-progress-linear>
            <div class="progress-detail mt-7 mb-2 body-0 primary--text align-self-stretch d-flex justify-space-between">
              <div>Shipped</div>
              <div>{{ getPercent(parts.totalShipped, parts.totalPartOrder) }}%</div>
            </div>
            <v-progress-linear
              :value="getPercent(parts.totalShipped, parts.totalPartOrder)"
              color="success"
              background-color="#e9ecef"
              height="20"
              class="rounded-pill"
            ></v-progress-linear>
            <div class="progress-detail mt-7 mb-2 body-0 primary--text align-self-stretch d-flex justify-space-between">
              <div>Late</div>
              <div>{{ getPercent(parts.totalLate, parts.totalPartOrder) }}%</div>
            </div>
            <v-progress-linear
              :value="getPercent(parts.totalLate, parts.totalPartOrder)"
              color="error"
              background-color="#e9ecef"
              height="20"
              class="rounded-pill"
            ></v-progress-linear>

            <v-spacer></v-spacer>
            <div class="body-0">
              {{ parts.totalPartOrder }} {{ parts.totalPartOrder === 1 ? 'part' : 'parts' }} are being shipped and
              tracked<br />&nbsp;
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'Charts',
    props: {},
    components: {},
    data: function() {
      return {
        parts: {}
      }
    },
    computed: {},
    mounted() {
      this.getOrderStatistics()
      this.initChart()
      this.$initSr()
    },
    methods: {
      getOrderStatistics() {
        this.$axios.post('/api/myShop/getOrderStatistics').then(result => {
          if (result.success && result.data) {
            this.parts = result.data
          }
        })
      },
      initChart() {
        const data = {
          labels: ['Machines due for maintenance ', 'Machines in queue '],
          datasets: [
            {
              label: 'Maintenance',
              data: [68, 32],
              backgroundColor: ['#238f23', '#e6e6e6'],
              hoverOffset: 4
            }
          ]
        }
        new window.Chart(document.getElementById('maintenanceChart'), {
          type: 'doughnut',
          data: data,
          options: {
            cutout: 100,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: false
              }
            }
          }
        })
      },
      getPercent(a, b) {
        return b === 0 ? 0 : Math.round((a / b) * 100)
      }
    }
  }
</script>

<style lang="scss">
  .shop-dashboard {
    padding: 100px 0;

    .dashboard-card {
      height: 100%;
      transition: 0.3s;
      .text-h4 {
        font-size: 40px !important;
        line-height: 66px;
      }

      &:hover {
        box-shadow: 0 4px 20px rgb(0 0 0 / 20%) !important;
      }
    }
    .donut-chart {
      position: relative;

      #maintenanceChart {
        width: 65%;
      }

      .donut-value {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 4px;
      }
    }

    .dashboard-card-img {
      width: 75%;
      margin: 10px auto 20px;
      position: relative;
    }

    .total-jobs {
      font-size: 60px !important;
      line-height: 68px;
      background-color: #eff3fe;
      padding: 12px 10px 0px;
      margin: 10px 0;
    }

    .progress-detail {
      line-height: 29px !important;
    }
  }
</style>
