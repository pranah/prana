<template>
  <div class="navbar">
    <v-row>
      <v-col>
    <img class="logo" height="30" @click="open = !open" src="~/assets/Logo.svg" alt="logo">
    <!-- <v-spacer></v-spacer> -->
      </v-col>
      <div class="logo">
      <v-col>
        <img class="logo-prana" height="30"  src="~/assets/Prananav.svg" alt="logo">
      </v-col>
      </div>
      <div class="links">
      <v-col>
        <nuxt-link
        v-for="link of links"
        :key="link.name"
        :to="link.to"
        exact
        v-text="link.name"
      />
      </v-col>
      </div>
    <!-- <img class="logo" height="30" src="~/assets/pranaFinalLogo.svg" alt="logo"> -->
    <div class="navbar-drawer" :class="{ isOpen: open }">
      <nuxt-link
        v-for="link of links"
        :key="link.name"
        :to="link.to"
        exact
        v-text="link.name"
      />
    </div>
    
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: false,
      links: [
        { to: '/', name: 'Home' },
        { to: '/collector', name: 'Reader' },
        { to: '/publisher', name: 'Author' },
        { to: '/about', name: 'About' },
      ]
    }
  },
  watch: {
    '$route.name' () {
      this.open = false
    }
  }
}
</script>


<style scoped>
.links {
  position: relative;
  right: 30%;
}
.logo-prana {
  position: relative;
  right: 540%;
}
.navbar {
  z-index: 20;
  position: relative;
  background: #0D47A1;
  /* background: #455A64; */
  color: white;
  padding: 2px;
}
.navbar-drawer {
  display: flex;
  flex-flow: column nowrap;
  width: 250px;
  position: absolute;
  z-index: 10;
  top: 100%;
  left: -500px;
  padding: 0 10px 20px;
  background: #0D47A1;
  /* background: #455A64; */
  text-align: center;
  transition: left 0.35s;
}
.isOpen {
  left: 0;
}
span, a {
  padding: 10px;
  color: white;
  cursor: pointer;
  text-decoration: none;
}
span:hover, a:hover {
  background: white;
  color: #455A64;
}
a.nuxt-link-active {
  cursor: default;
  background: #41B883;
  color: #455A64;
}
</style>
