<template>
  <div id="advanced-editor-example" class="hot">
    <HotTable :settings="hotSettings">
<!--      <HotColumn :width="150">-->
<!--&lt;!&ndash;        <StarsRating></StarsRating>&ndash;&gt;-->
<!--      </HotColumn>-->
<!--      <HotColumn v-for="n in 2" :width="150" v-bind:key="'col' + n">-->
<!--&lt;!&ndash;        <ColorPicker></ColorPicker>&ndash;&gt;-->
<!--      </HotColumn>-->
    </HotTable>
  </div>
</template>
<script>

import {HotTable} from "../../dist/vue-handsontable";
  
console.log(HotTable)
  debugger;


export default {
  data: function() {
    return {
      hotSettings: {
        data: [
          [1, "#2269EC", "#E1E7F3"],
          [2, "#A1E3CD", "#E5ECE4"],
          [3, "#A7DEA2", "#E4E8DA"],
          [4, "#ABE025", "#D4E1E6"],
          [5, "#018FC5", "#E8D3D7"],
          [5, "#FF1E49", "#D0D7E4"]
        ],
        fillHandle: false,
        copyPaste: false,
        licenseKey: "non-commercial-and-evaluation",
        rowHeaders: true,
        colHeaders: ["Rating", "Active star color", "Inactive star color"],
        autoRowSize: false,
        autoColumnSize: false
      }
    };
  },
  created: function() {
    // this.$store.commit("initStarColors", this.hotSettings.data);
  },
  methods: {},
  components: {
    HotTable,
    // HotColumn,
    // ColorPicker,
    // StarsRating
  }
}

</script>

<style>
button {
  width: 100%;
  height: 33px;
  margin-top: 10px;
}

.vc-chrome {
  box-shadow: none;
}
</style>

