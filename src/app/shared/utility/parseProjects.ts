import { Projects } from '../models/projects';

export function parseProjects(value: string | any[] | null): Projects[] {
  try {
    const parsedData = typeof value === 'string' ? JSON.parse(value) : value;

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData.map((p: any) =>
      new Projects(
        p.id,
        p.title,
        p.deadline ? new Date(p.deadline) : p.deadline,
        p.priority || 'Low'
      )
    );
  } catch (err: any) {
    console.error('Could not convert data', err);
    return [];
  }
}
