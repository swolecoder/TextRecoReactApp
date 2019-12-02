import React from "react";
import JSONPretty from "react-json-pretty";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const axios = require("axios");
var JSONPrettyMon = require("react-json-pretty/dist/monikai");

class ReactUploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      data: [],
      display:false
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillUpdate() {
    //https://techrecobackend.herokuapp.com/  || http://localhost:3000/text
    axios
      .get("https://techrecobackend.herokuapp.com/text")

      .then(res => {
        let d = res.data.filter(e => {
          delete e["_id"];
          delete e["__v"];
          return e;
        });
        let length = 0;
        let displayData = "";
        let e = d.forEach(e => {
          if (e["image"].length > length) {
            displayData = "";
            length = e["image"].length;
            displayData = e["image"];
          }
        });
        this.setState({ display: true });
        return this.setState({ data: displayData });
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
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
    axios
      .post("https://techrecobackend.herokuapp.com/text/upload", formData, config)
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
    console.log(this.state.data)
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" name="myImage" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>

        {/* {this.state.data.length < 1 ? (
          <div style={{paddingTop:"50px"}}>Upload Data Again</div> */}
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "100px",
              alignItems: "center"
            }}
          >
            <h1>Text-Recognition</h1>
            <br />
            {this.state.display && JSON.stringify(this.state.data).replace(/[\n\r]/g,' ')}
          </div>
        )}
      </div>
    );
  }
}

export default ReactUploadImage;
