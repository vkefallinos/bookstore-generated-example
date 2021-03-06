import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName
} from "material-ui/styles"
import path from "path"
import bodyParser from "body-parser"
import compress from "compression"
import cors from "cors"
import authorRoutes from "./routes/author.routes"
import readerRoutes from "./routes/reader.routes"
//comment out before building for production
// modules for server side rendering
import ReactDOMServer from "react-dom/server"
import StaticRouter from "react-router-dom/StaticRouter"

import JssProvider from "react-jss/lib/JssProvider"
import { blueGrey, lightGreen } from "material-ui/colors"
//end
const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//comment out before building for production
devBundle.compile(app)

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")))

// mount routes
app.use("/", authorRoutes)
app.use("/", bookRoutes)
app.use("/", readerRoutes)
app.get("*", (req, res) => {
  const sheetsRegistry = new SheetsRegistry()
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: "#8eacbb",
        main: "#607d8b",
        dark: "#34515e",
        contrastText: "#fff"
      },
      secondary: {
        light: "#e7ff8c",
        main: "#b2ff59",
        dark: "#7ecb20",
        contrastText: "#000"
      },
      openTitle: blueGrey["400"],
      protectedTitle: lightGreen["400"],
      type: "light"
    }
  })
  const generateClassName = createGenerateClassName()
  const context = {}
  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <JssProvider
        registry={sheetsRegistry}
        generateClassName={generateClassName}
      >
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          <MainRouter />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  )
  if (context.url) {
    return res.redirect(303, context.url)
  }
  const css = sheetsRegistry.toString()
  res.status(200).send(
    Template({
      markup: markup,
      css: css
    })
  )
})
// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message })
  }
})

export default app
