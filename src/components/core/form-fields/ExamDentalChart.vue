<template>
  <div
    class="column full-width q-px-md q-pt-md q-pb-sm gap-sm"
    style="
      border: 1px solid rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      margin-bottom: 20px;
    "
  >
    <div
      class="full-width row justify-center"
      ref="container"
      style="border: 1px solid rgba(0, 0, 0, 0.1); overflow: auto"
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
      lastLine: null,
      imageLayer: new Konva.Layer(),
      drawingLayer: new Konva.Layer(),
      lines: [],
      deletedLines: [],

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
  },
  methods: {
    undoLastAddedLine() {
      if (this.lines.length === 0) {
        return;
      }

      const line = this.lines.pop();
      line.hide();
      this.drawingLayer.batchDraw();
      this.deletedLines.push(line);
    },
    redoLastDeletedLine() {
      if (this.deletedLines.length === 0) {
        return;
      }

      const line = this.deletedLines.pop();
      line.show();
      this.drawingLayer.batchDraw();
      this.lines.push(line);
    },
    clearLines() {
      this.lines = [];
      this.deletedLines = [];
      this.drawingLayer.destroyChildren();
    },
  },
  mounted() {
    const imgElement = new Image();

    // IMPORTANT TO DEFINE onload FIRST BEFORE DEFINING THE src
    imgElement.onload = (e) => {
      const imgWidth = e.target.width;
      const imgHeight = e.target.height;

      // this.$refs.container.style.height = `${imgHeight}px`;
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

      if (this.modelValue) {
        const parsedJson = JSON.parse(this.modelValue);
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

      this.stage.on("mousedown touchstart", (e) => {
        this.isDrawing = true;
        const pos = e.currentTarget.getPointerPosition();

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

        // prevent scrolling on touch devices
        e.evt.preventDefault();

        const pos = e.currentTarget.getPointerPosition();
        const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
        this.lastLine.points(newPoints);
      });
    };

    imgElement.src = "dental-exam__chart.jpg";
  },
});
</script>
