const WORLD_TOPOJSON_URL = "https://vega.github.io/vega-datasets/data/world-110m.json";
const MALAYSIA_GEOJSON_URL = "https://raw.githubusercontent.com/nullifye/malaysia.geojson/refs/heads/master/malaysia.state.geojson";
const POVERTY_2022_URL = "data/poverty_2022.csv";
const POVERTY_HISTORY_URL = "data/poverty_history.csv";
const INCOME_HISTORY_URL = "data/income_history.csv";
const INCOME_2022_URL = "data/income_2022.csv";
const INCOME_POVERTY_2022_URL = "data/income_poverty_2022.csv";
const EXPENDITURE_STATE_YEAR_URL = "data/expenditure_state_year.csv";
const LIVING_PRESSURE_2022_URL = "data/living_pressure_2022.csv";

const COLORS = {
  poverty: "#2f5f8f",
  povertyDark: "#203f63",
  povertyLight: "#dbe5ee",
  hardcore: "#3f4f7f",
  relative: "#b08a45",
  income: "#667f99",
  incomeLight: "#b7c8d8",
  expenditure: "#9a7246",
  pressure: "#6d6384",
  ink: "#252a32",
  muted: "#696862",
  grid: "#ded4c6",
  land: "#e8dfd2"
};

const povertyScale = ["#eef3f7", "#b9cddd", "#6f96b8", "#203f63"];
const expenditureScale = ["#fbf5e9", "#dfc99d", "#b08a45", "#765331"];
const pressureScale = ["#f0edf2", "#c6bfd1", "#9287a4", "#514765"];
const stateDomain = [
  "W.P. Kuala Lumpur",
  "Selangor",
  "Johor",
  "Sarawak",
  "Kelantan",
  "Sabah"
];
const stateRange = [
  "#35689A",
  "#2F7F7B",
  "#9A7048",
  "#C28B22",
  "#7B3151",
  "#B45A48"
];
const stateColorScale = { domain: stateDomain, range: stateRange };
const fitAutosize = { type: "fit", contains: "padding" };

const baseConfig = {
  background: "transparent",
  view: { stroke: null },
  axis: {
    labelFont: "Helvetica",
    titleFont: "Helvetica",
    labelColor: "#66635e",
    titleColor: "#252a32",
    gridColor: "#ded4c6",
    domainColor: "#c8bcab",
    tickColor: "#c8bcab",
    labelFontSize: 11,
    titleFontSize: 12,
    titleFontWeight: 700
  },
  legend: {
    labelFont: "Helvetica",
    titleFont: "Helvetica",
    labelColor: "#66635e",
    titleColor: "#252a32",
    labelFontSize: 11,
    titleFontSize: 12,
    titleFontWeight: 700
  },
  header: {
    labelFont: "Helvetica",
    titleFont: "Helvetica"
  }
};

const geoStateTransforms = [
  {
    calculate:
      "datum.properties.name || datum.properties.NAME_1 || datum.properties.shapeName || datum.properties.state || datum.properties.NAME || datum.properties.State",
    as: "geo_state_raw"
  },
  {
    calculate:
      "replace(replace(replace(replace(replace(replace(datum.geo_state_raw, 'Penang', 'Pulau Pinang'), 'Kuala Lumpur', 'W.P. Kuala Lumpur'), 'Putrajaya', 'W.P. Putrajaya'), 'Labuan', 'W.P. Labuan'), 'Wilayah Persekutuan ', 'W.P. '), 'Federal Territory of ', 'W.P. ')",
    as: "state"
  }
];

const selectedStates = [...stateDomain];
const selectedStateFilter = `indexof(${JSON.stringify(selectedStates)}, datum.state) >= 0`;
const incomeGapOrder = [
  "W.P. Putrajaya",
  "W.P. Kuala Lumpur",
  "Selangor",
  "Melaka",
  "Pulau Pinang",
  "Johor",
  "Sabah",
  "Negeri Sembilan",
  "Sarawak",
  "Terengganu",
  "W.P. Labuan",
  "Perak",
  "Kelantan",
  "Kedah",
  "Pahang",
  "Perlis"
];
const hardcorePovertyOrder = [
  "Sabah",
  "Kelantan",
  "Sarawak",
  "Kedah",
  "Perak",
  "Terengganu",
  "Johor",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perlis",
  "Pulau Pinang",
  "Selangor",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya"
];

