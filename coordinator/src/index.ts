import express from "express";
import cors from "cors";
import { exec } from "child_process";

type CompilerResponse = {
  output: string | null;
  error: string | null;
};

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

  let compiledResult;
  switch (lang) {
    case "python":
      compiledResult = await runPythonCode(code);
      return res.json({ compiledResult });
    case "java":
      compiledResult = await compileJavaCode(code);
      return res.json({ compiledResult });
    default:
      break;
  }
});
const requestDataIsOK = (lang: string, code: string): boolean => {
  if (!code || !lang) {
    console.log("Code and lang are required fields");
    return false;
  }
  return true;
};

const runPythonCode = async (code: string): Promise<CompilerResponse> => {
  try {
    return new Promise((resolve, reject) => {
      exec(
        `docker run --rm -i python-env python -c "${code.replace(/"/g, '\\"')}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            resolve({
              output: null,
              error: cleanErrorMessage(error.message, "python"),
            });
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          resolve({
            output: stdout,
            error: null,
          });
        },
      );
    });
  } catch (e) {
    console.error(e);
    return Promise.resolve({
      output: null,
      //@ts-ignore
      error: cleanErrorMessage(e.message, "python"),
    });
  }
};

const compileJavaCode = async (code: string): Promise<CompilerResponse> => {
  return new Promise((resolve, reject) => {
    exec(
      `docker run --rm -i java-env sh -c 'echo "$1" > Main.java && javac Main.java && java Main' -- '${code}'`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          resolve({
            output: null,
            error: cleanErrorMessage(error.message, "java"),
          });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        resolve({
          output: stdout,
          error: null,
        });
      },
    );
  });
};

const cleanErrorMessage = (errorMessage: string, lang: string): string => {
  switch (lang) {
    case "java":
      return errorMessage.replace(
        `Command failed: docker run --rm -i java-env sh -c 'echo "$1" > Main.java && javac Main.java && java Main' -- `,
        "",
      );
    case "python":
      return errorMessage.replace(
        `Command failed: docker run --rm -i python-env python -c `,
        "",
      );
    default:
      return errorMessage;
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
