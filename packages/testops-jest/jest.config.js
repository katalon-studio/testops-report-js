module.exports = {
  reporters: ['default',
    ['.',
      {
        username: "anhle@mailinator.com",
        password: "12345678",
        basePath: "http://localhost:8444",
        projectId: 241,
        reportFolder: "./testops-result",
      }],
  ]
}