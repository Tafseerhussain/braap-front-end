<template>
    <Bubble color="braap_grey" align="left" :timestamp="activity.timestamp" :class="{ 'not-allowed': disabled }" class="payment-processed">
      <div class="body-1 d-block white--text d-flex align-center">
        <v-icon color="braap_green" class="white mr-2" style="border-radius: 50%; width:22px; height: 22px">mdi-check-circle</v-icon>
        <span>
        <b>STATUS:</b> Payment was processed.<br>
        <a class="white--text text-decoration-underline" ref="showDisclosureBtn" @click.prevent="show">Read the billing disclosure.</a>
        </span>
      </div>
      <template #bottom>
        <div v-click-outside="{
          handler: hide,
          closeConditional: () => showDisclosure,
          include: () => [$refs.showDisclosureBtn] 
        }">
          <div v-if="showDisclosure" class="disclosure mt-5 pl-1 pr-2 grey--text text--darken-3" >
              <p class="subtitle-1 mb-3">BRAAP ESTIMATE EXPLAINED</p>
              <p class="body-1  mb-3">
                This is an estimate based on our understanding of the service required. The price in the cart is our best
                estimate of the technician labor. We consider our experience and competitive pricing; while ensuring the
                highest quality. Once our technician reviews the diagnostic and analyzes the machine, Braap confirms the
                required parts. In some cases when we have questions or need to modify the diagnostic the service team will
                reach out to you. Watch your email and text messages.
              </p>
              <p class="subtitle-1 mb-3">HOW BILLING WORKS</p>
              <p class="body-1 mb-3">
                <ul class="pl-0">
                  <li>(1) Deposit – An initial deposit of 30% of the expected labor1 is charged at checkout.</li>
                  <li>(2) Parts–When the parts are confirmed by our service team, we send an email to confirm the cost2.</li>
                  <li>(3) Completion – Once service is complete, we apply the deposit and invoice the remaining labor.</li>
                </ul>
              </p>
              <p class="grey--text body-2">
                Disclosure: (1) Customers that do not complete Braap service pay a $100 fee for pickup and delivery. (2) If a customer does not respond to the price confirmation, Braap returns the machine not serviced.
              </p>
          </div>
        </div>
    </template>
    </Bubble>
</template>

<script>
  import Bubble from './Bubble.vue'
  import moment from 'moment'

  export default {
    name: 'PaymentProcessed',
    props: {
      activity: {
        type: Object,
        default: () => {}
      },
      disabled: {
        type: Boolean
      }
    },
    components: {
      Bubble
    },
    data: function() {
      return {
        showDisclosure: false
      }
    },
    created() {},
    computed: {},
    methods: {
      moment,
      show() {
        this.showDisclosure = true
        this.$root.scrollTimelineToBottom()
      },
      hide() {
        this.showDisclosure = false
        this.$root.scrollTimelineToBottom()
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .payment-processed {
    .disclosure {
      li {
        list-style: none;
        padding-left: 0;
      }
    }
  }
</style>
