<template>
  <div class="account-user-parts white">
    <v-container class="py-0">
      <v-row>
        <v-col cols="6" class="py-0">
          <v-btn color="braap_orange" dark x-large class="mr-4 mb-4 mb-0 rounded-10" @click="dialog = true">
            + Add Customers
          </v-btn>
        </v-col>
        <v-col cols="6" class="py-0">
          <v-text-field
            outlined
            hide-details
            placeholder="Search shop by name, location, VIN, or asset ID"
            @keydown="queryChange"
            v-model="query"
            class="rounded-10 braap-filter-search"
          >
            <template #prepend-inner>
              <v-icon>$svg-search</v-icon>
            </template>
            <template #append>
              <v-menu offset-y nudge-bottom="12" bottom left nudge-right="12" content-class="menu-dropdown">
                <template v-slot:activator="{ attrs, on }">
                  <v-icon color="primary" size="28" v-bind="attrs" v-on="on">$svg-settings</v-icon>
                </template>
                <v-list dense>
                  <v-list-item-group :mandatory="true" v-model="filter" @change="filterChanged">
                    <v-list-item
                      v-for="option in filterOptions"
                      :key="option.value"
                      link
                      :value="option.value"
                      class="px-3"
                      @click="filterItemClicked(option)"
                    >
                      <v-checkbox
                        :label="option.text"
                        hide-details
                        :ripple="false"
                        v-model="option.checked"
                        color="braap_orange"
                        class="ma-0 pb-1"
                      >
                      </v-checkbox>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="py-0">
          <div class="mt-5 text-subtitle-1" v-if="this.customers.length > 0">
            Viewing {{ this.customers.length }} of {{ this.total }} customers
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="py-4">
            <div ref="container">
              <template v-if="customers.length > 0">
                <v-scroll-x-transition group tag="div">
                  <CustomerItem
                    v-for="customer in customers"
                    :key="customer.id"
                    :value="customer"
                    @on-expand="expand"
                    :expanded="current === customer.id"
                    @edit="editCustomer"
                    @saved="customerSaved"
                    @removed="customerRemoved"
                  ></CustomerItem>
                </v-scroll-x-transition>
                <div class="ma-auto px-4" v-intersect.quiet="loadMore" v-if="!loading && hasMore">&nbsp;</div>
              </template>
              <!-- skeleton loader -->
              <template v-if="loading">
                <v-card
                  v-for="index of this.pageSize"
                  :key="index"
                  class="d-flex flex-column px-4 py-2 mb-4 rounded-br-0 rounded-bl-0"
                >
                  <v-row class="align-end my-0">
                    <v-col cols="2" class="py-0">
                      <v-skeleton-loader class="mx" type="list-item-avatar"></v-skeleton-loader>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <v-skeleton-loader class="mx" type="list-item-avatar"></v-skeleton-loader>
                    </v-col>
                    <v-col cols="3" class="py-0">
                      <v-skeleton-loader class="mx" type="list-item-avatar"></v-skeleton-loader>
                    </v-col>
                    <v-col cols="2" class="py-0">
                      <v-skeleton-loader class="mx" type="list-item"></v-skeleton-loader>
                    </v-col>
                    <v-col cols="1" class="py-0">
                      <v-skeleton-loader class="mx" type="list-item"></v-skeleton-loader>
                    </v-col>
                  </v-row>
                </v-card>
              </template>
              <template v-else-if="customers.length == 0">
                <!-- No customer, add first notification -->
                <div
                  v-if="noCustomer"
                  class="
                    d-flex
                    align-center align-sm-end
                    pl-4 pl-sm-10
                    pr-4
                    mt-0
                    subtitle-1
                    font-weight-medium
                    text-sm-h6
                  "
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
        </v-col>
      </v-row>
    </v-container>

    <AddCustomerDialog v-model="dialog" :data="addCustomerModel" @saved="customerSaved"></AddCustomerDialog>
  </div>
</template>

<script>
  import { debounce } from 'vue-debounce'
  import ArrowLine from '../../assets/arrow-line.svg'
  import CustomerItem from './CustomerItem.vue'
  import AddCustomerDialog from './AddCustomerDialog'

  export default {
    name: 'CustomerList',
    props: {},
    components: {
      ArrowLine,
      AddCustomerDialog,
      CustomerItem
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
        pageIndex: 1,
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
        this.pageIndex = 1
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
        if (val === 0) this.$router.push('/myshop')
        // if (val === 0) window.location.href = '/myshop'
      }
    },
    mounted() {
      this.setPageSize()
      this.getCustomers()
    },
    methods: {
      setPageSize() {
        var height = window.innerHeight - this.$refs.container.offsetTop

        var colNum = Math.ceil(height / 70)
        this.pageSize = colNum
      },
      getCustomers() {
        this.loading = true

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
        this.pageIndex = this.pageIndex + 1
        this.getCustomers()
      },
      filterChanged() {
        this.pageIndex = 1
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
          this.current = this.current == customer.id ? null : customer.id
        })
      },
      // add dialog
      editCustomer(customer) {
        this.addCustomerModel = { ...customer }
        this.dialog = true
      },
      customerSaved(data) {
        var index = this.customers.findIndex(x => x.id === data.id)
        if (index >= 0) {
          this.customers.splice(index, 1, { ...data, loading: false })
        } else {
          this.customers.splice(0, 0, data)
          this.total = this.total + 1
        }
      },
      customerRemoved(id) {
        var index = this.customers.findIndex(x => x.id === id)
        if (index >= 0) {
          this.customers.splice(index, 1)
          this.total = this.total - 1
        }
      }
    }
  }
</script>

<style lang="scss">
  .account-user-parts {
    min-height: 100vh;
    padding: 50px 0;
  }
</style>