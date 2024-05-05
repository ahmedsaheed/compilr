import express from "express";
import cors from "cors";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());

app.post("/compile", async (req, res) => {
  const { code, lang } = req.body;

  if (!requestDataIsOK(code, lang)) {
    return res
      .status(400)
      .json({ message: "Code and lang are required fields" });
  }

  const isCompilable = lang === "java" || lang === "c" || lang === "python";
  let imageName = isCompilable ? `${lang}-compiler` : undefined;

  if (!isCompilable)
    return res.status(400).json({ message: "Invalid language" });

  if (lang === "python") {
    let compiledResult = await runPythonCode(code);
    return res.json({ lang, code, imageName, compiledResult });
  }
});
const requestDataIsOK = (lang: string, code: string): boolean => {
  if (!code || !lang) {
    console.log("Code and lang are required fields");
    return false;
  }
  return true;
};
const runPythonCode = async (code: string): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      exec(
        `docker run --rm -i python-env python -c "${code}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            reject(error);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          resolve(stdout);
        },
      );
    });
  } catch (e) {
    console.error(e);
    return Promise.resolve("null");
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