// Figure 01: geographic distribution.
const mapPoverty = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 500,
  autosize: fitAutosize,
  padding: { left: 16, right: 16, top: 16, bottom: 16 },
  projection: { type: "mercator", center: [109, 4], scale: 2750 },
  layer: [
    {
      data: {
        url: WORLD_TOPOJSON_URL,
        format: { type: "topojson", feature: "countries" }
      },
      mark: {
        type: "geoshape",
        fill: COLORS.land,
        stroke: "#cfc2b0",
        strokeWidth: 0.5
      }
    },
    {
      data: {
        url: MALAYSIA_GEOJSON_URL,
        format: { type: "json", property: "features" }
      },
      transform: [
        ...geoStateTransforms,
        {
          lookup: "state",
          from: {
            data: { url: POVERTY_2022_URL },
            key: "state",
            fields: ["poverty_absolute", "poverty_hardcore", "poverty_relative"]
          }
        }
      ],
      mark: { type: "geoshape", stroke: "#fffaf2", strokeWidth: 1 },
      encoding: {
        color: {
          field: "poverty_absolute",
          type: "quantitative",
          title: "Absolute poverty (%)",
          scale: { range: povertyScale },
          legend: {
            orient: "bottom",
            direction: "horizontal",
            offset: 16,
            gradientLength: 240,
            gradientThickness: 13,
            titleLimit: 180,
            labelLimit: 80
          }
        },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "poverty_absolute", type: "quantitative", title: "Absolute poverty", format: ".1f" },
          { field: "poverty_hardcore", type: "quantitative", title: "Hardcore poverty", format: ".1f" },
          { field: "poverty_relative", type: "quantitative", title: "Relative poverty", format: ".1f" }
        ]
      }
    }
  ],
  config: baseConfig
};

// Figure 02: precise state ranking.
const absolutePovertyRank = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 390,
  autosize: fitAutosize,
  data: { url: POVERTY_2022_URL },
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 3 },
      encoding: {
        x: {
          field: "poverty_absolute",
          type: "quantitative",
          title: "Absolute poverty rate (%)"
        },
        y: {
          field: "state",
          type: "nominal",
          title: null,
          sort: { field: "poverty_absolute", order: "descending" }
        },
        color: {
          condition: {
            test: "indexof(['Sabah','Kelantan','Sarawak'], datum.state) >= 0",
            value: COLORS.povertyDark
          },
          value: COLORS.poverty
        },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "poverty_absolute", type: "quantitative", title: "Absolute poverty (%)", format: ".1f" }
        ]
      }
    },
    {
      mark: { type: "text", align: "left", baseline: "middle", dx: 5, font: "Helvetica", fontSize: 11 },
      encoding: {
        x: { field: "poverty_absolute", type: "quantitative" },
        y: {
          field: "state",
          type: "nominal",
          sort: { field: "poverty_absolute", order: "descending" }
        },
        text: { field: "poverty_absolute", type: "quantitative", format: ".1f" },
        color: { value: COLORS.ink }
      }
    }
  ],
  config: baseConfig
};

// Figure 03: small values shown without area distortion.
const hardcorePovertyDot = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 405,
  autosize: fitAutosize,
  padding: { left: 6, right: 8, top: 8, bottom: 6 },
  data: { url: POVERTY_2022_URL },
  layer: [
    {
      mark: { type: "rule", color: "#c8c2ce", strokeWidth: 2 },
      encoding: {
        x: { datum: 0, type: "quantitative", title: "Hardcore poverty rate (%)" },
        x2: { field: "poverty_hardcore", type: "quantitative" },
        y: {
          field: "state",
          type: "nominal",
          title: null,
          sort: hardcorePovertyOrder
        }
      }
    },
    {
      mark: { type: "circle", size: 115, color: COLORS.hardcore, stroke: "#fffaf2", strokeWidth: 1 },
      encoding: {
        x: {
          field: "poverty_hardcore",
          type: "quantitative",
          title: "Hardcore poverty rate (%)"
        },
        y: {
          field: "state",
          type: "nominal",
          title: null,
          sort: hardcorePovertyOrder
        },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "poverty_hardcore", type: "quantitative", title: "Hardcore poverty (%)", format: ".1f" }
        ]
      }
    }
  ],
  config: baseConfig
};

