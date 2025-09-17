<template>
  <div class="fit relative-position">
    <div class="fit bg-white flex flex-center" style="z-index: 999">
      <q-spinner v-if="loading" size="md" color="primary" />
    </div>
    <div
      v-show="!loading"
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
import { delay, formatName, formatDate } from "src/helpers/util";
import { examFieldsMap } from "src/helpers/constants.js";

export default {
  name: "PrintoutVisitDetails",
  props: {
    visitId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      // uermLogo: "app/uermLogo",
    }),
    ready() {
      return this.visitId && this.user;
    },
  },
  data() {
    return {
      exams,
      loading: true,
      content: null,
    };
  },
  watch: {
    ready: {
      async handler(val) {
        if (val) {
          await this.getVisitDetails();
          this.renderDocument();
        }
      },
      immediate: true,
    },
  },
  methods: {
    createFooter(currentPage, pageCount, pageSize) {
      return [
        {
          stack: [
            {
              columns: [
                {
                  text: this.content.visit.physician
                    ? "_________________________"
                    : "",
                  alignment: "center",
                  width: "50%",
                },
                { text: "", width: "50%" },
              ],
              fontSize: 9,
            },
            {
              columns: [
                {
                  text: `${
                    this.content.visit.physician
                      ? `${this.content.visit.physician} MD`
                      : ""
                  }`,
                  alignment: "center",
                  width: "50%",
                },
                { text: "", width: "50%" },
              ],
              fontSize: 8,
            },
          ],
          margin: [25, 20, 25, 0],
        },
        {
          layout: "noBorders",
          margin: [25, 20, 25, 0],
          table: {
            widths: ["100%"],
            body: [
              [
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  fontSize: 8,
                  alignment: "center",
                },
              ],
            ],
          },
        },
      ];
    },
    createExamTable(examName, fields, fieldValues) {
      const tableBody = [
        // HEADER
        [
          {
            text: examName,
            colSpan: 2,
            alignment: "center",
            bold: true,
            margin: 2,
          },
          "",
        ],
      ];

      for (const field of fields) {
        tableBody.push([
          { text: field.name, color: "#71797E" },
          { text: fieldValues[field.code] },
        ]);
      }

      return {
        headerRows: 1,
        margin: [0, 0, 0, 10],
        style: { fontSize: 8 },
        table: {
          widths: ["auto", "*"],
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex, node, columnIndex) => {
            return rowIndex % 2 === 0 ? "#F1F1F1" : null;
          },
          hLineWidth: (rowIndex, node) => {
            return rowIndex === 0 || rowIndex === node.table.body.length
              ? 0.5
              : 0;
          },
          vLineWidth: (rowIndex, node) => {
            return rowIndex === 0 || rowIndex === node.table.widths.length
              ? 0.5
              : 0;
          },
          hLineColor: (rowIndex, node) => {
            return rowIndex === 0 || rowIndex === node.table.body.length
              ? "#E0E0E0"
              : "rgba(0, 0, 0, 1)";
          },
          vLineColor: (rowIndex, node) => {
            return rowIndex === 0 || rowIndex === node.table.widths.length
              ? "#E0E0E0"
              : "rgba(0, 0, 0, 1)";
          },
        },
      };
    },
    createContentBody() {
      const examCodesToTableColIndexMap = {
        MED_HIST: 0,
        PE: 0,
        RAD_XR_CHST: 0,
        LAB_CBC: 1,
        LAB_URI: 1,
        LAB_FCL: 1,
      };

      const tableBodyCols = [[], []];

      for (const i in this.exams) {
        const exam = this.exams[i];

        if (
          this.content.exams[exam.code] &&
          Object.keys(this.content.exams[exam.code]).length > 0
        ) {
          tableBodyCols[examCodesToTableColIndexMap[exam.code] ?? 0].push(
            this.createExamTable(
              exam.name.toUpperCase(),
              examFieldsMap[exam.code],
              this.content.exams[exam.code]
            )
          );
        }
      }

      return {
        headerRows: 1,
        margin: [0, 0, 0, 0],
        table: {
          widths: ["50%", "50%"],
          body: [[{ stack: tableBodyCols[0] }, { stack: tableBodyCols[1] }]],
        },
        layout: "noBorders",
      };
    },
    renderDocument() {
      const documentDefinition = {
        // by default we use portrait, you can change it to landscape if you wish
        // pageOrientation: "landscape",
        info: {
          title: `VISIT DETAILS - ${this.content.patient.identificationCode}`,
          // author: "",
          // subject: "",
          // keywords: "",
        },
        // watermark: {
        //   text: "PATIENT COPY",
        //   color: "blue",
        //   opacity: 0.05,
        //   bold: false,
        //   italics: false,
        // },
        pageSize: "LETTER",
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [25, 190, 25, 90], // Body margins. Change top or bottom to resize the header or footer respectively.
        header: [
          {
            stack: [
              {
                columns: [
                  // [
                  //   {
                  //     image: this.uermLogo,
                  //     width: 55,
                  //     height: 55,
                  //   },
                  // ],
                  { text: "", width: "*" },
                  {
                    stack: [
                      {
                        text: "UNIVERSITY OF THE EAST\nRAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.",
                        alignment: "center",
                        fontSize: 10,
                        margin: [0, 0, 0, 5],
                      },
                      {
                        text: "64 Aurora Blvd. Brgy. Doña Imelda\nQuezon City, Philippines\nTel. No.: 715-0861 loc. 360",
                        alignment: "center",
                        bold: false,
                      },
                    ],
                    width: "auto",
                  },
                  { text: "", width: "*" },
                ],
                columnGap: 10,
                margin: [0, 0, 0, 20],
              },
              {
                table: {
                  widths: ["100%"],
                  body: [[{ text: "", border: [false, true] }]],
                },
              },
              {
                table: {
                  widths: ["auto", "*", "auto", "*"],
                  body: [
                    [
                      {
                        text: "Patient Name:",
                        border: [],
                      },
                      {
                        text: formatName(
                          this.content.patient.firstName,
                          this.content.patient.middleName,
                          this.content.patient.lastName,
                          this.content.patient.extName
                        ),
                        bold: true,
                        border: [],
                      },
                      { text: "Data & Time Visited:", border: [] },
                      {
                        text: formatDate(this.content.visit.dateTimeCreated),
                        bold: true,
                        border: [],
                      },
                    ],
                    [
                      { text: "Physician Name:", border: [] },
                      {
                        text: this.content.visit.physician,
                        bold: true,
                        border: [],
                      },
                      { text: "Data & Time Completed:", border: [] },
                      {
                        text: formatDate(this.content.visit.dateTimeCompleted),
                        bold: true,
                        border: [],
                      },
                    ],
                  ],
                },
                style: "noBorders",
                margin: [0, 0, 0, 5],
              },
              {
                table: {
                  widths: ["100%"],
                  body: [[{ text: "", border: [false, true] }]],
                },
              },
              {
                table: {
                  widths: ["100%"],
                  body: [
                    [
                      {
                        text: "ANNUAL PHYSICAL EXAM",
                        alignment: "center",
                        bold: true,
                        fontSize: 11,
                        fillColor: "#F1F1F1",
                        margin: [0, 5, 0, 5],
                      },
                    ],
                  ],
                },
                layout: "noBorders",
                margin: [0, 10, 0, 0],
              },
            ],
            style: ["fontNormal"],
            margin: [25, 10, 25, 0],
          },
        ],
        content: this.createContentBody(),
        footer: this.createFooter, // INTENTIONAL FUNCTION PASSING, NO INVOCATION
        styles: {
          fontHeader: {
            fontSize: 11,
            bold: true,
            margin: [0, 10, 0, 10],
          },
          fontNormal: {
            fontSize: 9,
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
    formatResponse(response) {
      const ret = {
        patient: response.patient,
        visit: response.visit,
        exams: {},
      };

      for (const exam of this.exams) {
        ret.exams[exam.code] = response.details
          .filter((e) => e.examCode === exam.code)
          .map((e) => {
            return [
              e.code,
              `${e.value == null || e.value === "" ? "" : e.value}${
                e.unit ? " ".concat(e.unit) : ""
              }${e.normalRange ? " (".concat(e.normalRange).concat(")") : ""}`,
              ...(e.remarks ? [e.remarks] : []),
            ];
          })
          .reduce((acc, e) => {
            acc[e[0]] = e[1];
            if (e[2]) acc.REMARKS = e[2];
            return acc;
          }, {});
      }

      return ret;
    },
    async getVisitDetails() {
      this.loading = true;

      const response = await this.$store.dispatch(
        "ape/getVisitDetailsAll",
        this.visitId
      );

      await delay(2000);

      if (response.error) {
        console.log(response.error);
        this.loading = false;
        return;
      }

      this.content = this.formatResponse(response.body);
      this.loading = false;
    },
  },
};
</script>
