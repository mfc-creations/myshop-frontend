<template>
  <div class="page-checkout">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h1 class="title">Checkout</h1>
      </div>

      <div class="column is-12 box">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in cart.items" v-bind:key="item.product.id">
              <td>{{ item.product.name }}</td>
              <td><i class="fas fa-rupee-sign"></i>{{ item.product.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>
                <i class="fas fa-rupee-sign"></i
                >{{ getItemTotal(item).toFixed(2) }}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td colspan="2">Total</td>
              <td>{{ cartTotalLength }}</td>
              <td>
                <i class="fas fa-rupee-sign"></i>{{ cartTotalPrice.toFixed(2) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="column is-12 box">
        <h2 class="subtitle">Shipping details</h2>

        <p class="has-text-grey mb-4">* All fields are required</p>

        <div class="columns is-multiline">
          <div class="column is-6">
            <div class="field">
              <label>First name*</label>
              <div class="control">
                <input type="text" class="input" v-model="first_name" />
              </div>
            </div>

            <div class="field">
              <label>Last name*</label>
              <div class="control">
                <input type="text" class="input" v-model="last_name" />
              </div>
            </div>

            <div class="field">
              <label>E-mail*</label>
              <div class="control">
                <input type="email" class="input" v-model="email" />
              </div>
            </div>

            <div class="field">
              <label>Phone*</label>
              <div class="control">
                <input type="text" class="input" v-model="phone" />
              </div>
            </div>
          </div>

          <div class="column is-6">
            <div class="field">
              <label>Address*</label>
              <div class="control">
                <input type="text" class="input" v-model="address" />
              </div>
            </div>

            <div class="field">
              <label>Pin code*</label>
              <div class="control">
                <input type="text" class="input" v-model="pincode" />
              </div>
            </div>

            <div class="field">
              <label>Place*</label>
              <div class="control">
                <input type="text" class="input" v-model="place" />
              </div>
            </div>
          </div>
        </div>

        <div class="notification is-danger mt-4" v-if="errors.length">
          <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
        </div>

        <hr />

        <div id="card-element" class="mb-5"></div>

        <template v-if="cartTotalLength">
          <hr />

          <button class="button is-dark" @click="submitForm">
            Pay with Razorpay
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router/index";
export default {
  name: "Checkout",
  data() {
    return {
      cart: {
        items: [],
      },
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      pincode: "",
      place: "",
      errors: [],
      script: `https://checkout.razorpay.com/v1/checkout.js`,
    };
  },
  mounted() {
    document.title = "Checkout | MyShop";

    this.cart = this.$store.state.cart;
  },
  methods: {
    getItemTotal(item) {
      return item.quantity * item.product.price;
    },
    submitForm() {
      this.errors = [];
      if (this.first_name === "") {
        this.errors.push("The first name field is missing!");
      }
      if (this.last_name === "") {
        this.errors.push("The last name field is missing!");
      }
      if (this.email === "") {
        this.errors.push("The email field is missing!");
      }
      if (this.phone === "") {
        this.errors.push("The phone field is missing!");
      }
      if (this.address === "") {
        this.errors.push("The address field is missing!");
      }
      if (this.pincode === "") {
        this.errors.push("The zip code field is missing!");
      }
      if (this.place === "") {
        this.errors.push("The place field is missing!");
      }
      if (!this.errors.length) {
        this.$store.commit("setIsLoading", true);
        this.payAmount();
      }
    },
    async loadRazorPay() {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = this.script;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    },

    async payAmount() {
      const items = [];
      for (let i = 0; i < this.cart.items.length; i++) {
        const item = this.cart.items[i];
        const obj = {
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price * item.quantity,
        };
        items.push(obj);
      }
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        address: this.address,
        pincode: this.pincode,
        place: this.place,
        phone: this.phone,
        items: items,
      };

      const result = await this.loadRazorPay();
      if (!result) {
        alert("Failed to load razorpay script");
        return;
      }
      let res;
      await axios
        .post("/checkout", data)
        .then((response) => {
          res = response.data;
        })
        .catch((error) => {
          this.errors.push("Something went wrong. Please try again");
        });
      this.$store.commit("setIsLoading", false);

      const options = {
        key: process.env.VUE_APP_RAZORPAY_KEY_ID,
        amount: res.amount,
        currency: res.currency,
        name: data.first_name,
        description: `Description of the payment`,
        order_id: res.id,
        handler: function (e) {
          router.push("/cart/success");
        },
        prefill: {
          name: data.first_name,
          email: data.email,
          contact: data.phone,
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    },
  },
  computed: {
    cartTotalPrice() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += curVal.product.price * curVal.quantity);
      }, 0);
    },
    cartTotalLength() {
      return this.cart.items.reduce((acc, curVal) => {
        return (acc += curVal.quantity);
      }, 0);
    },
  },
};
</script>
