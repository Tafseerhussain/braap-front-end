<template>
  <v-dialog v-model="dialog" persistent scrollable fullscreen transition="dialog-bottom-transition">
    <v-card class="contact-list">
      <v-card-title class="primary white--text py-2 pl-3 pl-sm-6 rounded-0">
        {{ customer.CustomerName }}'s contacts
        <v-btn icon small dark class="ml-auto mr-n4" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-2 px-3 px-sm-6">
        <div class="contact-grid pt-4">
          <div class="d-flex flex-column flex-sm-row align-stretch align-center mb-4">
            <v-text-field
              solo
              hide-details
              placeholder="Search contacts by name"
              prepend-inner-icon="mdi-magnify"
              @keydown="queryChange"
              v-model="query"
              :loading="querying"
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
          <div class="mb-4 body-2 text-right" v-if="this.contacts.length > 0">
            Viewing {{ this.contacts.length }} of {{ this.total }} contacts
          </div>
          <div ref="container" class="d-flex flex-wrap mb-0 mx-n4">
            <!-- contacts grid -->
            <template v-if="contacts.length > 0">
              <Contact
                v-for="contact in contacts"
                :key="contact.Id"
                :value="contact"
                @click="editContact"
                @removed="contactRemoved"
                class="contact-item mx-4 mb-8"
              ></Contact>
              <div class="ma-auto px-4" v-intersect.quiet="loadMore" v-if="!loading && hasMore"></div>
            </template>
            <!-- skeleton loader -->
            <template v-if="loading">
              <v-card
                v-for="index of this.pageSize"
                :key="index"
                class="d-flex flex-column mx-4 mb-8 pa-3 pb-0 primary--text contact-item"
              >
                <v-skeleton-loader class="mb-3" type="list-item-avatar"></v-skeleton-loader>
                <v-skeleton-loader class="my-4" type="text@2"></v-skeleton-loader>
                <v-skeleton-loader class="mb-5" type="text@2"></v-skeleton-loader>
                <v-skeleton-loader class="d-flex ml-auto mb-4" type="avatar"></v-skeleton-loader>
              </v-card>
            </template>
            <template v-else-if="contacts.length == 0">
              <!-- No matching contact -->
              <div class="pa-4 mt-4 flex-grow-1 subtitle-1 text-sm-h6 font-weight-regular text-center">
                Try again, no contact found.
              </div>
            </template>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <AddContactForm v-model="openDialog" :data="addContactModel" @saved="contactSaved" open-in-dialog></AddContactForm>
  </v-dialog>
</template>

<script>
  import { debounce } from 'vue-debounce'
  import Contact from './Contact.vue'
  import AddContactForm from './AddContactForm.vue'

  export default {
    name: 'ContactList',
    components: { Contact, AddContactForm },
    props: {
      value: {
        type: Boolean
      },
      customer: {
        type: Object
      }
    },
    data: function() {
      return {
        query: null,
        querying: false,
        filter: 'reset',
        filterOptions: [
          { value: 'recently_added', text: 'Recently added', checked: false },
          { value: 'favourite', text: 'Favorites', checked: false },
          { value: 'reset', text: 'Show All', checked: true }
        ],
        loading: true,
        contacts: [],
        pageNum: 1,
        pageSize: 4,
        total: 0,
        hasMore: true,
        dialog: false,

        openDialog: false,
        addContactModel: {}
      }
    },
    watch: {
      value(val) {
        this.dialog = val
        if (val) {
          this.$nextTick(() => {
            this.setPageSize()
            this.contacts = []
            this.pageNum = 1
            this.filter = 'reset'
            this.query = null
            this.loading = true
            this.loadContacts()
          })
        }
      },

      dialog(val) {
        if (val) {
          this.$chat.hide()
          this.$scrollbar_hide()
        } else {
          this.$chat.show()
          this.$scrollbar_show()
        }
      }
    },
    computed: {},
    created() {
      this.queryChange = debounce(() => {
        this.pageNum = 1
        this.querying = true
        this.loadContacts()
      }, 500)
    },
    mounted() {},
    methods: {
      setPageSize() {
        var height = window.innerHeight - this.$refs.container.offsetTop
        var width = window.innerWidth
        var rowNum = 5
        if (width > 2000) rowNum = Math.floor(width / 450)
        else if (width > 1700) rowNum = 4
        else if (width > 1280) rowNum = 3
        else if (width > 750) rowNum = 2
        else rowNum = 1

        if (rowNum > 1) {
          var colNum = Math.ceil(height / 260)
          this.pageSize = rowNum * colNum
        } else {
          this.pageSize = 6
        }
      },
      loadContacts() {
        this.$axios
          .post('/UserCustomer/GetUserCustomersContacts', {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            filterby: this.filter,
            searchString: this.query,
            userCustomerId: this.customer.Id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.contacts = result.data
              if (this.pageNum === 1) this.contacts = result.data
              else this.contacts = this.contacts.concat(result.data)
              this.loading = false
              this.querying = false
              this.hasMore = result.data.length >= this.pageSize
            }
          })

        this.$axios
          .post('/UserCustomer/GetUserCustomersContactsCount', {
            userCustomerId: this.customer.Id
          })
          .then(result => {
            if (result && result.status === 200 && result.data) {
              this.total = result.data
            }
          })
      },
      loadMore(entries, observer, isIntersecting) {
        if (!isIntersecting) return
        this.pageNum = this.pageNum + 1
        this.loading = true
        this.loadContacts()
      },
      filterChanged() {
        this.pageNum = 1
        this.query = null
        this.loadContacts()
      },
      filterItemClicked(option) {
        this.filterOptions.forEach(x => {
          x.checked = false
        })
        option.checked = true
      },
      closeDialog() {
        this.dialog = false
        this.$emit('input', false)
      },
      editContact(contact) {
        this.addContactModel = { ...contact }
        this.openDialog = true
      },
      contactSaved(data) {
        var index = this.contacts.findIndex(x => x.Id === data.Id)
        if (index >= 0) {
          this.contacts.splice(index, 1, { ...data })
        } else {
          this.contacts.splice(0, 0, data)
        }
        this.$emit('saved', data)
      },
      contactRemoved(id) {
        var index = this.contacts.findIndex(x => x.Id === id)
        if (index >= 0) {
          this.contacts.splice(index, 1)
        }
        this.$emit('removed', id)
      }
    }
  }
</script>

<style lang="scss">
  .contact-list {
    .contact-item {
      flex-basis: 450px;
      @media (max-width: 2000px) {
        flex-basis: calc(25% - 32px) !important;
      }
      @media (max-width: 1700px) {
        flex-basis: calc(33.3333% - 32px) !important;
      }
      @media (max-width: 1280px) {
        flex-basis: calc(50% - 32px) !important;
      }
      @media (max-width: 750px) {
        flex-basis: calc(100% - 32px) !important;
      }
    }
  }
</style>
