<template>
  <div class="fit relative-position">
    <div
      id="iframeContainer"
      class="fit absolute"
      style="left: 0; top: 0"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import pdfMake from "pdfmake";
import pdfMakeFonts from "src/helpers/pdfmake-vfs.js";

export default {
  name: "PrintoutChecklist",
  props: {
    patientInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  mounted() {
    this.renderDocument();
  },
  methods: {
    renderDocument() {
      const documentDefinition = {
        // by default we use portrait, you can change it to landscape if you wish
        // pageOrientation: "landscape",
        info: {
          title: `UERMMMCI INFIRMARY APE`,
          // author: "",
          // subject: "",
          // keywords: "",
        },
        pageSize: {
          width: 215.433,
          height: 215.433,
        },
        // pageSize: "LETTER",
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [25, 100, 25, 25], // Body margins. Change top or bottom to resize the header or footer respectively.
        header: [
          {
            stack: [
              {
                columns: [
                  { text: "", width: "*" },
                  {
                    stack: [
                      {
                        text: "UERMMMCI INFIRMARY APE",
                        alignment: "center",
                        fontSize: 10,
                        margin: [0, 0, 0, 5],
                      },
                    ],
                    width: "auto",
                  },
                  { text: "", width: "*" },
                ],
                columnGap: 10,
                margin: [0, 0, 0, 10],
              },
              // {
              //   table: {
              //     widths: ["100%"],
              //     body: [[{ text: "", border: [false, true] }]],
              //   },
              // },
              {
                table: {
                  widths: ["auto", "*"],
                  body: [
                    [
                      { text: "ID:", border: [] },
                      {
                        text:
                          this.patientInfo["Student Number"] ??
                          this.patientInfo["Employee Number"],
                        bold: true,
                        border: [],
                      },
                    ],
                    [
                      {
                        text: "Name:",
                        border: [],
                      },
                      {
                        text: this.patientInfo.Fullname,
                        border: [],
                      },
                    ],
                    [
                      { text: "Date:", border: [] },
                      {
                        text: this.patientInfo["Date & Time Registered"],
                        bold: true,
                        border: [],
                      },
                    ],
                  ],
                },
                style: "noBorders",
                margin: [0, 0, 0, 5],
              },
            ],
            style: ["fontNormal"],
            margin: [25, 10, 25, 0],
          },
        ],
        content: {
          table: {
            widths: ["*", "*"],
            body: this.createContentBody(),
          },
          style: ["fontBody"],
          margin: [0, 0, 0, 5],
        },
        styles: {
          fontHeader: {
            fontSize: 11,
            bold: true,
            margin: [0, 10, 0, 10],
          },
          fontNormal: {
            fontSize: 9,
          },
          fontBody: {
            fontSize: 8,
          },
          leftAlign: {
            alignment: "left",
          },
          footerStyle: {
            bold: true,
            alignment: "left",
          },
          tableStyle: {},
        },
      };

      pdfMake.vfs = pdfMakeFonts;
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

      pdfDocGenerator.getDataUrl((dataUrl) => {
        const targetElement = document.querySelector("#iframeContainer");
        const iframe = document.createElement("iframe");
        iframe.src = dataUrl;
        iframe.height = "100%";
        iframe.width = "100%";
        iframe.style.cssText = "z-index: 1; position: absolute; border: 0;";
        targetElement.appendChild(iframe);
      });
    },
    createContentBody() {
      const body = [
        [
          {
            text: "PE",
            alignment: "center",
          },
          { text: "     " },
        ],
        [
          {
            text: "X-RAY",
            alignment: "center",
          },
          { text: "     " },
        ],
        [
          {
            text: "CBC",
            alignment: "center",
          },
          { text: "     " },
        ],
        [
          {
            text: "URINE",
            alignment: "center",
          },
          { text: "     " },
        ],
      ];

      if (
        this.patientInfo.Affiliation === "Employee/Faculty" &&
        this.patientInfo.Campus === "Caloocan"
      ) {
        body.push([
          {
            text: "STOOL",
            alignment: "center",
          },
          { text: "     " },
        ]);
      }

      return body;
    },
  },
};
</script>
