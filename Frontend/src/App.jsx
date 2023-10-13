import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [Loading, setLoading] = useState(false);

  const uploadFile = (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("myfile", file);
    fetch("http://localhost:3000/util/uploadfile", {
      method: "POST",
      body: fd,
    }).then((res) => {
      if (res.status === 200) {
        toast.success("Audio Uploaded Successfully");
      }
    });
  };

  const Click_ME = () => {
    const file = document.getElementById("prompt").files[0].name;
    console.log(file);
    setLoading(true);
    fetch("http://localhost:3000/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: file }),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 400) {
          toast.error("File Not Supported");
        } else if (res.status === 200) {
          toast.success("Transcribed Successfully");
          return res.json();
        }   
        setLoading(false)
      })
      .then((data) => {
        console.log(data);
        document.getElementById("text_area").value = data.text;
        setLoading(false);
      });
  };

  const translate = () => {
    const text = document.getElementById("text_area").value;
    const lang = document.getElementById("language").value;
    setLoading(true);
    fetch(
      "http://localhost:3000/translate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, lang: lang }),
      },
      toast.success("Request Send .....")
    )
      .then((res) => {
        if (res.status === 200) {
          toast.success("Translated Successfully");
          return res.json();
        }
        setLoading(false);
      })
      .then((data) => {
        console.log(data.data);
        document.getElementById("text_area").value = data.data;
        setLoading(false);
      });
  };

  return (
    <>
      <Toaster></Toaster>
      <div className="container">
        <h2 className="text-light text-center pb-5 ">
          Transcribe Any Audio For Free Through Whisper Api
        </h2>
        <div className="row">
          <div className="col-lg-5 col-md-6 col-sm-12 mt-5">
            <label htmlFor="prompt" className="form-label text-light">
              Upload Your File Here
            </label>
            <input
              className="form-control "
              type="file"
              name="prompt"
              id="prompt"
              accept=".mp3"
              onChange={uploadFile}
            />
            <div className="text-center pt-3">
              <button className="btn btn-primary " onClick={Click_ME}>
                Submit &nbsp;{" "}
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div className="col-lg-7 col-md-6 col-sm-12 mt-5">
            {Loading && (
              <div>
                <p className="text-center font-monospace   text-warning">
                  Please Wait For Some Time <i className="fas fa-clock    "></i>{" "}
                </p>
              </div>
            )}
              
                  <div>
                    <label htmlFor="text_area" className="form-label text-light">
                      Transcribed Text
                    </label>
                    <textarea
                      className="form-control"
                      name="text_area"
                      id="text_area"
                      cols="30"
                      rows="10"
                      placeholder="Transcribed Text Will Be Displayed Here"
                    ></textarea>
                  </div>
            <label htmlFor="translate" className="form-label mt-3 text-light ">
              Translate in :-
            </label>
            <select
              className="form-select "
              name="language"
              id="language"
              onChange={translate}
              defaultValue="Select"
            >
              <option className="form-control" value="Select" disabled>
                Select
              </option>
              <option value="English" className="form-control ">
                English
              </option>
              <option value="French" className="form-control ">
                French
              </option>
              <option value="Hindi" className="form-control ">
                Hindi
              </option>
              <option value="Urdu" className="form-control ">
                Urdu
              </option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
