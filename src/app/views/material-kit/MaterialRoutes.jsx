import { lazy } from "react";
import Loadable from "app/components/Loadable";

//const AppForm = Loadable(lazy(() => import("./forms/AppForm")));
//const AppMenu = Loadable(lazy(() => import("./menu/AppMenu")));
const AppIcon = Loadable(lazy(() => import("./icons/AppIcon")));
const AppProgress = Loadable(lazy(() => import("./AppProgress")));
const AppRadio = Loadable(lazy(() => import("./radio/AppRadio")));
const AppTable = Loadable(lazy(() => import("./pessoaFisica/AppTable")));
//const AppSwitch = Loadable(lazy(() => import("./switch/AppSwitch")));
const AppSlider = Loadable(lazy(() => import("./slider/AppSlider")));
const AppButton = Loadable(lazy(() => import("./gerenciamento/manage")));
const AppSnackbar = Loadable(lazy(() => import("./snackbar/AppSnackbar")));
const AppAutoComplete = Loadable(lazy(() => import("./auto-complete/AppAutoComplete")));

const materialRoutes = [
  { path: "/material/table", element: <AppTable /> },
  //{ path: "/material/form", element: <AppForm /> },
  { path: "/material/city", element: <AppButton /> },
  { path: "/material/state", element: <AppIcon /> },
  { path: "/material/progress", element: <AppProgress /> },
  //{ path: "/material/menu", element: <AppMenu /> },
  //{ path: "/material/switch", element: <AppSwitch /> },
  { path: "/material/pj", element: <AppRadio /> },
  { path: "/material/frete", element: <AppSlider /> },
  { path: "/material/customers", element: <AppAutoComplete /> },
  { path: "/material/employee", element: <AppSnackbar /> }
];

export default materialRoutes;
