<template>
  <div class="column is-3">
    <router-link v-bind:to="{ path: `/${product.category}/${product.slug}` }">
      <div class="box">
        <figure class="image mb-4">
          <img v-bind:src="product.image" />
        </figure>

        <h3 class="is-size-4">{{ product.name }}</h3>
        <p class="is-size-6 has-text-grey">
          <i class="fas fa-rupee-sign"></i>
          {{ product.price }}
        </p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "ProductBox",
  props: {
    product: Object,
  },
};
</script>

<style scoped>
.image {
  margin-top: -1.25rem;
  margin-left: -1.25rem;
  margin-right: -1.25rem;
}
img {
  height: 15rem;
}
/* .box {
  height: 22rem;
} */
</style>
