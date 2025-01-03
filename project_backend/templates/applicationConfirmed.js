const applicationConfirmed = (firstName, lastName, institutionName, status) => `
  <h3>Hello ${firstName} ${lastName},</h3>
  <p>Your application for Erasmus program at ${institutionName} has been confirmed.</p>
  <p>New status: <strong>${status}</strong></p>
  <p>If you have any questions, feel free to contact us.</p>
`;

module.exports = applicationConfirmed;
