<script lang="ts">
import List from "./components/List.vue";
import Upload from "./components/Upload.vue";
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  components: {
    List,
    Upload,
  },

  data() {
    return {
      songs: [],
    };
  },

  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://5525.fr:19001/");
        console.log("Response:", response.data);
        this.songs = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
});
</script>

<template>
  <div>
    <List :songs="songs" :fetchData="fetchData" />
    <Upload :fetchData="fetchData" />
  </div>
</template>
