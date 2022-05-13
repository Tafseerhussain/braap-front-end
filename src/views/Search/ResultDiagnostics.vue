<template>
  <div class="result-diagnostics white pt-15 pb-13">
    <v-container class="py-0">
      <v-row>
        <v-col col="5">
          <div class="section-title font-weight-bold primary--text">Diagnostics</div>
        </v-col>
        <v-col col="7">
          <div v-if="filter.query" class="showing-results braap_orange--text body-0">
            <span class="primary--text font-weight-bold">Showing Results for</span> {{ filter.query }}.
          </div>
        </v-col>
      </v-row>

      <div ref="container" class="d-flex flex-wrap card-container mt-16">
        <template v-if="loading">
          <DiagnosticSkeleton v-for="index in pageSize" :key="index"> </DiagnosticSkeleton>
        </template>
        <template v-else-if="diagnostics.length == 0">
          <div class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4">
            <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
            <p class="mb-0">No diagnostics were found for your search.</p>
          </div>
        </template>
        <template v-else>
          <DiagnosticCard
            :value="d"
            v-for="d in diagnostics"
            :key="d.name"
            @research="research"
            :selected="selectedDiagnostics.indexOf(d.title) >= 0"
          >
            <template #action>
              <v-btn dark color="braap_orange" class="rounded-10 body-2" large @click="getItFixed(d)"
                >Get it fixed by Tech</v-btn
              >
              <v-hover v-slot="{ hover }">
                <v-btn
                  dark
                  color="braap_orange"
                  :outlined="!hover"
                  class="rounded-10 body-2 mt-2"
                  large
                  style="transition: 0.3s"
                  @click="$chat.start()"
                  >Ask Technician for Help</v-btn
                >
              </v-hover>
            </template>
          </DiagnosticCard>
        </template>
      </div>
    </v-container>
  </div>
</template>

<script>
  import DiagnosticCard from '@/components/Search/DiagnosticCard.vue'
  import DiagnosticSkeleton from '@/components/Search/DiagnosticSkeleton.vue'
  import mixins from '@/components/Search/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'ResultDiagnostics',
    props: {
      filter: {
        type: Object,
        default() {
          return {}
        }
      },
      selectedDiagnostics: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      DiagnosticCard,
      DiagnosticSkeleton
    },
    mixins: [mixins],
    data: function() {
      return {
        loading: true,
        diagnostics: []
      }
    },
    watch: {
      'filter.timestamp'() {
        if (this.filter.query) {
          this.loadDiagnostics()
        }
      }
    },
    computed: {
      ...mapState({
        isAuth: state => state.userId > 0
      })
    },
    created() {},
    methods: {
      loadDiagnostics() {
        this.loading = true
        this.$axios.post('/api/search/getDiagnostics', { ...this.filter }).then(result => {
          if (result && result.success) {
            this.diagnostics = result.data
          }
          this.loading = false
        })
      },
      research(diagnostic) {
        this.$emit('research', diagnostic)
      },
      getItFixed(d) {
        if (this.isAuth) {
          this.$emit('on-get', d)
        } else {
          var redirect = window.location.pathname
          if (window.location.search) {
            redirect += `/${window.location.search}`
          }
          this.$router.push({ name: 'Login', query: { redirect } })
        }
      }
    }
  }
</script>

<style lang="scss">
  .result-diagnostics {
    .showing-results {
      text-align: right;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
