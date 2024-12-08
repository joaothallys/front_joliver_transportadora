const navigations = [
  //{ name: "Dashboard", path: "/dashboard/default", icon: "dashboard" },
  { label: "Ferramentas", type: "label" },
  {
    name: "Ferramentas",
    icon: "favorite",
    badge: { value: "8+", color: "secondary" },
    children: [
      { name: "Clientes", path: "/material/customers", iconText: "C" },
      { name: "Cidades", path: "/material/city", iconText: "C" },

      { name: "Estado", path: "/material/state", iconText: "E" },

      { name: "Pessoa Fisica", path: "/material/progress", iconText: "PF" },
      { name: "Pessoa Jurídica", path: "/material/pj", iconText: "PJ" },
      //{ name: "Switch", path: "/material/switch", iconText: "S" },
      { name: "Frete", path: "/material/frete", iconText: "F" },
      { name: "Funcionarios", path: "/material/employee", iconText: "F" },
      { name: "Dashboard", path: "/material/table", iconText: "D" }
    ]
  },
  // {
  //   name: "Charts",
  //   icon: "trending_up",
  //   children: [{ name: "Echarts", path: "/charts/echarts", iconText: "E" }]
  // },
  {
    name: "Documentation",
    icon: "launch",
    type: "extLink",
    path: "http://demos.ui-lib.com/matx-react-doc/"
  }
];

export default navigations;
