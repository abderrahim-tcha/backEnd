const express = require("express");
const cors = require("cors");
const app = express();

//when back end is sperated from front end use this line for api to work
app.use(cors());

app.get("/data/:chartName", (req, res) => {
  // Get the chart name from the url
  const chartName = req.params.chartName;

  switch (chartName) {
    case "lineChart":
      console.log(chartName);
      const lineChartData = {
        labels: ["2015", "2016", "2017", "2018", "2019", "2020", "2021"],
        dataset: [30, 40, 35, 50, 49, 60, 70],
      };
      res.json(lineChartData);
      break;

    default:
      res.status(404).send("Chart not found");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
