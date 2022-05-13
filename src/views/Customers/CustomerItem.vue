<template>
  <div class="tech-customer">
    <v-card
      class="d-flex flex-column mb-4 rounded-br-0 rounded-10 customer-card"
      :class="{ 'expended-active': expanded }"
    >
      <div class="d-flex align-center py-4 px-4">
        <v-row align="center">
          <v-col cols="3" class="py-0">
            <!-- <span></span> -->
            <span class="body-1 d-flex align-center text-no-wrap" @click="editCustomer">
              <!-- <v-icon class="mr-2">mdi-account-supervisor-outline</v-icon> -->
              <img src="/icons/user-square.svg" class="mr-1" />
              <v-tooltip top color="primary" open-delay="100" content-class="top">
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    {{ customer.customerName }}
                  </span>
                </template>

                {{ customer.customerName }}
              </v-tooltip>
            </span>
          </v-col>
          <!-- <v-col cols="6" class="d-lg-none py-0">
            <span class="body-1 d-flex align-center text-no-wrap" v-if="!customer.isNotCompany">
              <v-icon class="mr-2">$svg-link</v-icon>
              <v-chip label dark color="primary" @click="editCustomer">{{ customer.domain }}</v-chip>
            </span>
          </v-col> -->
          <v-col cols="4" class="py-0">
            <span class="body-1 d-flex align-center text-lg-no-wrap hidden-span" @click="editCustomer">
              <img class="icon-img mr-1" src="/icons/exact-location.svg" />
              <v-tooltip top color="primary" open-delay="100" content-class="top">
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" class="hidden-span">
                    {{ customer.fullAddress }}
                  </span>
                </template>

                {{ customer.fullAddress }}
              </v-tooltip>
            </span>
          </v-col>
          <v-col cols="2" class="py-0">
            <span class="body-1 d-flex align-center text-no-wrap" v-if="!customer.isNotCompany">
              <v-icon class="mr-2">$svg-link</v-icon>
              <!-- <v-chip label dark color="primary" @click="editCustomer">{{ customer.domain }}</v-chip> -->
              <v-tooltip top color="primary" max-width="310" open-delay="100" content-class="top">
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on"> {{ customer.domain }} </span>
                </template>
                {{ customer.domain }}
              </v-tooltip>
            </span>
          </v-col>
          <v-col cols="3" class="py-0 d-flex align-center">
            <v-tooltip right color="primary" open-delay="100" content-class="right">
              <template v-slot:activator="{ on, attrs }">
                <!-- <img src="/icons/edit-blue.svg" class="mr-4" v-bind="attrs" v-on="on" /> -->
                <v-btn icon small v-bind="attrs" v-on="on" class="mr-4" @click="editCustomer">
                  <v-icon color="#0dcaf0" size="28">$svg-text-box-edit</v-icon>
                </v-btn>
              </template>
              Edit
            </v-tooltip>

            <v-tooltip right color="primary" open-delay="100" content-class="right">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small class="mr-4" v-bind="attrs" v-on="on" @click="setFavourite">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24.486" height="24.223" viewBox="0 0 30.486 29.223">
                    <g id="star" transform="translate(-598 -568)">
                      <path
                        id="fill-star"
                        data-name="fill-star"
                        d="M599.713,580.618l8.216-2.72,5.44-8.159,3.966,8.159,8.953,3-6.063,6.176.567,8.046-7.933-3.91-7.989,3.91.623-8.613Z"
                        :fill="!customer.isFavourite ? '#E6E6E6' : '#FFD740'"
                      />
                      <path
                        id="star-frame"
                        data-name="star-frame"
                        d="M21.575,12.062c-3.8-9.248-4.929-9.248-5.536-9.248-.558,0-1.708,0-5.849,9.12-8.645,1.514-8.99,2.537-9.152,3.034-.188.563-.534,1.6,6.278,7.106-1.783,8.6-.716,9.19-.2,9.478a1.374,1.374,0,0,0,.676.164c1.55,0,5.941-2.808,8.247-4.357,3.324,2.214,7.265,4.679,8.348,4.678a1.1,1.1,0,0,0,.7-.237c.441-.352.988-.789-.573-9.4,7.311-6.307,7.112-6.8,6.839-7.487C31.145,14.386,30.945,13.885,21.575,12.062Zm1.282,9.248a.955.955,0,0,0-.317.9c.51,2.771.995,5.987,1.1,7.575-1.5-.767-4.513-2.652-7.072-4.37a.955.955,0,0,0-1.072,0,49.365,49.365,0,0,1-7.274,4.277,42.791,42.791,0,0,1,1.08-7.8.956.956,0,0,0-.338-.945A47.637,47.637,0,0,1,3.111,15.6a50.612,50.612,0,0,1,7.9-1.864.959.959,0,0,0,.711-.55A58.121,58.121,0,0,1,16.023,5,56.746,56.746,0,0,1,20,13.263a.954.954,0,0,0,.7.577c3.167.611,6.657,1.373,8.292,1.844C27.83,16.907,25.2,19.3,22.857,21.31Z"
                        transform="translate(597.036 565.186)"
                        :fill="!customer.isFavourite ? '#E6E6E6' : '#FFD740'"
                      />
                    </g>
                  </svg>
                </v-btn>
              </template>
              Favorite
            </v-tooltip>

            <v-tooltip right color="primary" max-width="200" open-delay="100" content-class="right">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  :color="customer.isPriority ? 'braap_green' : 'braap_light_grey'"
                  @click="setPriority"
                  class="mr-4"
                >
                  <v-icon>$svg-tick</v-icon>
                </v-btn>
              </template>
              <p class="mb-0" v-if="customer.isPriority">
                Priority customer. This means that the customer service work gets prioritized. To turn off priority
                click on the green check icon.
              </p>
              <p class="mb-0" v-else>
                Click to turn on priority for the customer. This means that the customer service work gets prioritized.
              </p>
            </v-tooltip>

            <v-tooltip right color="primary" max-width="200" open-delay="100" content-class="right">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on" color="red" @click="deleteCustomer">
                  <img src="/icons/red-cross.svg" />
                </v-btn>
              </template>
              Remove
            </v-tooltip>
          </v-col>
        </v-row>
        <v-btn icon small @click="expand" v-if="!loading">
          <v-icon :color="expanded ? 'braap_orange' : 'braap_grey'" size="26" class="down-arrow"
            >mdi-chevron-down-circle-outline
          </v-icon>
        </v-btn>
        <v-progress-circular
          class="circular-pro"
          :size="28"
          v-show="loading"
          indeterminate
          color="braap_orange"
        ></v-progress-circular>
      </div>
      <v-divider v-if="expanded"></v-divider>
      <v-expand-transition>
        <v-card-text v-show="expanded" class="braap_bg_grey">
          <div class="settings py-4">
            <CustomerSetting :value="onsiteTravelCharge" type="OnsiteTravel" :customerId="customer.id">
              <template #value="{ chargeType, rate, discountRate }">
                Onsite travel is set to {{ chargeType.toLowerCase() }} of {{ rate | currency
                }}<span v-if="discountRate > 0">
                  and the first {{ discountRate }} percent of the travel is not charged</span
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
            </CustomerSetting>
            <CustomerSetting :value="jobAssessmentCharge" type="JobAssessment" :customerId="customer.id">
              <template #value="{ chargeType, rate, discountRate }">
                Job assessment charge is set to {{ chargeType.toLowerCase() }} of {{ rate | currency
                }}<span v-if="discountRate > 0">
                  and the first {{ discountRate }} percent of the assessment is not charged</span
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
            </CustomerSetting>
          </div>
          <!-- <v-divider class="mb-4 d-block d-lg-none"></v-divider> -->
          <v-divider class="mt-5 mb-8"></v-divider>

          <!-- Contacts -->
          <div class="d-flex align-center">
            <v-btn text x-large class="pa-2 contact-btn" @click="addContact">
              <v-icon size="48" color="primary">mdi-plus-circle</v-icon> Click to add a contact to customer.
            </v-btn>
          </div>
          <VueSlickCarousel ref="slide" class="customer-contact-slider" v-bind="settings" v-if="contacts.length > 0">
            <ContactItem
              v-for="contact in contacts"
              :key="contact.id"
              :value="contact"
              @click="editContact"
              @removed="contactRemoved"
            ></ContactItem>
          </VueSlickCarousel>

          <v-divider class="mt-5 mb-10"></v-divider>

          <!-- Machines -->
          <CustomerMachineAssets ref="machine" :customer-id="customer.id" user-type="TECH"></CustomerMachineAssets>
        </v-card-text>
      </v-expand-transition>
      <v-progress-linear
        v-if="false"
        value="100"
        height="4"
        class="elevation-2"
        :indeterminate="loading"
      ></v-progress-linear>
    </v-card>

    <AddContactDialog v-model="openDialog" :data="addContactModel" @saved="contactSaved"></AddContactDialog>
    <!-- <ContactList
      v-model="openContactDialog"
      :customer="customer"
      @saved="contactSaved"
      @removed="contactRemoved"
    ></ContactList> -->
  </div>
