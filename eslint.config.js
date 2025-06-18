module.exports = {
  overrides: [
    {
      files: [
        "src/app/dashboard/Clic-Up/page.tsx",
        "src/app/dashboard/Clic-Up/Usuarios/page.tsx",
        "src/app/dashboard/Clic-Up/Chats/page.tsx",
        "src/app/dashboard/Clic-Up/Avisos/page.tsx",
        "src/components/SearchAvisos.tsx",
        "src/components/App1Avisos.tsx",
        "src/components/Loading.tsx",
        "src/components/HomeWelcome.tsx",
        "src/components/HomeNav.tsx",
        "src/components/HomeHeader.tsx",
        "src/components/HomeGradient.tsx",
        "src/components/**.tsx",
      ],
      rules: {
        "no-unused-vars": "off",
        "react-hooks/exhaustive-deps": "off",
      },
    },
  ],
};