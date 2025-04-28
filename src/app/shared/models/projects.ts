export class Projects {
    constructor(
        public id: number, 
        public title: string, 
        public deadline: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        public priority: string = 'Low',
    ){}

    get priorityValue(): number {
        return this.priority.toLowerCase() === 'low' ? 1 : 
        this.priority.toLowerCase() === 'medium' ? 2 : 
        this.priority.toLowerCase() === 'high' ? 3 : 0;
    }
}