const applicationProcessed = (firstName, lastName, institutionName, status) => `
  <h3>Hello ${firstName} ${lastName},</h3>
  <p>Your application for Erasmus program at ${institutionName} has been processed.</p>
  <p>Status: <strong>${status}</strong></p>
  <p><strong>Please log in to Your account and confirm Your application. Remember, if You accept this application You can't accept any other.</strong></p>
  <p>If you have any questions, feel free to contact us.</p>
`;

module.exports = applicationProcessed;
