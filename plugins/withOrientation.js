const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withOrientation(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainActivity = androidManifest.manifest.application[0].activity.find(
      (activity) => activity.$['android:name'] === '.MainActivity'
    );

    if (mainActivity) {
      // Remove screenOrientation to allow both portrait and landscape
      delete mainActivity.$['android:screenOrientation'];
    }

    return config;
  });
};
