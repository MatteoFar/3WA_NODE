const pug = require("pug");
const format = require("./formatTime");
const { FormatTime } = format;
const { APP_LOCALHOST, APP_PORT } = process.env;
const fs = require("fs");

exports.RenderPage = function (link, res, code, req) {
  fs.readFile("./Data/student.json", "utf8", (err, data) => {
    if (data == undefined) {
      res.writeHead(404);
      res.end("error");
      return;
    }
    let parsing = JSON.parse(data);
    let students = parsing.students;

    students.forEach((s) => {
      s.birth = FormatTime(s.birth);
    });
    try {
      const renderTemplate = pug.compileFile(link, {
        pretty: true,
      });
      const result = renderTemplate({ students });
      res.writeHeader(code, "Content-Type", "text/html");
      res.end(result);
    } catch (err) {
      console.log("Erreur lors de la compilation :\n");
      console.log(err.message);
    }
    if (req?.method === "POST") {
      switch (req.url) {
        case "/":
          let body = "";

          req.on("data", (data) => {
            body += data;
          });

          req.on("end", () => {
            const data = body.split("&");

            let newStudent = {
              name: data[0].replace("name=", ""),
              birth: data[1].replace("trip-start=", ""),
            };

            fs.readFile("Data/student.json", function (err, data) {
              let json = JSON.parse(data);
              json.students.push(newStudent);
              if (err) {
                console.log(err);
                return;
              }

              fs.writeFileSync(
                "Data/student.json",
                JSON.stringify(json),
                function (err, list) {
                  if (err) {
                    console.log("erreur");
                    return;
                  }
                }
              );
            });

            res.writeHead(301, {
              Location: `http://${APP_LOCALHOST}:${APP_PORT}`,
            });
            res.end();
          });
          break;
        case "/users":
          console.log("2");
          let body1 = "";

          req.on("data", (data) => {
            body1 += data;
          });

          req.on("end", () => {
            let name = body1.replace("button=", "");

            const m = students.filter((s) => s.name !== name);

            students.length = 0;
            students.push.apply(students, m);

            fs.readFile("Data/student.json", function (err, data) {
              let json = JSON.parse(data);
              json.students = m;
              if (err) {
                console.log(err);
                return;
              }

              fs.writeFileSync(
                "Data/student.json",
                JSON.stringify(json),
                function (err, list) {
                  if (err) {
                    console.log("erreur");
                    return;
                  }
                }
              );
            });

            res.writeHead(301, {
              Location: `http://${APP_LOCALHOST}:${APP_PORT}`,
            });
            res.end();
          });
          break;
        default:
          break;
      }
    }
  });
};