// Figure 04: parallel coordinates with scores normalised across all states per dimension.
const povertyParallel = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 410,
  autosize: fitAutosize,
  padding: { left: 8, right: 12, top: 22, bottom: 10 },
  data: { url: POVERTY_2022_URL },
  transform: [
    {
      fold: ["poverty_relative", "poverty_absolute", "poverty_hardcore"],
      as: ["dimension_key", "value"]
    },
    {
      calculate: "toNumber(datum.value)",
      as: "numeric_value"
    },
    {
      calculate:
        "datum.dimension_key == 'poverty_relative' ? 'Relative poverty' : datum.dimension_key == 'poverty_absolute' ? 'Absolute poverty' : 'Hardcore poverty'",
      as: "dimension"
    },
    {
      calculate:
        "datum.dimension_key == 'poverty_relative' ? 1 : datum.dimension_key == 'poverty_absolute' ? 2 : 3",
      as: "dimension_order"
    },
    {
      joinaggregate: [{ op: "max", field: "numeric_value", as: "dimension_max" }],
      groupby: ["dimension"]
    },
    {
      calculate: "datum.dimension_max > 0 ? datum.numeric_value / datum.dimension_max * 100 : 0",
      as: "normalised_score"
    },
    {
      filter: "indexof(['Sabah','Sarawak','Johor','Selangor'], datum.state) >= 0"
    }
  ],
  layer: [
    {
      data: {
        values: [
          { dimension: "Relative poverty" },
          { dimension: "Absolute poverty" },
          { dimension: "Hardcore poverty" }
        ]
      },
      mark: {
        type: "rule",
        color: "#bfb6a8",
        strokeWidth: 1.6
      },
      encoding: {
        x: {
          field: "dimension",
          type: "nominal",
          sort: ["Relative poverty", "Absolute poverty", "Hardcore poverty"]
        },
        y: {
          datum: 0,
          type: "quantitative",
          scale: { domain: [0, 100], nice: false }
        },
        y2: { datum: 100 }
      }
    },
    {
      mark: {
        type: "line",
        strokeWidth: 2.8,
        opacity: 0.88
      },
      encoding: {
        x: {
          field: "dimension",
          type: "nominal",
          title: "Poverty dimension",
          sort: ["Relative poverty", "Absolute poverty", "Hardcore poverty"],
          axis: {
            labelAngle: 0,
            labelFontSize: 12,
            labelExpr: "split(datum.label, ' ')",
            labelLineHeight: 14,
            labelPadding: 7,
            titleFontSize: 13,
            titlePadding: 12
          }
        },
        y: {
          field: "normalised_score",
          type: "quantitative",
          title: "Normalised poverty score (%)",
          scale: { domain: [0, 100], nice: false },
          axis: {
            values: [0, 25, 50, 75, 100],
            labelExpr: "datum.value + '%'",
            grid: true,
            gridColor: "#ded4c6",
            gridOpacity: 0.18,
            domain: false,
            tickColor: "#cfc4b5"
          }
        },
        color: {
          field: "state",
          type: "nominal",
          title: "State",
          scale: stateColorScale,
          legend: {
            orient: "bottom",
            direction: "horizontal",
            columns: 4,
            offset: 12,
            values: ["Sabah", "Sarawak", "Johor", "Selangor"]
          }
        },
        detail: { field: "state" },
        order: { field: "dimension_order", type: "quantitative" },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "dimension", type: "nominal", title: "Dimension" },
          { field: "numeric_value", type: "quantitative", title: "Original rate (%)", format: ".1f" },
          { field: "normalised_score", type: "quantitative", title: "Normalised score (%)", format: ".1f" }
        ]
      }
    },
    {
      mark: {
        type: "point",
        filled: true,
        size: 82,
        opacity: 0.92,
        stroke: "#fffaf2",
        strokeWidth: 1
      },
      encoding: {
        x: {
          field: "dimension",
          type: "nominal",
          sort: ["Relative poverty", "Absolute poverty", "Hardcore poverty"]
        },
        y: {
          field: "normalised_score",
          type: "quantitative",
          scale: { domain: [0, 100], nice: false }
        },
        color: {
          field: "state",
          type: "nominal",
          scale: stateColorScale,
          legend: null
        },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "dimension", type: "nominal", title: "Dimension" },
          { field: "numeric_value", type: "quantitative", title: "Original rate (%)", format: ".1f" },
          { field: "normalised_score", type: "quantitative", title: "Normalised score (%)", format: ".1f" }
        ]
      }
    }
  ],
  config: baseConfig
};

