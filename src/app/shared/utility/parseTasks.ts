import { Tasks } from "../models/tasks";

export const parseTasks = (raw: string | any[] | null): Tasks[] => {
    try{
        const parsedData = typeof raw === 'string' ? JSON.parse(raw) : raw;

        if(!Array.isArray(parsedData)) return []

        return parsedData.map((t: any) =>
            new Tasks(t.id, t.todo, t.started, t.completed, t.priority || 'Low', t.projectId, t.userId)
        );
    }
    catch(error: any){
        console.error('Failed To Parse Tasks', error)
        return []
    }

}