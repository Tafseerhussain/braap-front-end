<template>
  <div>
    <v-card class="d-flex flex-column mb-4 rounded-br-0 rounded-bl-0 customer-card">
      <div class="d-flex align-center px-4 py-2">
        <v-btn icon small class="mr-2" @click="setFavourite">
          <svg xmlns="http://www.w3.org/2000/svg" width="24.486" height="24.223" viewBox="0 0 30.486 29.223">
            <g id="star" transform="translate(-598 -568)">
              <path
                id="fill-star"
                data-name="fill-star"
                d="M599.713,580.618l8.216-2.72,5.44-8.159,3.966,8.159,8.953,3-6.063,6.176.567,8.046-7.933-3.91-7.989,3.91.623-8.613Z"
                :fill="!customer.isFavourite ? '#FFF' : '#FFEA00'"
              />
              <path
                id="star-frame"
                data-name="star-frame"
                d="M21.575,12.062c-3.8-9.248-4.929-9.248-5.536-9.248-.558,0-1.708,0-5.849,9.12-8.645,1.514-8.99,2.537-9.152,3.034-.188.563-.534,1.6,6.278,7.106-1.783,8.6-.716,9.19-.2,9.478a1.374,1.374,0,0,0,.676.164c1.55,0,5.941-2.808,8.247-4.357,3.324,2.214,7.265,4.679,8.348,4.678a1.1,1.1,0,0,0,.7-.237c.441-.352.988-.789-.573-9.4,7.311-6.307,7.112-6.8,6.839-7.487C31.145,14.386,30.945,13.885,21.575,12.062Zm1.282,9.248a.955.955,0,0,0-.317.9c.51,2.771.995,5.987,1.1,7.575-1.5-.767-4.513-2.652-7.072-4.37a.955.955,0,0,0-1.072,0,49.365,49.365,0,0,1-7.274,4.277,42.791,42.791,0,0,1,1.08-7.8.956.956,0,0,0-.338-.945A47.637,47.637,0,0,1,3.111,15.6a50.612,50.612,0,0,1,7.9-1.864.959.959,0,0,0,.711-.55A58.121,58.121,0,0,1,16.023,5,56.746,56.746,0,0,1,20,13.263a.954.954,0,0,0,.7.577c3.167.611,6.657,1.373,8.292,1.844C27.83,16.907,25.2,19.3,22.857,21.31Z"
                transform="translate(597.036 565.186)"
                :fill="!customer.isFavourite ? '#A7ABB3' : '#FFEA00'"
              />
            </g>
          </svg>
        </v-btn>

        <v-tooltip bottom color="primary" max-width="310" open-delay="100">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              :color="customer.isPriority ? 'braap_green' : 'grey'"
              @click="setPriority"
            >
              <v-icon>$svg-tick</v-icon>
            </v-btn>
          </template>
          <p class="mb-0" v-if="customer.IsPriority">
            Priority customer. This means that the customer service work gets prioritized. To turn off priority click on
            the green check icon.
          </p>
          <p class="mb-0" v-else>
            Click to turn on priority for the customer. This means that the customer service work gets prioritized.
          </p>
        </v-tooltip>

        <v-spacer></v-spacer>
        <v-tooltip left color="primary" max-width="310" open-delay="100">
          <template v-slot:activator="{ on, attrs }">
            <v-hover v-slot="{ hover }">
              <v-btn icon :color="hover ? 'braap_red' : 'primary'" @click="deleteCustomer" v-bind="attrs" v-on="on">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-hover>
          </template>
          Delete the customer
        </v-tooltip>
      </div>
      <div class="d-flex align-end align-lg-center px-4 py-2">
        <v-row align="center">
          <v-col cols="6" lg="3">
            <span class="body-1 d-flex align-center text-no-wrap" @click="editCustomer">
              <v-icon class="mr-2">mdi-account-supervisor-outline</v-icon>
              {{ customer.customerName }}
            </span>
          </v-col>
          <v-col cols="6" class="d-lg-none">
            <span class="body-1 d-flex align-center text-no-wrap" v-if="!customer.isNotCompany">
              <v-icon class="mr-2">$svg-link</v-icon>
              <v-chip label dark color="primary" @click="editCustomer">{{ customer.domain }}</v-chip>
            </span>
          </v-col>
          <v-col cols="12" lg="6">
            <span class="body-1 d-flex align-center text-lg-no-wrap" @click="editCustomer">
              <v-icon class="mr-2">mdi-map-marker-outline</v-icon> {{ customer.fullAddress }}
            </span>
          </v-col>
          <v-col cols="3" class="d-none d-lg-block">
            <span class="body-1 d-flex align-center text-no-wrap" v-if="!customer.isNotCompany">
              <v-icon class="mr-2">$svg-link</v-icon>
              <v-chip label dark color="primary" @click="editCustomer">{{ customer.domain }}</v-chip>
            </span>
          </v-col>
        </v-row>
        <v-btn icon class="black--text" @click="expand" :disabled="loading">
          <v-icon color="#000" style="font-size: 26px" class="down-arrow" :class="{ 'up-arrow': expanded }"
            >mdi-arrow-down-drop-circle-outline
          </v-icon>
        </v-btn>
      </div>
      <v-expand-transition>
        <v-card-text v-show="expanded">
          <div class="settings pt-4 pb-8">
            <span class="subtitle-1 font-weight-medium primary--text">SETTINGS</span>
            <Setting :value="onsiteTravelCharge" type="OnsiteTravel" :customerId="customer.id">
              <template #value="{ ChargeType, Rate, DiscountRate }">
                Onsite travel is set to {{ ChargeType.toLowerCase() }} of {{ Rate | currency
                }}<span v-if="DiscountRate > 0">
                  and the first {{ DiscountRate }} percent of the travel is not charged</span
                >.
              </template>
              <template #title>Onsite travel</template>
              <template #label>Charge onsite travel fees</template>
              <template #tooltip>Setup fees for traveling to a customer site.</template>
              <template #rateTooltip>
                Input a fully loaded hourly rate that includes gas, vehicle expense, and any other travel expense.
              </template>
              <template #discountTooltip>
                A discount rate provides the ability to not charge for all travel. For example, a technician has an
                onsite visit that is 100 miles away or a 2-hour, round trip. If the discount rate is set to 10% then the
                first 10 miles or the first 12 minutes is not charged. If there is no discount rate do not setup.
              </template>
            </Setting>
            <Setting :value="jobAssessmentCharge" type="JobAssessment" :customerId="customer.Id">
              <template #value="{ ChargeType, Rate, DiscountRate }">
                Job assessment charge is set to {{ ChargeType.toLowerCase() }} of {{ Rate | currency
                }}<span v-if="DiscountRate > 0">
                  and the first {{ DiscountRate }} percent of the assessment is not charged</span
                >.
              </template>
              <template #title>Job assessment charge</template>
              <template #label>Charge for job assessment</template>
              <template #tooltip>Setup fees for conducting a job assessment.</template>
              <template #discountTooltip>
                A discount rate provides the ability to not charge for the full assessment. For example, a technician
                performs an assessment that takes 3-hours and the discount rate is set to 10 percent, only 2.70 hours
                are charged. If there is no discount rate do not setup.
              </template>
            </Setting>
          </div>
          <v-divider class="mb-4 d-block d-lg-none"></v-divider>
          <v-btn dark block large class="mb-4 d-block d-sm-none" @click="addContact"> + Add contact </v-btn>
          <div
            v-if="contacts && contacts.length === 0"
            class="d-flex d-sm-none align-center pl-0 mt-0 mb-8 subtitle-1 font-weight-medium"
          >
            <v-icon large>mdi-arrow-up-thin</v-icon>Click to add the first contact to customer.
          </div>
          <!-- Contacts -->
          <v-sheet :max-width="slideMax" class="mr-auto mx-n4 mx-sm-0">
            <v-slide-group
              ref="slide"
              show-arrows
              next-icon="mdi-chevron-right-circle"
              prev-icon="mdi-chevron-left-circle"
            >
              <v-slide-item>
                <div class="d-none d-sm-flex align-center">
                  <v-btn
                    dark
                    style="height: auto; min-height: 200px"
                    small
                    class="align-self-stretch mb-4"
                    @click="addContact"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <div
                    v-if="contacts && contacts.length === 0"
                    class="d-flex align-center pl-10 mt-0 subtitle-1 font-weight-medium"
                  >
                    <v-icon large>mdi-arrow-left-thin</v-icon>Click to add the first contact to customer.
                  </div>
                </div>
              </v-slide-item>
              <v-slide-item v-for="contact in contacts" :key="contact.id">
                <Contact :value="contact" :width="slideItem" @click="editContact" @removed="contactRemoved"></Contact>
              </v-slide-item>
              <v-slide-item v-if="totalContact > 15">
                <div class="d-none d-sm-flex align-center">
                  <v-btn
                    text
                    style="height: auto; min-height: 200px"
                    class="align-self-stretch mb-4"
                    @click="moreContact"
                  >
                    View more
                  </v-btn>
                </div>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
          <!-- Machines -->
          <CustomerMachine
            ref="machine"
            :customer-id="customer.Id"
            :customer-name="customer.CustomerName"
          ></CustomerMachine>
        </v-card-text>
      </v-expand-transition>
      <v-progress-linear value="100" height="4" class="elevation-2" :indeterminate="loading"></v-progress-linear>
    </v-card>

    <AddContactForm v-model="openDialog" :data="addContactModel" @saved="contactSaved"></AddContactForm>
    <ContactList
      v-model="openContactDialog"
      :customer="customer"
      @saved="contactSaved"
      @removed="contactRemoved"
    ></ContactList>
  </div>
