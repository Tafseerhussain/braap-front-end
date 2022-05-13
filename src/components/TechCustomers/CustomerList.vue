<template>
  <div data-braap>
    <v-app class="tech-customers">
      <v-btn-toggle class="braap-primary-toggle px-3 px-sm-4 mt-2 mb-2" v-model="type" dense background-color="white">
        <v-btn
          :color="type === 0 ? 'primary' : 'white'"
          :class="{ 'white--text': type === 0 }"
          class="px-4 text-capitalize"
        >
          Machine | Asset
        </v-btn>
        <v-btn
          :color="type === 1 ? 'primary' : 'white'"
          :class="{ 'white--text': type === 1 }"
          class="px-8 text-capitalize"
        >
          Customer
        </v-btn>
      </v-btn-toggle>
      <div class="customer-grid py-4 px-3 px-sm-4">
        <div class="d-flex flex-column flex-sm-row align-stretch align-center mb-4">
          <v-btn color="braap_green" dark large class="mr-0 mr-sm-4 mb-4 mb-sm-0" @click="dialog = true">
            + ADD Customer
          </v-btn>
          <v-text-field
            solo
            hide-details
            placeholder="Search by customer name or location"
            prepend-inner-icon="mdi-magnify"
            @keydown="queryChange"
            v-model="query"
          >
            <template #append>
              <v-menu offset-y nudge-bottom="12" bottom left nudge-right="12" content-class="menu-dropdown">
                <template v-slot:activator="{ attrs, on }">
                  <v-icon color="primary" v-bind="attrs" v-on="on">$svg-settings</v-icon>
                </template>
                <v-list>
                  <v-list-item-group color="#000" :mandatory="true" v-model="filter" @change="filterChanged">
                    <v-list-item
                      v-for="option in filterOptions"
                      :key="option.value"
                      link
                      :value="option.value"
                      class="px-2"
                      @click="filterItemClicked(option)"
                    >
                      <v-checkbox
                        :label="option.text"
                        hide-details
                        :ripple="false"
                        v-model="option.checked"
                        class="ma-0 py-2 text-uppercase font-weight-medium"
                      >
                      </v-checkbox>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </template>
          </v-text-field>
        </div>
        <div class="mb-4 body-2 text-right" v-if="this.customers.length > 0">
          Viewing {{ this.customers.length }} of {{ this.total }} customers
        </div>
        <div ref="container" class="mb-10">
          <template v-if="customers.length > 0">
            <v-scroll-x-transition group tag="div">
              <Customer
                v-for="customer in customers"
                :key="customer.id"
                :value="customer"
                @on-expand="expand"
                :expanded="current === customer.id"
                @edit="editCustomer"
                @saved="customerSaved"
                @removed="customerRemoved"
              ></Customer>
            </v-scroll-x-transition>
            <div class="ma-auto px-4" v-intersect.quiet="loadMore" v-if="!loading && hasMore">&nbsp;</div>
          </template>
          <!-- skeleton loader -->
          <template v-if="loading">
            <v-card
              v-for="index of this.pageSize"
              :key="index"
              class="d-flex flex-column px-4 mb-4 rounded-br-0 rounded-bl-0"
            >
              <v-row class="align-end">
                <v-col cols="4">
                  <v-skeleton-loader class="mx" type="list-item-three-line"></v-skeleton-loader>
                </v-col>
                <v-col cols="4">
                  <v-skeleton-loader class="mx" type="list-item-three-line"></v-skeleton-loader>
                </v-col>
                <v-col cols="3">
                  <v-skeleton-loader class="mx" type="list-item-three-line"></v-skeleton-loader>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-card>
          </template>
          <template v-else-if="customers.length == 0">
            <!-- No customer, add first notification -->
            <div
              v-if="noCustomer"
              class="d-flex align-center align-sm-end pl-4 pl-sm-10 pr-4 mt-0 subtitle-1 font-weight-medium text-sm-h6"
            >
              <ArrowLine class="d-none d-sm-inline-block mb-3 flex-shrink-0"></ArrowLine>
              <v-icon large class="d-block d-sm-none">mdi-arrow-up-thin</v-icon>
              Click to add the first customer.
            </div>
            <!-- No matching customer -->
            <div v-else class="pa-4 mt-4 flex-grow-1 subtitle-1 text-sm-h6 font-weight-regular text-center">
              Try again, no customer found.
            </div>
          </template>
        </div>
      </div>

      <AddCustomerForm v-model="dialog" :data="addCustomerModel" @saved="customerSaved"></AddCustomerForm>
    </v-app>
  </div>
