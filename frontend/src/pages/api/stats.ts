import type { NextApiRequest, NextApiResponse } from 'next';

const stats = {
  interviews: 1200,
  experts: 45,
  stories: 320,
  users: 800,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(stats);
}
