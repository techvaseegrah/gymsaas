module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the source-map-loader rule and exclude face-api.js
      const sourceMapLoaderRule = webpackConfig.module.rules.find(
        (rule) => 
          rule.use && 
          rule.use.some((use) => 
            typeof use === 'object' && 
            use.loader && 
            use.loader.includes('source-map-loader')
          )
      );

      if (sourceMapLoaderRule) {
        // Exclude face-api.js from source map processing
        sourceMapLoaderRule.exclude = [
          ...(sourceMapLoaderRule.exclude || []),
          /node_modules\/face-api\.js/
        ];
      }

      // Ignore ModuleNotFoundError for 'fs' in face-api.js
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false
      };

      // Ignore warnings for specific modules
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        {
          module: /node_modules\/face-api\.js/,
          message: /Can't resolve 'fs'/
        }
      ];

      return webpackConfig;
    }
  }
};