</template>

<script>
  import { debounce } from 'vue-debounce'
  import ArrowLine from '../../assets/arrow-line.svg'
  import Customer from './Customer.vue'
  import AddCustomerForm from './AddCustomerForm'

  export default {
    name: 'CustomerList',
    props: {},
    components: {
      ArrowLine,
      AddCustomerForm,
      Customer
    },
    data: function() {
      return {
        type: 1,
        query: null,
        filter: 'reset',
        filterOptions: [
          { value: 'recently_added', text: 'Recently added', checked: false },
          { value: 'favourite', text: 'Favorites', checked: false },
          { value: 'reset', text: 'Show All', checked: true }
        ],
        current: null,
        customers: [],
        loading: true,
        pageNum: 1,
        pageSize: 4,
        total: 0,
        hasMore: true,

        // add dialog
        dialog: false,
        addCustomerModel: {}
      }
    },
    created() {
      this.queryChange = debounce(() => {
        this.pageNum = 1
        this.customers = []
        this.getCustomers()
      }, 500)
    },
    computed: {
      noCustomer() {
        return this.filter == 'reset' && this.total === 0 && !this.query
      }
    },
    watch: {
      type(val) {
        if (val === 0) window.location.href = '/myshop'
      }
    },
    mounted() {
      this.setPageSize()
      this.getCustomers()
    },
    methods: {
      setPageSize() {
        var height = window.innerHeight - this.$refs.container.offsetTop

        var colNum = Math.ceil(height / 108)
        this.pageSize = colNum
      },
      getCustomers() {
        this.loading = true
        // this.$axios
        //   .post('/UserCustomer/GetUserCustomersCount', {
        //     pageNum: this.pageNum,
        //     pageSize: this.pageSize,
        //     filterby: this.filter,
        //     searchString: this.query
        //   })
        //   .then(result => {
        //     if (result && result.status === 200) {
        //       this.total = result.data
        //     }
        //   })

        this.$axios
          .post('/api/userCustomer/list', {
            pageIndex: this.pageNum,
            pageSize: this.pageSize,
            filterby: this.filter,
            searchQuery: this.query
          })
          .then(result => {
            if (result.success && result.data) {
              result.data.data.forEach(x => {
                x.loading = false
              })
              this.customers = this.customers.concat(result.data.data)
              this.total = result.data.count
              this.loading = false
              this.hasMore = result.data.length >= this.pageSize
            }
          })
      },
      loadMore(entries, observer, isIntersecting) {
        if (!isIntersecting) return
        this.pageNum = this.pageNum + 1
        this.getCustomers()
      },
      filterChanged() {
        this.pageNum = 1
        this.customers = []
        this.getCustomers()
      },
      filterItemClicked(option) {
        this.filterOptions.forEach(x => {
          x.checked = false
        })
        option.checked = true
      },
      expand(customer) {
        this.$nextTick(() => {
          this.current = this.current == customer.Id ? null : customer.Id
        })
      },
      // add dialog
      editCustomer(customer) {
        this.addCustomerModel = { ...customer }
        this.dialog = true
      },
      customerSaved(data) {
        var index = this.customers.findIndex(x => x.Id === data.Id)
        if (index >= 0) {
          this.customers.splice(index, 1, { ...data, loading: false })
        } else {
          this.customers.splice(0, 0, data)
          this.total = this.total + 1
        }
      },
      customerRemoved(id) {
        var index = this.customers.findIndex(x => x.Id === id)
        if (index >= 0) {
          this.customers.splice(index, 1)
          this.total = this.total - 1
        }
      }
    }
  }
</script>

<style lang="scss">
  .tech-customers {
    font-family: Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    letter-spacing: -0.3px;
  }
</style>
