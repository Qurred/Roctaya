// constructor(private http: Http) {}

export class News{

    constructor(
        public creator: number,
        public title: String,
        public body: String,
        public time: String,
        public banner: string
    ){}
}
