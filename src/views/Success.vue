<template>
  <div class="page-success">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h1 class="title">Thank you</h1>
        <p>Order placed successfully!!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Success",
  mounted() {
    document.title = "Success | MyShop";
    this.$store.commit("clearCart");
  },
};
</script>
