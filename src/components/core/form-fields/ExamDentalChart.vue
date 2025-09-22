<template>
  <div
    class="column full-width q-pa-md gap-sm"
    style="
      border: 1px solid rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      margin-bottom: 20px;
    "
  >
    <div class="full-width column items-center gap-sm">
      <div
        ref="container"
        :style="isScrolling ? { cursor: 'move' } : {}"
        style="border: 1px solid rgba(0, 0, 0, 0.1); overflow: hidden"
      ></div>
      <div class="row">
        <q-btn
          dense
          unelevated
          round
          icon="sym_o_undo"
          class="text-primary"
          @click="undoLastAddedLine"
        >
          <q-tooltip>Undo Last Added Stroke</q-tooltip>
        </q-btn>
        <q-btn
          dense
          unelevated
          round
          icon="sym_o_redo"
          class="text-primary"
          @click="redoLastDeletedLine"
        >
          <q-tooltip>Redo Last Undone Stroke</q-tooltip>
        </q-btn>
        <q-btn
          dense
          unelevated
          round
          icon="sym_o_close"
          class="text-primary"
          @click="clearLines"
        >
          <q-tooltip>Clear Strokes</q-tooltip>
        </q-btn>
        <q-btn
          dense
          unelevated
          round
          icon="sym_o_replay"
          class="text-primary"
          @click="resetLines"
        >
          <q-tooltip>Reset Changes</q-tooltip>
        </q-btn>
        <q-separator vertical class="q-mx-sm" />
        <q-btn
          dense
          unelevated
          round
          :class="isScrolling ? 'bg-primary text-white' : 'text-primary'"
          icon="sym_o_pan_tool"
          class="text-primary"
          @click="isScrolling = !isScrolling"
        >
          <q-tooltip>Toggle Pan Mode On/Off</q-tooltip>
        </q-btn>
        <q-btn
          dense
          unelevated
          round
          icon="sym_o_view_compact_alt"
          class="text-primary"
          @click="resetViewport"
        >
          <q-tooltip>Reset Viewport</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Konva from "konva";

export default defineComponent({
  name: "FormFieldExamDentalChart",
  props: {
    label: {
      type: String,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      stage: null,
      isDrawing: false,
      isScrolling: false,
      lastLine: null,
      imageLayer: new Konva.Layer(),
      drawingLayer: new Konva.Layer(),
      lines: [],
      deletedLines: [],

      initialValue: null,
      value: null,
    };
  },
  computed: {
    rules() {
      return this.value.value == null || this.value.value === ""
        ? []
        : [
            (val) =>
              val == null || val === "" ? "This field is required." : undefined,
          ];
    },
  },
  watch: {
    value: {
      handler(v) {
        this.$emit("update:modelValue", v);
      },
      immediate: false,
    },
    isScrolling(v) {
      this.stage.setAttr("draggable", v);
    },
  },
  methods: {
    undoLastAddedLine() {
      if (this.lines.length === 0) {
        return;
      }

      const line = this.lines.pop();
      this.drawingLayer.removeChildren();
      this.drawingLayer.add(...this.lines);
      this.deletedLines.push(line);
    },
    redoLastDeletedLine() {
      if (this.deletedLines.length === 0) {
        return;
      }

      const line = this.deletedLines.pop();
      this.drawingLayer.add(line);
      this.lines.push(line);
    },
    clearLines() {
      if (this.lines.length === 0) {
        return;
      }

      this.deletedLines = [...this.lines];
      this.lines = [];
      this.drawingLayer.removeChildren();
    },
    resetLines() {
      this.clearLines();

      if (this.initialValue) {
        const parsedJson = JSON.parse(this.initialValue);
        const drawingLayer = parsedJson.children[1];

        const lines = drawingLayer.children.map((e) => {
          return new Konva.Line({
            ...e.attrs,
          });
        });

        this.lines = lines;
        this.drawingLayer.add(...lines);
        this.value = this.stage.toJSON();
      }
    },
    resetViewport() {
      this.stage.position({ x: 0, y: 0 });
      this.stage.batchDraw();
    },
  },
  mounted() {
    if (this.modelValue) {
      this.initialValue = this.modelValue;
    }

    const imgElement = new Image();

    // IMPORTANT TO DEFINE onload FIRST BEFORE DEFINING THE src
    imgElement.onload = (e) => {
      const imgWidth = e.target.width;
      const imgHeight = e.target.height;

      this.$refs.container.height = imgHeight;

      this.stage = new Konva.Stage({
        container: this.$refs.container,
        width: imgWidth,
        height: imgHeight,
      });

      this.imageLayer.add(
        new Konva.Image({
          x: 0,
          y: 0,
          width: imgWidth,
          height: imgHeight,
          image: e.target,
        })
      );

      this.stage.add(this.imageLayer);
      this.stage.add(this.drawingLayer);
      this.resetLines();

      this.stage.on("mousedown touchstart", (e) => {
        if (this.isScrolling) {
          return;
        }

        this.isDrawing = true;
        const pos = e.currentTarget.getRelativePointerPosition();

        this.lastLine = new Konva.Line({
          stroke: "#0d47a1",
          strokeWidth: 2,
          globalCompositeOperation: "brush",
          // round cap for smoother lines
          lineCap: "round",
          lineJoin: "round",
          // add point twice, so we have some drawings even on a simple click
          points: [pos.x, pos.y, pos.x, pos.y],
        });

        this.drawingLayer.add(this.lastLine);
        this.lines.push(this.lastLine);
      });

      this.stage.on("mouseup touchend mouseleave", (e) => {
        this.isDrawing = false;
        this.value = e.currentTarget.toJSON();
      });

      this.stage.on("mousemove touchmove", (e) => {
        if (!this.isDrawing) {
          return;
        }

        const pos = e.currentTarget.getRelativePointerPosition();

        const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
        this.lastLine.points(newPoints);
      });
    };

    imgElement.src = "dental-exam__chart.jpg";
  },
});
</script>
