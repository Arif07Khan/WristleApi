import Express from "express";
const app = Express();
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import router_util from "./util.js";
import cors from "cors";
import OpenAI from "openai";

app.use(cors({ origin: "http://localhost:5173" }));

app.use("/util", router_util);

// The model to use for the transcription

app.use(Express.json()); // to support JSON-encoded bodies

// Read the audio file and append it to the FormData object

app.post("/transcribe", (req, res) => {
  const model = "whisper-1";
  const filename = req.body.file;
  const audioPath = `./uploads/${filename}`;

  if (!fs.existsSync(audioPath)) {
    console.log("File not found");
    return;
  } else if (!filename.endsWith(".mp3")) {
    console.log("File not in correct format");
    res.sendStatus(400);
    return;
  } else if (filename.endsWith(".mp3")) {
    const formData = new FormData();
    formData.append("model", model);
    formData.append("file", fs.createReadStream(audioPath), {
      filename: filename,
    });

    console.log("Transcribing audio file ...... ");

    const url = "https://api.openai.com/v1/audio/transcriptions";
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    })
      .then((response) => {
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        console.log("Transcription complete");
        res.json(data);
      })
      .catch((error) => {
        console.error(error);
        res.json({ error: error });
      });
  }
});


app.post("/translate", (req, res) => {
    const language = req.body.lang;
    const paragraph = req.body.text;
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    console.log("Translating text ...... ");
openai.chat.completions.create({
    model:"gpt-3.5-turbo",
    messages:[{
        role:"user",
        content: `Translate to ${language} : ${paragraph}`,
    }]
}).then((response) => {
    res.json({data:response.choices[0].message.content});
    console.log("Translation complete");
}).catch((error) => {
    console.error(error);
    res.json({ error: error });
});
})

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
