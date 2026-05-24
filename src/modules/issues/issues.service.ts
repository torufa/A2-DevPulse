import { pool } from "../../db";
import type { IIssue, IIssueQuery } from "./issues.interface";



const createIssueIntoDB = async (payload: IIssue, reporter_id: number) => {
  const { title, description, type, status } = payload;

  const result = await pool.query(
    `
        INSERT INTO issues(title, description, type, status, reporter_id) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `,
    [title, description, type, status, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async(query: IIssueQuery) => {
  const sort = query.sort || 'newest'

  const issuesData = await pool.query(`
    SELECT * FROM issues
    ${
      query?.type && query?.status
        ? `WHERE type='${query.type}' AND status='${query.status}'`
        : query?.type
          ? `WHERE type='${query.type}'`
          : query?.status
            ? `WHERE status='${query.status}'`
            : ""
    }
    ORDER BY issues.created_at ${sort === "newest" ? "DESC" : "ASC"}
  `);

  const usersData = await pool.query(`
    SELECT id, name, role FROM users
  `)
  const hashTableOfUserData = usersData.rows.reduce(
    (table, currentUser) => {
      table[currentUser.id] = currentUser;
      return table;
    },
    {} as Record<number, any>,
  );

  const result = issuesData.rows.map((issue) => {
    issue.reporter = hashTableOfUserData?.[issue.reporter_id] || null;
    delete issue.reporter_id;
    return issue;
  });

  return result;
};


const getSingleIssueFromDB = async (id: string) => {
  const issueData = await pool.query(`
    SELECT * FROM issues
    WHERE id=$1
    `,[id]);

  if (!issueData.rows.length) {
    throw new Error("Issue Not Found!");
  }

  const issue = issueData.rows[0]

  const userData = await pool.query(`
  SELECT id , name , role FROM users
  WHERE id=$1
  `,[issue.reporter_id]);

  const result = {
    ...issue,
    reporter: issue,
  };

  delete result.reporter_id;

  return result;
};



export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};