// Figure 05: long-run income trajectories with a user-controlled highlight.
const incomeTrend = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 410,
  autosize: fitAutosize,
  data: { url: INCOME_HISTORY_URL },
  params: [
    {
      name: "highlightState",
      value: "Sabah",
      bind: {
        input: "select",
        name: "Highlight state: ",
        options: selectedStates
      }
    }
  ],
  transform: [
    { filter: selectedStateFilter },
    { filter: "datum.income_median != null" },
    { filter: "year(datum.date) >= 1999" }
  ],
  mark: { type: "line", point: { filled: true, size: 72 }, interpolate: "monotone" },
  encoding: {
    x: { field: "date", type: "temporal", title: "Year", axis: { format: "%Y" } },
    y: {
      field: "income_median",
      type: "quantitative",
      title: "Median monthly household income (RM)"
    },
    color: {
      field: "state",
      type: "nominal",
      title: "State",
      scale: stateColorScale,
      legend: { orient: "bottom", direction: "horizontal", columns: 3 }
    },
    opacity: {
      condition: { test: "datum.state == highlightState", value: 1 },
      value: 0.42
    },
    strokeWidth: {
      condition: { test: "datum.state == highlightState", value: 3.6 },
      value: 2.3
    },
    detail: { field: "state" },
    tooltip: [
      { field: "state", type: "nominal", title: "State" },
      { field: "date", type: "temporal", title: "Year", format: "%Y" },
      { field: "income_median", type: "quantitative", title: "Median income (RM)", format: ",.0f" }
    ]
  },
  config: baseConfig
};

// Figure 06: distribution signal through mean-median distance.
const incomeDumbbell = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 430,
  autosize: fitAutosize,
  padding: { left: 6, right: 8, top: 8, bottom: 6 },
  data: { url: INCOME_2022_URL },
  transform: [
    { calculate: "datum.income_mean - datum.income_median", as: "income_gap" }
  ],
  layer: [
    {
      mark: { type: "rule", color: "#b8afa3", strokeWidth: 2.5 },
      encoding: {
        x: {
          field: "income_median",
          type: "quantitative",
          title: "Monthly household income (RM)"
        },
        x2: { field: "income_mean", type: "quantitative" },
        y: {
          field: "state",
          type: "nominal",
          title: null,
          sort: incomeGapOrder
        },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "income_median", type: "quantitative", title: "Median (RM)", format: ",.0f" },
          { field: "income_mean", type: "quantitative", title: "Mean (RM)", format: ",.0f" }
        ]
      }
    },
    {
      transform: [
        { fold: ["income_median", "income_mean"], as: ["income_measure", "income_value"] },
        {
          calculate: "datum.income_measure == 'income_median' ? 'Median income' : 'Mean income'",
          as: "measure_label"
        }
      ],
      mark: { type: "circle", size: 80, stroke: "#fffaf2", strokeWidth: 1 },
      encoding: {
        x: { field: "income_value", type: "quantitative" },
        y: {
          field: "state",
          type: "nominal",
          title: null,
          sort: incomeGapOrder
        },
        color: {
          field: "measure_label",
          type: "nominal",
          title: null,
          scale: {
            domain: ["Median income", "Mean income"],
            range: [COLORS.income, COLORS.relative]
          }
        },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "measure_label", type: "nominal", title: "Measure" },
          { field: "income_value", type: "quantitative", title: "Income (RM)", format: ",.0f" }
        ]
      }
    }
  ],
  config: baseConfig
};

