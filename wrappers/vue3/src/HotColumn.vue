<script lang="ts">
import { defineComponent } from 'vue';
import {
  propFactory,
  findVNodeByType,
  filterPassedProps
} from './helpers';
import {
  HotTableProps,
  HotColumnMethods,
} from './types';

type VNode = any
type Vue = any

  const HotColumn = {
    name: 'HotColumn',
    props: propFactory('HotColumn'),
    inject: ['columnsCache'],
    methods: {
      /**
       * Create the column settings based on the data provided to the `hot-column` component and it's child components.
       */
      // TODO: bring back vue components in cells
      createColumnSettings: function (hotColumnSlots: any): void {
        // const rendererVNode: VNode | null = findVNodeByType(hotColumnSlots, 'hot-renderer');
        // const editorVNode: VNode | null = findVNodeByType(hotColumnSlots, 'hot-editor');
        
        // let usesRendererComponent = false;
        const assignedProps = filterPassedProps(this.$props);
        // if (rendererVNode && usesRendererComponent === false) {  //todo always false
        //   usesRendererComponent = true; //same as usesRendererComponent = !!rendererVNode;
        // }
        let columnSettings = {...assignedProps, usesRendererComponent: false};
        // if (rendererVNode !== null) {
        //   columnSettings.renderer = this.$parent.getRendererWrapper(rendererVNode, this);
        // } else 
        if (assignedProps.renderer) {
          columnSettings.renderer = assignedProps.renderer;
        }
        // if (editorVNode !== null) {
        //   columnSettings.editor = this.$parent.getEditorClass(editorVNode, this);
        // } else 
        if (assignedProps.editor) {
          columnSettings.editor = assignedProps.editor;
        }

        columnSettings.usesRendererComponent = false;
        
        this.columnsCache.set(this, columnSettings)
      }
    },
    mounted: function () {
      this.createColumnSettings([]);
    },
    unmounted: function () {
      this.columnsCache.delete(this)
    },
    render: function () {
      return null;
    }
  };

  export default HotColumn;
  export { HotColumn };
</script>
