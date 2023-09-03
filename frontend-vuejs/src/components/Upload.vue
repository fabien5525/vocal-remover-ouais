<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  props: {
    fetchData: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      url: "",
      showModal: false,
    };
  },

  methods: {
    async uploadUrl() {
      try {
        const response = await axios
          .post("http://5525.fr:19001/upload", {
            url: this.url,
          })
          .then(() => {
            this.fetchData();
            console.log("Fetched data");
          });
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
    onInputChange(event: InputEvent | Event) {
      this.url = (event.target as HTMLInputElement).value;
    },
    onSubmit() {
      console.log("Submitted URL:", this.url);
      this.uploadUrl();
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.url = "";
    },
    openModal() {
      this.showModal = true;
    },
  },
});
</script>

<template>
  <div>
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>Enter URL</h2>
          <input v-model="url" placeholder="Enter URL" @input="onInputChange" />
          <br />
          <button class="modal_button" @click="onSubmit">Submit</button>
          <button class="modal_button" @click="closeModal">Close</button>
        </div>
      </div>
    </teleport>
  </div>
  <div>
    <button class="button" @click="openModal">Upload URL</button>
  </div>
</template>

<style scoped>
/* Modal overlay styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal styles */
.modal {
  background: rgb(44, 44, 44);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.button {
  margin: 30px;
}

.modal_button {
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  margin-top: 20px;
}
</style>
