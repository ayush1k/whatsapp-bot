module.exports = {
  industry: 'Real Estate',
  qualifyingQuestions: [
    'Which city/location are you looking for?',
    'Are you looking for a flat, villa, or plot? Is it for investment or personal use?',
    'What’s your budget range?',
    'When are you planning to move or invest?',
    'Would you like to schedule a site visit?',
  ],
  classificationRules: {
    hot: (metadata) => {
      return (
        metadata.location &&
        metadata.propertyType &&
        metadata.budget &&
        metadata.timeline &&
        metadata.timeline.toLowerCase().includes('month')
      );
    },
    cold: (metadata) => {
      return (
        metadata.intent?.toLowerCase().includes('just browsing') ||
        !metadata.budget ||
        metadata.engagement === 'low'
      );
    },
    invalid: (metadata) => {
      return metadata.fake === true || metadata.gibberish === true;
    },
  }
};
