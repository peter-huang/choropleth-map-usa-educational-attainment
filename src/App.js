import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";
import * as topojson from "topojson";

const URLS = [
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
];

const COLORS = [
  "#577590",
  "#43aa8b",
  "#90be6d",
  "#f9c74f",
  "#f8961e",
  "#f3722c",
  "#f94144",
];

/*
 * Determines the color of the cell in the heatmap
 *
 * @param curD - current bachelor education attainment
 * @param minP - minimum bachelor education attainment
 * @param maxP - maximum bachelor education attainment
 */
const getCellColor = (curD, minP, maxP) => {
  const increment = maxP / COLORS.length;
  if (curD >= minP && curD < minP + increment) {
    return COLORS[0];
  } else if (curD >= minP + increment * 1 && curD < minP + increment * 2) {
    return COLORS[1];
  } else if (curD >= minP + increment * 2 && curD < minP + increment * 3) {
    return COLORS[2];
  } else if (curD >= minP + increment * 3 && curD < minP + increment * 4) {
    return COLORS[3];
  } else if (curD >= minP + increment * 4 && curD < minP + increment * 5) {
    return COLORS[4];
  } else if (curD >= minP + increment * 5 && curD < minP + increment * 6) {
    return COLORS[5];
  } else if (curD >= minP + increment * 6) {
    return COLORS[6];
  }
};

/*
const URLS = [
  "https://www.peterhuang.net/projects/choropleth-map-usa-educational-attainment/files/counties.json",
  "https://www.peterhuang.net/projects/choropleth-map-usa-educational-attainment/files/for_user_education.json",
];
*/
function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    getData(URLS);
  }, []);

  /*
   * Fetches the json data asynchronously
   *
   * @param urls - array of links to the data source
   */
  const getData = (urls) => {
    Promise.all(urls.map((url) => fetch(url)))
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.log("Error encountered: " + error));
  };

  return (
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex flex-column justify-content-center align-items-center">
          <div>
            <ChoroplethMap data={data} />
          </div>

          <div class="text-center font-weight-bold text-black mt-2 pt-2 d-none">
            Designed and coded by{" "}
            <a class="credits" href="https://github.com/peter-huang">
              Peter Huang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoroplethMap({ data }) {
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      drawChoroplethMap(data);
    }
  }, [data]);

  const drawChoroplethMap = (data) => {
    const topology = data[0];
    const education = data[1];

    const padding = {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    };

    const dim = {
      width: 1000 + padding.left + padding.right,
      height: 500 + padding.top + padding.bottom,
    };

    const axisFactor = {
      top: 2,
      right: 5,
      bottom: 2,
      left: 9,
    };

    // Tooltip
    const tooltip = d3
      .select("#body")
      .append("div")
      .attr("id", "tooltip")
      .attr("style", "position: absolute; opacity: 0;");

    // TItles
    d3.select("#choropleth")
      .append("div")
      .attr("id", "title")
      .text("United States Educational Attainment");
    d3.select("#title")
      .append("div")
      .attr("id", "description")
      .text(
        "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
      );

    const svg = d3
      .select("#choropleth")
      .append("svg")
      .attr("id", "map")
      .attr("width", dim.width)
      .attr("height", dim.height);

    // Polygon datas
    const counties = topology.objects.counties;

    // Data sets
    const countiesDataSet = topojson.feature(topology, counties);

    // Project resize (already projected data)
    const projection = d3
      .geoIdentity()
      .fitSize([dim.width, dim.height], countiesDataSet);

    const path = d3.geoPath().projection(projection);

    const minBachelorPercent = d3.min(education, (d) => d.bachelorsOrHigher);
    const maxBachelorPercent = d3.max(education, (d) => d.bachelorsOrHigher);

    const countiesGroup = svg.append("g").attr("id", "counties");

    console.log(countiesDataSet.features.length);

    // Drawing counties
    countiesGroup
      .selectAll("path")
      .data(countiesDataSet.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("fill", (d) => {
        const t = education.filter((e) => d.id === e.fips);
        return getCellColor(
          t[0].bachelorsOrHigher,
          minBachelorPercent,
          maxBachelorPercent
        );
      })
      .attr("d", path)
      .attr("id", (d) => d.id)
      .attr("data-fips", (d) => {
        const t = education.filter((e) => d.id === e.fips);
        return t[0].fips;
      })
      .attr("data-education", (d) => {
        const t = education.filter((e) => d.id === e.fips);
        return t[0].bachelorsOrHigher;
      })
      .on("mousemove", (d, i) => {
        const eduObj = education.filter((e) => d.id === e.fips);

        let content =
          eduObj[0].area_name +
          ", " +
          eduObj[0].state +
          ": " +
          eduObj[0].bachelorsOrHigher +
          "%";

        tooltip.transition().duration(100).style("opacity", 0.9);
        let pos = d3
          .select(document.getElementsByClassName("county")[i])
          .node()
          .getBoundingClientRect();
        let x = pos.x - window.pageXOffset + "px";
        let y = pos.y - window.pageYOffset + "px";

        tooltip
          .html(content)
          .style("left", x)
          .style("top", y)
          .style("opacity", 0.9)
          .attr("data-education", eduObj[0].bachelorsOrHigher);
      })
      .on("mouseout", (d, i) => {
        //console.log("mouseout");

        tooltip.transition().duration(100).style("opacity", 0);
      });

    // Legend Data
    const tempLegend = () => {
      const arr = [];
      const t = (maxBachelorPercent - minBachelorPercent) / COLORS.length;

      for (let i = 1; i <= COLORS.length; i++) {
        if (i === 1) {
          arr.push(minBachelorPercent);
        } else {
          arr.push(minBachelorPercent + (i - 1) * t);
        }
      }
      return arr;
    };

    // Legend scale and axis setup
    const educationScale = d3.scaleLinear();
    educationScale.domain([minBachelorPercent, maxBachelorPercent]);
    educationScale.range([0, padding.left * axisFactor.left * COLORS.length]);
    const educationScaleAxis = d3
      .axisBottom(educationScale)
      .ticks(COLORS.length)
      .tickValues(tempLegend())
      .tickFormat((d) => d3.format("1.1f")(d) + "%");

    // Add legend with scale and axis
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .style("font-size", "0.75em")
      .style("font-weight", "bold")
      .attr(
        "transform",
        "translate(" + dim.width / 2 + "," + padding.top * axisFactor.top + ")"
      )
      .call(educationScaleAxis);

    // Legend - scale the rects
    for (let i = 0; i < COLORS.length; i++) {
      legend
        .append("rect")
        .attr("width", padding.left * axisFactor.left)
        .attr("height", padding.left * axisFactor.bottom)
        .attr("x", padding.left * axisFactor.left * i)
        .attr("y", -1 * padding.left * axisFactor.bottom)
        .style("fill", COLORS[i])
        .style("stroke-width", 1)
        .style("stroke", "black");
    }
  };

  return (
    <div id="choropleth-container">
      <div id="choropleth"></div>
    </div>
  );
}

export default App;