// Figure 07: relationship and exception detection.
const incomePovertyScatter = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 430,
  autosize: fitAutosize,
  data: { url: INCOME_POVERTY_2022_URL },
  layer: [
    {
      mark: { type: "circle", size: 125, opacity: 0.86, stroke: "#fffaf2", strokeWidth: 1 },
      encoding: {
        x: {
          field: "income_median",
          type: "quantitative",
          title: "Median monthly household income (RM)"
        },
        y: {
          field: "poverty_absolute",
          type: "quantitative",
          title: "Absolute poverty rate (%)"
        },
        color: {
          field: "poverty_absolute",
          type: "quantitative",
          title: "Poverty (%)",
          scale: { range: povertyScale },
          legend: {
            orient: "bottom",
            direction: "horizontal",
            gradientLength: 180,
            gradientThickness: 12,
            offset: 12
          }
        },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "income_median", type: "quantitative", title: "Median income (RM)", format: ",.0f" },
          { field: "poverty_absolute", type: "quantitative", title: "Poverty (%)", format: ".1f" }
        ]
      }
    },
    {
      transform: [{ regression: "poverty_absolute", on: "income_median" }],
      mark: { type: "line", color: COLORS.ink, strokeDash: [6, 5], strokeWidth: 2 },
      encoding: {
        x: { field: "income_median", type: "quantitative" },
        y: { field: "poverty_absolute", type: "quantitative" }
      }
    },
    {
      transform: [{ filter: "indexof(['Sabah','Kelantan','Sarawak'], datum.state) >= 0" }],
      mark: { type: "text", align: "left", dx: 8, dy: -7, font: "Helvetica", fontSize: 11, fontWeight: "bold" },
      encoding: {
        x: { field: "income_median", type: "quantitative" },
        y: { field: "poverty_absolute", type: "quantitative" },
        text: { field: "state" },
        color: { value: COLORS.povertyDark }
      }
    }
  ],
  config: baseConfig
};

// Figure 08: movement within the state poverty hierarchy.
const povertyBump = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 410,
  autosize: fitAutosize,
  data: { url: POVERTY_HISTORY_URL },
  transform: [
    { filter: "datum.poverty_absolute != null" },
    { filter: "year(datum.date) >= 2012" },
    { calculate: "timeFormat(toDate(datum.date), '%Y')", as: "survey_year" },
    {
      window: [{ op: "rank", as: "poverty_rank" }],
      sort: [{ field: "poverty_absolute", order: "descending" }],
      groupby: ["date"]
    },
    { filter: selectedStateFilter }
  ],
  layer: [
    {
      mark: { type: "line", point: { filled: true, size: 70 }, strokeWidth: 2.5 },
      encoding: {
        x: {
          field: "survey_year",
          type: "ordinal",
          title: "Survey year",
          sort: ["2012", "2014", "2016", "2019", "2020", "2022"],
          axis: { labelAngle: 0 }
        },
        y: {
          field: "poverty_rank",
          type: "quantitative",
          title: "Poverty rank (1 = highest poverty rate)",
          scale: { reverse: true, domain: [1, 16] },
          axis: {
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            tickMinStep: 1,
            labelOverlap: false
          }
        },
        color: {
          field: "state",
          type: "nominal",
          title: "State",
          scale: stateColorScale,
          legend: { orient: "bottom", direction: "horizontal", columns: 3, offset: 14 }
        },
        detail: { field: "state" },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "survey_year", type: "nominal", title: "Year" },
          { field: "poverty_rank", type: "quantitative", title: "Rank", format: ".0f" },
          { field: "poverty_absolute", type: "quantitative", title: "Poverty (%)", format: ".1f" }
        ]
      }
    }
  ],
  config: baseConfig
};

