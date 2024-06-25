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
import { delay } from "src/helpers/util";
import { exams, examsMap, examFieldsMap } from "src/helpers/constants.js";

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
      exams: [{ code: "MEDHIST", name: "Medical History" }, ...exams],
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
    createTableWidths() {
      return Array(12).fill("8.333333333333333%");
    },
    createTableTextCells(
      text,
      colSpan = 1,
      rowSpan = 1,
      padded = false,
      bordered = true,
      additionalStyles = {}
    ) {
      return [
        {
          colSpan,
          rowSpan,
          text,
          border: additionalStyles.border
            ? additionalStyles.border
            : Array(4).fill(bordered),
          margin: padded ? Array(4).fill(2) : Array(4).fill(0),
          ...additionalStyles,
        },
        ...Array(colSpan - 1).fill(""), // "Spanned" or occupied columns must still have cells
      ];
    },
    createFooter(currentPage, pageCount, pageSize) {
      return [
        {
          layout: "noBorders",
          margin: [25, 20, 25, 0],
          table: {
            widths: ["70%", "30%"],
            body: [
              [
                {
                  // text: "Print Date & Time: " + formatDate(new Date()),
                  text: "Official STATEMENT OF ACCOUNT can be requested at the Billing Section of UERMMMC.",
                  fontSize: 9,
                  alignment: "left",
                  italics: true,
                  bold: true,
                },
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  fontSize: 9,
                  alignment: "right",
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
        this.createTableTextCells(examName, 12, 1, true, true, {
          alignment: "center",
          fontSize: 10,
          bold: true,
        }),
      ];

      for (const field of fields) {
        tableBody.push([
          ...this.createTableTextCells(field.name, 4, 1, true, true, {
            fontSize: 9,
          }),
          ...this.createTableTextCells(
            fieldValues[field.code],
            8,
            1,
            true,
            true,
            { fontSize: 9 }
          ),
        ]);
      }

      if (fieldValues.REMARKS) {
        tableBody.push([
          ...this.createTableTextCells("Remarks", 4, 1, true, true, {
            fontSize: 9,
          }),
          ...this.createTableTextCells(fieldValues.REMARKS, 8, 1, true, true, {
            fontSize: 9,
          }),
        ]);
      }

      return {
        headerRows: 1,
        margin: [0, 0, 0, 10],
        style: ["fontNormal"],
        table: {
          widths: this.createTableWidths(),
          body: tableBody,
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex > 1 && rowIndex % 2 === 0 ? "#E8E8E8" : null;
          },
        },
      };
    },
    createContentBody() {
      const tableBodyCols = [[], []];

      for (const i in this.exams) {
        const exam = this.exams[i];

        if (
          this.content.exams[exam.code] &&
          Object.keys(this.content.exams[exam.code]).length > 0
        ) {
          tableBodyCols[i % 2].push(
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
        style: ["fontNormal"],
        table: {
          widths: ["50%", "50%"],
          body: [[{ stack: tableBodyCols[0] }, { stack: tableBodyCols[1] }]],
        },
        layout: "noBorders",
      };
    },
    renderDocument() {
      const documentDefinition = {
        info: {
          title: `VISIT DETAILS - ${this.content.patient.identificationCode}`,
          // author: `${this.user.lastName}, ${this.user.firstName} ${this.user.middleName}`,
          // subject: this.content.type.name,
          // keywords: `${this.content.type.name} - ${this.content.case.code}`,
        },
        // by default we use portrait, you can change it to landscape if you wish
        // pageOrientation: "landscape",
        // watermark: {
        //   text: "PATIENT COPY",
        //   color: "blue",
        //   opacity: 0.05,
        //   bold: false,
        //   italics: false,
        // },
        pageSize: "LETTER",
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [25, 240, 25, 60], // Body margins. Change top or bottom to resize the header or footer respectively.
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
                  {
                    text: "",
                    width: "*",
                  },
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
                  {
                    text: "",
                    width: "*",
                  },
                ],
                columnGap: 10,
                table: {
                  widths: this.createTableWidths(),
                  body: [
                    [...this.createTableTextCells("", 4, 1, false, false)],
                  ],
                },
                margin: [25, 10, 25, 0],
              },
            ],
            style: ["headerStyle", "fontNormal"],
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
          headerStyle: {
            bold: true,
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
        // MEDHIST AND PE ARE ALREADY FORMATTED. LEAVE AS IS.
        if (["MEDHIST", "PE"].includes(exam.code)) {
          ret.exams[exam.code] = response[exam.code];
          continue;
        }

        ret.exams[exam.code] = response.diagResults
          .filter((e) => e.diagCode === exam.code)
          .map((e) => {
            return [
              e.diagParamCode,
              `${e.diagParamValue}${
                e.diagParamUnit ? " ".concat(e.diagParamUnit) : ""
              }${
                e.diagParamNormalRange
                  ? " (".concat(e.diagParamNormalRange).concat(")")
                  : ""
              }`,
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
