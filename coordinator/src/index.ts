import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());

app.post("/compile", (req, res) => {
  const { code, lang } = req.body;
  if (!code || !lang) {
    console.log("Code and lang are required fields");
    return res
      .status(400)
      .json({ message: "Code and lang are required fields" });
  }
  const isCompilable = lang === "java" || lang === "c" || lang === "python";
  let imageName = isCompilable ? `${lang}-compiler` : undefined;
  console.log(lang, code, imageName);
  imageName != undefined
    ? res.json({ lang, code, imageName })
    : res.status(400).json({ message: "Invalid language" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
