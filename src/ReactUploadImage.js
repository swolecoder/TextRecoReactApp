import React from "react";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const axios = require("axios");
var JSONPrettyMon = require("react-json-pretty/dist/monikai");

class ReactUploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      data: [],
      display: false,
      classificationData: []
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillUpdate() {
    //https://techrecobackend.herokuapp.com/text  || http://localhost:3000/text
    axios
      .get("http://localhost:3000/text")

      .then(res => {
        console.log(res.data);
        let d = res.data.filter(e => {
          delete e["_id"];
          delete e["__v"];
          return e;
        });

        let length = 0;
        let displayData = "";
        let classification = [];
        let e = d.forEach(e => {
          if (e["image"].length > length) {
            displayData = "";
            length = e["image"].length;
            displayData = e["image"];
            classification = [];
            classification = e["classification"];
          }
        });
        this.setState({ display: true });
        this.setState({ classificationData: classification });
        return this.setState({ data: displayData });
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() {});
  }

  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    //https://techrecobackend.herokuapp.com/text/upload
    axios
      .post("http://localhost:3000/text/upload", formData, config)
      .then(response => {
        alert("The file is successfully uploaded");
      })
      .catch(error => {});
  }

  onChange(e) {
    this.setState({ data: "" });
    this.setState({ file: e.target.files[0] });
  }

  render() {
    var documents = [
      {
        classification: "NaturalReader",
        content: '"Listen to PDF, Books,\\nand Webpages.\\nNaturalReader\\n"'
      },
      {
        classification: "ALBERT EINSTEIN",
        content:
          '"LIFE IS LIKE RIDING A\\nBICYCLE. TO KEEP YOUR\\nBALANCE YOU MUST\\nKEEP MOVING.\\nALBERT EINSTEIN\\n"'
      },
      {
        classification: "area-filling",
        content:
          '"I am curious about\\narea-filling text\\nrendering options\\n"'
      }
    ];
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" name="myImage" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>

        {this.state.data.length < 1 ? (
          <div style={{ paddingTop: "50px" }}></div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "100px",
              alignItems: "center"
            }}
          >
            <h2>Text-Recognition</h2>
            <br />
            {this.state.display && JSON.stringify(this.state.data)}
          </div>
        )}

        <div>
          <h2>
            {this.state.classificationData.length > 0 && "Classification Data"}
          </h2>
          {this.state.classificationData.length > 0 && (
            <JSONPretty
              id="json-pretty"
              theme={JSONPrettyMon}
              style={{ fontSize: "1.1em" }}
              data={this.state.classificationData}
              mainStyle="padding:1em"
              valueStyle="font-size:1.5em"
            ></JSONPretty>
          )}
          <div>
            <h2>Pre-Defined Classification Data</h2>
            <JSONPretty
              id="json-pretty"
              theme={JSONPrettyMon}
              style={{ fontSize: "1.1em" }}
              data={documents}
              mainStyle="padding:1em"
              valueStyle="font-size:1.5em"
            ></JSONPretty>
          </div>
        </div>
      </div>
    );
  }
}

export default ReactUploadImage;
