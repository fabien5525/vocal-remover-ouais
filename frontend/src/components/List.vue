<script lang="ts">
export default {
  props: {
    songs: {
      type: Array as () => Array<{
        name: string;
        original_url: string;
        instruments_url: string;
        vocals_url: string;
      }>,
      required: true,
    },
    fetchData: {
      type: Function,
      required: true,
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<template>
  <div>
    <h1>List of Songs</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Original</th>
          <th>Instrumental</th>
          <th>Vocals</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in songs" :key="item.name">
          <td>{{ item.name }}</td>
          <td>
            <audio id="musicPlayer" controls>
              <source :src="item.original_url" type="audio/mp3" />
            </audio>
          </td>
          <td>
            <audio id="musicPlayer" controls>
              <source :src="item.instruments_url" type="audio/mp3" />
            </audio>
          </td>
          <td>
            <audio id="musicPlayer" controls>
              <source :src="item.vocals_url" type="audio/mp3" />
            </audio>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  border: 1px solid #ddd;
  width: 100%;
}

th,
td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}
</style>