</template>

<script>
  import Contact from './Contact.vue'
  import CustomerMachine from './CustomerMachine.vue'
  import AddContactForm from './AddContactForm.vue'
  import ContactList from './ContactList.vue'
  import Setting from './Setting.vue'

  export default {
    name: 'Customer',
    props: {
      value: {
        type: Object,
        required: true
      },
      expanded: {
        type: Boolean
      }
    },
    components: {
      Contact,
      CustomerMachine,
      AddContactForm,
      ContactList,
      Setting
    },
    data: function() {
      return {
        customer: {},
        loading: false,
        loaded: false,
        slideMax: 0,
        slideItem: 0,
        contacts: [],
        totalContact: 0,

        openDialog: false,
        addContactModel: {},
        openContactDialog: false,

        onsiteTravelCharge: null,
        jobAssessmentCharge: null
      }
    },
    created() {
      if (this.value) {
        this.customer = this.value
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.customer = val
        }
      },
      expanded(val) {
        if (val) {
          this.$nextTick(() => {
            setTimeout(() => {
              let width = this.$el.offsetWidth

              // mobile layout < 568px, no 32px padding, no 50px add button
              this.slideMax = width - (width > 568 ? 32 : 0)
              let container = this.slideMax - 72 - (width > 568 ? 50 : 0)

              var rowNum = 5
              if (width > 2000) rowNum = Math.floor(container / 450)
              else if (width > 1700) rowNum = 4
              else if (width > 1280) rowNum = 3
              else if (width > 750) rowNum = 2
              else rowNum = 1

              this.slideItem = container / rowNum - 16
              this.$refs.slide.setWidths()
            }, 10)
          })
        }
      }
    },
    mounted() {},
    methods: {
      expand() {
        if (!this.loaded) {
          this.loading = true

          Promise.all([this.loadContacts(), this.loadMachines(), this.loadCustomerSetting()]).then(() => {
            this.loading = false
            this.loaded = true
            this.$emit('on-expand', this.customer)
          })
        } else {
          this.$emit('on-expand', this.customer)
        }
      },
      loadMachines() {
        return new Promise(resolve => {
          this.$refs.machine.getUserVehicle(resolve)
        })
      },
      loadContacts() {
        return new Promise(resolve => {
          this.$axios
            .post('/UserCustomer/GetUserCustomersContacts', {
              pageNum: 1,
              pageSize: 15,
              userCustomerId: this.customer.Id
            })
            .then(result => {
              if (result && result.status === 200) {
                this.contacts = result.data
              }
              resolve()
            })

          this.$axios
            .post('/UserCustomer/GetUserCustomersContactsCount', {
              userCustomerId: this.customer.Id
            })
            .then(result => {
              if (result && result.status === 200 && result.data) {
                this.totalContact = result.data
              }
            })
        })
      },
      loadCustomerSetting() {
        return new Promise(resolve => {
          this.$axios
            .post('/UserCustomer/GetCustomerSettings', {
              customerId: this.customer.Id
            })
            .then(result => {
              if (result && result.status === 200) {
                this.onsiteTravelCharge = result.data.find(x => x.Type === 'OnsiteTravel')
                this.jobAssessmentCharge = result.data.find(x => x.Type === 'JobAssessment')
              }
              resolve()
            })
        })
      },
      editCustomer() {
        this.$emit('edit', this.customer)
      },
      // update Customer
      setPriority() {
        this.customer.IsPriority = !this.customer.IsPriority
        this.updateCustomer()
      },
      setFavourite() {
        this.customer.IsFavourite = !this.customer.IsFavourite
        this.updateCustomer()
      },
      deleteCustomer() {
        this.$axios.post('/UserCustomer/DeleteUserCustomer', { Id: this.customer.Id }).then(result => {
          if (result && result.status === 200 && result.data) {
            this.$emit('removed', this.customer.Id)
          } else {
            this.$msg.error('System error, please try again.')
          }
        })
      },
      updateCustomer() {
        this.$axios.post('/UserCustomer/AddOrUpdateUserCustomer', { ...this.customer }).then(result => {
          if (result && result.status === 200 && result.data) {
            this.$emit('saved', result.data)
          } else {
            this.$msg.error('System error, please try again.')
          }
        })
      },
      // add contact dialog
      addContact() {
        this.addContactModel = { UserCustomerId: this.customer.Id }
        this.openDialog = true
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
      },
      contactRemoved(id) {
        var index = this.contacts.findIndex(x => x.Id === id)
        if (index >= 0) {
          this.contacts.splice(index, 1)
        }
      },
      moreContact() {
        this.openContactDialog = true
      }
    }
  }
</script>

<style lang="scss">
  .customer-card {
    .down-arrow {
      transition: transform 350ms;
    }
    .up-arrow {
      transform: rotate(180deg);
    }

    .v-slide-group__next,
    .v-slide-group__prev {
      min-width: 36px;
      flex-basis: 36px;
      .v-icon {
        font-size: 36px;
      }
      .v-icon--disabled {
        opacity: 0.3 !important;
      }
    }

    .v-slide-group {
      max-width: none;
    }
  }
</style>
