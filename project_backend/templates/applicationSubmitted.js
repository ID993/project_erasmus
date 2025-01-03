const applicationSubmitted = (firstName, lastName, institutionName) => `
  <h3>Hello ${firstName} ${lastName},</h3>
  <p>Your application for the Erasmus program at ${institutionName} has been successfully submitted!</p>
  <p>We will notify you once it's processed.</p>
  <p>Thank you for applying!</p>
`;

module.exports = applicationSubmitted;
