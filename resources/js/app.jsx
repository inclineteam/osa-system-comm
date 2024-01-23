import "./bootstrap";
import "../css/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/custom.css";
import "boxicons/css/boxicons.min.css";
import "../css/style.css";
import "react-toastify/dist/ReactToastify.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";
import "react-quill/dist/quill.snow.css";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";
<<<<<<< HEAD

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// const googleClientId =
// "975156131635-fa69r5835sj96sjp52cfrn6u7hlluaiq.apps.googleusercontent.com";
=======
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// const googleClientId =
//   "975156131635-fa69r5835sj96sjp52cfrn6u7hlluaiq.apps.googleusercontent.com";
>>>>>>> b38224b9fdfc5bb040c53b26c8dede7a5de7b3a8

axios.defaults.baseURL = import.meta.env.VITE_APP_URL + "/api";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

createInertiaApp({
  title: (title) => `${title ? title + " - " : title} ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob("./Pages/**/*.jsx")
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <GoogleOAuthProvider
        onScriptLoadError={(err) => console.log("google oauth error: ", err)}
        clientId={googleClientId}
      >
        <App {...props} />
      </GoogleOAuthProvider>
    );
  },
  progress: {
    color: "#4B5563",
  },
});
