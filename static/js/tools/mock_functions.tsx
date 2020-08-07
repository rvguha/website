/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

jest.mock("axios");
import { when } from "jest-when";
import axios from "axios";
import hierarchy from "../../data/hierarchy_top.json";
import { drawGroupLineChart } from "../chart/draw";
import * as d3 from "d3";

export function axios_mock(): void {
  // Mock all the async axios call.
  axios.get = jest.fn();
  // get stats.
  when(axios.get)
    .calledWith("/api/stats/Median_Age_Person?&dcid=geoId/05")
    .mockResolvedValue({
      data: {
        "geoId/05": {
          place_dcid: "geoId/05",
          place_name: "Arkansas",
          provenance_domain: "census.gov",
          data: { "2011": 37.3, "2012": 37.4, "2013": 37.5, "2014": 37.6 },
        },
      },
    });
  // get hierachy.json
  when(axios.get)
    .calledWith("../../data/hierarchy_statsvar.json")
    .mockResolvedValue({ data: hierarchy });

  // get statsvar properties
  when(axios.get)
    .calledWith("/api/stats/stats-var-property?dcid=Median_Age_Person")
    .mockResolvedValue({
      data: {
        Median_Age_Person: { md: "", mprop: "age", pt: "Person", pvs: {} },
      },
    });
  // get place stats vars
  when(axios.get)
    .calledWith("/api/place/statsvars/geoId/05")
    .mockResolvedValue({ data: ["Count_Person", "Median_Age_Person"] });
  // get place names
  when(axios.get)
    .calledWith("/api/place/name?dcid=geoId/05")
    .mockResolvedValue({ data: { "geoId/05": "Place" } });
}

// Mock drawGroupLineChart() as getComputedTextLength can has issue with jest
// and jsdom.
export function drawGroupLineChart_mock(): void {
  (drawGroupLineChart as jest.Mock).mockImplementation(
    (selector: string | HTMLDivElement) => {
      let container: d3.Selection<any, any, any, any>;
      if (typeof selector === "string") {
        container = d3.select("#" + selector);
      } else if (selector instanceof HTMLDivElement) {
        container = d3.select(selector);
      } else {
        return;
      }
      container.selectAll("svg").remove();

      const svg = container
        .append("svg")
        .attr("width", 500)
        .attr("height", 500);
      svg.append("text").text("svg text");
    }
  );
}