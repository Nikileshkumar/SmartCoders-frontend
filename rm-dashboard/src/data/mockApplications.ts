// mockApplications.ts

const mockApplications = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    journey: 'Loan',
    status: 'active',
    assignedTo: null,
    auditLogs: [
      {
        note: 'Called the customer for document verification.',
        by: 'RM John',
        date: '2024-07-10 14:10'
      }
    ],
    customerFeedback: [
      {
        message: 'Can I upload scanned documents instead of originals?',
        date: '2024-07-17 10:05',
        read: false
      }
    ]
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '8765432109',
    journey: 'Account Opening',
    status: 'pending',
    assignedTo: null,
    auditLogs: [
      {
        note: 'Customer submitted initial application.',
        by: 'RM Alex',
        date: '2024-07-09 11:00'
      }
    ],
    customerFeedback: [
      {
        message: 'I made a mistake in my address. How can I fix it?',
        date: '2024-07-17 13:20',
        read: false
      }
    ]
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@example.com',
    phone: '7654321098',
    journey: 'Insurance',
    status: 'inactive',
    assignedTo: null,
    auditLogs: [
      {
        note: 'Reached out for premium payment.',
        by: 'RM Sam',
        date: '2024-07-08 09:30'
      }
    ],
    customerFeedback: [
      {
        message: 'Is there a discount for annual payments?',
        date: '2024-07-15 16:45',
        read: true
      }
    ]
  },
  {
    id: 4,
    firstName: 'Bob',
    lastName: 'Williams',
    email: 'bob.williams@example.com',
    phone: '6543210987',
    journey: 'Loan',
    status: 'pending',
    assignedTo: null,
    auditLogs: [
      {
        note: 'Waiting for address verification.',
        by: 'RM Maria',
        date: '2024-07-07 15:20'
      }
    ],
    customerFeedback: []
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Davis',
    email: 'charlie.davis@example.com',
    phone: '5432109876',
    journey: 'Account Opening',
    status: 'active',
    assignedTo: null,
    auditLogs: [
      {
        note: 'Verified KYC documents.',
        by: 'RM Kate',
        date: '2024-07-06 10:45'
      }
    ],
    customerFeedback: [
      {
        message: 'When will my account be activated?',
        date: '2024-07-16 18:30',
        read: false
      },
      {
        message: 'Thanks, I got the confirmation mail.',
        date: '2024-07-17 09:10',
        read: true
      }
    ]
  }
];

export default mockApplications;
