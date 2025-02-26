const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const DASHBOARD_ACCESS = process.env.DASHBOARD_ACCESS;

router.get("/:chartName", verifyToken, (req, res) => {
  const chartName = req.params.chartName;

  //the user trying to access the chart we got its info from verifyToken middleware
  const currentUser = req.user.username;
  const currentUserAuthLevel = req.user.authlevel;

  if (currentUserAuthLevel < DASHBOARD_ACCESS) {
    return res.status(403).json({
      message: "Access denied. You do not have the required permission",
    });
  }
  switch (chartName) {
    case "lineChart":
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

module.exports = router;
