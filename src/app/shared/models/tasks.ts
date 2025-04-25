export class Tasks {
    constructor(public id: number, public todo: string, public started: boolean = false, public completed: boolean = false, public userId?: number, public priority: string = 'Low'){

    }

    get priorityValue(): number {
        return this.priority.toLowerCase() === 'low' ? 1 : this.priority.toLowerCase() === 'medium'  ? 2 : this.priority.toLowerCase() === 'high'  ? 3 : 0
    }
}