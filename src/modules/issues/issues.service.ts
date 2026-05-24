import { pool } from "../../db";
import type { IIssue, IIssueInfo, IIssueQuery } from "./issues.interface";



const createIssueIntoDB = async (payload: IIssue, reporter_id: number) => {
  const { title, description, type } = payload;
  const status = payload.status || "open";

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
  const issueData = await pool.query(
    `
    SELECT * FROM issues
    WHERE id=$1
    `,
    [id],
  );

  if (!issueData.rows.length) {
    return null;
  }

  const userData = await pool.query(
    `
  SELECT id , name , role FROM users
  WHERE id=$1
  `,
    [issueData.rows[0].reporter_id],
  );

  const result = {
    ...issueData.rows[0],
    reporter: userData.rows[0],
  };

  delete result.reporter_id;

  return result;
};

const updateIssueIntoDB = async (
  id: number,
  payload: IIssueInfo,
  reporter_role: string,
  userId: number,
) => {
  const checkIssue = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
  `,
    [id],
  );

  const issue = checkIssue.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }

  const { title, description, type, status } = payload;
  const role = {
    contributor: "contributor",
    maintainer: "maintainer",
  };

  if (reporter_role === role.contributor) {
    if (issue.reporter_id !== userId) {
      throw new Error("You're not allowed to update");
    }

    if (issue.status !== "open") {
      throw new Error("Can not Update");
    }

    const result = await pool.query(
      `
      UPDATE issues
        SET title = COALESCE($1,title), description = COALESCE($2,description), type = COALESCE($3,type), status = COALESCE($4,status)
        WHERE id = $5

        RETURNING *
    `,
      [title, description, type, status, id],
    );
    return result.rows[0] ? result.rows[0] : "Not Updated";
  }

  const result = await pool.query(
    `
      UPDATE issues
      SET title = COALESCE($1,title), description = COALESCE($2,description), type = COALESCE($3,type), status = COALESCE($4,status)
      WHERE id = $5

      RETURNING *
    `,
    [title, description, type, status, id],
  );
  return result.rows[0] ? result.rows[0] : "Not Updated";
}; 

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
};