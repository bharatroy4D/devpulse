
        import {createRequire} from "module";
        const require = createRequire(import.meta.url)
        
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express3 = __toESM(require("express"), 1);

// src/module/issues/issues.route.ts
var import_express = require("express");

// src/db/index.ts
var import_pg = require("pg");

// src/config/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
import_dotenv.default.config({
  path: import_path.default.join(process.cwd(), ".env")
});
var config = {
  databse_string: process.env.DATABASE_URL,
  port: process.env.PORT,
  jwt_secrete: process.env.JWT_SECRETE
};
var config_default = config;

// src/db/index.ts
var pool = new import_pg.Pool({
  connectionString: config_default.databse_string
});
var initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20) NOT NULL,
            email VARCHAR(40) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) 
            CHECK(role IN('contributor','maintainer'))
            DEFAULT ('contributor'),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
    await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL,
            type VARCHAR(30)
            CHECK(type IN('bug', 'feature_request'))
            NOT NULL,
            status VARCHAR(20)
            DEFAULT 'open'
            CHECK (status IN('open', 'in_progress', 'resolved')),
            reporter_id INTEGER NOT NULL REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
    console.log("Database connection successfully");
  } catch (error) {
    console.log("DB error", error);
  }
};

// src/module/issues/issues.service.ts
var createIssuesIntoDB = async (payload, reporterId) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `
    INSERT INTO issues(
    title, description,
    type , reporter_id)
    VALUES($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporterId]
  );
  return result;
};
var getSingleIssuesIntoDB = async (id) => {
  const result = await pool.query(`

  SELECT
   i.*,
    json_build_object(
      'id', u.id,
      'name', u.name,
      'role', u.role
    ) AS reporter
  FROM issues i
  JOIN users u
    ON i.reporter_id = u.id
  WHERE i.id = $1
  `, [id]);
  return result;
};
var getAllIssuesIntoDB = async (sort, type, status) => {
};
var updateIssuesIntoDB = async (issuesId, payload, user) => {
  const issuesResult = await pool.query(`
    SELECT * FROM issues WHERE id=$1
    `, [issuesId]);
  const issues = issuesResult.rows[0];
  if (!issues) {
    throw new Error("issues not found!");
  }
  if (user.role === "contributor") {
    if (issues.reporter_id !== user.id) {
      throw new Error(`
        statusCode:403,
        message:"you can update only your own issues"
        `);
    }
  }
  if (issues.status !== "open") {
    throw new Error(`
      statusCode:409,
      message:"only open issues can be updated"
      `);
  }
  const title = payload.title ?? issues.title;
  const description = payload.description ?? issues.description;
  const type = payload.type ?? issues.type;
  const result = await pool.query(`
    UPDATE issues SET
     title=$1,
    description=$2,
    type=$3,
    updated_at=NOW() 
    WHERE id=$4

    RETURNING *
    `, [title, description, type, issuesId]);
  return result;
};
var deleteIssuesIntoDB = async (id) => {
  const result = await pool.query(`
    DELETE FROM issues WHERE id=$1
    
    `, [id]);
  if (result.rowCount === 0) {
    throw new Error("issues not found");
  }
  return result;
};
var issuesService = {
  createIssuesIntoDB,
  getSingleIssuesIntoDB,
  updateIssuesIntoDB,
  deleteIssuesIntoDB,
  getAllIssuesIntoDB
};

// src/utils/sendResponse.ts
var sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};
var sendResponse_default = sendResponse;

// src/module/issues/issues.controller.ts
var createIssues = async (req, res) => {
  const reporterId = req.user.id;
  try {
    const result = await issuesService.createIssuesIntoDB(req.body, reporterId);
    sendResponse_default(res, 201, {
      success: true,
      message: "issues Create successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, 500, {
      success: true,
      message: "Failed to Create issues ",
      data: error
    });
  }
};
var getSingleIssues = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await issuesService.getSingleIssuesIntoDB(id);
    if (result.rows.length === 0) {
      res.status(500).json({
        success: false,
        message: "issues not found! ",
        data: {}
      });
    }
    sendResponse_default(res, 200, {
      success: true,
      message: "issues retrived successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, 500, {
      success: false,
      message: "issues not found! ",
      data: error
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const { sort, type, status } = req.query;
    const result = await issuesService.getAllIssuesIntoDB(
      sort,
      type,
      status
    );
    res.status(200).json({
      success: true,
      message: "issues retrived successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failt to retrived issues! ",
      error
    });
  }
};
var updateIssues = async (req, res) => {
  try {
    const issuesId = req.params.id;
    const result = await issuesService.updateIssuesIntoDB(issuesId, req.body, req.user);
    sendResponse_default(res, 200, {
      success: true,
      message: "issues update successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, 500, {
      success: false,
      message: "something went wrong! ",
      data: error
    });
  }
};
var deleteIssues = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await issuesService.deleteIssuesIntoDB(id);
    sendResponse_default(res, 200, {
      success: true,
      message: "issues delete successfully",
      data: {}
    });
  } catch (error) {
    sendResponse_default(res, 500, {
      success: false,
      message: "issues delete fail!",
      data: error
    });
  }
};
var issuesController = {
  createIssues,
  getSingleIssues,
  deleteIssues,
  updateIssues,
  getAllIssues
};

// src/middleware/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!"
        });
      }
      const decoded = import_jsonwebtoken.default.verify(token, config_default.jwt_secrete);
      const userData = await pool.query(`
            SELECT * FROM users WHERE email=$1
            `, [decoded.email]);
      const user = userData.rows[0];
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "forbidden"
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/types/index.ts
var USER_ROLE = {
  maintainer: "maintainer",
  contributor: "contributor"
};

// src/module/issues/issues.route.ts
var router = (0, import_express.Router)();
router.post("/", auth_default(), issuesController.createIssues);
router.get("/:id", issuesController.getSingleIssues);
router.get("/:id", issuesController.getAllIssues);
router.patch("/:id", auth_default(), issuesController.updateIssues);
router.delete("/:id", auth_default(USER_ROLE.maintainer), issuesController.deleteIssues);
var issuesRoute = router;

// src/module/auth/auth.route.ts
var import_express2 = require("express");

// src/module/auth/auth.service.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var signUpIntoDB = async (payload) => {
  const { name, password, email, role } = payload;
  const hashPassword = await import_bcryptjs.default.hash(password, 10);
  const result = await pool.query(`
        INSERT INTO users
        (name, password, email,role)
        VALUES($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING *
        `, [name, hashPassword, email, role]);
  delete result.rows[0].password;
  return result;
};
var loginIntoDB = async (payload) => {
  const { email, password } = payload;
  const result = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email]);
  if (result.rows.length === 0) {
    throw new Error("User not found!");
  }
  const user = result.rows[0];
  const matchPassword = await import_bcryptjs.default.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Crediential");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
  const accessToken = await import_jsonwebtoken2.default.sign(jwtPayload, config_default.jwt_secrete, { expiresIn: "1d" });
  delete result.rows[0];
  return { accessToken };
};
var authService = {
  signUpIntoDB,
  loginIntoDB
};

// src/module/auth/auth.controller.ts
var signUp = async (req, res) => {
  try {
    const result = await authService.signUpIntoDB(req.body);
    sendResponse_default(res, 201, {
      success: true,
      message: "User Register Successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, 500, {
      success: false,
      message: "User Register fail!",
      data: error
    });
  }
};
var login = async (req, res) => {
  try {
    const result = await authService.loginIntoDB(req.body);
    sendResponse_default(res, 200, {
      success: true,
      message: "Login Successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, 500, {
      success: true,
      message: "Something went worng",
      data: error
    });
  }
};
var authController = {
  signUp,
  login
};

// src/module/auth/auth.route.ts
var router2 = (0, import_express2.Router)();
router2.post("/signUp", authController.signUp);
router2.post("/login", authController.login);
var authRoute = router2;

// src/app.ts
var import_cors = __toESM(require("cors"), 1);

// src/utils/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = (0, import_express3.default)();
app.use(import_express3.default.json());
app.use((0, import_cors.default)({
  origin: "http://localhost:5000"
}));
app.get("/", (req, res) => {
  res.send("hello devpluse");
});
app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
app_default.listen(config_default.port, () => {
  initDB();
  console.log(`server is running port:${config_default.port}`);
});
//# sourceMappingURL=server.cjs.map