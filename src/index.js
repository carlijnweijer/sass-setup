#!/usr/bin/env node
import * as cp from "child_process";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";

const CURR_DIR = process.cwd();
const templatePath = path.join(CURR_DIR, "node_modules/sass-setup/src/sass");
const targetPath = path.join(CURR_DIR, "src/styles");

inquirer
  .prompt([
    {
      type: "confirm",
      name: "create",
      message: "Do you want to install sass as a dependency?",
    },
  ])
  .then((answers) => {
    if (answers.create) {
      cp.execSync("npm i sass");
      console.log("installed sass");
    }
  })
  .then(() => {
    fs.mkdirSync(targetPath);

    createDirectoryContents(templatePath, targetPath);
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.log("Something went wrong", error);
    }
  });

function createDirectoryContents(templatePath, newPath) {
  fs.readdirSync(templatePath).forEach((file) => {
    const origFilePath = path.join(templatePath, file);
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, "utf8");
      const writePath = path.join(newPath, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      const newSubFolder = path.join(newPath, file);
      fs.mkdirSync(newSubFolder);

      if (fs.existsSync(newSubFolder)) {
        createDirectoryContents(
          path.join(templatePath, file),
          path.join(newPath, file)
        );
      } else {
        createDirectoryContents(
          path.join(templatePath, file),
          path.join(newPath, file)
        );
      }
    }
  });
}