// Figure 09: state-by-year spending matrix.
const expenditureHeatmap = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 260,
  autosize: fitAutosize,
  data: { url: EXPENDITURE_STATE_YEAR_URL },
  transform: [
    { calculate: "timeFormat(toDate(datum.date), '%Y')", as: "survey_year" }
  ],
  mark: { type: "rect", cornerRadius: 2, stroke: "#fffaf2", strokeWidth: 1 },
  encoding: {
    x: {
      field: "state",
      type: "nominal",
      title: null,
      sort: { field: "avg_expenditure", op: "mean", order: "descending" },
      axis: { labelAngle: -35, labelFontSize: 10, labelLimit: 95 }
    },
    y: {
      field: "survey_year",
      type: "ordinal",
      sort: "descending",
      title: "Year",
      axis: { labelAngle: 0 }
    },
    color: {
      field: "avg_expenditure",
      type: "quantitative",
      title: "Average expenditure (RM)",
      scale: { range: expenditureScale },
      legend: {
        orient: "bottom",
        direction: "horizontal",
        gradientLength: 220,
        gradientThickness: 12
      }
    },
    tooltip: [
      { field: "state", type: "nominal", title: "State" },
      { field: "survey_year", type: "nominal", title: "Year" },
      { field: "avg_expenditure", type: "quantitative", title: "Expenditure (RM)", format: ",.0f" }
    ]
  },
  config: baseConfig
};

