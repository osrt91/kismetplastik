module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      url: [
        "http://localhost:3000/test/tr",
        "http://localhost:3000/test/tr/urunler",
        "http://localhost:3000/test/tr/hakkimizda",
        "http://localhost:3000/test/tr/iletisim",
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["warn", { minScore: 0.8 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.85 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