</template>

<script>
  import ContactItem from './ContactItem.vue'
  import CustomerMachineAssets from './CustomerMachineAssets.vue'
  import AddContactDialog from './AddContactDialog.vue'
  // import ContactList from './ContactList.vue'
  import CustomerSetting from './CustomerSetting.vue'
  import VueSlickCarousel from 'vue-slick-carousel'

  export default {
    name: 'CustomerItem',
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
      ContactItem,
      CustomerMachineAssets,
      AddContactDialog,
      // ContactList,
      CustomerSetting,
      VueSlickCarousel
    },
    data: function() {
      return {
        customer: {},
        loading: false,
        loaded: false,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          speed: 500,
          infinite: true,
          dots: false,
          arrows: false,
          autoplay: true,
          autoplaySpeed: 3000
        },
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
            .post(`/api/userCustomer/${this.customer.id}/contacts`, {
              pageIndex: 1,
              pageSize: 15
            })
            .then(result => {
              if (result.success) {
                this.contacts = result.data.data
                this.totalContact = result.data.count
              }
              resolve()
            })
        })
      },
      loadCustomerSetting() {
        return new Promise(resolve => {
          this.$axios.post(`/api/userCustomer/${this.customer.id}/settings`).then(result => {
            if (result.success) {
              this.onsiteTravelCharge = result.data.find(x => x.type === 'OnsiteTravel')
              this.jobAssessmentCharge = result.data.find(x => x.type === 'JobAssessment')
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
        this.customer.isPriority = !this.customer.isPriority
        this.updateCustomer()
      },
      setFavourite() {
        this.customer.isFavourite = !this.customer.isFavourite
        this.updateCustomer()
      },
      deleteCustomer() {
        this.$axios.post(`/api/userCustomer/delete/${this.customer.id}`).then(result => {
          if (result.success && result.data) {
            this.$emit('removed', this.customer.id)
          } else {
            this.$msg.error('System error, please try again.')
          }
        })
      },
      updateCustomer() {
        this.$axios.post('/api/userCustomer/addOrUpdate', { ...this.customer }).then(result => {
          if (result.success && result.data) {
            this.$emit('saved', result.data)
          } else {
            this.$msg.error('System error, please try again.')
          }
        })
      },
      // add contact dialog
      addContact() {
        this.addContactModel = { userCustomerId: this.customer.id }
        this.openDialog = true
      },
      editContact(contact) {
        this.addContactModel = { ...contact }
        this.openDialog = true
      },
      contactSaved(data) {
        var index = this.contacts.findIndex(x => x.id === data.id)
        if (index >= 0) {
          this.contacts.splice(index, 1, { ...data })
        } else {
          this.contacts.splice(0, 0, data)
        }
      },
      contactRemoved(id) {
        var index = this.contacts.findIndex(x => x.id === id)
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
  @import '@/styles/color.scss';
  .tech-customer {
    .customer-card {
      transition: 0.3s;
      border: 2px solid transparent;
      .icon-img {
        width: 24px;
        cursor: pointer;
      }
      .down-arrow {
        transition: transform 100ms;
      }
      &.expended-active {
        border-color: $braap_orange;
        .down-arrow {
          transform: rotate(180deg);
        }
      }
      .hidden-span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        // position: relative;
        display: inline-block;
      }

      .settings {
        padding-left: 10px !important;
      }

      .contact-btn {
        margin-left: -3px;
      }

      .edit-icon {
        svg {
          width: 48px;
          height: 48px;
        }
      }

      .customer-contact-slider .slick-slide {
        padding: 20px 10px;
      }
    }
  }
</style>