// Figure 10: multivariate synthesis with quadrant references.
const livingPressureBubble = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: "container",
  height: 500,
  autosize: fitAutosize,
  padding: { left: 8, right: 62, top: 20, bottom: 12 },
  data: { url: LIVING_PRESSURE_2022_URL },
  transform: [
    {
      joinaggregate: [
        { op: "mean", field: "income_median", as: "mean_income" },
        { op: "mean", field: "avg_expenditure", as: "mean_expenditure" }
      ]
    }
  ],
  layer: [
    {
      mark: { type: "rule", color: "#a8a097", strokeDash: [5, 5], strokeWidth: 1.3 },
      encoding: {
        x: {
          field: "mean_income",
          type: "quantitative",
          scale: { domain: [3000, 12000], nice: false, zero: false }
        }
      }
    },
    {
      mark: { type: "rule", color: "#a8a097", strokeDash: [5, 5], strokeWidth: 1.3 },
      encoding: {
        y: {
          field: "mean_expenditure",
          type: "quantitative",
          scale: { domain: [2800, 9600], nice: false, zero: false }
        }
      }
    },
    {
      mark: { type: "circle", opacity: 0.82, stroke: "#fffaf2", strokeWidth: 1.2 },
      encoding: {
        x: {
          field: "income_median",
          type: "quantitative",
          title: "Median monthly household income (RM)",
          scale: { domain: [3000, 12000], nice: false, zero: false }
        },
        y: {
          field: "avg_expenditure",
          type: "quantitative",
          title: "Average monthly household expenditure (RM)",
          scale: { domain: [2800, 9600], nice: false, zero: false }
        },
        size: {
          field: "poverty_absolute",
          type: "quantitative",
          title: "Absolute poverty (%)",
          scale: { range: [80, 1150] },
          legend: null
        },
        color: {
          field: "living_pressure",
          type: "quantitative",
          title: ["Household pressure:", "expenditure-to-income ratio"],
          scale: { range: pressureScale },
          legend: null
        },
        tooltip: [
          { field: "state", type: "nominal", title: "State" },
          { field: "income_median", type: "quantitative", title: "Median income (RM)", format: ",.0f" },
          { field: "avg_expenditure", type: "quantitative", title: "Expenditure (RM)", format: ",.0f" },
          { field: "poverty_absolute", type: "quantitative", title: "Poverty (%)", format: ".1f" },
          { field: "living_pressure", type: "quantitative", title: "Pressure ratio", format: ".2f" }
        ]
      }
    },
    {
      transform: [
        { filter: "datum.state == 'W.P. Putrajaya'" }
      ],
      mark: { type: "text", align: "left", baseline: "middle", dx: 8, dy: -12, font: "Helvetica", fontSize: 11, fontWeight: "bold" },
      encoding: {
        x: {
          field: "income_median",
          type: "quantitative",
          scale: { domain: [3000, 12000], nice: false, zero: false }
        },
        y: {
          field: "avg_expenditure",
          type: "quantitative",
          scale: { domain: [2800, 9600], nice: false, zero: false }
        },
        text: { field: "state" },
        color: { value: COLORS.ink }
      }
    },
    {
      transform: [
        { filter: "datum.state == 'W.P. Kuala Lumpur'" }
      ],
      mark: { type: "text", align: "left", baseline: "middle", dx: 8, dy: 12, font: "Helvetica", fontSize: 11, fontWeight: "bold" },
      encoding: {
        x: {
          field: "income_median",
          type: "quantitative",
          scale: { domain: [3000, 12000], nice: false, zero: false }
        },
        y: {
          field: "avg_expenditure",
          type: "quantitative",
          scale: { domain: [2800, 9600], nice: false, zero: false }
        },
        text: { field: "state" },
        color: { value: COLORS.ink }
      }
    },
    {
      transform: [
        { filter: "indexof(['Kelantan','Sabah'], datum.state) >= 0" }
      ],
      mark: { type: "text", align: "left", baseline: "middle", dx: -50, dy: 20, font: "Helvetica", fontSize: 11, fontWeight: "bold" },
      encoding: {
        x: {
          field: "income_median",
          type: "quantitative",
          scale: { domain: [3000, 12000], nice: false, zero: false }
        },
        y: {
          field: "avg_expenditure",
          type: "quantitative",
          scale: { domain: [2800, 9600], nice: false, zero: false }
        },
        text: { field: "state" },
        color: { value: COLORS.ink }
      }
    },
    {
      data: {
        values: [
          { x: 9500, y: 8500, x2: 10056, y2: 8897 },
          { x: 4075, y: 5100, x2: 3900, y2: 3550 }
        ]
      },
      mark: { type: "rule", color: "#9b958d", strokeWidth: 0.9 },
      encoding: {
        x: {
          field: "x",
          type: "quantitative",
          scale: { domain: [3000, 12000], nice: false, zero: false }
        },
        y: {
          field: "y",
          type: "quantitative",
          scale: { domain: [2800, 9600], nice: false, zero: false }
        },
        x2: { field: "x2" },
        y2: { field: "y2" }
      }
    },
    {
      data: {
        values: [
          { x: 7600, x2: 9500, y: 8250, y2: 8750 },
          { x: 3150, x2: 5000, y: 5100, y2: 5550 }
        ]
      },
      mark: {
        type: "rect",
        fill: "#f4eee4",
        stroke: "#cfc4b5",
        strokeWidth: 0.8,
        cornerRadius: 4,
        opacity: 0.9
      },
      encoding: {
        x: {
          field: "x",
          type: "quantitative",
          scale: { domain: [3000, 12000], nice: false, zero: false }
        },
        x2: { field: "x2" },
        y: {
          field: "y",
          type: "quantitative",
          scale: { domain: [2800, 9600], nice: false, zero: false }
        },
        y2: { field: "y2" }
      }
    },
    {
      data: {
        values: [
          {
            x: 8550,
            y: 8572,
            label: "High income also comes with\nhigh monthly expenditure."
          },
          {
            x: 4075,
            y: 5400,
            label: "Darker colour bubble shows\nhigher spending pressure."
          }
        ]
      },
      mark: {
        type: "text",
        align: "center",
        baseline: "middle",
        lineBreak: "\n",
        lineHeight: 12,
        font: "Helvetica",
        fontSize: 9.5,
        fontWeight: 600,
        color: COLORS.povertyDark
      },
      encoding: {
        x: {
          field: "x",
          type: "quantitative",
          scale: { domain: [3000, 12000], nice: false, zero: false }
        },
        y: {
          field: "y",
          type: "quantitative",
          scale: { domain: [2800, 9600], nice: false, zero: false }
        },
        text: { field: "label" }
      }
    }
  ],
  config: baseConfig
};

const embedOptions = { actions: false, renderer: "canvas" };

vegaEmbed("#map_poverty", mapPoverty, embedOptions);
vegaEmbed("#abs_poverty_rank", absolutePovertyRank, embedOptions);
vegaEmbed("#hardcore_poverty_dot", hardcorePovertyDot, embedOptions);
vegaEmbed("#poverty_parallel", povertyParallel, embedOptions);
vegaEmbed("#income_trend", incomeTrend, embedOptions);
vegaEmbed("#income_dumbbell", incomeDumbbell, embedOptions);
vegaEmbed("#income_poverty_scatter", incomePovertyScatter, embedOptions);
vegaEmbed("#poverty_bump", povertyBump, embedOptions);
vegaEmbed("#expenditure_heatmap", expenditureHeatmap, embedOptions);
vegaEmbed("#living_pressure_bubble", livingPressureBubble, embedOptions);